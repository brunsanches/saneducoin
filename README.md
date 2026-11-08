# Saneducoin

PRIORIDADE 1: O Motor de Gamificação e Trilha de Conteúdo (O "Coração" do App)

Antes de desenhar telas, o Lovable precisa entender a lógica de progressão e exatamente qual conteúdo vai em cada etapa.

1.1. Economia Virtual e Engajamento

Moeda/Pontuação: "EduCoins" ou XP (Pontos de Experiência).

Mecânica de Ganho: +10 XP por aula lida, +50 XP por quiz acertado, +100 XP por usar um simulador.

Retenção Diária (Streak): Sistema de "Ofensiva" (estilo Duolingo) - quantos dias seguidos o usuário acessa o app.

1.2. Sistema de Níveis (A Jornada Financeira Completa) Informação necessária: O conteúdo exato que será ensinado em cada fase, do zero ao avançado.

Nível 1: Sobrevivência (Limpando o Terreno)

Conteúdo: Como sair das dívidas, renegociação, perigos do rotativo do cartão de crédito, cheque especial, organização de orçamento básico (Regra 50/30/20) e uso inteligente do PIX.

Nível 2: O Poupador (A Base de Segurança)

Conteúdo: Criação da Reserva de Emergência, o que é inflação (o inimigo invisível) e por que a Poupança perde dinheiro.

Nível 3: O Investidor de Renda Fixa (Emprestando dinheiro)

Conteúdo Básico: Tesouro Direto (Selic, IPCA+, Prefixado) e CDBs (Liquidez diária, % do CDI).

Conteúdo Avançado: LCI e LCA (Isenção de IR), Debêntures, CRIs e CRAs (Riscos e garantias do FGC).

Nível 4: O Sócio (Renda Variável - Construção de Patrimônio)

Conteúdo: Ações (Análise básica, dividendos), FIIs (Fundos Imobiliários e aluguéis mensais), ETFs (Fundos de Índice - ex: BOVA11) e BDRs (Investindo no exterior do Brasil).

Nível 5: Mestre do Capital (Derivativos e Alternativos)

Conteúdo: Opções (Calls e Puts), Mercado Futuro (Dólar, Índice, Commodities) e Criptomoedas (Bitcoin, Ethereum, riscos e custódia).

1.3. Conquistas (Badges)

Exemplos: "Mão de Vaca Nível 1" (Orçamento criado), "Sócio do Nubank" (Primeiro CDB), "Senhor dos Imóveis" (Primeiro FII estudado).

PRIORIDADE 2: Arquitetura de Interface (O que cada tela precisa ter)

Agora que temos a lógica, definimos os componentes visuais que pediríamos para o Lovable criar em cada página.

2.1. Dashboard Gamificado (Tela Inicial Pós-Login)

Header: Foto de perfil, Nível atual (Ex: Nível 2 - Poupador), saldo de XP e ícone de "fogo" mostrando a ofensiva de dias.

Corpo: Card de "Próxima Missão" (botão de CTA gigante para a próxima aula).

Rodapé: Barra de navegação inferior (Home, Trilhas, Ferramentas, Perfil).

2.2. Trilha de Aprendizado (O Mapa)

Visual: Um caminho sinuoso (estilo mapa de jogo).

Componentes: Nódulos (círculos) representando as aulas. Nódulos cinzas estão bloqueados. Nódulos coloridos estão liberados. Nódulos com estrelas foram concluídos.

2.3. O "Dojo" (Tela da Aula e Quiz)

Informação: Um texto curto (máximo 3 parágrafos) ou carrossel de imagens explicando o conceito.

Interação: Uma pergunta de múltipla escolha. Se acertar, dispara uma animação de confetes em tela cheia na cor verde.

2.4. Arsenal de Ferramentas (Simuladores)

Simulador 1: Juros Compostos (Aporte + Tempo + Taxa).

Simulador 2: Comparador de Renda Fixa (Poupança vs. Tesouro Selic vs. CDB 100% CDI).

Simulador 3: Calculadora de Independência Financeira (Quanto falta para viver de renda).

PRIORIDADE 3: Contexto e UX (Regras Inegociáveis de Design)

Instruções de "comportamento" para a IA não gerar um sistema genérico americano.

Identidade Visual: Cores primárias Verde (dinheiro/progresso) e Roxo/Azul (tecnologia/confiança). Interface limpa, cantos arredondados, fontes grandes.

Zero "Economês" Inicial: Termos técnicos (CDI, Volatilidade, Liquidez) só aparecem a partir do Nível 3, e sempre com um ícone de "?" que abre um balão de explicação simples.

Contexto 100% Brasileiro: Textos devem usar "R$", citar instituições reais do dia a dia (Nubank, Caixa, B3, Tesouro Nacional) e usar inflação baseada no IPCA.

Mobile-First Extremo: Todo o design deve ser pensado para tela de celular vertical. Botões devem ser fáceis de clicar com o polegar.

PRIORIDADE 4: O Roadmap de Execução no Lovable (Passo a Passo)

Como vamos "alimentar" a IA para que o código não quebre.

Prompt 1 (Base): Criar o Design System Global, Navbar e a Landing Page de conversão (Página de vendas do app).

Prompt 2 (Dashboard): Criar a UI do Dashboard Logado, focando na barra de progresso de XP, Avatar e cards de missões diárias.

Prompt 3 (O Mapa): Criar o componente visual da Trilha (o mapa gamificado com os níveis 1 ao 5 descritos na Prioridade 1).

Prompt 4 (O Quiz): Desenvolver a lógica e a interface de uma aula interativa, onde o clique na resposta certa gera a animação de sucesso.

Prompt 5 (Ferramentas): Construir as 3 calculadoras interativas (React state) com gráficos visuais mostrando o dinheiro crescendo ao longo do tempo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://saneducoin.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2736b610-ff43-4912-a6f2-c5179aae0d65).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
