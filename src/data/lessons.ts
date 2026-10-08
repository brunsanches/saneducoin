export type Level = { id: number; name: string; subtitle: string; emoji: string };

export const LEVELS: Level[] = [
  { id: 1, name: "Sobrevivência", subtitle: "Limpando o terreno", emoji: "🧹" },
  { id: 2, name: "Poupador", subtitle: "A base de segurança", emoji: "🐷" },
  { id: 3, name: "Investidor de Renda Fixa", subtitle: "Emprestando dinheiro", emoji: "🏦" },
  { id: 4, name: "Sócio", subtitle: "Construção de patrimônio", emoji: "📈" },
  { id: 5, name: "Mestre do Capital", subtitle: "Derivativos e alternativos", emoji: "👑" },
];

export type Lesson = {
  id: string;
  level: number;
  title: string;
  /** Até 3 parágrafos. Use [[Termo]] para termos com explicação (apenas nível 3+). */
  paragraphs: string[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const LESSONS: Lesson[] = [
  // Nível 1
  {
    id: "dividas",
    level: 1,
    title: "Como sair das dívidas",
    paragraphs: [
      "O primeiro passo é colocar todas as dívidas no papel: para quem você deve, quanto e qual o juro de cada uma. Sem esse mapa, fica impossível escolher por onde começar.",
      "Ataque primeiro a dívida com o juro mais alto. Normalmente é o cartão de crédito ou o cheque especial: eles crescem muito mais rápido que qualquer outra conta.",
      "Enquanto quita, pare de criar dívidas novas: deixe o cartão guardado e compre só no débito ou no PIX.",
    ],
    question: "Qual dívida você deve pagar primeiro?",
    options: ["A de menor valor", "A com o juro mais alto", "A mais antiga", "Tanto faz"],
    correct: 1,
    explanation: "A dívida com o maior juro é a que mais cresce todo mês. Quitar ela primeiro economiza mais dinheiro.",
  },
  {
    id: "renegociacao",
    level: 1,
    title: "Renegociação sem medo",
    paragraphs: [
      "Bancos e lojas preferem receber menos do que não receber nada. Por isso, renegociar costuma render descontos grandes, às vezes acima de 80% em dívidas antigas.",
      "Use canais oficiais como o Desenrola, o Serasa Limpa Nome ou o app do seu próprio banco. Desconfie de quem pede pagamento adiantado para 'limpar seu nome'.",
      "Só aceite uma parcela que caiba no seu orçamento. Um acordo quebrado volta com juros e piora a situação.",
    ],
    question: "Qual é o cuidado mais importante ao fechar um acordo?",
    options: ["Escolher a maior parcela possível", "Garantir que a parcela cabe no orçamento", "Pagar uma taxa para um intermediário", "Fechar o acordo no primeiro dia"],
    correct: 1,
    explanation: "Um acordo que você não consegue pagar vira uma nova dívida. A parcela precisa caber no seu mês.",
  },
  {
    id: "cartao-cheque",
    level: 1,
    title: "Rotativo e cheque especial: as armadilhas",
    paragraphs: [
      "Pagar só o mínimo da fatura joga o resto no rotativo, que pode passar de 400% ao ano. Uma dívida de R$ 1.000 pode virar mais de R$ 4.000 em um ano.",
      "O cheque especial parece um 'dinheiro extra' na sua conta, mas é um empréstimo caríssimo que começa a cobrar juros no mesmo dia.",
      "Regra de ouro: pague sempre a fatura inteira. Se não der, troque o rotativo por um empréstimo pessoal mais barato.",
    ],
    question: "O que acontece quando você paga só o mínimo da fatura?",
    options: ["Nada, está tudo certo", "O resto entra no rotativo com juros altíssimos", "O banco perdoa o restante", "Você ganha pontos extras"],
    correct: 1,
    explanation: "O valor que sobra vai para o rotativo, um dos juros mais altos do Brasil.",
  },
  {
    id: "orcamento",
    level: 1,
    title: "Orçamento 50/30/20 e PIX inteligente",
    paragraphs: [
      "A regra 50/30/20 divide sua renda líquida: 50% para o essencial (aluguel, contas, mercado), 30% para desejos (lazer, delivery) e 20% para o futuro (dívidas e investimentos).",
      "Ganha R$ 3.000? São R$ 1.500 para o essencial, R$ 900 para desejos e R$ 600 para o futuro.",
      "Use o PIX a seu favor: agende transferências para a sua 'caixinha' no dia do pagamento e confira sempre o nome do recebedor antes de confirmar, para fugir de golpes.",
    ],
    question: "Com renda de R$ 4.000, quanto vai para o futuro na regra 50/30/20?",
    options: ["R$ 400", "R$ 800", "R$ 1.200", "R$ 2.000"],
    correct: 1,
    explanation: "20% de R$ 4.000 são R$ 800 por mês para quitar dívidas e investir.",
  },
  // Nível 2
  {
    id: "reserva",
    level: 2,
    title: "Reserva de emergência",
    paragraphs: [
      "A reserva de emergência é o dinheiro que te salva quando o carro quebra ou o emprego some. Sem ela, qualquer imprevisto vira dívida no cartão.",
      "O ideal é guardar de 6 a 12 meses do seu custo de vida. Gasta R$ 2.500 por mês? Sua meta fica entre R$ 15.000 e R$ 30.000.",
      "Ela precisa estar em um lugar seguro e que você consiga sacar no mesmo dia. Comece pequeno: R$ 50 por mês já é um começo.",
    ],
    question: "Quanto deve ter uma reserva de emergência?",
    options: ["1 salário", "De 6 a 12 meses do custo de vida", "O valor de um carro", "Não precisa ter"],
    correct: 1,
    explanation: "De 6 a 12 meses do seu custo de vida cobre a maioria dos imprevistos com folga.",
  },
  {
    id: "inflacao",
    level: 2,
    title: "Inflação: o inimigo invisível",
    paragraphs: [
      "Inflação é o aumento geral dos preços. No Brasil, a medida oficial é o IPCA, calculado pelo IBGE.",
      "Se o IPCA do ano foi 5%, a mesma compra de mercado que custava R$ 100 passa a custar R$ 105. Seu dinheiro parado compra menos coisas.",
      "Por isso não basta guardar dinheiro: é preciso que ele renda mais que a inflação para você realmente ficar mais rico.",
    ],
    question: "Qual índice mede a inflação oficial no Brasil?",
    options: ["Ibovespa", "IPCA", "Dólar", "Selic"],
    correct: 1,
    explanation: "O IPCA, medido pelo IBGE, é o índice oficial de inflação do país.",
  },
  {
    id: "poupanca",
    level: 2,
    title: "Por que a poupança perde dinheiro",
    paragraphs: [
      "A poupança da Caixa ou de qualquer banco rende cerca de 0,5% ao mês mais um pequeno extra. Em vários anos, isso fica abaixo da inflação.",
      "Na prática, seu dinheiro cresce no extrato, mas compra menos coisas no mercado. É perder dinheiro sem perceber.",
      "Existem opções tão seguras quanto a poupança que rendem mais, como o Tesouro Selic e CDBs de grandes bancos. Você vai conhecer no próximo nível.",
    ],
    question: "Por que a poupança costuma ser uma má escolha?",
    options: ["Porque é proibida", "Porque muitas vezes rende menos que a inflação", "Porque tem imposto alto", "Porque não dá para sacar"],
    correct: 1,
    explanation: "Quando rende menos que a inflação, o poder de compra do seu dinheiro diminui.",
  },
  // Nível 3
  {
    id: "tesouro",
    level: 3,
    title: "Tesouro Direto: Selic, IPCA+ e Prefixado",
    paragraphs: [
      "No Tesouro Direto você empresta dinheiro para o governo federal, pelo site do Tesouro Nacional ou pela corretora. É o investimento mais seguro do país.",
      "O Tesouro Selic acompanha a taxa [[Selic]] e tem [[liquidez]] diária: ótimo para a reserva. O IPCA+ paga a inflação mais um juro fixo, protegendo seu poder de compra no longo prazo.",
      "O Prefixado trava uma taxa no dia da compra. Se você vender antes do vencimento, o preço pode oscilar ([[marcação a mercado]]).",
    ],
    question: "Qual título é o mais indicado para a reserva de emergência?",
    options: ["Tesouro Prefixado 2035", "Tesouro IPCA+ 2045", "Tesouro Selic", "Nenhum"],
    correct: 2,
    explanation: "O Tesouro Selic quase não oscila e pode ser resgatado a qualquer dia útil.",
  },
  {
    id: "cdb",
    level: 3,
    title: "CDB e o % do CDI",
    paragraphs: [
      "No CDB você empresta dinheiro para um banco, como Nubank, Inter ou Itaú. Em troca, ele paga um percentual do [[CDI]].",
      "Um CDB de 100% do CDI rende praticamente o mesmo que o Tesouro Selic. Já 120% do CDI rende 20% a mais que isso.",
      "Muitos CDBs têm [[liquidez]] diária e são protegidos pelo [[FGC]] até R$ 250 mil por CPF e por instituição.",
    ],
    question: "Um CDB de 110% do CDI rende…",
    options: ["Menos que o CDI", "Igual ao CDI", "10% a mais que o CDI", "110% ao ano"],
    correct: 2,
    explanation: "110% do CDI significa receber o CDI inteiro mais 10% dele.",
  },
  {
    id: "lci-lca",
    level: 3,
    title: "LCI, LCA, debêntures, CRI e CRA",
    paragraphs: [
      "LCI e LCA financiam imóveis e o agronegócio e são isentas de [[Imposto de Renda]] para pessoa física. Também têm proteção do [[FGC]].",
      "Debêntures são empréstimos para empresas. CRIs e CRAs financiam o setor imobiliário e o agro. Pagam mais, mas não têm FGC: o risco é a empresa não pagar ([[risco de crédito]]).",
      "Quanto maior a taxa oferecida, maior costuma ser o risco. Diversifique e leia quem é o emissor.",
    ],
    question: "Qual destes investimentos NÃO tem a garantia do FGC?",
    options: ["CDB", "LCI", "LCA", "Debênture"],
    correct: 3,
    explanation: "Debêntures, CRIs e CRAs não têm FGC. Se o emissor quebrar, você pode perder dinheiro.",
  },
  // Nível 4
  {
    id: "acoes",
    level: 4,
    title: "Ações e dividendos",
    paragraphs: [
      "Comprar uma ação é virar sócio de uma empresa listada na B3, como Itaú, Petrobras ou WEG. Você participa dos lucros e prejuízos.",
      "Parte do lucro é distribuída em [[dividendos]], dinheiro que cai direto na sua conta da corretora.",
      "O preço das ações tem [[volatilidade]]: sobe e desce todo dia. Por isso, invista pensando em 5 anos ou mais e só depois de ter a reserva pronta.",
    ],
    question: "O que são dividendos?",
    options: ["Uma taxa da corretora", "Parte do lucro paga aos sócios", "Um tipo de imposto", "Um empréstimo"],
    correct: 1,
    explanation: "Dividendos são a fatia do lucro que a empresa divide com quem tem ações dela.",
  },
  {
    id: "fiis",
    level: 4,
    title: "FIIs: aluguel todo mês",
    paragraphs: [
      "Fundos Imobiliários (FIIs) reúnem dinheiro de muitas pessoas para comprar shoppings, galpões e prédios comerciais.",
      "Os aluguéis são distribuídos mensalmente aos cotistas e, para pessoa física, esses rendimentos são isentos de [[Imposto de Renda]].",
      "Com cotas a partir de R$ 10 na B3, você vira 'dono' de pedacinhos de imóveis sem precisar de escritura nem inquilino.",
    ],
    question: "Com que frequência a maioria dos FIIs paga rendimentos?",
    options: ["Uma vez por ano", "Todo mês", "Só quando vende a cota", "Nunca"],
    correct: 1,
    explanation: "A maioria dos FIIs distribui os aluguéis mensalmente.",
  },
  {
    id: "etfs-bdrs",
    level: 4,
    title: "ETFs e BDRs",
    paragraphs: [
      "Um ETF é uma cesta de ações em um só ativo. O BOVA11, por exemplo, segue o Ibovespa: com uma cota você tem um pedaço das maiores empresas da B3.",
      "BDRs são recibos negociados na B3 que representam ações de fora, como Apple ou Amazon. É investir no exterior sem abrir conta lá fora.",
      "ETFs e BDRs ajudam a [[diversificação]]: se uma empresa vai mal, as outras seguram a carteira.",
    ],
    question: "O que é o BOVA11?",
    options: ["Uma criptomoeda", "Um ETF que segue o Ibovespa", "Um título do Tesouro", "Uma ação da Petrobras"],
    correct: 1,
    explanation: "BOVA11 é um ETF que replica o Ibovespa, o principal índice da bolsa brasileira.",
  },
  // Nível 5
  {
    id: "opcoes",
    level: 5,
    title: "Opções: calls e puts",
    paragraphs: [
      "Uma opção é um contrato que dá o direito de comprar (call) ou vender (put) uma ação por um preço combinado até uma data.",
      "Quem compra uma put está se protegendo de quedas, como um seguro. Quem compra uma call aposta na alta pagando pouco (o [[prêmio]]).",
      "Opções têm [[alavancagem]]: podem multiplicar ganhos e também zerar o valor investido rapidamente. Use com muito cuidado.",
    ],
    question: "Uma PUT dá o direito de…",
    options: ["Comprar uma ação", "Vender uma ação por um preço combinado", "Receber dividendos", "Não pagar imposto"],
    correct: 1,
    explanation: "A put é o direito de vender. Por isso funciona como proteção contra quedas.",
  },
  {
    id: "futuro",
    level: 5,
    title: "Mercado futuro",
    paragraphs: [
      "No mercado futuro você negocia hoje o preço de algo para uma data futura: dólar, Ibovespa (mini índice), boi gordo, milho.",
      "Empresas usam para se proteger (um exportador trava o dólar, por exemplo). Especuladores usam para apostar na direção do preço.",
      "Você deposita apenas uma [[margem de garantia]], mas ganha ou perde sobre o valor total. É [[alavancagem]] pura e exige muita disciplina.",
    ],
    question: "Por que o mercado futuro é arriscado para iniciantes?",
    options: ["Porque é ilegal", "Pela alta alavancagem", "Porque só abre aos domingos", "Porque não tem imposto"],
    correct: 1,
    explanation: "Com pouca margem você movimenta muito dinheiro, então as perdas podem ser grandes.",
  },
  {
    id: "cripto",
    level: 5,
    title: "Criptomoedas: riscos e custódia",
    paragraphs: [
      "Bitcoin é uma moeda digital com quantidade limitada. Ethereum é uma rede que roda contratos e aplicativos. Ambas têm [[volatilidade]] altíssima.",
      "Você pode comprar em corretoras ou via ETFs na B3, como o HASH11. Guardar em uma carteira própria ([[autocustódia]]) dá controle total, mas perder a senha significa perder tudo.",
      "Não há FGC nem garantia do governo. Uma regra comum é não ultrapassar 5% do patrimônio em cripto.",
    ],
    question: "O que acontece se você perder a chave da sua carteira em autocustódia?",
    options: ["O banco devolve", "O FGC cobre", "Você perde o acesso às moedas", "A B3 recupera"],
    correct: 2,
    explanation: "Na autocustódia só você tem a chave. Sem ela, ninguém consegue recuperar as moedas.",
  },
];

export const GLOSSARY: Record<string, string> = {
  Selic: "A taxa básica de juros do Brasil, definida pelo Banco Central. Ela serve de referência para quase todos os investimentos.",
  liquidez: "A facilidade de transformar o investimento em dinheiro na conta. Liquidez diária = dá para sacar em qualquer dia útil.",
  "marcação a mercado": "O preço do título muda todo dia conforme os juros do mercado. Só faz diferença se você vender antes do vencimento.",
  CDI: "Taxa que os bancos usam para emprestar dinheiro entre si. Anda quase colada na Selic e é a régua da renda fixa.",
  FGC: "Fundo Garantidor de Créditos: devolve até R$ 250 mil por CPF e por banco se a instituição quebrar.",
  "Imposto de Renda": "Imposto cobrado sobre o lucro. Em vários investimentos ele é descontado automaticamente no resgate.",
  "risco de crédito": "O risco de quem pegou seu dinheiro emprestado não conseguir pagar de volta.",
  dividendos: "Parte do lucro que a empresa distribui em dinheiro para quem tem ações dela.",
  volatilidade: "O quanto o preço sobe e desce. Alta volatilidade = muita oscilação em pouco tempo.",
  "diversificação": "Espalhar o dinheiro em vários investimentos para não depender de um só.",
  "prêmio": "O preço que você paga para comprar uma opção.",
  alavancagem: "Operar com mais dinheiro do que você tem. Multiplica ganhos e também perdas.",
  "margem de garantia": "Valor depositado na corretora como garantia de que você vai honrar a operação.",
  autocustódia: "Guardar suas criptomoedas em uma carteira em que só você tem a senha (chave privada).",
};
