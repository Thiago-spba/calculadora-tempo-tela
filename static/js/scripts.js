// ============================================
// CALCULADORA DE TEMPO DE TELA - VERSÃO FINAL
// Com: Anti-Intermitência + Badges + Confetes + Download
// ============================================

let graficoRotina = null;
let graficoComparacao = null;
let dadosResultado = null;
let tentativasGrafico = 0;
const MAX_TENTATIVAS = 5;

// ============================================
// FUNÇÃO: AGUARDAR CHART.JS CARREGAR
// ============================================
function aguardarChartJS() {
    return new Promise((resolve) => {
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js já carregado');
            resolve(true);
            return;
        }

        let tentativas = 0;
        const intervalo = setInterval(() => {
            tentativas++;
            
            if (typeof Chart !== 'undefined') {
                console.log('✅ Chart.js carregado após', tentativas * 200, 'ms');
                clearInterval(intervalo);
                resolve(true);
            } else if (tentativas >= 50) {
                console.error('❌ Timeout: Chart.js não carregou');
                clearInterval(intervalo);
                resolve(false);
            }
        }, 200);
    });
}

// ============================================
// NOVA FUNÇÃO: ANIMAÇÃO DE CONFETES (SUCESSO)
// ============================================
function celebrarSucesso() {
    // Verifica se a biblioteca confetti está disponível
    if (typeof confetti === 'undefined') {
        console.warn('⚠️ Biblioteca confetti não carregada');
        return;
    }

    // Confetes do centro
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    // Confetes dos lados após 200ms
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 200);
}

// ============================================
// NOVA FUNÇÃO: ANIMAÇÃO DE SHAKE (ALERTA)
// ============================================
function alertaShake() {
    const resultadosSection = document.getElementById('resultados');
    if (resultadosSection) {
        resultadosSection.classList.add('shake');
        
        setTimeout(() => {
            resultadosSection.classList.remove('shake');
        }, 600);
    }
}

// ============================================
// NOVA FUNÇÃO: CRIAR BADGE DE CONQUISTA
// ============================================
function criarBadgeConquista(classificacao, horasDia, mediaBrasil) {
    let emoji, texto, classe;
    
    if (classificacao === 'Normal') {
        emoji = '🏆';
        texto = 'Parabéns! Seu uso está equilibrado!';
        classe = 'sucesso';
        celebrarSucesso();
    } else if (classificacao === 'Moderado') {
        emoji = '⚠️';
        const reducao = (horasDia - 2).toFixed(1);
        texto = `Atenção! Tente reduzir ${reducao}h para melhorar`;
        classe = 'moderado';
    } else if (classificacao === 'Alto') {
        emoji = '🚨';
        const reducao = (horasDia - 2).toFixed(1);
        texto = `Alerta! Reduza ${reducao}h para um uso saudável`;
        classe = 'alerta';
        alertaShake();
    } else { // Excessivo
        emoji = '❌';
        const reducao = (horasDia - 2).toFixed(1);
        texto = `Crítico! Reduza urgentemente ${reducao}h`;
        classe = 'alerta';
        alertaShake();
    }
    
    // Adicionar comparação com média
    let comparacao = '';
    if (horasDia > mediaBrasil) {
        const diferenca = (horasDia - mediaBrasil).toFixed(1);
        comparacao = `Você está ${diferenca}h acima da média brasileira.`;
    } else {
        comparacao = 'Você está abaixo da média brasileira! 👏';
    }
    
    return `
        <div class="badge-conquista ${classe}">
            <span class="emoji">${emoji}</span>
            <div>${texto}</div>
            <small style="font-size: 0.85rem; opacity: 0.9; margin-top: 8px; display: block;">
                ${comparacao}
            </small>
        </div>
    `;
}

