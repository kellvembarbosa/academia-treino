// Dados do plano — Team Ferreira
const G = `${import.meta.env.BASE_URL}gifs`;

export const EXERCISES = {
  // ---------- Quadríceps (segunda / sexta) ----------
  ext: {
    name: 'Cadeira extensora',
    gif: `${G}/LEG-EXTENSION.gif`,
    proto: '10 rep → 40s descanso → 10 rep → 35s → 8–10 rep → 30s → 6–10 rep → 30s.'
  },
  legpress45: {
    name: 'Leg press 45°',
    gif: `${G}/Leg-Press.gif`,
    proto: '2×10 (40s descanso) → 4×5 com 15s entre elas → 45s descanso → reduz a carga → 4×10 com 20s entre elas.'
  },
  smith: {
    name: 'Agachamento Smith',
    gif: `${G}/smith-machine-squat.gif`,
    proto: 'Pés a ~20 cm. 20 rep → 40s → +20% carga, 10 rep → 45s → +20% carga, 10 rep → 30s → −40% carga, 1×20.'
  },
  legSentado: {
    name: 'Leg press sentado (horizontal)',
    gif: `${G}/Lever-Horizontal-Leg-Press.gif`,
    proto: '5×10 com pés fechados, 30s entre séries. Após a última série, uma sequência de passadas.'
  },
  sumoHalter: {
    name: 'Agachamento sumô com halteres',
    gif: `${G}/dumbbell-sumo-squat.gif`,
    proto: '3×20 com 45s de intervalo entre as séries.'
  },
  addAbd20: {
    name: 'Adutora e abdutora',
    gif: `${G}/HIP-ADDUCTION-MACHINE.gif`,
    gif2: `${G}/HiP-ABDUCTION-MACHINE.gif`,
    proto: '5×20 em cada máquina (adutora e abdutora).'
  },

  // ---------- Superiores (terça) ----------
  latRaise: {
    name: 'Elevação lateral com halteres',
    gif: `${G}/Dumbbell-Lateral-Raise.gif`,
    proto: 'Aquecimento com peso leve: 3×10–15. Aumenta o peso: 4×10.'
  },
  frontRaise: {
    name: 'Elevação frontal',
    gif: `${G}/Dumbbell-Front-Raise.gif`,
    proto: '4×8–10 — peso que permita chegar a 8 com dificuldade e forçar mais 2 para finalizar.'
  },
  shoulderPress: {
    name: 'Desenvolvimento de ombros com halteres',
    gif: `${G}/Dumbbell-Shoulder-Press.gif`,
    proto: '4×10–12 — descer o peso até as orelhas e subir sem encostar/fechar o peso acima da cabeça.'
  },
  rearDelt: {
    name: 'Posteriores de ombro na máquina',
    gif: `${G}/Rear-Delt-Machine-Flys.gif`,
    proto: '5×20 — pronar os cotovelos para o alto, puxar até o braço ficar reto, não mais que isso.'
  },
  barbellCurl: {
    name: 'Rosca direta com barra',
    gif: `${G}/Barbell-Curl.gif`,
    proto: '3×15 controlando a cadência: 3s para subir e 3s para descer.'
  },
  altCurl: {
    name: 'Rosca alternada com halteres',
    gif: `${G}/Dumbbell-Curl.gif`,
    proto: '3×12–15 — manter controle de carga e execução.'
  },

  // ---------- Posteriores de coxa (quarta) ----------
  seatedCurl: {
    name: 'Cadeira flexora',
    gif: `${G}/Seated-Leg-Curl.gif`,
    proto: '4×20 — 10 segurando o peso 2s embaixo + 10 diretas sem segurar.'
  },
  hack: {
    name: 'Agachamento no hack',
    gif: `${G}/Sled-Hack-Squat.gif`,
    proto: '4×10 com aumento de 20% da carga em cada série.'
  },
  stiff: {
    name: 'Stiff com barra reta',
    gif: `${G}/Barbell-Romanian-Deadlift.gif`,
    proto: '4×10 com 40s de descanso entre as séries.'
  },
  sumo: {
    name: 'Agachamento sumô',
    gif: `${G}/dumbbell-sumo-squat.gif`,
    proto: '3×20.'
  },
  lyingCurl: {
    name: 'Mesa flexora',
    gif: `${G}/Leg-Curl.gif`,
    proto: '4×10 controlando a fase concêntrica.'
  },
  addAbd12: {
    name: 'Adutores e abdutora',
    gif: `${G}/HIP-ADDUCTION-MACHINE.gif`,
    gif2: `${G}/HiP-ABDUCTION-MACHINE.gif`,
    proto: '4 séries em cada de 10–12 repetições.'
  },
  hipThrust: {
    name: 'Elevação pélvica',
    gif: `${G}/Barbell-Hip-Thrust.gif`,
    proto: '4×10–12 com progressão de cargas.'
  },

  // ---------- Costas (quinta) ----------
  pulldown: {
    name: 'Puxada no peito',
    gif: `${G}/Lat-Pulldown.gif`,
    proto: 'Aquecimento: carga p/ 20 rep moderadamente leve, 2×. Depois aumentar a carga: 3×10–12.'
  },
  lowRow: {
    name: 'Remada baixa',
    gif: `${G}/Seated-Cable-Row.gif`,
    proto: '4×10–12 — puxada abaixo do umbigo.'
  },
  oneArmRow: {
    name: 'Remada unilateral com halteres',
    gif: `${G}/Dumbbell-Row.gif`,
    proto: '3×10–12 — puxada próxima ao glúteo, esticar bem a escápula embaixo.'
  },
  straightPulldown: {
    name: 'Pulldown (braços estendidos)',
    gif: `${G}/Rope-Straight-Arm-Pulldown.gif`,
    proto: '3×10 — pronar os cotovelos para o alto e manter a execução assim.'
  }
};

