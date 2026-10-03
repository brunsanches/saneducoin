# EduFin — app gamificado de educação financeira (entrega completa)

Tudo em português do Brasil, R$, instituições reais (Nubank, Caixa, B3, Tesouro Nacional), inflação pelo IPCA. Pensado para celular na vertical. Sem login: o progresso fica salvo no próprio aparelho.

## Identidade visual
- Verde (dinheiro/progresso) como cor principal + roxo/azul (tecnologia/confiança) como secundária.
- Cantos bem arredondados, fontes grandes (Nunito para títulos e texto), botões altos (min. 56px) e fáceis de tocar com o polegar.
- Layout centralizado em coluna de celular (max ~480px) mesmo no desktop.

## Telas
1. **Landing page (/)** — página de vendas: chamada principal, como funciona (XP, ofensiva, níveis), os 5 níveis da jornada, simuladores, depoimentos fictícios, botão "Começar grátis" que leva ao dashboard.
2. **Dashboard (/app)** — topo com avatar, "Nível X – Nome", saldo de XP com barra de progresso até o próximo nível e foguinho com dias de ofensiva. Card gigante "Próxima Missão", missões diárias e conquistas recentes.
3. **Trilhas (/trilhas)** — mapa sinuoso estilo jogo com os 5 níveis; aulas como círculos: cinza = bloqueada, colorida = liberada, com estrelas = concluída.
4. **Dojo (/aula/$id)** — até 3 parágrafos curtos, uma pergunta de múltipla escolha; acerto dispara confete verde em tela cheia e soma XP.
5. **Ferramentas (/ferramentas)** + 3 simuladores com gráfico do dinheiro crescendo:
   - Juros compostos (aporte inicial, aporte mensal, prazo, taxa)
   - Comparador: Poupança vs Tesouro Selic vs CDB 100% CDI (com IR regressivo)
   - Independência financeira (quanto falta para viver de renda)
6. **Perfil (/perfil)** — nível, XP total, ofensiva, todas as conquistas (bloqueadas/desbloqueadas), botão para zerar progresso.
- Barra inferior fixa nas telas do app: Home, Trilhas, Ferramentas, Perfil.

## Regras do jogo
- +10 XP por aula lida, +50 XP por quiz acertado, +100 XP por usar um simulador (1ª vez de cada).
- Ofensiva: conta dias seguidos de acesso; zera se pular um dia.
- Nível do usuário = nível da trilha alcançado (Sobrevivência, Poupador, Investidor de Renda Fixa, Sócio, Mestre do Capital). Aula seguinte só libera após concluir a anterior.
- Conquistas: "Mão de Vaca Nível 1" (aula de orçamento 50/30/20), "Sócio do Nubank" (aula de CDB), "Senhor dos Imóveis" (aula de FIIs), "Primeira Ofensiva" (3 dias), "Simulador Nato" (3 simuladores), "Mestre do Capital" (trilha completa) e mais algumas.

## Conteúdo (todas as aulas escritas por mim, ~3–4 por nível)
- N1: sair das dívidas, renegociação, rotativo do cartão, cheque especial, regra 50/30/20, PIX inteligente.
- N2: reserva de emergência, inflação (IPCA), por que a poupança perde.
- N3: Tesouro Selic/IPCA+/Prefixado, CDB (liquidez, % do CDI), LCI/LCA, debêntures, CRI/CRA, FGC.
- N4: ações e dividendos, FIIs, ETFs (BOVA11), BDRs.
- N5: opções (calls/puts), mercado futuro, cripto (riscos e custódia).
- Termos técnicos (CDI, liquidez, volatilidade…) só a partir do N3, sempre com ícone "?" que abre balão com explicação simples.

## Detalhes técnicos
- Rotas separadas em `src/routes/` (index, app, trilhas, aula.$id, ferramentas + 3 sub-rotas, perfil), cada uma com head() próprio.
- Conteúdo e conquistas em arquivos de dados tipados (`src/data/`); motor de gamificação em um store com hook (`useGame`) persistido em localStorage, lido após hidratação.
- Gráficos com recharts; confete com canvas-confetti (cores verdes); componente `Termo` com Popover para o "?".
- Tokens de cor em oklch em `src/styles.css`; fonte via `<link>` no root.
- Registrar decisões de estrutura no AGENTS.md e identidade visual na memória do projeto.
