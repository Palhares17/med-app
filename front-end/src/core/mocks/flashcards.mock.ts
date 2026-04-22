import type { FlashcardDeck } from "@/core/entities/flashcard.entity"

export const MOCK_DECKS: FlashcardDeck[] = [
  {
    id: "deck_01_cardiovascular",
    topic: "Sistema Cardiovascular",
    subject: "Anatomia Humana",
    cardCount: 6,
    createdAt: "2026-02-20T14:30:00Z",
    cards: [
      {
        id: "card_cv_01",
        front: "Quais são as quatro câmaras do coração humano?",
        back: "O coração possui dois átrios (direito e esquerdo) e dois ventrículos (direito e esquerdo). Os átrios recebem o sangue e os ventrículos o bombeiam. O átrio direito recebe sangue venoso das veias cavas, e o átrio esquerdo recebe sangue arterial das veias pulmonares.",
      },
      {
        id: "card_cv_02",
        front: "O que é o septo interventricular e qual sua função?",
        back: "O septo interventricular é uma parede muscular espessa que separa os ventrículos direito e esquerdo. Sua função principal é impedir a mistura do sangue venoso (rico em CO2) com o sangue arterial (rico em O2), garantindo a circulação eficiente. A porção membranosa superior é a mais fina e a porção muscular inferior é a mais espessa.",
      },
      {
        id: "card_cv_03",
        front: "Descreva a circulação pulmonar (pequena circulação).",
        back: "A circulação pulmonar inicia no ventrículo direito, que ejeta sangue venoso através da valva pulmonar para o tronco pulmonar. Este se divide nas artérias pulmonares direita e esquerda, levando sangue aos pulmões. Nos capilares alveolares ocorre a hematose (troca gasosa). O sangue arterializado retorna ao átrio esquerdo pelas quatro veias pulmonares.",
      },
      {
        id: "card_cv_04",
        front: "Quais são as artérias coronárias e o que elas irrigam?",
        back: "As artérias coronárias direita e esquerda originam-se da aorta ascendente, logo acima da valva aórtica. A coronária esquerda se divide em: artéria descendente anterior (irriga parede anterior do VE e septo) e artéria circunflexa (irriga parede lateral e posterior do VE). A coronária direita irriga o VD, a parede inferior do VE e o nó sinoatrial (em 60% dos casos).",
      },
      {
        id: "card_cv_05",
        front: "O que é o sistema de condução do coração?",
        back: "O sistema de condução é responsável pela geração e propagação do impulso elétrico cardíaco. É composto por: nó sinoatrial (SA) -- marca-passo natural, localizado no átrio direito; nó atrioventricular (AV) -- atrasa o impulso para permitir enchimento ventricular; feixe de His -- conduz o impulso pelo septo interventricular; e fibras de Purkinje -- distribuem o impulso pelas paredes ventriculares.",
      },
      {
        id: "card_cv_06",
        front: "Quais são as valvas cardíacas e suas localizações?",
        back: "O coração possui quatro valvas: as atrioventriculares (tricúspide, entre AD e VD; e mitral/bicúspide, entre AE e VE) impedem o refluxo de sangue dos ventrículos para os átrios durante a sístole. As valvas semilunares (pulmonar, na saída do VD; e aórtica, na saída do VE) impedem o refluxo de sangue das grandes artérias para os ventrículos durante a diástole.",
      },
    ],
  },
  {
    id: "deck_02_anti_hipertensivos",
    topic: "Farmacologia dos Anti-hipertensivos",
    subject: "Farmacologia",
    cardCount: 7,
    createdAt: "2026-02-18T09:30:00Z",
    cards: [
      {
        id: "card_ah_01",
        front: "Qual o mecanismo de ação dos inibidores da ECA (IECA)?",
        back: "Os IECA (ex.: enalapril, captopril, ramipril) inibem a enzima conversora de angiotensina (ECA), bloqueando a conversão de angiotensina I em angiotensina II. Isso resulta em vasodilatação, redução da secreção de aldosterona (diminuindo retenção de sódio e água) e aumento de bradicinina (vasodilatador). A tosse seca é efeito adverso comum justamente pelo acúmulo de bradicinina.",
      },
      {
        id: "card_ah_02",
        front: "Qual a diferença entre IECA e BRA (bloqueadores dos receptores de angiotensina)?",
        back: "Os IECA inibem a enzima que produz angiotensina II, enquanto os BRA (ex.: losartana, valsartana, candesartana) bloqueiam diretamente o receptor AT1 da angiotensina II. Como os BRA não afetam a degradação de bradicinina, não causam tosse seca. Ambos são contraindicados na gestação por risco de teratogenicidade. Os BRA são frequentemente indicados quando há intolerância aos IECA.",
      },
      {
        id: "card_ah_03",
        front: "Como atuam os bloqueadores dos canais de cálcio (BCC)?",
        back: "Os BCC bloqueiam os canais de cálcio tipo L na musculatura lisa vascular e/ou cardíaca. Di-hidropiridínicos (anlodipino, nifedipino) atuam principalmente nos vasos, causando vasodilatação periférica. Não-di-hidropiridínicos (verapamil, diltiazem) atuam predominantemente no coração, reduzindo frequência cardíaca e contratilidade. Edema de membros inferiores é efeito adverso comum dos di-hidropiridínicos.",
      },
      {
        id: "card_ah_04",
        front: "Qual o mecanismo de ação dos diuréticos tiazídicos?",
        back: "Os tiazídicos (hidroclorotiazida, clortalidona, indapamida) inibem o cotransportador Na+/Cl- no túbulo contorcido distal do néfron. Isso aumenta a excreção de sódio e água, reduzindo a volemia e, a longo prazo, a resistência vascular periférica. Podem causar hipocalemia, hiperuricemia, hiperglicemia e hiponatremia. A clortalidona tem meia-vida mais longa e é preferida em ensaios clínicos.",
      },
      {
        id: "card_ah_05",
        front: "Quando os betabloqueadores são indicados na hipertensão?",
        back: "Betabloqueadores (propranolol, atenolol, metoprolol, carvedilol) reduzem a PA por diminuição do débito cardíaco e da secreção de renina. Não são mais primeira linha como monoterapia anti-hipertensiva (exceto em situações específicas). São indicados em HAS associada a: insuficiência cardíaca (carvedilol, bisoprolol, metoprolol succinato), doença coronariana, arritmias e enxaqueca. Contraindicados em asma e DPOC grave (não seletivos).",
      },
      {
        id: "card_ah_06",
        front: "O que é a espironolactona e quando é utilizada?",
        back: "A espironolactona é um antagonista da aldosterona (diurético poupador de potássio). Atua bloqueando o receptor de mineralocorticoide no túbulo coletor, inibindo a reabsorção de sódio e a secreção de potássio. Indicada na hipertensão resistente (4o fármaco), insuficiência cardíaca (classes III-IV) e hiperaldosteronismo. Pode causar hipercalemia e ginecomastia (efeito antiandrogênico).",
      },
      {
        id: "card_ah_07",
        front: "Quais as principais classes de anti-hipertensivos de primeira linha no Brasil?",
        back: "Segundo as Diretrizes Brasileiras de Hipertensão, as classes de primeira linha em monoterapia são: diuréticos tiazídicos (hidroclorotiazida, clortalidona), IECA (enalapril, ramipril), BRA (losartana, valsartana) e bloqueadores dos canais de cálcio (anlodipino). A escolha depende de comorbidades, idade e perfil do paciente. Combinações de duas classes são recomendadas quando a PA está mais de 20/10 mmHg acima da meta.",
      },
    ],
  },
  {
    id: "deck_03_snc",
    topic: "Sistema Nervoso Central",
    subject: "Neuroanatomia",
    cardCount: 5,
    createdAt: "2026-02-15T16:50:00Z",
    cards: [
      {
        id: "card_snc_01",
        front: "Quais são as principais divisões do encéfalo?",
        back: "O encéfalo divide-se em: prosencéfalo (cérebro), que inclui o telencéfalo (hemisférios cerebrais, córtex, núcleos da base) e o diencéfalo (tálamo, hipotálamo, epitálamo, subtálamo); mesencéfalo (pedúnculos cerebrais, tecto, aqueduto cerebral); e rombencéfalo, que inclui a ponte, o cerebelo e o bulbo (medula oblonga). O tronco encefálico é formado por mesencéfalo, ponte e bulbo.",
      },
      {
        id: "card_snc_02",
        front: "Quais são os lobos do cérebro e suas principais funções?",
        back: "O cérebro possui quatro lobos principais: frontal (planejamento motor, funções executivas, personalidade, área de Broca para produção da fala); parietal (processamento somatossensorial, propriocepção, orientação espacial); temporal (audição, memória, área de Wernicke para compreensão da linguagem); e occipital (processamento visual primário e associativo). Há também o lobo da ínsula, profundo ao sulco lateral, relacionado a gustação e interocepção.",
      },
      {
        id: "card_snc_03",
        front: "O que é o tálamo e qual sua função principal?",
        back: "O tálamo é uma estrutura ovoide pareada localizada no diencéfalo. Funciona como estação retransmissora de quase todas as informações sensoriais (exceto olfação) que chegam ao córtex cerebral. Seus núcleos incluem: corpo geniculado lateral (visão), corpo geniculado medial (audição), núcleo ventral posterolateral (sensibilidade somática do corpo) e núcleo ventral posteromedial (sensibilidade somática da face). Também participa da regulação da consciência e do ciclo sono-vigília.",
      },
      {
        id: "card_snc_04",
        front: "Descreva a irrigação arterial do encéfalo e o polígono de Willis.",
        back: "A irrigação encefálica provém de dois sistemas: artérias carótidas internas (circulação anterior) e artérias vertebrais (circulação posterior). As vertebrais se unem formando a artéria basilar. O polígono de Willis é um anel anastomótico na base do encéfalo, formado por: artérias cerebrais anteriores, comunicante anterior, carótidas internas (segmento terminal), comunicantes posteriores e cerebrais posteriores. Ele permite circulação colateral em caso de obstrução de um vaso.",
      },
      {
        id: "card_snc_05",
        front: "Quais são as meninges e os espaços entre elas?",
        back: "As meninges são três membranas protetoras: dura-máter (mais externa, espessa, fibrosa, aderida ao crânio), aracnoide-máter (intermediária, delicada, avascular) e pia-máter (mais interna, vascularizada, aderida ao tecido nervoso). Os espaços são: epidural (entre crânio e dura-máter, potencial no encéfalo, real na medula); subdural (entre dura-máter e aracnoide, contém fina camada de líquido); e subaracnóideo (entre aracnoide e pia-máter, preenchido por líquor/LCR).",
      },
    ],
  },
  {
    id: "deck_04_bioquimica_proteinas",
    topic: "Bioquímica das Proteínas",
    subject: "Bioquímica",
    cardCount: 6,
    createdAt: "2026-02-10T11:15:00Z",
    cards: [
      {
        id: "card_bq_01",
        front: "Quais são os quatro níveis de estrutura das proteínas?",
        back: "Estrutura primária: sequência linear de aminoácidos unidos por ligações peptídicas. Estrutura secundária: arranjos locais estabilizados por pontes de hidrogênio entre o esqueleto peptídico (alfa-hélice e folha-beta). Estrutura terciária: conformação tridimensional global da cadeia polipeptídica, estabilizada por interações hidrofóbicas, pontes dissulfeto, ligações iônicas e van der Waals. Estrutura quaternária: associação de duas ou mais cadeias polipeptídicas (subunidades), como na hemoglobina (tetrâmero alfa2beta2).",
      },
      {
        id: "card_bq_02",
        front: "O que é desnaturação proteica e quais agentes podem causá-la?",
        back: "Desnaturação é a perda da estrutura tridimensional nativa de uma proteína, com perda de sua função biológica. Mantém-se a estrutura primária (ligações peptídicas), mas se perdem as estruturas secundária, terciária e quaternária. Agentes desnaturantes incluem: calor, pH extremo, detergentes (SDS), ureia, solventes orgânicos e agitação mecânica. Algumas proteínas podem renaturar espontaneamente ao se remover o agente desnaturante (experimento de Anfinsen com ribonuclease A).",
      },
      {
        id: "card_bq_03",
        front: "Qual a diferença entre aminoácidos essenciais e não essenciais?",
        back: "Aminoácidos essenciais são aqueles que o organismo humano não consegue sintetizar e que devem ser obtidos pela dieta. São 9: histidina, isoleucina, leucina, lisina, metionina, fenilalanina, treonina, triptofano e valina. Aminoácidos não essenciais podem ser sintetizados pelo organismo a partir de intermediários metabólicos. Alguns são condicionalmente essenciais (arginina, glutamina, tirosina), pois em certas condições (crescimento, estresse) a síntese endógena não é suficiente.",
      },
      {
        id: "card_bq_04",
        front: "O que é a ligação peptídica e quais suas características?",
        back: "A ligação peptídica é formada por uma reação de condensação entre o grupo alfa-amino de um aminoácido e o grupo alfa-carboxil de outro, com liberação de uma molécula de água. Características: possui caráter parcial de dupla ligação (ressonância entre C=O e C-N), sendo rígida e planar; é predominantemente na configuração trans; não possui rotação livre. A rotação ocorre em torno das ligações N-Calfa (ângulo phi) e Calfa-C (ângulo psi).",
      },
      {
        id: "card_bq_05",
        front: "Como a hemoglobina transporta oxigênio e o que é a cooperatividade?",
        back: "A hemoglobina (Hb) é um tetrâmero (alfa2beta2) com 4 grupos heme, cada um contendo Fe2+ que se liga reversivelmente ao O2. A ligação do O2 a uma subunidade induz mudança conformacional que facilita a ligação nas demais subunidades -- isso é a cooperatividade positiva, que gera a curva sigmoide de saturação. Fatores que deslocam a curva para a direita (diminuem afinidade): aumento de H+, CO2, temperatura e 2,3-BPG (efeito Bohr). Isso facilita a liberação de O2 nos tecidos.",
      },
      {
        id: "card_bq_06",
        front: "O que são chaperonas moleculares e qual seu papel?",
        back: "Chaperonas são proteínas que auxiliam no dobramento correto de outras proteínas, sem fazer parte da estrutura final. Elas previnem agregação proteica e auxiliam na renaturação de proteínas mal dobradas. Principais famílias: Hsp70 (estabilizam polipeptídeos nascentes), Hsp60/chaperoninas (como GroEL/GroES em bactérias e TRiC em eucariotos, fornecem ambiente isolado para dobramento) e Hsp90 (maturação de proteínas sinalizadoras). São superexpressas em situações de estresse celular (heat shock proteins).",
      },
    ],
  },
  {
    id: "deck_05_semiologia_cardiaca",
    topic: "Semiologia Cardíaca",
    subject: "Semiologia",
    cardCount: 8,
    createdAt: "2026-02-25T08:00:00Z",
    cards: [
      {
        id: "card_sc_01",
        front: "Quais são os focos de ausculta cardíaca e sua localização?",
        back: "Os cinco focos de ausculta cardíaca são: foco aórtico (2o espaço intercostal direito, paraesternal); foco pulmonar (2o espaço intercostal esquerdo, paraesternal); foco aórtico acessório (ponto de Erb, 3o espaço intercostal esquerdo, paraesternal); foco tricúspide (4o espaço intercostal esquerdo, paraesternal ou borda esternal esquerda baixa); e foco mitral (5o espaço intercostal esquerdo, na linha hemiclavicular -- ictus cordis).",
      },
      {
        id: "card_sc_02",
        front: "O que representam a primeira (B1) e a segunda (B2) bulhas cardíacas?",
        back: "B1 corresponde ao fechamento das valvas atrioventriculares (mitral e tricúspide) no início da sístole ventricular. É mais audível no foco mitral e tem som grave (\"TUM\"). B2 corresponde ao fechamento das valvas semilunares (aórtica e pulmonar) no início da diástole. É mais audível nos focos da base e tem som agudo (\"TÁ\"). O desdobramento fisiológico de B2 ocorre na inspiração, quando o retorno venoso aumentado atrasa o fechamento da valva pulmonar.",
      },
      {
        id: "card_sc_03",
        front: "O que é a terceira bulha (B3) e qual seu significado clínico?",
        back: "B3 é um ruído de baixa frequência que ocorre no início da diástole (protodiastólico), após B2. É produzida pelo enchimento ventricular rápido passivo, quando o sangue do átrio impacta contra a parede ventricular. Fisiológica em crianças e adultos jovens. Em adultos acima de 40 anos, é patológica e indica sobrecarga de volume ventricular, sendo marcador de insuficiência cardíaca descompensada (ritmo de galope protodiastólico: TUM-TÁ-TU).",
      },
      {
        id: "card_sc_04",
        front: "Como diferenciar um sopro sistólico de um sopro diastólico?",
        back: "Sopros sistólicos ocorrem entre B1 e B2, podendo ser de ejeção (crescendo-decrescendo, como estenose aórtica) ou de regurgitação (holossistólico, como insuficiência mitral). Sopros diastólicos ocorrem entre B2 e B1 seguinte, incluindo sopros de enchimento ventricular (estenose mitral -- ruflar diastólico) e de regurgitação semilunar (insuficiência aórtica -- sopro aspirativo decrescendo). Sopros diastólicos são quase sempre patológicos.",
      },
      {
        id: "card_sc_05",
        front: "O que é o pulso jugular e como avaliá-lo?",
        back: "O pulso jugular (turgência jugular) reflete a pressão venosa central e o funcionamento do lado direito do coração. Avalia-se com paciente em decúbito dorsal a 45 graus, observando a veia jugular interna direita. Normal: oscilação visível até 3-4 cm acima do ângulo esternal. A pressão venosa jugular (PVJ) elevada sugere insuficiência cardíaca direita, tamponamento cardíaco, pericardite constritiva ou obstrução da veia cava superior. O refluxo hepatojugular reforça o diagnóstico.",
      },
      {
        id: "card_sc_06",
        front: "Como classificar os sopros cardíacos pela escala de Levine?",
        back: "A escala de Levine classifica sopros em 6 graus: I/VI -- muito suave, audível apenas com concentração; II/VI -- suave, mas facilmente audível; III/VI -- moderado, sem frêmito; IV/VI -- alto, com frêmito palpável; V/VI -- muito alto, audível com estetoscópio parcialmente apoiado; VI/VI -- audível sem estetoscópio (apenas com a campânula próxima). Sopros grau III ou mais geralmente indicam patologia significativa. A presença de frêmito (a partir do grau IV) sempre é patológica.",
      },
      {
        id: "card_sc_07",
        front: "Quais as características da dor torácica de origem cardíaca (anginosa)?",
        back: "A dor anginosa típica é: retroesternal, em aperto/pressão/peso (não pontada); irradia para membro superior esquerdo, mandíbula, dorso ou epigástrio; desencadeada por esforço físico ou estresse emocional; aliviada por repouso ou nitroglicerina sublingual (em 3-5 minutos); duração de 2-15 minutos (angina estável). Se durar mais de 20 minutos, pensar em infarto agudo do miocárdio. Sintomas associados: dispneia, sudorese, náusea. Dor que piora com respiração ou palpação geralmente não é cardíaca.",
      },
      {
        id: "card_sc_08",
        front: "O que é o ictus cordis e como deve ser avaliado?",
        back: "O ictus cordis (impulso apical) é o ponto de máxima pulsação do coração na parede torácica, correspondendo ao ápice do ventrículo esquerdo. Localização normal: 5o espaço intercostal esquerdo, na linha hemiclavicular. Avalia-se: localização, extensão (normal: 2-3 cm ou 1-2 polpas digitais), intensidade, mobilidade e tipo de impulso. Desvio para esquerda e para baixo sugere hipertrofia/dilatação do VE. Impulso sustentado (em cúpula) indica sobrecarga de pressão. Impulso hipercinético indica sobrecarga de volume.",
      },
    ],
  },
]
