import type { QuestionSet } from "@/core/entities/question.entity"

export const MOCK_QUESTION_SETS: QuestionSet[] = [
  {
    id: "qs-1",
    topic: "Sistema Cardiovascular",
    subject: "Fisiologia",
    questionCount: 4,
    createdAt: "2026-02-18T10:00:00Z",
    questions: [
      {
        id: "q-1-1",
        question:
          "Qual estrutura é responsável por gerar o impulso elétrico que inicia o batimento cardíaco?",
        alternatives: [
          { id: "a-1-1-a", text: "Nó atrioventricular (AV)", isCorrect: false },
          { id: "a-1-1-b", text: "Nó sinoatrial (SA)", isCorrect: true },
          { id: "a-1-1-c", text: "Feixe de His", isCorrect: false },
          { id: "a-1-1-d", text: "Fibras de Purkinje", isCorrect: false },
        ],
        explanation:
          "O nó sinoatrial (SA), localizado no átrio direito, é o marca-passo natural do coração. Ele gera impulsos elétricos rítmicos que se propagam pelos átrios, iniciando a contração cardíaca.",
      },
      {
        id: "q-1-2",
        question: "Qual é o débito cardíaco normal em repouso de um adulto?",
        alternatives: [
          { id: "a-1-2-a", text: "2 a 3 L/min", isCorrect: false },
          { id: "a-1-2-b", text: "4 a 5 L/min", isCorrect: false },
          { id: "a-1-2-c", text: "5 a 6 L/min", isCorrect: true },
          { id: "a-1-2-d", text: "8 a 10 L/min", isCorrect: false },
        ],
        explanation:
          "O débito cardíaco normal em repouso é de aproximadamente 5 a 6 L/min, calculado pelo produto da frequência cardíaca (~70 bpm) pelo volume sistólico (~70-80 mL).",
      },
      {
        id: "q-1-3",
        question:
          "A Lei de Frank-Starling descreve a relação entre:",
        alternatives: [
          {
            id: "a-1-3-a",
            text: "Frequência cardíaca e pressão arterial",
            isCorrect: false,
          },
          {
            id: "a-1-3-b",
            text: "Pré-carga e força de contração ventricular",
            isCorrect: true,
          },
          {
            id: "a-1-3-c",
            text: "Pós-carga e débito cardíaco",
            isCorrect: false,
          },
          {
            id: "a-1-3-d",
            text: "Resistência vascular e retorno venoso",
            isCorrect: false,
          },
        ],
        explanation:
          "A Lei de Frank-Starling estabelece que, dentro de limites fisiológicos, quanto maior o volume diastólico final (pré-carga), maior será a força de contração ventricular e, consequentemente, o volume sistólico.",
      },
      {
        id: "q-1-4",
        question: "O que acontece durante a fase de ejeção ventricular?",
        alternatives: [
          {
            id: "a-1-4-a",
            text: "As valvas atrioventriculares se abrem",
            isCorrect: false,
          },
          {
            id: "a-1-4-b",
            text: "As valvas semilunares se abrem e o sangue é ejetado",
            isCorrect: true,
          },
          {
            id: "a-1-4-c",
            text: "Todas as valvas estão fechadas",
            isCorrect: false,
          },
          {
            id: "a-1-4-d",
            text: "O enchimento ventricular atinge o pico",
            isCorrect: false,
          },
        ],
        explanation:
          "Na fase de ejeção, a pressão ventricular supera a pressão nas artérias, abrindo as valvas semilunares (aórtica e pulmonar) e permitindo a ejeção do sangue para a circulação sistêmica e pulmonar.",
      },
    ],
  },
  {
    id: "qs-2",
    topic: "Antibióticos Beta-Lactâmicos",
    subject: "Farmacologia",
    questionCount: 3,
    createdAt: "2026-02-22T16:00:00Z",
    questions: [
      {
        id: "q-2-1",
        question:
          "Qual o mecanismo de ação dos antibióticos beta-lactâmicos?",
        alternatives: [
          {
            id: "a-2-1-a",
            text: "Inibição da síntese de proteínas na subunidade 30S",
            isCorrect: false,
          },
          {
            id: "a-2-1-b",
            text: "Inibição da síntese da parede celular bacteriana",
            isCorrect: true,
          },
          {
            id: "a-2-1-c",
            text: "Inibição da síntese de ácido fólico",
            isCorrect: false,
          },
          {
            id: "a-2-1-d",
            text: "Alteração da permeabilidade da membrana celular",
            isCorrect: false,
          },
        ],
        explanation:
          "Os beta-lactâmicos se ligam às proteínas ligadoras de penicilina (PBPs), inibindo a transpeptidase necessária para a síntese do peptidoglicano da parede celular bacteriana.",
      },
      {
        id: "q-2-2",
        question:
          "Qual dos seguintes antibióticos é uma cefalosporina de 3ª geração?",
        alternatives: [
          { id: "a-2-2-a", text: "Cefalexina", isCorrect: false },
          { id: "a-2-2-b", text: "Cefazolina", isCorrect: false },
          { id: "a-2-2-c", text: "Ceftriaxona", isCorrect: true },
          { id: "a-2-2-d", text: "Cefepima", isCorrect: false },
        ],
        explanation:
          "A ceftriaxona é uma cefalosporina de 3ª geração com amplo espectro contra gram-negativos. Cefalexina é de 1ª geração, cefazolina de 1ª geração (uso parenteral) e cefepima de 4ª geração.",
      },
      {
        id: "q-2-3",
        question:
          "Paciente alérgico à penicilina tem qual probabilidade de reação cruzada com cefalosporinas?",
        alternatives: [
          { id: "a-2-3-a", text: "Menor que 1%", isCorrect: false },
          { id: "a-2-3-b", text: "1 a 3%", isCorrect: true },
          { id: "a-2-3-c", text: "10 a 15%", isCorrect: false },
          { id: "a-2-3-d", text: "Acima de 20%", isCorrect: false },
        ],
        explanation:
          "Estudos recentes mostram que a taxa de reação cruzada real entre penicilinas e cefalosporinas é de aproximadamente 1 a 3%, muito menor do que os 10% historicamente citados.",
      },
    ],
  },
  {
    id: "qs-3",
    topic: "Distúrbios Hidroeletrolíticos",
    subject: "Clínica Médica",
    questionCount: 3,
    createdAt: "2026-02-28T08:45:00Z",
    questions: [
      {
        id: "q-3-1",
        question:
          "Qual o principal achado eletrocardiográfico da hipercalemia?",
        alternatives: [
          { id: "a-3-1-a", text: "Onda U proeminente", isCorrect: false },
          { id: "a-3-1-b", text: "Onda T apiculada (em tenda)", isCorrect: true },
          { id: "a-3-1-c", text: "Prolongamento do intervalo QT", isCorrect: false },
          { id: "a-3-1-d", text: "Infradesnivelamento de ST", isCorrect: false },
        ],
        explanation:
          "A hipercalemia causa caracteristicamente ondas T apiculadas e estreitas ('em tenda'). Em níveis mais elevados, pode causar alargamento do QRS e, eventualmente, fibrilação ventricular.",
      },
      {
        id: "q-3-2",
        question:
          "Qual o tratamento de primeira linha para hiponatremia grave sintomática?",
        alternatives: [
          { id: "a-3-2-a", text: "Restrição hídrica", isCorrect: false },
          { id: "a-3-2-b", text: "Solução salina hipertônica (NaCl 3%)", isCorrect: true },
          { id: "a-3-2-c", text: "Furosemida", isCorrect: false },
          { id: "a-3-2-d", text: "Vaptanos", isCorrect: false },
        ],
        explanation:
          "Na hiponatremia grave sintomática (convulsões, rebaixamento), utiliza-se solução salina hipertônica (NaCl 3%) com correção máxima de 8-10 mEq/L nas primeiras 24h para evitar mielinólise pontina.",
      },
      {
        id: "q-3-3",
        question:
          "A causa mais comum de hipocalcemia é:",
        alternatives: [
          { id: "a-3-3-a", text: "Hipoparatireoidismo", isCorrect: true },
          { id: "a-3-3-b", text: "Pancreatite aguda", isCorrect: false },
          { id: "a-3-3-c", text: "Deficiência de vitamina D", isCorrect: false },
          { id: "a-3-3-d", text: "Síndrome nefrótica", isCorrect: false },
        ],
        explanation:
          "O hipoparatireoidismo (frequentemente pós-cirúrgico) é a causa mais comum de hipocalcemia. O PTH é essencial para manter os níveis séricos de cálcio através da reabsorção óssea e renal.",
      },
    ],
  },
]
