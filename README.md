# 📱 Calculadora de Tempo de Tela - Consciência Digital

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> Projeto de Extensão Universitária para conscientização sobre saúde digital e uso consciente de dispositivos eletrônicos.

## 📋 Sobre o Projeto

A **Calculadora de Tempo de Tela** é uma aplicação web desenvolvida em Python/Flask que permite aos usuários calcularem quanto tempo gastam em dispositivos eletrônicos e visualizarem o impacto disso em suas vidas através de métricas estatísticas e visualizações interativas.

Este projeto foi desenvolvido como **Atividade de Extensão Universitária** com foco em:
- 📊 **Estatística Aplicada** (medidas de tendência central, classificações, indicadores)
- 🐍 **Programação Python** (funções, estruturas condicionais, operadores)
- 📈 **Dashboard e Análise de Dados** (visualizações, KPIs, design UX/UI)

## ✨ Funcionalidades

- ⏱️ **Cálculo preciso** de tempo de tela (horas e minutos)
- 📊 **Visualizações interativas** (gráfico de rosca e barras)
- 📈 **Comparação estatística** com a média nacional brasileira
- 🎯 **Classificação automática** do nível de uso (Normal, Moderado, Alto, Excessivo)
- 📱 **PWA (Progressive Web App)** - instalável como aplicativo
- 🔗 **Compartilhamento** em redes sociais (WhatsApp, Facebook, Twitter)
- 📚 **Conteúdo educativo** sobre saúde digital
- 👥 **Contador de impacto social** (visitantes únicos)

## 🎯 Aplicação das Disciplinas Acadêmicas

### Estatística Aplicada
- Cálculo de médias e medianas
- Distribuições e classificações estatísticas
- Comparação com dados populacionais (IBGE)
- Indicadores de desempenho (KPIs)

### Programação Python
- Funções customizadas para cálculos
- Estruturas condicionais (if/elif/else)
- Operadores matemáticos
- Manipulação de arquivos e dados

### Dashboard e Visualização
- Design responsivo com Bootstrap
- Gráficos interativos (Chart.js)
- Princípios de UX/UI
- Animações e micro-interações

## 🚀 Tecnologias Utilizadas

- **Backend:** Python 3.8+, Flask 3.0+
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Frameworks CSS:** Bootstrap 5.3
- **Gráficos:** Chart.js
- **Animações:** Lottie Files
- **Ícones:** Font Awesome 6
- **PWA:** Service Workers, Web Manifest

## 📦 Instalação e Uso

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/calculadora-tempo-tela.git
cd calculadora-tempo-tela
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute a aplicação:
```bash
python app.py
```

5. Acesse no navegador:
```
http://127.0.0.1:5000
```

## 🌐 Deploy no Vercel

O projeto está configurado para deploy automático no Vercel:

1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Importe o projeto
4. Deploy automático!

Arquivo de configuração: `vercel.json`

## 📁 Estrutura do Projeto

```
calculadora_tempo_tela/
├── app.py                      # Aplicação Flask principal
├── requirements.txt            # Dependências Python
├── vercel.json                 # Configuração Vercel
├── templates/
│   ├── index.html             # Página principal
│   ├── dicas.html             # Página de dicas práticas
│   ├── saude.html             # Página sobre impactos na saúde
│   └── tempo-recomendado.html # Página com diretrizes OMS
├── static/
│   ├── css/
│   │   └── styles.css         # Estilos personalizados
│   ├── js/
│   │   └── scripts.js         # JavaScript principal
│   ├── icons/
│   │   ├── icon-192x192.png   # Ícone PWA 192x192
│   │   └── icon-512x512.png   # Ícone PWA 512x512
│   ├── manifest.json          # Manifest PWA
│   └── service-worker.js      # Service Worker
├── dados/
│   └── acessos.txt            # Contador de visitantes
└── README.md                  # Este arquivo
```

## 👥 Impacto Social

Este projeto tem como objetivo:

- Conscientizar a população sobre os riscos do uso excessivo de telas
- Fornecer dados estatísticos baseados em estudos científicos
- Oferecer ferramentas gratuitas de autoavaliação
- Promover educação em saúde digital

**Métricas de Impacto:**
- Contador de visitantes únicos
- Compartilhamentos em redes sociais
- Feedback da comunidade

## 📊 Dados e Estatísticas

O projeto utiliza como referência:
- Média nacional de uso: 4 horas/dia (IBGE)
- Diretrizes da OMS (Organização Mundial da Saúde)
- Estudos da American Optometric Association
- Pesquisas sobre saúde digital e bem-estar

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Quem sou**
- GitHub: https://github.com/Thiago-spba/Thiago-spba
- https://portfolio-thiagosp.vercel.app/

## 🙏 Agradecimentos

Centro Universitário Celso Lisboa

Professor: Miguel Gabriel Prazeres de Carvalho
Professor: Carlos Alberto Marques de Souza

## 📞 Contato

Para dúvidas, sugestões ou parcerias:
- Email: thiago.rpba@gmail.com

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

**Desenvolvido com ❤️ como Projeto de Extensão Universitária**