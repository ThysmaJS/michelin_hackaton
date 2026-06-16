// Pure decision logic: recommendation engine + postal-code → region mapping.

export function recommend({ route, freq }) {
  if (route === 'Chemin / gravel') {
    return freq === 'Intensif' || freq === 'Compétition' ? 'power-gravel' : 'power-adventure';
  }
  if (route === 'Mixte') return 'power-adventure';
  if (route === 'Pavés') return freq === 'Compétition' ? 'power-cup' : 'power-all-season';
  if (route === 'Route lisse') {
    if (freq === 'Compétition') return 'power-cup';
    if (freq === 'Intensif') return 'power-road';
    if (freq === 'Occasionnel') return 'lithion-4';
    return 'power-road';
  }
  return 'power-road';
}

const departmentMap = {
  aura: ['69', '01', '03', '07', '15', '26', '38', '42', '43', '63', '73', '74'],
  paca: ['04', '05', '06', '13', '83', '84'],
  idf: ['75', '77', '78', '91', '92', '93', '94', '95'],
  bretagne: ['22', '29', '35', '56'],
  occitanie: ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'],
  aquitaine: ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
};

const cityMatchers = [
  ['aura', /lyon|grenoble|annecy|chambér|clermont|valence|st[- ]?étienne|saint[- ]?étienne/],
  ['paca', /marseille|nice|toulon|aix|avignon|cannes/],
  ['idf', /paris|versailles|boulogne|nanterre|créteil/],
  ['bretagne', /rennes|brest|quimper|vannes|lorient|st[- ]?malo/],
  ['occitanie', /toulouse|montpellier|nîmes|perpignan|albi/],
  ['aquitaine', /bordeaux|biarritz|pau|bayonne|arcachon|limoges/],
];

export function postalToRegion(p) {
  const d = (p || '').replace(/\D/g, '').slice(0, 2);
  for (const key in departmentMap) {
    if (departmentMap[key].includes(d)) return key;
  }
  const c = (p || '').toLowerCase();
  for (const [key, re] of cityMatchers) {
    if (re.test(c)) return key;
  }
  return null;
}
