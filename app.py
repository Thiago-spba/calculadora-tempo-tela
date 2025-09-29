from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime

app = Flask(__name__)

# Função para contar acessos
def contar_acesso():
    arquivo_acessos = 'dados/acessos.txt'
    
    if not os.path.exists(arquivo_acessos):
        with open(arquivo_acessos, 'w') as f:
            f.write('0')
    
    try:
        with open(arquivo_acessos, 'r') as f:
            total = int(f.read().strip())
    except:
        total = 0
    
    total += 1
    with open(arquivo_acessos, 'w') as f:
        f.write(str(total))
    
    return total

def obter_total_acessos():
    arquivo_acessos = 'dados/acessos.txt'
    try:
        with open(arquivo_acessos, 'r') as f:
            return int(f.read().strip())
    except:
        return 0

# APOSTILA 2 - PYTHON: Funções com horas e minutos
def calcular_tempo_perdido(horas_dia):
    """Calcula tempo perdido - CONCEITO: Funções e Operadores Matemáticos"""
    tempo_mes = horas_dia * 30
    tempo_ano = horas_dia * 365
    dias_perdidos = round(tempo_ano / 24, 1)
    return tempo_mes, tempo_ano, dias_perdidos

def classificar_uso(horas):
    """Classifica o uso - CONCEITO: Estruturas Condicionais"""
    # APOSTILA 1 - ESTATÍSTICA: Distribuições e classificações
    if horas <= 2:
        return "Normal", "success", "🎉 Parabéns! Seu uso está saudável e equilibrado!"
    elif horas <= 4:
        return "Moderado", "warning", "⚠️ Atenção! Considere reduzir um pouco o tempo de tela."
    elif horas <= 6:
        return "Alto", "danger", "🚨 Cuidado! Esse nível pode afetar sua saúde."
    else:
        return "Excessivo", "danger", "❌ Alerta máximo! Reduza urgentemente seu tempo de tela."

def calcular_estatisticas(horas_dia):
    """Aplica conceitos estatísticos - APOSTILA 1: Médias e Indicadores"""
    # CONCEITO: Medidas de tendência central e comparação
    media_nacional = 4.0  # Média baseada em dados do IBGE
    
    # CONCEITO: Cálculo de percentuais e indicadores
    if horas_dia > media_nacional:
        percentual = round(((horas_dia - media_nacional) / media_nacional) * 100)
        comparacao = f"{percentual}% acima da média nacional"
        emoji = "⚠️"
    elif horas_dia < media_nacional:
        percentual = round(((media_nacional - horas_dia) / media_nacional) * 100)
        comparacao = f"{percentual}% abaixo da média nacional"
        emoji = "✅"
    else:
        comparacao = "Na média nacional"
        percentual = 0
        emoji = "📊"
    
    return comparacao, percentual, emoji, media_nacional

@app.route('/')
def home():
    """Rota principal"""
    total_acessos = contar_acesso()
    return render_template('index.html', total_acessos=total_acessos)

@app.route('/dicas')
def dicas():
    """Rota para página de dicas"""
    return render_template('dicas.html')

@app.route('/saude')
def saude():
    """Rota para página de saúde"""
    return render_template('saude.html')

@app.route('/tempo-recomendado')
def tempo_recomendado():
    """Rota para página de tempo recomendado"""
    return render_template('tempo-recomendado.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    """Rota que processa os cálculos - INTEGRAÇÃO DAS 3 APOSTILAS"""
    try:
        # Recebe horas e minutos
        horas = float(request.form.get('horas', 0))
        minutos = float(request.form.get('minutos', 0))
        
        # Converte tudo para horas (decimal)
        horas_dia = horas + (minutos / 60)
        
        # Validação
        if horas_dia < 0 or horas_dia > 24:
            return jsonify({
                'sucesso': False,
                'mensagem': 'Por favor, insira um valor válido entre 0 e 24 horas.'
            })
        
        # APOSTILA 2 - PYTHON: Aplicação de funções
        tempo_mes, tempo_ano, dias_perdidos = calcular_tempo_perdido(horas_dia)
        classificacao, cor_alerta, mensagem = classificar_uso(horas_dia)
        comparacao, percentual, emoji, media_nacional = calcular_estatisticas(horas_dia)
        
        # APOSTILA 3 - DASHBOARD: Preparação de dados para visualização
        resultado = {
            'sucesso': True,
            'horasDia': round(horas_dia, 2),
            'tempoMes': int(tempo_mes),
            'tempoAno': int(tempo_ano),
            'diasPerdidos': dias_perdidos,
            'classificacao': classificacao,
            'corAlerta': cor_alerta,
            'mensagemPersonalizada': mensagem,
            'comparacaoTexto': comparacao,
            'percentualDiferenca': percentual,
            'emojiComparacao': emoji,
            'mediaNacional': media_nacional
        }
        
        return jsonify(resultado)
        
    except ValueError:
        return jsonify({
            'sucesso': False,
            'mensagem': 'Por favor, insira números válidos.'
        })
    except Exception as e:
        return jsonify({
            'sucesso': False,
            'mensagem': f'Erro interno: {str(e)}'
        })

@app.route('/manifest.json')
def manifest():
    """Serve o manifest.json"""
    return app.send_static_file('manifest.json')

@app.route('/service-worker.js')
def service_worker():
    """Serve o service worker"""
    return app.send_static_file('service-worker.js')

if __name__ == '__main__':
    if not os.path.exists('dados'):
        os.makedirs('dados')
    
    print("=" * 60)
    print("🚀 SERVIDOR INICIANDO - PROJETO DE EXTENSÃO")
    print("=" * 60)
    print("\n📊 APLICAÇÃO DAS 3 APOSTILAS:")
    print("   ✅ Estatística Aplicada (classificações, médias, indicadores)")
    print("   ✅ Programação Python (funções, estruturas, operadores)")
    print("   ✅ Dashboard/Análise (visualização, KPIs, design)")
    print("\n🌐 Acesse: http://127.0.0.1:5000")
    print("👥 Impacto Social: Contador de visitas ativo")
    print("📱 PWA: Pronto para instalar como app")
    print("❌ Para parar: Ctrl+C")
    print("=" * 60)
    
    app.run(debug=True, host='127.0.0.1', port=5000)