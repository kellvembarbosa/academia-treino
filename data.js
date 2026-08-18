// Dados do plano — Team Ferreira
const GIF = 'https://fitnessprogramer.com/wp-content/uploads';

const EXERCISES = {
  // ---------- Quadríceps (segunda / sexta) ----------
  ext: {
    name: 'Cadeira extensora',
    gif: `${GIF}/2021/02/LEG-EXTENSION.gif`,
    proto: '10 rep → 40s descanso → 10 rep → 35s → 8–10 rep → 30s → 6–10 rep → 30s.'
  },
  legpress45: {
    name: 'Leg press 45°',
    gif: `${GIF}/2015/11/Leg-Press.gif`,
    proto: '2×10 (40s descanso) → 4×5 com 15s entre elas → 45s descanso → reduz a carga → 4×10 com 20s entre elas.'
  },
  smith: {
    name: 'Agachamento Smith',
    gif: `${GIF}/2024/10/smith-machine-squat.gif`,
    proto: 'Pés a ~20 cm. 20 rep → 40s → +20% carga, 10 rep → 45s → +20% carga, 10 rep → 30s → −40% carga, 1×20.'
  },
  legSentado: {
    name: 'Leg press sentado (horizontal)',
    gif: `${GIF}/2021/08/Lever-Horizontal-Leg-Press.gif`,
    proto: '5×10 com pés fechados, 30s entre séries. Após a última série, uma sequência de passadas.'
  },
  sumoHalter: {
    name: 'Agachamento sumô com halteres',
    gif: `${GIF}/2021/02/dumbbell-sumo-squat.gif`,
    proto: '3×20 com 45s de intervalo entre as séries.'
  },
  addAbd20: {
    name: 'Adutora e abdutora',
    gif: `${GIF}/2021/02/HIP-ADDUCTION-MACHINE.gif`,
    gif2: `${GIF}/2021/02/HiP-ABDUCTION-MACHINE.gif`,
    proto: '5×20 em cada máquina (adutora e abdutora).'
  },

  // ---------- Superiores (terça) ----------
  latRaise: {
    name: 'Elevação lateral com halteres',
    gif: `${GIF}/2021/02/Dumbbell-Lateral-Raise.gif`,
    proto: 'Aquecimento com peso leve: 3×10–15. Aumenta o peso: 4×10.'
  },
  frontRaise: {
    name: 'Elevação frontal',
    gif: `${GIF}/2021/02/Dumbbell-Front-Raise.gif`,
    proto: '4×8–10 — peso que permita chegar a 8 com dificuldade e forçar mais 2 para finalizar.'
  },
  shoulderPress: {
    name: 'Desenvolvimento de ombros com halteres',
    gif: `${GIF}/2021/02/Dumbbell-Shoulder-Press.gif`,
    proto: '4×10–12 — descer o peso até as orelhas e subir sem encostar/fechar o peso acima da cabeça.'
  },
  rearDelt: {
    name: 'Posteriores de ombro na máquina',
    gif: `${GIF}/2021/02/Rear-Delt-Machine-Flys.gif`,
    proto: '5×20 — pronar os cotovelos para o alto, puxar até o braço ficar reto, não mais que isso.'
  },
  barbellCurl: {
    name: 'Rosca direta com barra',
    gif: `${GIF}/2021/02/Barbell-Curl.gif`,
    proto: '3×15 controlando a cadência: 3s para subir e 3s para descer.'
  },
  altCurl: {
    name: 'Rosca alternada com halteres',
    gif: `${GIF}/2021/02/Dumbbell-Curl.gif`,
    proto: '3×12–15 — manter controle de carga e execução.'
  },

  // ---------- Posteriores de coxa (quarta) ----------
  seatedCurl: {
    name: 'Cadeira flexora',
    gif: `${GIF}/2021/08/Seated-Leg-Curl.gif`,
    proto: '4×20 — 10 segurando o peso 2s embaixo + 10 diretas sem segurar.'
  },
  hack: {
    name: 'Agachamento no hack',
    gif: `${GIF}/2021/02/Sled-Hack-Squat.gif`,
    proto: '4×10 com aumento de 20% da carga em cada série.'
  },
  stiff: {
    name: 'Stiff com barra reta',
    gif: `${GIF}/2021/02/Barbell-Romanian-Deadlift.gif`,
    proto: '4×10 com 40s de descanso entre as séries.'
  },
  sumo: {
    name: 'Agachamento sumô',
    gif: `${GIF}/2021/02/dumbbell-sumo-squat.gif`,
    proto: '3×20.'
  },
  lyingCurl: {
    name: 'Mesa flexora',
    gif: `${GIF}/2021/02/Leg-Curl.gif`,
    proto: '4×10 controlando a fase concêntrica.'
  },
  addAbd12: {
    name: 'Adutores e abdutora',
    gif: `${GIF}/2021/02/HIP-ADDUCTION-MACHINE.gif`,
    gif2: `${GIF}/2021/02/HiP-ABDUCTION-MACHINE.gif`,
    proto: '4 séries em cada de 10–12 repetições.'
  },
  hipThrust: {
    name: 'Elevação pélvica',
    gif: `${GIF}/2021/02/Barbell-Hip-Thrust.gif`,
    proto: '4×10–12 com progressão de cargas.'
  },

  // ---------- Costas (quinta) ----------
  pulldown: {
    name: 'Puxada no peito',
    gif: `${GIF}/2021/02/Lat-Pulldown.gif`,
    proto: 'Aquecimento: carga p/ 20 rep moderadamente leve, 2×. Depois aumentar a carga: 3×10–12.'
  },
  lowRow: {
    name: 'Remada baixa',
    gif: `${GIF}/2021/02/Seated-Cable-Row.gif`,
    proto: '4×10–12 — puxada abaixo do umbigo.'
  },
  oneArmRow: {
    name: 'Remada unilateral com halteres',
    gif: `${GIF}/2021/02/Dumbbell-Row.gif`,
    proto: '3×10–12 — puxada próxima ao glúteo, esticar bem a escápula embaixo.'
  },
  straightPulldown: {
    name: 'Pulldown (braços estendidos)',
    gif: `${GIF}/2021/06/Rope-Straight-Arm-Pulldown.gif`,
    proto: '3×10 — pronar os cotovelos para o alto e manter a execução assim.'
  }
};

