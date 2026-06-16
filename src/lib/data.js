// Static catalogue + reference data for the Michelin Vélo experience.

export const brands = [
  'Trek', 'Specialized', 'Canyon', 'Cannondale', 'Giant', 'Scott', 'Cube', 'BMC',
  'Pinarello', 'Look', 'Bianchi', 'Cervélo', 'Van Rysel', 'Orbea', 'Merida',
  'Ridley', 'Wilier', 'Colnago', 'Focus', 'Lapierre', 'Time',
];

export const modelsByBrand = {
  Trek: [['Émonda', 'Route'], ['Domane', 'Endurance'], ['Madone', 'Aéro'], ['Checkpoint', 'Gravel'], ['FX', 'Urbain']],
  Specialized: [['Tarmac SL8', 'Route'], ['Roubaix', 'Endurance'], ['Allez', 'Route'], ['Diverge', 'Gravel'], ['Aethos', 'Route']],
  Canyon: [['Ultimate', 'Route'], ['Endurace', 'Endurance'], ['Aeroad', 'Aéro'], ['Grail', 'Gravel'], ['Grizl', 'Gravel']],
  Cannondale: [['SuperSix EVO', 'Route'], ['Synapse', 'Endurance'], ['Topstone', 'Gravel'], ['CAAD13', 'Route']],
  Giant: [['TCR Advanced', 'Route'], ['Defy', 'Endurance'], ['Propel', 'Aéro'], ['Revolt', 'Gravel']],
  'Van Rysel': [['RCR Pro', 'Route'], ['EDR CF', 'Endurance'], ['NCR CF', 'Aéro'], ['GCR', 'Gravel']],
  Pinarello: [['Dogma F', 'Route'], ['Paris', 'Endurance'], ['Grevil', 'Gravel']],
  Bianchi: [['Oltre', 'Aéro'], ['Specialissima', 'Route'], ['Infinito', 'Endurance'], ['Arcadex', 'Gravel']],
};

export const genericModels = [
  ['Route Performance', 'Route'], ['Endurance', 'Endurance'], ['Aéro', 'Aéro'],
  ['Gravel', 'Gravel'], ['Urbain / VTC', 'Urbain'],
];

export const currentTyreList = [
  ['Michelin Power Road', "Pneu d'origine"],
  ['Continental GP 5000', 'Concurrent'],
  ['Vittoria Corsa', 'Concurrent'],
  ['Pirelli P Zero', 'Concurrent'],
  ["Pneus d'origine", 'Je ne sais pas'],
  ['Autre / inconnu', '—'],
];

export const freqList = [
  ['Occasionnel', '1 à 2 sorties par mois', '🍃'],
  ['Régulier', '1 à 2 sorties par semaine', '🚴'],
  ['Intensif', '3 sorties ou plus par semaine', '🔥'],
  ['Compétition', 'Entraînement & courses', '🏆'],
];

export const routeList = [
  ['Route lisse', 'Asphalte, routes ouvertes', '🛣'],
  ['Pavés', 'Secteurs pavés, routes dégradées', '🧱'],
  ['Chemin / gravel', 'Pistes, sentiers, terre', '🏞'],
  ['Mixte', 'Un peu de tout', '🔀'],
];