// ============================================
// NOVA FUNÇÃO: DOWNLOAD DO RESULTADO COMO IMAGEM
// ============================================
async function baixarResultado() {
    const btn = document.getElementById('btn-baixar-resultado');
    
    if (!btn) {
        console.error('❌ Botão de download não encontrado');
        return;
    }

    // Verifica se html2canvas está disponível
    if (typeof html2canvas === 'undefined') {
        alert('Erro: Biblioteca de captura de tela não carregada. Recarregue a página.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Gerando...';
    
    try {
        const resultadosSection = document.getElementById('resultados');
        
        // Configurações do html2canvas
        const canvas = await html2canvas(resultadosSection, {
            backgroundColor: '#f8f9fa',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        // Converter para imagem e fazer download
        const link = document.createElement('a');
        link.download = `meu-tempo-de-tela-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Feedback visual
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Baixado!';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download me-2"></i>Baixar Resultado';
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        alert('Erro ao gerar imagem. Tente novamente.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download me-2"></i>Baixar Resultado';
    }
}

// ============================================
// FUNÇÃO: CRIAR GRÁFICOS (COM RETRY)
// ============================================
async function criarGraficos(data) {
    console.log('🎨 Iniciando criação de gráficos...');
    
    const chartDisponivel = await aguardarChartJS();
    
    if (!chartDisponivel) {
        console.error('❌ Chart.js não está disponível');
        mostrarErroGraficos();
        return;
    }

    const canvasRotina = document.getElementById('grafico-rotina');
    const canvasComparacao = document.getElementById('grafico-comparacao');
    
    if (!canvasRotina || !canvasComparacao) {
        console.error('❌ Canvas não encontrados');
        
        if (tentativasGrafico < MAX_TENTATIVAS) {
            tentativasGrafico++;
            console.log(`⏳ Tentativa ${tentativasGrafico}/${MAX_TENTATIVAS}...`);
            setTimeout(() => criarGraficos(data), 500);
            return;
        } else {
            console.error('❌ Canvas não encontrados após múltiplas tentativas');
            mostrarErroGraficos();
            return;
        }
    }

    try {
        if (graficoRotina) graficoRotina.destroy();
        if (graficoComparacao) graficoComparacao.destroy();

        const horasSono = 8;
        const horasTela = data.horasDia;
        const horasTrabalhoEstudo = 8;
        const horasRefeicoes = 2;
        const horasDeslocamento = 1.5;
        const horasLazerOutros = 24 - horasSono - horasTela - horasTrabalhoEstudo - horasRefeicoes - horasDeslocamento;

        // GRÁFICO DE PIZZA
        const ctx = canvasRotina.getContext('2d');
        
        graficoRotina = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    '📱 Tempo de Tela', 
                    '💼 Trabalho/Estudo', 
                    '😴 Sono', 
                    '🍽️ Refeições',
                    '🚗 Deslocamento',
                    '🎯 Lazer/Outros'
                ],
                datasets: [{
                    label: 'Distribuição do Dia (24h)',
                    data: [
                        horasTela, 
                        horasTrabalhoEstudo, 
                        horasSono, 
                        horasRefeicoes,
                        horasDeslocamento,
                        horasLazerOutros > 0 ? horasLazerOutros : 0
                    ],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#9966FF',
                        '#FF9F40',
                        '#FFCD56',
                        '#4BC0C0'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { 
                                size: window.innerWidth < 768 ? 11 : 13, 
                                family: 'Poppins', 
                                weight: '600' 
                            },
                            padding: window.innerWidth < 768 ? 10 : 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            color: '#333'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        titleFont: { size: 15, weight: 'bold', family: 'Poppins' },
                        bodyFont: { size: 13, family: 'Poppins' },
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const valor = context.parsed;
                                const porcentagem = ((valor / 24) * 100).toFixed(1);
                                return `${label}: ${valor.toFixed(1)}h (${porcentagem}%)`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed;
                                const anoHoras = (valor * 365).toFixed(0);
                                const dias = (valor * 365 / 24).toFixed(1);
                                const porcentagem = ((valor / 24) * 100).toFixed(1);
                                
                                if (context.dataIndex === 0) {
                                    return `\n📊 Anual: ${anoHoras}h (${dias} dias)\n⚠️ ${porcentagem > 20 ? 'Acima do recomendado' : 'Dentro do esperado'}`;
                                } else if (context.dataIndex === 2) {
                                    return `\n💤 Sono recomendado: 7-9h\n${valor < 7 ? '⚠️ Abaixo do recomendado' : valor > 9 ? '⚠️ Acima do recomendado' : '✅ Adequado'}`;
                                }
                                return `\n📅 Por ano: ${anoHoras}h (${dias} dias)`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Como você distribui suas 24 horas?',
                        font: { 
                            size: window.innerWidth < 768 ? 14 : 16, 
                            weight: 'bold', 
                            family: 'Poppins' 
                        },
                        padding: { bottom: 20 },
                        color: '#333'
                    }
                }
            }
        });

        // GRÁFICO DE BARRAS
        const ctxComparacao = canvasComparacao.getContext('2d');
        
        const mediaGlobal = 6.9;
        const mediaBrasil = 9.4;
        const recomendacaoOMS = 2.0;
        const mediaJovens = 7.2;

        graficoComparacao = new Chart(ctxComparacao, {
            type: 'bar',
            data: {
                labels: ['Você', 'Média Brasil', 'Média Global', 'Jovens 16-24', 'Recomendação OMS'],
                datasets: [{
                    label: 'Horas por Dia',
                    data: [
                        data.horasDia, 
                        mediaBrasil, 
                        mediaGlobal, 
                        mediaJovens, 
                        recomendacaoOMS
                    ],
                    backgroundColor: [
                        data.horasDia > mediaBrasil ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        data.horasDia > mediaBrasil ? '#FF6384' : '#4BC0C0',
                        '#36A2EB',
                        '#9966FF',
                        '#FFCE56',
                        '#4BC0C0'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    barThickness: window.innerWidth < 768 ? 'flex' : 50,
                    maxBarThickness: 60
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: window.innerWidth < 768 ? 'y' : 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(data.horasDia, 10) + 1,
                        ticks: {
                            callback: function(value) { return value + 'h'; },
                            font: { family: 'Poppins', size: window.innerWidth < 768 ? 10 : 12, weight: '600' },
                            color: '#666'
                        },
                        grid: { 
                            display: true, 
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false 
                        },
                        title: {
                            display: window.innerWidth >= 768,
                            text: 'Tempo de Tela (horas/dia)',
                            font: { size: 13, weight: 'bold', family: 'Poppins' },
                            color: '#333'
                        }
                    },
                    x: {
                        ticks: { 
                            font: { 
                                size: window.innerWidth < 768 ? 9 : 12, 
                                family: 'Poppins', 
                                weight: '600' 
                            },
                            color: '#666',
                            maxRotation: window.innerWidth < 768 ? 45 : 0,
                            minRotation: window.innerWidth < 768 ? 45 : 0
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        titleFont: { size: 15, weight: 'bold', family: 'Poppins' },
                        bodyFont: { size: 13, family: 'Poppins' },
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                const labels = {
                                    0: '📱 Seu Uso',
                                    1: '🇧🇷 Média Nacional',
                                    2: '🌎 Média Global',
                                    3: '👥 Jovens Brasileiros',
                                    4: '🏥 Recomendação OMS'
                                };
                                return labels[context[0].dataIndex];
                            },
                            label: function(context) {
                                const valor = context.parsed.y || context.parsed.x;
                                return `Tempo: ${valor.toFixed(1)}h por dia`;
                            },
                            afterLabel: function(context) {
                                const valor = context.parsed.y || context.parsed.x;
                                const anoHoras = (valor * 365).toFixed(0);
                                const dias = (valor * 365 / 24).toFixed(0);
                                
                                const infos = {
                                    0: `\n📊 Por ano: ${anoHoras}h (${dias} dias)\n${data.horasDia > mediaBrasil ? '⚠️ Acima da média brasileira' : '✅ Abaixo da média brasileira'}`,
                                    1: '\n📍 Fonte: We Are Social 2024\n🥇 Brasil lidera ranking mundial',
                                    2: '\n🌐 Fonte: Digital Report 2024\n📈 Crescimento de 2% ao ano',
                                    3: '\n👶 Faixa etária mais conectada\n📱 Redes sociais e streaming',
                                    4: '\n⚕️ Baseado em estudos de saúde\n🎯 Recomendação para adultos'
                                };
                                return infos[context.dataIndex] || '';
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Comparação com Médias e Recomendações',
                        font: { 
                            size: window.innerWidth < 768 ? 13 : 16, 
                            weight: 'bold', 
                            family: 'Poppins' 
                        },
                        padding: { bottom: 20 },
                        color: '#333'
                    }
                }
            }
        });

        console.log('✅ Gráficos criados com sucesso!');
        tentativasGrafico = 0;

    } catch (erro) {
        console.error('❌ Erro ao criar gráficos:', erro);
        
        if (tentativasGrafico < MAX_TENTATIVAS) {
            tentativasGrafico++;
            console.log(`⏳ Nova tentativa ${tentativasGrafico}/${MAX_TENTATIVAS}...`);
            setTimeout(() => criarGraficos(data), 1000);
        } else {
            mostrarErroGraficos();
        }
    }
}

// ============================================
// FUNÇÃO: MOSTRAR ERRO DOS GRÁFICOS
// ============================================
function mostrarErroGraficos() {
    const graficosContainer = document.querySelector('.row.g-4');
    if (graficosContainer) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning text-center mt-3';
        alerta.innerHTML = `
            <h5>⚠️ Gráficos não carregaram</h5>
            <p>Recarregue a página (F5) ou aguarde alguns segundos.</p>
            <button onclick="location.reload()" class="btn btn-primary btn-sm mt-2">
                🔄 Recarregar Página
            </button>
        `;
        graficosContainer.appendChild(alerta);
    }
}

// ============================================
// EVENTO PRINCIPAL: DOM CARREGADO
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM carregado - Aguardando Chart.js...');
    
    await aguardarChartJS();

    const inputHoras = document.getElementById('horas');
    const inputMinutos = document.getElementById('minutos');
    const totalPreview = document.getElementById('total-preview');

    function atualizarPreview() {
        const horas = parseInt(inputHoras.value) || 0;
        const minutos = parseInt(inputMinutos.value) || 0;
        
        if (horas === 0 && minutos === 0) {
            totalPreview.textContent = 'Digite os valores para ver o total';
            totalPreview.classList.remove('active');
        } else {
            const totalHoras = horas + (minutos / 60);
            totalPreview.textContent = `📊 Total: ${totalHoras.toFixed(1)} horas por dia`;
            totalPreview.classList.add('active');
        }
    }

    if (inputHoras && inputMinutos) {
        inputHoras.addEventListener('input', atualizarPreview);
        inputMinutos.addEventListener('input', atualizarPreview);
    }

    const animacaoContainer = document.getElementById('animacao-cerebro');
    if (animacaoContainer) {
        const player = document.createElement('lottie-player');
        player.src = 'https://assets10.lottiefiles.com/packages/lf20_pNx6yH.json';
        player.background = 'transparent';
        player.speed = '1';
        player.style.width = '100%';
        player.style.height = '100%';
        player.loop = true;
        player.autoplay = true;
        animacaoContainer.appendChild(player);
    }

    function animarContagem(elemento, valorFinal, duracao = 1500) {
        const valorInicial = 0;
        const incremento = valorFinal / (duracao / 16);
        let valorAtual = valorInicial;
        
        const timer = setInterval(() => {
            valorAtual += incremento;
            if (valorAtual >= valorFinal) {
                elemento.textContent = Math.round(valorFinal);
                clearInterval(timer);
            } else {
                elemento.textContent = Math.round(valorAtual);
            }
        }, 16);
    }

    const form = document.getElementById('calculator-form');
    const resultadosSection = document.getElementById('resultados');

    if (!form) return;

    const dadosSalvos = localStorage.getItem('dadosCalculadora');
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            if (dados.horas !== undefined) inputHoras.value = dados.horas;
            if (dados.minutos !== undefined) inputMinutos.value = dados.minutos;
            if (dados.resultado) exibirResultadosSalvos(dados.resultado);
            atualizarPreview();
        } catch (e) {
            console.error('Erro ao recuperar dados:', e);
        }
    }

    function exibirResultadosSalvos(data) {
        dadosResultado = data;
        
        document.getElementById('texto-mensagem').textContent = data.mensagemPersonalizada;
        document.getElementById('tempo-ano').textContent = Math.round(data.tempoAno);
        document.getElementById('tempo-mes').textContent = Math.round(data.tempoMes);
        document.getElementById('dias-perdidos').textContent = data.diasPerdidos;
        document.getElementById('classificacao-valor').textContent = data.classificacao;
        document.getElementById('emoji-comparacao').textContent = data.emojiComparacao;
        document.getElementById('texto-comparacao').textContent = data.comparacaoTexto;

        const cardClassificacao = document.getElementById('card-classificacao');
        cardClassificacao.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-critical');
        cardClassificacao.classList.add(`bg-${data.corAlerta}`);

        // NOVO: Criar badge de conquista
        const badgeContainer = document.getElementById('badge-conquista-container');
        if (badgeContainer) {
            badgeContainer.innerHTML = criarBadgeConquista(data.classificacao, data.horasDia, 9.4);
        }

        criarGraficos(data);
        resultadosSection.classList.remove('d-none');
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('/calcular', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                const dadosParaSalvar = {
                    horas: parseInt(inputHoras.value) || 0,
                    minutos: parseInt(inputMinutos.value) || 0,
                    resultado: data
                };
                localStorage.setItem('dadosCalculadora', JSON.stringify(dadosParaSalvar));
                
                dadosResultado = data;
                tentativasGrafico = 0;
                
                document.getElementById('texto-mensagem').textContent = data.mensagemPersonalizada;
                animarContagem(document.getElementById('tempo-ano'), data.tempoAno);
                animarContagem(document.getElementById('tempo-mes'), data.tempoMes);
                document.getElementById('dias-perdidos').textContent = data.diasPerdidos;
                document.getElementById('classificacao-valor').textContent = data.classificacao;
                document.getElementById('emoji-comparacao').textContent = data.emojiComparacao;
                document.getElementById('texto-comparacao').textContent = data.comparacaoTexto;

                const cardClassificacao = document.getElementById('card-classificacao');
                cardClassificacao.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-critical');
                cardClassificacao.classList.add(`bg-${data.corAlerta}`);

                // NOVO: Criar badge de conquista
                const badgeContainer = document.getElementById('badge-conquista-container');
                if (badgeContainer) {
                    badgeContainer.innerHTML = criarBadgeConquista(data.classificacao, data.horasDia, 9.4);
                }

                criarGraficos(data);
                resultadosSection.classList.remove('d-none');
                resultadosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                alert(data.mensagem);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Não foi possível conectar ao servidor.');
        });
    });

    // COMPARTILHAMENTO
    const btnCompartilhar = document.getElementById('btn-compartilhar');
    if (btnCompartilhar) {
        btnCompartilhar.addEventListener('click', function() {
            if (!dadosResultado) {
                alert('Faça o cálculo primeiro!');
                return;
            }

            const classificacaoEmoji = {
                'Normal': '✅',
                'Moderado': '⚠️',
                'Alto': '🚨',
                'Excessivo': '❌'
            };

            const emoji = classificacaoEmoji[dadosResultado.classificacao] || '📊';

            const texto = `${emoji} MEU TEMPO DE TELA

⏰ ${dadosResultado.horasDia}h por dia
📊 ${dadosResultado.classificacao}
📅 ${dadosResultado.diasPerdidos} dias perdidos/ano

Descubra o seu:`;

            const url = window.location.href;
            const textoCompleto = `${texto} ${url}`;

            if (navigator.share) {
                navigator.share({ title: 'Calculadora de Tempo de Tela', text: texto, url: url })
                    .catch(() => compartilharFallback(textoCompleto));
            } else {
                compartilharFallback(textoCompleto);
            }
        });
    }

    // NOVO: BOTÃO DE DOWNLOAD
    const btnBaixar = document.getElementById('btn-baixar-resultado');
    if (btnBaixar) {
        btnBaixar.addEventListener('click', baixarResultado);
    }

    function compartilharFallback(texto) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
        modal.innerHTML = `
            <div style="background:white;padding:30px;border-radius:15px;max-width:400px;width:90%;">
                <h5 class="mb-3 text-center">Compartilhar em:</h5>
                <div class="d-grid gap-2">
                    <a href="https://wa.me/?text=${encodeURIComponent(texto)}" target="_blank" class="btn btn-success">
                        <i class="fab fa-whatsapp me-2"></i>WhatsApp
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="btn btn-primary">
                        <i class="fab fa-facebook me-2"></i>Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}" target="_blank" class="btn btn-info text-white">
                        <i class="fab fa-twitter me-2"></i>Twitter
                    </a>
                    <button onclick="navigator.clipboard.writeText('${texto.replace(/'/g, "\\'")}'); alert('Link copiado!')" class="btn btn-secondary">
                        <i class="fas fa-copy me-2"></i>Copiar Link
                    </button>
                </div>
                <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-outline-secondary w-100 mt-3">Fechar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // RESPONSIVIDADE
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (dadosResultado && typeof Chart !== 'undefined') {
                criarGraficos(dadosResultado);
            }
        }, 250);
    });
});

console.log('✅ Script carregado - Versão Final com Badges, Confetes e Download');