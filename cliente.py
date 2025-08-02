from flask import Blueprint, request, jsonify
from src.models.user import db, User, Cliente, Pedido, TransacaoCashback, Fornecedor, BeneficioFornecedor
from src.routes.auth import token_required
from datetime import datetime, timedelta
from sqlalchemy import func, extract

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        # Estatísticas do mês atual
        mes_atual = datetime.now().month
        ano_atual = datetime.now().year
        
        # Total de pedidos do mês
        pedidos_mes = Pedido.query.filter(
            Pedido.cliente_id == cliente.id,
            extract('month', Pedido.data_pedido) == mes_atual,
            extract('year', Pedido.data_pedido) == ano_atual
        ).all()
        
        total_kg_mes = sum(p.quantidade_kg for p in pedidos_mes)
        total_valor_mes = sum(p.valor_total for p in pedidos_mes)
        
        # Atualizar nível de parceria baseado no volume mensal
        nivel_anterior = cliente.nivel_parceria
        cliente.total_compras_mes = total_kg_mes
        cliente.nivel_parceria = cliente.calcular_nivel_parceria()
        
        # Se mudou de nível, registrar
        mudou_nivel = nivel_anterior != cliente.nivel_parceria
        
        # Próximas entregas automáticas
        proximas_entregas = Pedido.query.filter(
            Pedido.cliente_id == cliente.id,
            Pedido.automatico == True,
            Pedido.status == 'pendente'
        ).order_by(Pedido.data_entrega).limit(3).all()
        
        # Últimas transações de cashback
        ultimas_transacoes = TransacaoCashback.query.filter(
            TransacaoCashback.cliente_id == cliente.id
        ).order_by(TransacaoCashback.data_transacao.desc()).limit(5).all()
        
        # Benefícios disponíveis baseados no nível
        beneficios_disponiveis = BeneficioFornecedor.query.join(Fornecedor).join(User).filter(
            User.aprovado == True,
            User.ativo == True,
            BeneficioFornecedor.ativo == True,
            BeneficioFornecedor.nivel_minimo.in_(['inicial', cliente.nivel_parceria])
        ).all()
        
        if cliente.nivel_parceria == 'avancado':
            beneficios_disponiveis.extend(
                BeneficioFornecedor.query.join(Fornecedor).join(User).filter(
                    User.aprovado == True,
                    User.ativo == True,
                    BeneficioFornecedor.ativo == True,
                    BeneficioFornecedor.nivel_minimo == 'avancado'
                ).all()
            )
        elif cliente.nivel_parceria == 'elite':
            beneficios_disponiveis.extend(
                BeneficioFornecedor.query.join(Fornecedor).join(User).filter(
                    User.aprovado == True,
                    User.ativo == True,
                    BeneficioFornecedor.ativo == True,
                    BeneficioFornecedor.nivel_minimo.in_(['avancado', 'elite'])
                ).all()
            )
        
        db.session.commit()
        
        return jsonify({
            'cliente': cliente.to_dict(),
            'estatisticas_mes': {
                'total_kg': total_kg_mes,
                'total_valor': total_valor_mes,
                'numero_pedidos': len(pedidos_mes),
                'mudou_nivel': mudou_nivel
            },
            'proximas_entregas': [p.to_dict() for p in proximas_entregas],
            'ultimas_transacoes_cashback': [t.to_dict() for t in ultimas_transacoes],
            'beneficios_disponiveis': len(beneficios_disponiveis),
            'taxa_cashback_atual': cliente.get_taxa_cashback()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@cliente_bp.route('/historico-pedidos', methods=['GET'])
@token_required
def get_historico_pedidos(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        # Parâmetros de paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Filtros
        status = request.args.get('status')
        mes = request.args.get('mes', type=int)
        ano = request.args.get('ano', type=int)
        
        query = Pedido.query.filter(Pedido.cliente_id == cliente.id)
        
        if status:
            query = query.filter(Pedido.status == status)
        if mes and ano:
            query = query.filter(
                extract('month', Pedido.data_pedido) == mes,
                extract('year', Pedido.data_pedido) == ano
            )
        elif ano:
            query = query.filter(extract('year', Pedido.data_pedido) == ano)
        
        pedidos = query.order_by(Pedido.data_pedido.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'pedidos': [p.to_dict() for p in pedidos.items],
            'total': pedidos.total,
            'pages': pedidos.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@cliente_bp.route('/historico-cashback', methods=['GET'])
@token_required
def get_historico_cashback(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        # Parâmetros de paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Filtros
        tipo = request.args.get('tipo')  # ganho ou uso
        
        query = TransacaoCashback.query.filter(TransacaoCashback.cliente_id == cliente.id)
        
        if tipo:
            query = query.filter(TransacaoCashback.tipo == tipo)
        
        transacoes = query.order_by(TransacaoCashback.data_transacao.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Resumo do cashback
        total_ganho = db.session.query(func.sum(TransacaoCashback.valor)).filter(
            TransacaoCashback.cliente_id == cliente.id,
            TransacaoCashback.tipo == 'ganho'
        ).scalar() or 0
        
        total_usado = db.session.query(func.sum(TransacaoCashback.valor)).filter(
            TransacaoCashback.cliente_id == cliente.id,
            TransacaoCashback.tipo == 'uso'
        ).scalar() or 0
        
        return jsonify({
            'transacoes': [t.to_dict() for t in transacoes.items],
            'total': transacoes.total,
            'pages': transacoes.pages,
            'current_page': page,
            'per_page': per_page,
            'resumo': {
                'total_ganho': total_ganho,
                'total_usado': total_usado,
                'saldo_atual': cliente.cashback_acumulado
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@cliente_bp.route('/criar-pedido', methods=['POST'])
@token_required
def criar_pedido(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        data = request.get_json()
        
        # Validação
        required_fields = ['quantidade_kg', 'tipo_cafe', 'tipo_torra', 'valor_total']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Campo {field} é obrigatório'}), 400
        
        # Criar pedido
        pedido = Pedido(
            cliente_id=cliente.id,
            quantidade_kg=data['quantidade_kg'],
            tipo_cafe=data['tipo_cafe'],
            tipo_torra=data['tipo_torra'],
            valor_total=data['valor_total'],
            endereco_entrega=data.get('endereco_entrega', cliente.endereco),
            observacoes=data.get('observacoes'),
            automatico=data.get('automatico', False),
            dia_entrega_automatica=data.get('dia_entrega_automatica')
        )
        
        # Se for automático, calcular próxima entrega
        if pedido.automatico and pedido.dia_entrega_automatica:
            hoje = datetime.now()
            if pedido.dia_entrega_automatica == 15:
                if hoje.day <= 15:
                    pedido.data_entrega = hoje.replace(day=15)
                else:
                    # Próximo mês
                    if hoje.month == 12:
                        pedido.data_entrega = hoje.replace(year=hoje.year + 1, month=1, day=15)
                    else:
                        pedido.data_entrega = hoje.replace(month=hoje.month + 1, day=15)
            elif pedido.dia_entrega_automatica == 30:
                if hoje.day <= 28:  # Considerando fevereiro
                    try:
                        pedido.data_entrega = hoje.replace(day=30)
                    except ValueError:
                        # Fevereiro ou mês com menos de 30 dias
                        pedido.data_entrega = hoje.replace(day=28)
                else:
                    # Próximo mês
                    if hoje.month == 12:
                        pedido.data_entrega = hoje.replace(year=hoje.year + 1, month=1, day=30)
                    else:
                        try:
                            pedido.data_entrega = hoje.replace(month=hoje.month + 1, day=30)
                        except ValueError:
                            pedido.data_entrega = hoje.replace(month=hoje.month + 1, day=28)
        
        db.session.add(pedido)
        db.session.flush()
        
        # Calcular e adicionar cashback
        taxa_cashback = cliente.get_taxa_cashback()
        valor_cashback = data['valor_total'] * taxa_cashback
        
        transacao_cashback = TransacaoCashback(
            cliente_id=cliente.id,
            pedido_id=pedido.id,
            tipo='ganho',
            valor=valor_cashback,
            descricao=f'Cashback do pedido #{pedido.id}'
        )
        
        cliente.cashback_acumulado += valor_cashback
        cliente.data_ultima_compra = datetime.utcnow()
        
        db.session.add(transacao_cashback)
        db.session.commit()
        
        return jsonify({
            'message': 'Pedido criado com sucesso',
            'pedido': pedido.to_dict(),
            'cashback_ganho': valor_cashback
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@cliente_bp.route('/usar-cashback', methods=['POST'])
@token_required
def usar_cashback(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        data = request.get_json()
        valor_uso = data.get('valor', 0)
        
        if valor_uso <= 0:
            return jsonify({'message': 'Valor deve ser maior que zero'}), 400
        
        if valor_uso > cliente.cashback_acumulado:
            return jsonify({'message': 'Saldo insuficiente'}), 400
        
        # Registrar uso do cashback
        transacao = TransacaoCashback(
            cliente_id=cliente.id,
            tipo='uso',
            valor=valor_uso,
            descricao=data.get('descricao', 'Uso de cashback')
        )
        
        cliente.cashback_acumulado -= valor_uso
        
        db.session.add(transacao)
        db.session.commit()
        
        return jsonify({
            'message': 'Cashback utilizado com sucesso',
            'valor_usado': valor_uso,
            'saldo_restante': cliente.cashback_acumulado
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

@cliente_bp.route('/beneficios-disponiveis', methods=['GET'])
@token_required
def get_beneficios_disponiveis(current_user):
    try:
        if current_user.tipo_usuario != 'cliente':
            return jsonify({'message': 'Acesso negado'}), 403
        
        cliente = current_user.cliente
        if not cliente:
            return jsonify({'message': 'Perfil de cliente não encontrado'}), 404
        
        # Benefícios baseados no nível do cliente
        niveis_permitidos = ['inicial']
        if cliente.nivel_parceria in ['avancado', 'elite']:
            niveis_permitidos.append('avancado')
        if cliente.nivel_parceria == 'elite':
            niveis_permitidos.append('elite')
        
        beneficios = db.session.query(BeneficioFornecedor, Fornecedor, User).join(
            Fornecedor, BeneficioFornecedor.fornecedor_id == Fornecedor.id
        ).join(
            User, Fornecedor.user_id == User.id
        ).filter(
            User.aprovado == True,
            User.ativo == True,
            BeneficioFornecedor.ativo == True,
            BeneficioFornecedor.nivel_minimo.in_(niveis_permitidos)
        ).all()
        
        resultado = []
        for beneficio, fornecedor, user in beneficios:
            resultado.append({
                'beneficio': beneficio.to_dict(),
                'fornecedor': {
                    'id': fornecedor.id,
                    'nome_empresa': fornecedor.nome_empresa,
                    'categoria': fornecedor.categoria,
                    'telefone': user.telefone,
                    'instagram': fornecedor.instagram,
                    'site': fornecedor.site
                }
            })
        
        return jsonify({
            'beneficios': resultado,
            'nivel_cliente': cliente.nivel_parceria,
            'total_beneficios': len(resultado)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500

