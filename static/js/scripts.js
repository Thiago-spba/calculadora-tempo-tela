document.addEventListener('DOMContentLoaded', function() {

    // --- PREVIEW EM TEMPO REAL DO TOTAL DE HORAS ---
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

    // --- CARREGAMENTO DA ANIMAÇÃO LOTTIE ---
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

    // --- FUNÇÃO DE ANIMAÇÃO DE CONTAGEM ---
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

    // --- LÓGICA DA CALCULADORA ---
    const form = document.getElementById('calculator-form');
    const resultadosSection = document.getElementById('resultados');
    let graficoRotina = null;
    let graficoComparacao = null;
    let dadosResultado = null;

    if (!form) return; // Se não estiver na página index, para aqui

    // --- RECUPERA DADOS SALVOS AO CARREGAR A PÁGINA ---
    const dadosSalvos = localStorage.getItem('dadosCalculadora');
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            if (dados.horas !== undefined) {
                inputHoras.value = dados.horas;
            }
            if (dados.minutos !== undefined) {
                inputMinutos.value = dados.minutos;
            }
            if (dados.resultado) {
                exibirResultadosSalvos(dados.resultado);
            }
            atualizarPreview();
        } catch (e) {
            console.error('Erro ao recuperar dados:', e);
        }
    }

    // --- FUNÇÃO PARA EXIBIR RESULTADOS SALVOS ---
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

        criarGraficos(data);
        resultadosSection.classList.remove('d-none');
    }

    // --- FUNÇÃO PARA CRIAR GRÁFICOS ---
    function criarGraficos(data) {
        const horasSono = 8;
        const horasTela = data.horasDia;
        const horasLivre = 24 - horasSono - horasTela;

        // GRÁFICO DE ROSCA
        const ctx = document.getElementById('grafico-rotina').getContext('2d');
        
        if (graficoRotina) {
            graficoRotina.destroy();
        }

        graficoRotina = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['⏱️ Tempo de Tela', '🎯 Tempo Livre', '😴 Tempo de Sono'],
                datasets: [{
                    label: 'Sua Rotina de 24h',
                    data: [horasTela, horasLivre < 0 ? 0 : horasLivre, horasSono],
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(0, 123, 255, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderColor: ['#dc3545', '#007bff', '#6c757d'],
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 14, family: 'Poppins', weight: 'bold' },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const valor = context.parsed;
                                const porcentagem = ((valor / 24) * 100).toFixed(1);
                                return `${label}: ${valor}h (${porcentagem}% do dia)`;
                            },
                            afterLabel: function(context) {
                                if (context.dataIndex === 0) {
                                    return `\n📱 ${(horasTela * 365).toFixed(0)} horas por ano`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });

        // GRÁFICO DE BARRAS
        const ctxComparacao = document.getElementById('grafico-comparacao').getContext('2d');
        
        if (graficoComparacao) {
            graficoComparacao.destroy();
        }

        graficoComparacao = new Chart(ctxComparacao, {
            type: 'bar',
            data: {
                labels: ['📱 Seu Uso', '🇧🇷 Média BR'],
                datasets: [{
                    label: 'Horas por Dia',
                    data: [data.horasDia, data.mediaNacional],
                    backgroundColor: [
                        data.horasDia > data.mediaNacional ? 'rgba(220, 53, 69, 0.8)' : 'rgba(40, 167, 69, 0.8)',
                        'rgba(0, 123, 255, 0.8)'
                    ],
                    borderColor: [
                        data.horasDia > data.mediaNacional ? '#dc3545' : '#28a745',
                        '#007bff'
                    ],
                    borderWidth: 3,
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(data.horasDia, data.mediaNacional) + 2,
                        ticks: {
                            callback: function(value) { return value + 'h'; },
                            font: { family: 'Poppins', size: 12, weight: 'bold' }
                        },
                        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                        title: {
                            display: true,
                            text: 'Horas por Dia',
                            font: { size: 14, weight: 'bold', family: 'Poppins' }
                        }
                    },
                    x: {
                        ticks: { font: { size: 14, family: 'Poppins', weight: 'bold' } },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                const valor = context.parsed.y;
                                return context.dataIndex === 0 ? `Você usa: ${valor}h/dia` : `Média nacional: ${valor}h/dia`;
                            },
                            afterLabel: function(context) {
                                if (context.dataIndex === 0) {
                                    const diferenca = Math.abs(data.horasDia - data.mediaNacional).toFixed(1);
                                    return data.horasDia > data.mediaNacional ? `\n⚠️ ${diferenca}h acima da média` : `\n✅ ${diferenca}h abaixo da média`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
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
                // SALVA NO LOCALSTORAGE
                const dadosParaSalvar = {
                    horas: parseInt(inputHoras.value) || 0,
                    minutos: parseInt(inputMinutos.value) || 0,
                    resultado: data
                };
                localStorage.setItem('dadosCalculadora', JSON.stringify(dadosParaSalvar));
                console.log('Dados salvos:', dadosParaSalvar); // DEBUG
                
                dadosResultado = data;
                
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

            const texto = `⏰ Uso ${dadosResultado.horasDia}h de tela por dia!\n📊 Classificação: ${dadosResultado.classificacao}\n📱 Isso equivale a ${dadosResultado.diasPerdidos} dias por ano!\n\n🔗 Faça seu teste também:`;
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
                <button onclick="this.closest('div').remove()" class="btn btn-outline-secondary w-100 mt-3">Fechar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
});