// Gamme route & gravel Michelin — source : « 2W Bicycle Product Catalog v4 - 2026 ».
// Attributs réels du catalogue : segment, gomme, dimensions ETRTO, plage de pression,
// poids, tubeless. Les 4 scores radar (adhérence/rendement/endurance/légèreté) sont
// dérivés de façon déterministe de ces attributs (cf. lib/scoring.js), le catalogue ne
// fournissant pas d'indices de performance. Les prix sont des MSRP indicatifs (absents
// du catalogue).
export const tyres = {
  'power-cup':            { brand: 'Michelin', name: 'Power Cup', tag: 'Compétition route', usage: 'Course · route lisse', grip: 85, rendement: 94, endurance: 74, legerete: 89, weight: '215 g', price: '54,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×23 à 28C', pressure: '4 – 8 bar', tubeless: false },
  'power-cup-tlr':        { brand: 'Michelin', name: 'Power Cup TLR', tag: 'Compétition tubeless', usage: 'Course · tubeless', grip: 85, rendement: 94, endurance: 75, legerete: 84, weight: '270 g', price: '69,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×25 à 32C', pressure: '3,5 – 8 bar', tubeless: true },
  'power-time-trial':     { brand: 'Michelin', name: 'Power Time Trial', tag: 'Contre-la-montre', usage: 'CLM · route lisse', grip: 85, rendement: 97, endurance: 63, legerete: 93, weight: '185 g', price: '49,90 €', terrain: 'route', segment: 'Racing Line', rubber: 'GUM-X', sizes: '700×23 à 25C', pressure: '5 – 8 bar', tubeless: false },
  'power-road':           { brand: 'Michelin', name: 'Power Road', tag: 'Performance route', usage: 'Performance · route', grip: 85, rendement: 94, endurance: 74, legerete: 87, weight: '235 g', price: '39,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×25C', pressure: '5 – 8 bar', tubeless: false },
  'power-road-tlr':       { brand: 'Michelin', name: 'Power Road TLR', tag: 'Performance tubeless', usage: 'Performance · tubeless', grip: 85, rendement: 94, endurance: 76, legerete: 82, weight: '290 g', price: '54,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×25 à 32C', pressure: '5 – 8 bar', tubeless: true },
  'pro5':                 { brand: 'Michelin', name: 'Pro5', tag: 'Endurance route', usage: 'Endurance · route', grip: 85, rendement: 82, endurance: 89, legerete: 86, weight: '250 g', price: '44,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×25 à 32C', pressure: '5 – 7,5 bar', tubeless: false },
  'power-all-season':     { brand: 'Michelin', name: 'Power All Season', tag: 'Toutes saisons', usage: 'Toutes saisons · route', grip: 93, rendement: 84, endurance: 90, legerete: 83, weight: '280 g', price: '44,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'MAGI-X', sizes: '700×25 à 32C', pressure: '4 – 7,5 bar', tubeless: false },
  'lithion-4':            { brand: 'Michelin', name: 'Lithion 4', tag: 'Entraînement route', usage: 'Entraînement · route', grip: 90, rendement: 82, endurance: 87, legerete: 86, weight: '250 g', price: '26,90 €', terrain: 'route', segment: 'Performance Line', rubber: 'MAGI-X', sizes: '700×23 à 32C', pressure: '3,2 – 8 bar', tubeless: false },
  'power-protection-tlr': { brand: 'Michelin', name: 'Power Protection TLR', tag: 'Anti-crevaison', usage: 'Endurance · anti-crevaison', grip: 93, rendement: 84, endurance: 91, legerete: 77, weight: '330 g', price: '54,90 €', terrain: 'route', segment: 'Competition Line', rubber: 'MAGI-X', sizes: '700×28 à 32C', pressure: '3 – 6 bar', tubeless: true },
  'power-adventure':      { brand: 'Michelin', name: 'Power Adventure', tag: 'Aventure mixte', usage: 'Gravel · mixte', grip: 89, rendement: 84, endurance: 92, legerete: 73, weight: '370 g', price: '44,90 €', terrain: 'gravel', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×30 à 48C', pressure: '2 – 5 bar', tubeless: true },
  'power-gravel':         { brand: 'Michelin', name: 'Power Gravel', tag: 'Gravel polyvalent', usage: 'Gravel · chemin', grip: 94, rendement: 70, endurance: 94, legerete: 67, weight: '430 g', price: '49,90 €', terrain: 'gravel', segment: 'Competition Line', rubber: 'MAGI-X', sizes: '700×33 à 50C', pressure: '1 – 5 bar', tubeless: true },
  'power-gravel-rs':      { brand: 'Michelin', name: 'Power Gravel RS', tag: 'Gravel compétition', usage: 'Gravel · course', grip: 89, rendement: 90, endurance: 80, legerete: 65, weight: '445 g', price: '64,90 €', terrain: 'gravel', segment: 'Racing Line', rubber: 'GUM-X', sizes: '700×42C', pressure: 'max 4,5 bar', tubeless: true },
  'power-gravel-extreme': { brand: 'Michelin', name: 'Power Gravel Extreme', tag: 'Gravel extrême', usage: 'Gravel · terrain extrême', grip: 89, rendement: 67, endurance: 95, legerete: 51, weight: '580 g', price: '57,90 €', terrain: 'gravel', segment: 'Competition Line', rubber: 'GUM-X', sizes: '700×42 à 48C', pressure: 'max 4,5 bar', tubeless: true },
};

// Pneus concurrents — hors catalogue Michelin (caractéristiques publiques constructeur),
// fournis pour le comparateur. Même forme que `tyres`.
export const competitors = {
  'continental-gp5000':   { brand: 'Continental', name: 'Grand Prix 5000', usage: 'Endurance · route', grip: 88, rendement: 90, endurance: 80, legerete: 82, weight: '215 g', price: '64,90 €', terrain: 'route', segment: 'Compétition', rubber: 'BlackChili', sizes: '700×25 à 32C', pressure: '5 – 8 bar', tubeless: false },
  'pirelli-pzero':        { brand: 'Pirelli', name: 'P Zero Race', usage: 'Compétition · route', grip: 90, rendement: 89, endurance: 72, legerete: 88, weight: '205 g', price: '59,90 €', terrain: 'route', segment: 'Compétition', rubber: 'SmartEVO', sizes: '700×24 à 30C', pressure: '5 – 8 bar', tubeless: false },
  'vittoria-corsa':       { brand: 'Vittoria', name: 'Corsa N.EXT', usage: 'Course · route', grip: 87, rendement: 86, endurance: 78, legerete: 80, weight: '235 g', price: '54,90 €', terrain: 'route', segment: 'Compétition', rubber: 'Graphene 2.0', sizes: '700×24 à 30C', pressure: '5 – 8 bar', tubeless: false },
  'schwalbe-proone':      { brand: 'Schwalbe', name: 'Pro One', usage: 'Course · route', grip: 86, rendement: 88, endurance: 76, legerete: 84, weight: '250 g', price: '57,90 €', terrain: 'route', segment: 'Compétition', rubber: 'Addix Race', sizes: '700×25 à 32C', pressure: '4,5 – 8 bar', tubeless: true },
  'continental-terra':    { brand: 'Continental', name: 'Terra Speed', usage: 'Gravel · chemin', grip: 80, rendement: 74, endurance: 86, legerete: 70, weight: '335 g', price: '56,90 €', terrain: 'gravel', segment: 'Gravel', rubber: 'BlackChili', sizes: '700×35 à 45C', pressure: '2 – 4,5 bar', tubeless: true },
  'panaracer-gravelking': { brand: 'Panaracer', name: 'GravelKing SK', usage: 'Gravel · mixte', grip: 82, rendement: 70, endurance: 88, legerete: 66, weight: '350 g', price: '46,90 €', terrain: 'gravel', segment: 'Gravel', rubber: 'ZSG', sizes: '700×32 à 50C', pressure: '2 – 4,5 bar', tubeless: true },
};

export const metricDefs = [
  ['Adhérence', 'grip'], ['Rendement', 'rendement'], ['Endurance', 'endurance'], ['Légèreté', 'legerete'],
];

// Route gradients by surface (placeholder "landscape" backdrops).
export const gRoute = [
  'linear-gradient(150deg,#16407e,#0a1f44 70%)',
  'linear-gradient(150deg,#1d5a8a,#0c2a4d 70%)',
  'linear-gradient(150deg,#3a4f7a,#16203f 70%)',
];
export const gGravel = [
  'linear-gradient(150deg,#5a4a2a,#241a0e 70%)',
  'linear-gradient(150deg,#6a5a3a,#2a2212 70%)',
  'linear-gradient(150deg,#2f5a3a,#13251a 70%)',
];

export const regions = [
  { key: 'aura', label: 'Auvergne-Rhône-Alpes' },
  { key: 'paca', label: "Provence-Alpes-Côte d'Azur" },
  { key: 'idf', label: 'Île-de-France' },
  { key: 'bretagne', label: 'Bretagne' },
  { key: 'occitanie', label: 'Occitanie' },
  { key: 'aquitaine', label: 'Nouvelle-Aquitaine' },
];

export const regionRoutes = {
  aura: [
    { t: 'route',  title: 'Les Lacets de Montvernier', loc: 'Savoie', distance: '48 km', surface: 'Route · cols', stars: '★★★', blurb: "Dix-huit virages en épingle taillés dans la montagne — un terrain de jeu mythique pour les pneus de route exigeants." },
    { t: 'route',  title: 'Le Col de la Croix de Fer', loc: 'Savoie', distance: '92 km', surface: 'Route · grand col', stars: '★★★', blurb: "Une ascension légendaire des Alpes, longue et roulante, où le rendement fait toute la différence." },
    { t: 'gravel', title: 'Les Chemins du Beaujolais', loc: 'Rhône', distance: '56 km', surface: 'Gravel · vignes', stars: '★★', blurb: "Pistes de terre entre les crus dorés, là où l'accroche et le confort priment sur la vitesse." },
  ],
  paca: [
    { t: 'route',  title: 'Le Mont Ventoux par Bédoin', loc: 'Vaucluse', distance: '64 km', surface: 'Route · géant', stars: '★★★', blurb: "Le Géant de Provence — 21 km d'ascension où la confiance dans la gomme se mérite à chaque virage." },
    { t: 'route',  title: 'La Corniche des Maures', loc: "Var · Côte d'Azur", distance: '72 km', surface: 'Route · littoral', stars: '★★', blurb: "Entre mer et forêt, un ruban d'asphalte parfait pour enchaîner les kilomètres à haute vitesse." },
    { t: 'gravel', title: 'Les Ocres du Luberon', loc: 'Vaucluse', distance: '47 km', surface: 'Gravel · ocres', stars: '★★', blurb: "Sentiers de terre rouge au cœur des villages perchés, un décor de carte postale pour rouler large." },
  ],
  idf: [
    { t: 'route',  title: 'La Vallée de Chevreuse', loc: 'Yvelines', distance: '58 km', surface: 'Route · vallons', stars: '★★★', blurb: "Le terrain d'entraînement des Franciliens : routes secondaires roulantes et bosses bien dosées." },
    { t: 'route',  title: 'Les Boucles de la Seine', loc: "Val-d'Oise", distance: '64 km', surface: 'Route · fleuve', stars: '★★', blurb: "Le long des méandres, une sortie plate et rapide idéale pour travailler la vélocité." },
    { t: 'gravel', title: 'La Forêt de Fontainebleau', loc: 'Seine-et-Marne', distance: '42 km', surface: 'Gravel · forêt', stars: '★★', blurb: "Chemins sableux entre les chaos de grès — un classique du gravel aux portes de Paris." },
  ],
  bretagne: [
    { t: 'route',  title: 'La Côte de Granit Rose', loc: "Côtes-d'Armor", distance: '67 km', surface: 'Route · littoral', stars: '★★★', blurb: "Un littoral spectaculaire où le vent et l'humidité mettent l'adhérence à l'épreuve." },
    { t: 'route',  title: "La Presqu'île de Crozon", loc: 'Finistère', distance: '55 km', surface: 'Route · caps', stars: '★★★', blurb: "Falaises et landes face à l'Atlantique, sur des routes nerveuses entre mer et bruyère." },
    { t: 'gravel', title: 'Les Landes de Monteneuf', loc: 'Morbihan', distance: '38 km', surface: 'Gravel · landes', stars: '★★', blurb: "Pistes de schiste entre menhirs et forêts, une échappée gravel au cœur de l'Argoat." },
  ],
  occitanie: [
    { t: 'route',  title: 'Le Col du Tourmalet', loc: 'Hautes-Pyrénées', distance: '76 km', surface: 'Route · grand col', stars: '★★★', blurb: "Le toit des Pyrénées cyclistes — une descente technique où chaque appui doit inspirer confiance." },
    { t: 'route',  title: "Les Gorges de l'Hérault", loc: 'Hérault', distance: '61 km', surface: 'Route · gorges', stars: '★★', blurb: "Un parcours sinueux taillé dans la roche, alternant ombre fraîche et lignes droites brûlantes." },
    { t: 'gravel', title: 'Le Plateau du Larzac', loc: 'Aveyron', distance: '54 km', surface: 'Gravel · causse', stars: '★★', blurb: "Grands espaces caillouteux et horizons infinis pour les amateurs d'aventure au long cours." },
  ],
  aquitaine: [
    { t: 'route',  title: 'Les Vignobles du Médoc', loc: 'Gironde', distance: '58 km', surface: 'Route · vignes', stars: '★★★', blurb: "Routes plates et impeccables entre les grands châteaux, parfaites pour rouler vite et longtemps." },
    { t: 'route',  title: 'La Vélodyssée Atlantique', loc: 'Gironde', distance: '70 km', surface: 'Route · océan', stars: '★★', blurb: "Le long de l'océan, une voie roulante balayée par l'air iodé des dunes." },
    { t: 'gravel', title: 'Les Pistes des Landes', loc: 'Landes', distance: '49 km', surface: 'Gravel · pinède', stars: '★★', blurb: "Allées sableuses sous les pins maritimes, un terrain souple qui récompense le confort." },
  ],
};

export const retailerData = [
  { name: 'Cyclable', address: '12 rue de la République', city: 'Lyon 2e', distance: '1,2 km', stock: true, x: '42%', y: '40%' },
  { name: 'Culture Vélo', address: '30 cours Émile Zola', city: 'Villeurbanne', distance: '3,8 km', stock: true, x: '63%', y: '33%' },
  { name: 'Decathlon', address: '112 cours Charlemagne', city: 'Lyon 2e', distance: '5,1 km', stock: false, x: '30%', y: '66%' },
  { name: 'Probikeshop', address: '8 rue des Aciéries', city: 'Saint-Étienne', distance: '12,4 km', stock: true, x: '72%', y: '70%' },
];

export const footerCols = [
  { title: 'Vélo', links: ['Trouver mon pneu', 'Comparateur', 'Guide Route', 'Tous les pneus vélo'] },
  { title: 'Michelin', links: ['Le Groupe', 'Innovation', 'Développement durable', 'Carrières'] },
  { title: 'Aide', links: ['Contact', 'Montage & entretien', 'Garantie', 'FAQ'] },
];

export const socials = ['f', 'X', 'in', '▶'];

export const legalLinks = [
  'Politique de cookies', "Conditions d'utilisation", 'Mentions légales', 'Politique de confidentialité',
];

export const heroStats = [
  { num: '6', label: 'pneus de la gamme' },
  { num: '< 1 min', label: 'pour être conseillé' },
  { num: '100%', label: 'adapté à votre usage' },
];

export const stepMeta = [
  { block: '🚲 Mon vélo', title: 'Quelle est la marque de votre vélo ?', hint: 'Commencez à taper, les suggestions apparaissent en temps réel.' },
  { block: '🚲 Mon vélo', title: 'Quel modèle exactement ?', hint: 'La liste est filtrée selon la marque choisie.' },
  { block: '🚲 Mon vélo', title: 'Quels pneus sont montés actuellement ?', hint: 'Pour comprendre votre point de départ.' },
  { block: '🛣 Mon usage', title: 'À quelle fréquence roulez-vous ?', hint: 'Votre rythme oriente le choix de la gomme.' },
  { block: '🛣 Mon usage', title: 'Sur quel type de routes ?', hint: 'Le terrain est le critère le plus déterminant.' },
  { block: '🛣 Mon usage', title: 'Votre kilométrage mensuel ?', hint: 'Une estimation suffit.' },
];