// dia da semana (0=dom .. 6=sáb) → treino
const PLAN = {
  1: { title: 'Quadríceps', ex: ['ext', 'legpress45', 'smith', 'legSentado', 'sumoHalter', 'addAbd20'] },
  2: { title: 'Superiores', ex: ['latRaise', 'frontRaise', 'shoulderPress', 'rearDelt', 'barbellCurl', 'altCurl'] },
  3: { title: 'Posteriores de coxa', ex: ['seatedCurl', 'hack', 'stiff', 'sumo', 'lyingCurl', 'addAbd12', 'hipThrust'] },
  4: { title: 'Costas', ex: ['pulldown', 'lowRow', 'oneArmRow', 'straightPulldown'] },
  5: { title: 'Quadríceps (repetição)', ex: ['ext', 'legpress45', 'smith', 'legSentado', 'sumoHalter', 'addAbd20'] }
};

const DIET = [
  {
    meal: 'Café da manhã', icon: '🌅',
    items: ['4 ovos inteiros', '1 banana', 'Café (opcional)'],
    note: 'Opção: trocar 2 ovos por 150 g de frango se enjoar.'
  },
  {
    meal: 'Almoço', icon: '🍽️',
    items: ['150 g frango, patinho ou peixe', '120 g arroz branco ou 150 g batata inglesa', 'Salada à vontade', '1 fio de azeite (5 g)']
  },
  {
    meal: 'Lanche', icon: '🥜',
    items: ['1 iogurte natural', '15 g castanhas ou 16 g de pasta de amendoim']
  },
  {
    meal: 'Jantar', icon: '🌙',
    items: ['200 g frango, carne magra ou ovos', 'Legumes (brócolis, abobrinha, cenoura, couve-flor)'],
    note: 'Se treinar à noite: acrescenta 80–100 g de arroz ou batata.'
  },
  {
    meal: 'Ceia (se bater fome)', icon: '🌜',
    items: ['2 ovos ou', '150 g de iogurte natural']
  }
];

const SHOPPING = [
  { group: 'Proteínas', items: ['Ovos', 'Frango (peito)', 'Patinho', 'Peixe', 'Carne magra', 'Iogurte natural'] },
  { group: 'Carboidratos', items: ['Arroz branco', 'Batata inglesa', 'Banana'] },
  { group: 'Gorduras boas', items: ['Azeite de oliva', 'Castanhas', 'Pasta de amendoim'] },
  { group: 'Vegetais e salada', items: ['Folhas para salada', 'Brócolis', 'Abobrinha', 'Cenoura', 'Couve-flor'] },
  { group: 'Outros', items: ['Café'] }
];