// blocos de treino — a agenda semanal é configurável (ver schedule no estado)
export const WORKOUTS = {
  quad: { letter: 'A', title: 'Quadríceps', ex: ['ext', 'legpress45', 'smith', 'legSentado', 'sumoHalter', 'addAbd20'] },
  sup: { letter: 'B', title: 'Superiores', ex: ['latRaise', 'frontRaise', 'shoulderPress', 'rearDelt', 'barbellCurl', 'altCurl'] },
  post: { letter: 'C', title: 'Posteriores de coxa', ex: ['seatedCurl', 'hack', 'stiff', 'sumo', 'lyingCurl', 'addAbd12', 'hipThrust'] },
  costas: { letter: 'D', title: 'Costas', ex: ['pulldown', 'lowRow', 'oneArmRow', 'straightPulldown'] }
};

// ordem padrão de rotação dos blocos ao montar a semana
export const WORKOUT_CYCLE = ['quad', 'sup', 'post', 'costas'];

// agenda padrão do plano original: Seg A, Ter B, Qua C, Qui D, Sex A
export const DEFAULT_SCHEDULE = { 0: null, 1: 'quad', 2: 'sup', 3: 'post', 4: 'costas', 5: 'quad', 6: null };

// dias sugeridos por quantidade de treinos na semana (começando na segunda)
export const DAYS_PRESET = {
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [1, 2, 3, 4, 5, 6, 0]
};

export const DIET = [
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

// qty = estimativa para 1 semana seguindo o plano alimentar
export const SHOPPING = [
  {
    group: 'Proteínas',
    items: [
      { name: 'Ovos', qty: 30, unit: 'un', note: '4/dia no café + ceia' },
      { name: 'Frango (peito)', qty: 1.5, unit: 'kg', note: 'almoço e jantar' },
      { name: 'Patinho', qty: 0.7, unit: 'kg' },
      { name: 'Peixe', qty: 0.7, unit: 'kg' },
      { name: 'Carne magra', qty: 0.7, unit: 'kg' },
      { name: 'Iogurte natural', qty: 8, unit: 'un', note: 'lanche + ceia' }
    ]
  },
  {
    group: 'Carboidratos',
    items: [
      { name: 'Arroz branco', qty: 1, unit: 'kg' },
      { name: 'Batata inglesa', qty: 1, unit: 'kg' },
      { name: 'Banana', qty: 7, unit: 'un' }
    ]
  },
  {
    group: 'Gorduras boas',
    items: [
      { name: 'Azeite de oliva', qty: 1, unit: 'un', note: 'garrafa dura semanas' },
      { name: 'Castanhas', qty: 150, unit: 'g' },
      { name: 'Pasta de amendoim', qty: 1, unit: 'pote' }
    ]
  },
  {
    group: 'Vegetais e salada',
    items: [
      { name: 'Folhas para salada', qty: 2, unit: 'maços' },
      { name: 'Brócolis', qty: 1, unit: 'un' },
      { name: 'Abobrinha', qty: 1, unit: 'un' },
      { name: 'Cenoura', qty: 3, unit: 'un' },
      { name: 'Couve-flor', qty: 1, unit: 'un' }
    ]
  },
  {
    group: 'Outros',
    items: [
      { name: 'Café', qty: 1, unit: 'pct' }
    ]
  }
];

export function fmtQty(q, unit) {
  const n = Number.isInteger(q) ? q : String(q).replace('.', ',');
  return `${n} ${unit}`;
}

export const DOW_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
