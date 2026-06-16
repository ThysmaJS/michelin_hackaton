// Enriched route data for the Guide Michelin page.
// Keyed by route title (matches regionRoutes[*][*].title).
// waypoints: [[lat, lng], ...] — one per segment, approximate real coordinates.

export const routeDetails = {
  'Les Lacets de Montvernier': {
    elevation: '1 450 m D+', difficulty: 'Difficile', season: 'Mai – Octobre', tyreKey: 'power-cup',
    tyreReason: "Dix-huit virages en épingle exigent une adhérence maximale et une précision de trajectoire sans compromis. Le Power Cup s'impose pour chaque appui dans les lacets et inspire confiance dans la descente technique.",
    waypoints: [[45.319, 6.308], [45.325, 6.293], [45.330, 6.279], [45.333, 6.264]],
    segments: [
      { name: 'Pontamafrey', km: '0', type: 'depart', desc: 'Départ en fond de Maurienne. Route large pour s\'échauffer avant l\'ascension.' },
      { name: 'Entrée des lacets', km: '4', type: 'cle', desc: 'Les épingles débutent, rampes de 8 à 12 %. Le placement de roue devient critique.' },
      { name: 'Vue panoramique', km: '7', type: 'cle', desc: 'Le décor s\'ouvre sur la vallée. Prudence si la chaussée est humide.' },
      { name: 'Sommet · 1 450 m', km: '9', type: 'sommet', desc: 'Panorama à 360° sur les Alpes. Longue descente technique jusqu\'à Saint-Étienne-de-Cuines.' },
    ],
  },
  'Le Col de la Croix de Fer': {
    elevation: '2 000 m D+', difficulty: 'Difficile', season: 'Juin – Septembre', tyreKey: 'power-cup',
    tyreReason: "Une ascension alpine de 92 km suivie d'une descente rapide à grande vitesse. Le Power Cup combine rendement optimal en montée et adhérence irréprochable dans les virages rapides de la descente.",
    waypoints: [[45.276, 6.353], [45.245, 6.171], [45.231, 6.195], [45.227, 6.202]],
    segments: [
      { name: 'Saint-Jean-de-Maurienne', km: '0', type: 'depart', desc: 'Sortie progressive de la ville, route large et bien entretenue.' },
      { name: 'Col du Glandon', km: '35', type: 'cle', desc: 'Premier col de la journée. Route étroite et exposée, vent possible.' },
      { name: 'Lacets sommitaux', km: '80', type: 'cle', desc: 'Les pentes se redressent à 10 %. Le placement de roue est décisif.' },
      { name: 'Croix de Fer · 2 067 m', km: '92', type: 'sommet', desc: 'Sommet mythique. Vue sur les grandes Rousses et la Belledonne avant la descente.' },
    ],
  },
  'Les Chemins du Beaujolais': {
    elevation: '450 m D+', difficulty: 'Modéré', season: 'Mars – Novembre', tyreKey: 'power-adventure',
    tyreReason: "Pistes de terre entre les rangs de vigne et chemins forestiers humides alternent avec le macadam. Le Power Adventure associe confort et rendement sur ces surfaces mixtes du Beaujolais.",
    waypoints: [[45.989, 4.717], [46.020, 4.670], [46.032, 4.594], [46.005, 4.638]],
    segments: [
      { name: 'Villefranche-sur-Saône', km: '0', type: 'depart', desc: 'Départ en plaine, entrée progressive dans les vignobles du Beaujolais.' },
      { name: 'Pistes des crus', km: '14', type: 'cle', desc: 'Premières pistes de terre entre les rangs de vigne. Accroche modérée.' },
      { name: 'Belmont-d\'Azergues', km: '32', type: 'cle', desc: 'Village perché avec vue sur la vallée. Relance après la descente.' },
      { name: 'Descente forêt', km: '50', type: 'descente', desc: 'Sous-bois ombragés et sentiers humides en fin de parcours. Freinage à anticiper.' },
    ],
  },
  'Le Mont Ventoux par Bédoin': {
    elevation: '1 610 m D+', difficulty: 'Difficile', season: 'Avril – Octobre', tyreKey: 'power-cup',
    tyreReason: "21 km d'ascension sur l'asphalte parfait du Ventoux, suivis d'une descente exposée et rapide. Le Power Cup maximise le rendement dans les longues pentes et garantit l'adhérence sous le mistral.",
    waypoints: [[44.124, 5.183], [44.145, 5.228], [44.155, 5.264], [44.174, 5.279]],
    segments: [
      { name: 'Bédoin', km: '0', type: 'depart', desc: 'Départ du village. Les 5 premiers km sont roulants avant que la pente s\'accentue.' },
      { name: 'Forêt de Bédoin', km: '6', type: 'cle', desc: 'La pente monte à 9 %. L\'ombre des pins offre un répit avant la zone chauve.' },
      { name: 'Chalet Reynard', km: '16', type: 'cle', desc: 'La forêt cède la place au désert de pierres blanches. Vent fort possible.' },
      { name: 'Sommet · 1 909 m', km: '21', type: 'sommet', desc: 'Tour météo iconique. Vue jusqu\'aux Alpes et aux Pyrénées par beau temps.' },
    ],
  },
  'La Corniche des Maures': {
    elevation: '650 m D+', difficulty: 'Modéré', season: 'Toute l\'année', tyreKey: 'power-all-season',
    tyreReason: "Le littoral varois impose embruns, routes parfois mouillées et virages rapides face à la mer. Le Power All Season maintient une adhérence constante quelle que soit la météo méditerranéenne.",
    waypoints: [[43.136, 6.372], [43.178, 6.525], [43.195, 6.561], [43.157, 6.472]],
    segments: [
      { name: 'Le Lavandou', km: '0', type: 'depart', desc: 'Départ face à la mer. Route côtière dégagée avec vue sur les îles d\'Hyères.' },
      { name: 'Cavalaire-sur-Mer', km: '20', type: 'cle', desc: 'La route monte et descend sur les collines boisées. Virages rapides.' },
      { name: 'La Croix-Valmer', km: '42', type: 'cle', desc: 'Vignes en bord de mer, asphalte impeccable. Longue ligne droite.' },
      { name: 'Rayol-Canadel', km: '72', type: 'arrivee', desc: 'Arrivée sur les hauteurs avec vue sur les îles d\'Hyères.' },
    ],
  },
  'Les Ocres du Luberon': {
    elevation: '380 m D+', difficulty: 'Facile', season: 'Mars – Novembre', tyreKey: 'power-adventure',
    tyreReason: "Sentiers de terre ocre, chemins en calcaire et tronçons bitumés s'enchaînent dans le Luberon. Le Power Adventure gère cette mixité avec souplesse et procure du confort sur les pierres roulantes.",
    waypoints: [[43.929, 5.503], [43.912, 5.201], [43.876, 5.396], [43.842, 5.398]],
    segments: [
      { name: 'Rustrel', km: '0', type: 'depart', desc: 'Le Colorado provençal. Premiers sentiers ocre et blanc entre les cheminées de fée.' },
      { name: 'Gordes', km: '18', type: 'cle', desc: 'Village perché spectaculaire. Vue sur le Luberon et la Montagne du Luberon.' },
      { name: 'Apt', km: '32', type: 'cle', desc: 'Retour sur bitume pour traverser la ville. Marché de producteurs le samedi.' },
      { name: 'Buoux', km: '47', type: 'arrivee', desc: 'Fin de parcours dans les cerisiers. Fort de Buoux en surplomb.' },
    ],
  },
  'La Vallée de Chevreuse': {
    elevation: '580 m D+', difficulty: 'Modéré', season: 'Toute l\'année', tyreKey: 'power-road',
    tyreReason: "Routes secondaires régulières et petites bosses variées font de Chevreuse un terrain parfait pour le Power Road : polyvalent et vif, il excelle sur les relances et les descentes rapides des Yvelines.",
    waypoints: [[48.804, 2.120], [48.704, 2.034], [48.668, 1.959], [48.763, 2.072]],
    segments: [
      { name: 'Versailles', km: '0', type: 'depart', desc: 'Sortie du domaine royal. Large route forestière vers la vallée.' },
      { name: 'Chevreuse', km: '20', type: 'cle', desc: 'La vallée s\'encaisse. Routes étroites, petites côtes sèches.' },
      { name: 'Cernay-la-Ville', km: '38', type: 'cle', desc: 'Abbaye de l\'Abbaye. Forêt de Rambouillet, terrain vallonné.' },
      { name: 'Saint-Rémy-lès-Chevreuse', km: '58', type: 'arrivee', desc: 'Retour accessible en RER B. Parcours complet et varié.' },
    ],
  },
  'Les Boucles de la Seine': {
    elevation: '120 m D+', difficulty: 'Facile', season: 'Toute l\'année', tyreKey: 'lithion-4',
    tyreReason: "Parcours plat dédié à l'endurance et à la vélocité. Le Lithion 4 offre une durabilité exemplaire sur asphalte urbain et péri-urbain pour les sorties régulières en semaine.",
    waypoints: [[48.893, 2.162], [48.946, 2.146], [48.999, 2.096], [48.869, 2.134]],
    segments: [
      { name: 'Chatou', km: '0', type: 'depart', desc: 'Île des Impressionnistes. Piste cyclable longeant la Seine.' },
      { name: 'Maisons-Laffitte', km: '18', type: 'cle', desc: 'Hippodrome et berges. Route plate et régulière en bord de fleuve.' },
      { name: 'Conflans-Sainte-Honorine', km: '38', type: 'cle', desc: 'Confluent Seine-Oise. Vue panoramique depuis les hauteurs du belvédère.' },
      { name: 'Bougival', km: '64', type: 'arrivee', desc: 'Guinguettes et berges. Fin de boucle apaisante face au fleuve.' },
    ],
  },
  'La Forêt de Fontainebleau': {
    elevation: '320 m D+', difficulty: 'Modéré', season: 'Toute l\'année', tyreKey: 'power-gravel',
    tyreReason: "Chemins sableux, pavés de grès et drailles forestières composent ce parcours exigeant pour les pneus. Le Power Gravel y est souverain avec sa bande centrale roulante et ses flancs accrocheurs.",
    waypoints: [[48.445, 2.601], [48.403, 2.568], [48.418, 2.613], [48.380, 2.632]],
    segments: [
      { name: 'Barbizon', km: '0', type: 'depart', desc: 'Village des peintres de l\'école de Barbizon. Entrée dans la forêt par les drailles.' },
      { name: 'Gorges de Franchard', km: '14', type: 'cle', desc: 'Chaos de grès et chemins sableux. Gestion de l\'accroche dans les virages.' },
      { name: 'Rocher Canon', km: '26', type: 'cle', desc: 'Points de vue sur la plaine de Bière et les cultures de l\'Essonne.' },
      { name: 'Rocher Cassepot', km: '42', type: 'arrivee', desc: 'Sortie de forêt sur piste carrossable. Retour vers Barbizon.' },
    ],
  },
  'La Côte de Granit Rose': {
    elevation: '720 m D+', difficulty: 'Modéré', season: 'Avril – Octobre', tyreKey: 'power-all-season',
    tyreReason: "Vent d'ouest, embruns et chaussée humide même en été sont le lot de la côte bretonne. Le Power All Season maintient une adhérence fiable sur granit mouillé et asphalte salé.",
    waypoints: [[48.800, -3.445], [48.832, -3.485], [48.823, -3.516], [48.732, -3.458]],
    segments: [
      { name: 'Perros-Guirec', km: '0', type: 'depart', desc: 'Vue sur les Sept Îles. Vent d\'ouest souvent présent dès la sortie.' },
      { name: 'Ploumanac\'h', km: '12', type: 'cle', desc: 'Site des rochers roses. Route côtière étroite entre blocs de granit.' },
      { name: 'Trégastel', km: '24', type: 'cle', desc: 'Descente vers la plage. Sable sur la chaussée possible en été.' },
      { name: 'Lannion', km: '67', type: 'arrivee', desc: 'Centre médiéval à l\'arrivée. Fin de parcours en ville.' },
    ],
  },
  'La Presqu\'île de Crozon': {
    elevation: '680 m D+', difficulty: 'Modéré', season: 'Avril – Octobre', tyreKey: 'power-all-season',
    tyreReason: "Enclave marine battue par les vents atlantiques, Crozon réclame un pneu fiable et homogène par toutes conditions. Le Power All Season est la réponse évidente face aux embruns et à l'humidité des caps.",
    waypoints: [[48.247, -4.492], [48.272, -4.590], [48.188, -4.544], [48.223, -4.500]],
    segments: [
      { name: 'Crozon', km: '0', type: 'depart', desc: 'Bourg central de la presqu\'île. Départ vers les caps du bout du monde.' },
      { name: 'Camaret-sur-Mer', km: '14', type: 'cle', desc: 'Alignements de menhirs et sémaphore. Vue sur la Pointe des Espagnols.' },
      { name: 'Cap de la Chèvre', km: '30', type: 'cle', desc: 'Point le plus au sud. Falaises vertigineuses et vent de plein fouet.' },
      { name: 'Morgat', km: '55', type: 'arrivee', desc: 'Station balnéaire. Fin de boucle sur la baie de Douarnenez.' },
    ],
  },
  'Les Landes de Monteneuf': {
    elevation: '290 m D+', difficulty: 'Facile', season: 'Toute l\'année', tyreKey: 'power-adventure',
    tyreReason: "Pistes de schiste et chemins forestiers humides composent ce parcours doux. Le Power Adventure passe partout avec légèreté sans sacrifier le rendement sur les sections asphaltées.",
    waypoints: [[47.834, -2.296], [47.880, -2.380], [47.932, -2.398], [47.834, -2.296]],
    segments: [
      { name: 'Monteneuf', km: '0', type: 'depart', desc: 'Mégalithes de la Forêt du Névet. Premiers chemins de schiste.' },
      { name: 'Forêt de Lanouée', km: '12', type: 'cle', desc: 'Sous-bois touffu. Racines traversant le sentier par endroits.' },
      { name: 'Ploërmel', km: '24', type: 'cle', desc: 'Lac au Duc. Retour temporaire sur route goudronnée.' },
      { name: 'Retour par les dolmens', km: '38', type: 'arrivee', desc: 'Boucle finale sur les landes bretonnes. Paysage préhistorique intact.' },
    ],
  },
  'Le Col du Tourmalet': {
    elevation: '1 900 m D+', difficulty: 'Difficile', season: 'Juin – Septembre', tyreKey: 'power-cup',
    tyreReason: "L'ascension reine des Pyrénées culmine à 2 115 m. Sa descente nord vers Sainte-Marie-de-Campan est technique et rapide : le Power Cup est la seule réponse fiable à cette vitesse.",
    waypoints: [[42.870, -0.007], [42.898, 0.060], [42.902, 0.130], [42.909, 0.149]],
    segments: [
      { name: 'Luz-Saint-Sauveur', km: '0', type: 'depart', desc: 'Village pyrénéen en fond de vallée. L\'ascension s\'engage dans les gorges.' },
      { name: 'Barèges', km: '14', type: 'cle', desc: 'Station de ski estivale. Pente constante à 7 %. Gestion rigoureuse de l\'effort.' },
      { name: 'Plateau du Lienz', km: '62', type: 'cle', desc: 'La route s\'ouvre sur les alpages. Vent violent possible à cette altitude.' },
      { name: 'Tourmalet · 2 115 m', km: '76', type: 'sommet', desc: 'Le toit des Pyrénées cyclistes. Statue de l\'Octave Lapize avant la descente.' },
    ],
  },
  'Les Gorges de l\'Hérault': {
    elevation: '750 m D+', difficulty: 'Modéré', season: 'Mars – Novembre', tyreKey: 'power-road',
    tyreReason: "Route sinueuse et ombragée taillée dans la roche calcaire. Le Power Road combine rendement sur les lignes droites et adhérence dans les virages humides au fond des gorges.",
    waypoints: [[43.934, 3.701], [43.732, 3.548], [43.688, 3.532], [43.651, 3.557]],
    segments: [
      { name: 'Ganges', km: '0', type: 'depart', desc: 'Entrée progressive dans les gorges. Route large au départ.' },
      { name: 'Saint-Guilhem-le-Désert', km: '22', type: 'cle', desc: 'Village médiéval classé. Route étroite entre les maisons et la paroi.' },
      { name: 'Pont du Diable', km: '35', type: 'cle', desc: 'Fond de gorge. Route mouillée par les cascades et l\'ombre permanente.' },
      { name: 'Gignac', km: '61', type: 'arrivee', desc: 'Retour dans la plaine de l\'Hérault. Vignobles et garrigue.' },
    ],
  },
  'Le Plateau du Larzac': {
    elevation: '560 m D+', difficulty: 'Modéré', season: 'Avril – Octobre', tyreKey: 'power-gravel',
    tyreReason: "Le causse Larzac est couvert de gravier calcaire blanc et de pistes caillouteuses exposées au vent. Le Power Gravel excelle sur ces surfaces abrasives tout en conservant un rendement correct sur asphalte.",
    waypoints: [[43.980, 3.154], [44.007, 3.051], [43.977, 2.989], [44.098, 3.077]],
    segments: [
      { name: 'La Cavalerie', km: '0', type: 'depart', desc: 'Plateau nu et vaste. Vent permanent à prévoir toute la journée.' },
      { name: 'Piste du causse', km: '16', type: 'cle', desc: 'Gravier calcaire blanc et dévers. Maîtrise de l\'accroche requise.' },
      { name: 'Roquefort-sur-Soulzon', km: '34', type: 'cle', desc: 'Caves à fromage creusées dans le roc. Descente technique vers la plaine.' },
      { name: 'Millau', km: '54', type: 'arrivee', desc: 'La ville sous son viaduc. Vue saisissante sur l\'ouvrage depuis le bas.' },
    ],
  },
  'Les Vignobles du Médoc': {
    elevation: '180 m D+', difficulty: 'Facile', season: 'Toute l\'année', tyreKey: 'power-road',
    tyreReason: "Routes immaculées et plates entre les grands châteaux bordelais : un terrain taillé pour le Power Road. Rendement maximal sur asphalte parfait, idéal pour enchaîner les kilomètres à haute allure.",
    waypoints: [[44.840, -0.580], [45.040, -0.673], [45.196, -0.748], [45.257, -0.763]],
    segments: [
      { name: 'Bordeaux', km: '0', type: 'depart', desc: 'Quais de la Garonne. Sortie nord vers le Médoc par la D2.' },
      { name: 'Margaux', km: '20', type: 'cle', desc: 'Premier grand cru classé. Route droite entre les vignes entretenues.' },
      { name: 'Pauillac', km: '40', type: 'cle', desc: 'Capitale du Médoc. Vue sur l\'estuaire de la Gironde.' },
      { name: 'Saint-Estèphe', km: '58', type: 'arrivee', desc: 'Dernier grand cru en route. Fin de parcours face à l\'estuaire.' },
    ],
  },
  'La Vélodyssée Atlantique': {
    elevation: '220 m D+', difficulty: 'Facile', season: 'Toute l\'année', tyreKey: 'lithion-4',
    tyreReason: "Long itinéraire côtier sur piste cyclable et route secondaire plate. Le Lithion 4 est pensé pour l'endurance et les longues distances en conditions régulières, sans surprise.",
    waypoints: [[44.661, -1.168], [44.395, -1.162], [44.200, -1.232], [44.089, -1.313]],
    segments: [
      { name: 'Arcachon', km: '0', type: 'depart', desc: 'Dune du Pilat en toile de fond. Départ de la piste littorale atlantique.' },
      { name: 'Biscarrosse-Plage', km: '22', type: 'cle', desc: 'Entre lac et océan. La piste alterne asphalte et section sablée.' },
      { name: 'Mimizan', km: '44', type: 'cle', desc: 'Station familiale. Route droite sous les pins maritimes landais.' },
      { name: 'Contis-les-Bains', km: '70', type: 'arrivee', desc: 'Phare et estuaire de la Contis. Fin de parcours face aux vagues.' },
    ],
  },
  'Les Pistes des Landes': {
    elevation: '180 m D+', difficulty: 'Facile', season: 'Toute l\'année', tyreKey: 'power-adventure',
    tyreReason: "Allées forestières sableuses et larges, idéales pour débuter le gravel. Le Power Adventure offre le confort tubeless et l'accroche suffisante sur les pistes douces des Landes.",
    waypoints: [[43.665, -1.396], [43.726, -1.341], [44.095, -1.069], [43.800, -1.240]],
    segments: [
      { name: 'Hossegor', km: '0', type: 'depart', desc: 'Lac d\'Hossegor. Entrée dans la pinède landaise par les chemins forestiers.' },
      { name: 'Pistes de sable', km: '14', type: 'cle', desc: 'Allées sablonneuses sous les pins maritimes. Accroche douce et régulière.' },
      { name: 'Parentis-en-Born', km: '30', type: 'cle', desc: 'Lac de Biscarrosse. Route forestière carrossable bien damée.' },
      { name: 'Retour côtier', km: '49', type: 'arrivee', desc: 'Retour à Hossegor par la route de l\'Océan. Fin de boucle atlantique.' },
    ],
  },
};
