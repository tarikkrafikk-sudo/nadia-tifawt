// Catalogue de démonstration — utilisé comme seed MongoDB et comme fallback
// si MONGODB_URI n'est pas défini (le site tourne alors sans base de données).

export const CATEGORIES = [
  { slug: 'miel', name: 'Miel Pur', nameAr: 'عسل حر', tagline: 'Récolté dans l’Atlas et le Souss' },
  { slug: 'amlou', name: 'Amlou', nameAr: 'أملو', tagline: 'Amandes, argan & miel, moulus à la pierre' },
  { slug: 'cosmetiques', name: 'Cosmétiques Naturels', nameAr: 'مستحضرات طبيعية', tagline: 'Rituels de beauté amazighs' },
];

const img = (s) => [`/images/products/${s}.jpg`];

// Visuels « pot » générés (scripts/art/render-products.mjs) utilisés sur les cartes best-sellers
// de l’accueil : étiquette ⵣ · nom du produit · NADIA TIFAWT. Toujours prioritaires sur les photos
// envoyées depuis l’admin, pour garder une vitrine homogène. ?v= force le rafraîchissement du cache.
const JAR_V = 2;
export const JAR_ART = {
  'miel-euphorbe-atlas': `/images/products/miel-euphorbe.jpg?v=${JAR_V}`,
  'amlou-traditionnel-argan': `/images/products/amlou-traditionnel.jpg?v=${JAR_V}`,
  'creme-visage-miel-argan': `/images/products/creme-visage-miel.jpg?v=${JAR_V}`,
  'miel-thym-montagne': `/images/products/miel-thym.jpg?v=${JAR_V}`,
};

const BASE_PRODUCTS = [
  {
    slug: 'miel-euphorbe-atlas', name: 'Miel d’Euphorbe de l’Atlas', nameAr: 'عسل الدغموس',
    category: 'miel', price: 390, compareAtPrice: 450, size: '500 g', stock: 24,
    images: img('miel-euphorbe'), bestseller: true, featured: true, rating: 4.9, reviewsCount: 128,
    shortDescription: 'Miel rare au goût puissant et légèrement poivré, récolté dans le Souss.',
    description: 'Butiné sur les euphorbes résinifères du Souss et de l’Anti-Atlas, ce miel ambré est réputé depuis des générations pour sa force et ses vertus. Récolte artisanale, non chauffé, non filtré industriellement.',
    ingredients: '100 % miel pur d’euphorbe (Euphorbia resinifera). Non pasteurisé.',
    usage: 'Une cuillère à café le matin à jeun, ou dans une eau tiède. Ne pas donner aux enfants de moins de 1 an.',
  },
  {
    slug: 'miel-thym-montagne', name: 'Miel de Thym Sauvage', nameAr: 'عسل الزعتر',
    category: 'miel', price: 320, size: '500 g', stock: 30,
    images: img('miel-thym'), bestseller: true, rating: 4.8, reviewsCount: 96,
    shortDescription: 'Doux, floral et aromatique — le miel des hauts plateaux.',
    description: 'Récolté au printemps sur les plateaux du Moyen-Atlas, là où le thym sauvage tapisse les pentes. Sa texture crémeuse et son parfum herbacé en font un miel d’exception pour le petit-déjeuner.',
    ingredients: '100 % miel pur de thym sauvage.', usage: 'Sur du pain, dans une infusion tiède, ou à la cuillère.',
  },
  {
    slug: 'miel-sidr-jujubier', name: 'Miel de Jujubier (Sidr)', nameAr: 'عسل السدر',
    category: 'miel', price: 450, size: '500 g', stock: 12,
    images: img('miel-sidr'), featured: true, rating: 5, reviewsCount: 64,
    shortDescription: 'Le grand cru des miels marocains, onctueux et caramélisé.',
    description: 'Issu de la floraison du jujubier sauvage dans les régions arides de l’Oriental, le miel de Sidr est l’un des plus recherchés au monde. Notes de caramel et de fruits secs.',
    ingredients: '100 % miel pur de jujubier (Ziziphus lotus).', usage: 'À déguster pur, une cuillère par jour.',
  },
  {
    slug: 'miel-fleur-oranger', name: 'Miel de Fleur d’Oranger', nameAr: 'عسل زهر الليمون',
    category: 'miel', price: 220, size: '500 g', stock: 40,
    images: img('miel-oranger'), rating: 4.7, reviewsCount: 51,
    shortDescription: 'Clair et délicat, au parfum de néroli.',
    description: 'Récolté dans les vergers de la plaine de Berkane, ce miel clair cristallise finement et révèle un parfum délicat de fleur d’oranger.',
    ingredients: '100 % miel pur de fleur d’oranger.', usage: 'Idéal dans les pâtisseries, le thé et les yaourts.',
  },
  {
    slug: 'amlou-traditionnel-argan', name: 'Amlou Traditionnel à l’Argan', nameAr: 'أملو بالأركان',
    category: 'amlou', price: 180, compareAtPrice: 210, size: '400 g', stock: 35,
    images: img('amlou-traditionnel'), bestseller: true, featured: true, rating: 4.9, reviewsCount: 212,
    shortDescription: 'Amandes grillées, huile d’argan alimentaire et miel, moulus à la meule de pierre.',
    description: 'La recette des femmes d’Idaoutanane : amandes beldi torréfiées, huile d’argan pressée à froid et miel pur, broyés lentement à la meule de pierre pour une texture soyeuse.',
    ingredients: 'Amandes beldi (55 %), huile d’argan alimentaire (30 %), miel pur (15 %).', usage: 'À tartiner sur msemen, baghrir ou pain chaud.',
  },
  {
    slug: 'amlou-miel-premium', name: 'Amlou Royal au Miel d’Euphorbe', nameAr: 'أملو ملكي',
    category: 'amlou', price: 240, size: '400 g', stock: 18,
    images: img('amlou-miel'), rating: 4.8, reviewsCount: 74,
    shortDescription: 'Notre amlou signature, enrichi au miel d’euphorbe.',
    description: 'Une édition d’exception où le miel d’euphorbe vient sublimer l’alliance amandes-argan. Plus intense, plus gourmand.',
    ingredients: 'Amandes beldi, huile d’argan alimentaire, miel d’euphorbe.', usage: 'Au petit-déjeuner ou en goûter énergétique.',
  },
  {
    slug: 'creme-visage-miel-argan', name: 'Crème Visage au Miel & Argan', nameAr: 'كريم الوجه بالعسل',
    category: 'cosmetiques', price: 260, compareAtPrice: 300, size: '50 ml', stock: 28,
    images: img('creme-visage-miel'), bestseller: true, featured: true, rating: 4.9, reviewsCount: 143,
    shortDescription: 'Nourrit, illumine et protège — la peau retrouve son éclat.',
    description: 'Une crème onctueuse qui associe le pouvoir réparateur du miel pur à l’huile d’argan bio. Elle nourrit en profondeur, apaise les tiraillements et révèle l’éclat naturel du teint.',
    ingredients: 'Aqua, Argania Spinosa Kernel Oil*, Mel (miel), Butyrospermum Parkii Butter*, Rosa Damascena Flower Water, Tocopherol. *Bio',
    usage: 'Matin et soir sur peau propre, en massages circulaires.',
  },
  {
    slug: 'huile-argan-pure', name: 'Huile d’Argan Pure Cosmétique', nameAr: 'زيت الأركان',
    category: 'cosmetiques', price: 190, size: '100 ml', stock: 45,
    images: img('huile-argan'), rating: 4.8, reviewsCount: 188,
    shortDescription: 'Pressée à froid par une coopérative féminine d’Essaouira.',
    description: 'L’or liquide du Maroc. Visage, corps, cheveux et ongles : un seul geste pour nourrir et sublimer.',
    ingredients: '100 % Argania Spinosa Kernel Oil, pressée à froid.', usage: 'Quelques gouttes sur peau ou cheveux légèrement humides.',
  },
  {
    slug: 'huile-figue-barbarie', name: 'Huile de Figue de Barbarie', nameAr: 'زيت الهندية',
    category: 'cosmetiques', price: 420, size: '30 ml', stock: 10,
    images: img('huile-figue-barbarie'), featured: true, rating: 5, reviewsCount: 39,
    shortDescription: 'Le sérum anti-âge naturel le plus précieux du Maroc.',
    description: 'Il faut près d’une tonne de figues pour un litre d’huile. Riche en vitamine E et stérols, elle lisse les ridules et le contour des yeux.',
    ingredients: '100 % Opuntia Ficus-Indica Seed Oil.', usage: '2 à 3 gouttes le soir sur visage et contour des yeux.',
  },
  {
    slug: 'savon-noir-eucalyptus', name: 'Savon Noir Beldi à l’Eucalyptus', nameAr: 'الصابون البلدي',
    category: 'cosmetiques', price: 85, size: '250 g', stock: 60,
    images: img('savon-noir'), rating: 4.7, reviewsCount: 117,
    shortDescription: 'Le rituel du hammam, à la maison.',
    description: 'Pâte d’olive noire saponifiée traditionnellement et parfumée à l’eucalyptus. Prépare la peau au gommage au kessa.',
    ingredients: 'Huile d’olive saponifiée, huile essentielle d’eucalyptus.', usage: 'Appliquer sur peau humide, laisser poser 5 min, rincer puis gommer.',
  },
  {
    slug: 'masque-ghassoul-miel', name: 'Masque Ghassoul, Miel & Rose', nameAr: 'قناع الغاسول',
    category: 'cosmetiques', price: 120, size: '150 g', stock: 22,
    images: img('masque-miel-ghassoul'), rating: 4.6, reviewsCount: 58,
    shortDescription: 'Argile de l’Atlas purifiante adoucie au miel.',
    description: 'Le ghassoul extrait de la vallée de la Moulouya, associé au miel et aux pétales de rose de Kelâat M’Gouna.',
    ingredients: 'Ghassoul, poudre de miel, poudre de rose de Damas.', usage: 'Mélanger à l’eau de rose, poser 10 min, rincer.',
  },
  {
    slug: 'baume-nuit-argan', name: 'Baume de Nuit Réparateur', nameAr: 'بلسم الليل',
    category: 'cosmetiques', price: 290, size: '50 ml', stock: 0,
    images: img('baume-argan'), rating: 4.8, reviewsCount: 27,
    shortDescription: 'Cire d’abeille, argan et néroli pour une peau régénérée au réveil.',
    description: 'Un baume fondant qui travaille pendant votre sommeil.',
    ingredients: 'Argan*, cire d’abeille, beurre de karité*, huile essentielle de néroli.', usage: 'Le soir, réchauffer une noisette entre les doigts et appliquer.',
  },
];



export const SHIPPING_ZONES = [
  { id: 'agadir', label: 'Agadir & environs', fee: 0, delay: '24 h' },
  { id: 'maroc', label: 'Autres villes du Maroc', fee: 35, delay: '48 – 72 h' },
];
export const FREE_SHIPPING_THRESHOLD = 500;

/* ───────────── Traductions EN / AR du catalogue ───────────── */
export const CATEGORY_I18N = {
  miel: { en: { name: 'Pure Honey', tagline: 'Harvested in the Atlas and the Souss' }, ar: { name: 'عسل حر', tagline: 'يُجنى في الأطلس وسوس' } },
  amlou: { en: { name: 'Amlou', tagline: 'Almonds, argan & honey, stone-ground' }, ar: { name: 'أملو', tagline: 'لوز وأركان وعسل، مطحون بالرحى الحجرية' } },
  cosmetiques: { en: { name: 'Natural Cosmetics', tagline: 'Amazigh beauty rituals' }, ar: { name: 'مستحضرات طبيعية', tagline: 'طقوس جمال أمازيغية' } },
};

export const PRODUCT_I18N = {
  'miel-euphorbe-atlas': {
    en: { name: 'Atlas Euphorbia Honey', shortDescription: 'A rare honey with a powerful, slightly peppery taste, harvested in the Souss.', description: 'Gathered from the resin spurge of the Souss and Anti-Atlas, this amber honey has been prized for generations for its strength and virtues. Artisanal harvest, unheated, not industrially filtered.', ingredients: '100% pure euphorbia honey (Euphorbia resinifera). Unpasteurised.', usage: 'One teaspoon in the morning on an empty stomach, or in lukewarm water. Not for children under 1 year.' },
    ar: { name: 'عسل الدغموس من الأطلس', shortDescription: 'عسل نادر بطعم قوي ولاذع قليلاً، يُجنى في منطقة سوس.', description: 'يُجنى من نبات الدغموس في سوس والأطلس الصغير، وهو عسل كهرماني اشتهر منذ أجيال بقوته وفوائده. جني تقليدي، غير مُسخَّن وغير مُصفّى صناعياً.', ingredients: 'عسل دغموس حر 100٪. غير مُبستر.', usage: 'ملعقة صغيرة صباحاً على الريق أو في ماء فاتر. لا يُعطى للأطفال أقل من سنة.', size: '500 غ' },
  },
  'miel-thym-montagne': {
    en: { name: 'Wild Thyme Honey', shortDescription: 'Mild, floral and aromatic — the honey of the high plateaus.', description: 'Harvested in spring on the Middle Atlas plateaus, where wild thyme carpets the slopes. Its creamy texture and herbal scent make it an exceptional breakfast honey.', ingredients: '100% pure wild thyme honey.', usage: 'On bread, in a warm infusion, or by the spoonful.' },
    ar: { name: 'عسل الزعتر البري', shortDescription: 'لطيف وزهري وعطري — عسل الهضاب العالية.', description: 'يُجنى في الربيع على هضاب الأطلس المتوسط حيث يغطي الزعتر البري المنحدرات. قوامه الكريمي ورائحته العشبية تجعله عسلاً استثنائياً لوجبة الفطور.', ingredients: 'عسل زعتر بري حر 100٪.', usage: 'على الخبز، في منقوع دافئ، أو بالملعقة.', size: '500 غ' },
  },
  'miel-sidr-jujubier': {
    en: { name: 'Jujube Honey (Sidr)', shortDescription: 'The grand cru of Moroccan honeys, smooth and caramelised.', description: 'From the blossoming of wild jujube in the arid lands of the Oriental, Sidr honey is one of the most sought-after honeys in the world. Notes of caramel and dried fruit.', ingredients: '100% pure jujube honey (Ziziphus lotus).', usage: 'Enjoy it pure, one spoonful a day.' },
    ar: { name: 'عسل السدر', shortDescription: 'أرقى أنواع العسل المغربي، ناعم بنكهة الكراميل.', description: 'يُجنى من إزهار السدر البري في المناطق الجافة بالجهة الشرقية، وهو من أكثر أنواع العسل طلباً في العالم. نكهات الكراميل والفواكه الجافة.', ingredients: 'عسل سدر حر 100٪.', usage: 'يُتناول صافياً، ملعقة في اليوم.', size: '500 غ' },
  },
  'miel-fleur-oranger': {
    en: { name: 'Orange Blossom Honey', shortDescription: 'Light and delicate, with a scent of neroli.', description: 'Harvested in the orchards of the Berkane plain, this light honey crystallises finely and reveals a delicate orange-blossom fragrance.', ingredients: '100% pure orange blossom honey.', usage: 'Perfect in pastries, tea and yoghurt.' },
    ar: { name: 'عسل زهر الليمون', shortDescription: 'فاتح ورقيق بعبير زهر البرتقال.', description: 'يُجنى في بساتين سهل بركان، عسل فاتح يتبلور بنعومة ويكشف عن عبير رقيق لزهر الليمون.', ingredients: 'عسل زهر الليمون حر 100٪.', usage: 'مثالي في الحلويات والشاي والياغورت.', size: '500 غ' },
  },
  'amlou-traditionnel-argan': {
    en: { name: 'Traditional Argan Amlou', shortDescription: 'Roasted almonds, culinary argan oil and honey, ground on a millstone.', description: 'The recipe of the women of Idaoutanane: roasted beldi almonds, cold-pressed argan oil and pure honey, slowly ground on a millstone for a silky texture.', ingredients: 'Beldi almonds (55%), culinary argan oil (30%), pure honey (15%).', usage: 'Spread on msemen, baghrir or warm bread.' },
    ar: { name: 'أملو تقليدي بالأركان', shortDescription: 'لوز محمّص وزيت أركان غذائي وعسل، مطحون بالرحى الحجرية.', description: 'وصفة نساء إداوتنان: لوز بلدي محمّص، زيت أركان معصور على البارد وعسل حر، تُطحن ببطء بالرحى الحجرية لقوام حريري.', ingredients: 'لوز بلدي (55٪)، زيت أركان غذائي (30٪)، عسل حر (15٪).', usage: 'يُدهن على المسمن أو البغرير أو الخبز الساخن.', size: '400 غ' },
  },
  'amlou-miel-premium': {
    en: { name: 'Royal Amlou with Euphorbia Honey', shortDescription: 'Our signature amlou, enriched with euphorbia honey.', description: 'An exceptional edition where euphorbia honey elevates the almond-argan pairing. More intense, more indulgent.', ingredients: 'Beldi almonds, culinary argan oil, euphorbia honey.', usage: 'At breakfast or as an energising snack.' },
    ar: { name: 'أملو ملكي بعسل الدغموس', shortDescription: 'أملو العلامة، مُعزَّز بعسل الدغموس.', description: 'إصدار استثنائي يرتقي فيه عسل الدغموس بمزيج اللوز والأركان. أكثر قوة وأكثر لذة.', ingredients: 'لوز بلدي، زيت أركان غذائي، عسل الدغموس.', usage: 'في الفطور أو كوجبة خفيفة مُنشِّطة.', size: '400 غ' },
  },
  'creme-visage-miel-argan': {
    en: { name: 'Honey & Argan Face Cream', shortDescription: 'Nourishes, brightens and protects — your skin regains its glow.', description: 'A rich cream combining the restorative power of pure honey with organic argan oil. It deeply nourishes, soothes tightness and reveals your complexion’s natural radiance.', ingredients: 'Aqua, Argania Spinosa Kernel Oil*, Mel (honey), Butyrospermum Parkii Butter*, Rosa Damascena Flower Water, Tocopherol. *Organic', usage: 'Morning and evening on clean skin, in circular movements.' },
    ar: { name: 'كريم الوجه بالعسل والأركان', shortDescription: 'يغذّي ويُشرق ويحمي — تستعيد بشرتك إشراقتها.', description: 'كريم غني يجمع بين قوة العسل الحر الترميمية وزيت الأركان العضوي. يغذّي بعمق ويهدّئ الشدّ ويكشف عن الإشراقة الطبيعية للبشرة.', ingredients: 'ماء، زيت الأركان العضوي، عسل، زبدة الشيا العضوية، ماء ورد دمشقي، فيتامين E.', usage: 'صباحاً ومساءً على بشرة نظيفة بحركات دائرية.', size: '50 مل' },
  },
  'huile-argan-pure': {
    en: { name: 'Pure Cosmetic Argan Oil', shortDescription: 'Cold-pressed by a women’s cooperative in Essaouira.', description: 'Morocco’s liquid gold. Face, body, hair and nails: one gesture to nourish and enhance.', ingredients: '100% Argania Spinosa Kernel Oil, cold-pressed.', usage: 'A few drops on skin or slightly damp hair.' },
    ar: { name: 'زيت الأركان التجميلي الصافي', shortDescription: 'معصور على البارد من طرف تعاونية نسائية بالصويرة.', description: 'الذهب السائل للمغرب. للوجه والجسم والشعر والأظافر: لمسة واحدة للتغذية والجمال.', ingredients: 'زيت أركان صافٍ 100٪ معصور على البارد.', usage: 'بضع قطرات على البشرة أو الشعر الرطب قليلاً.', size: '100 مل' },
  },
  'huile-figue-barbarie': {
    en: { name: 'Prickly Pear Seed Oil', shortDescription: 'Morocco’s most precious natural anti-ageing serum.', description: 'It takes nearly a tonne of fruit to make one litre of oil. Rich in vitamin E and sterols, it smooths fine lines and the eye contour.', ingredients: '100% Opuntia Ficus-Indica Seed Oil.', usage: '2 to 3 drops in the evening on face and eye contour.' },
    ar: { name: 'زيت بذور الهندية (التين الشوكي)', shortDescription: 'أثمن سيروم طبيعي مضاد للشيخوخة في المغرب.', description: 'يحتاج اللتر الواحد إلى ما يقارب طناً من الثمار. غني بفيتامين E والستيرولات، ينعّم الخطوط الرفيعة ومحيط العين.', ingredients: 'زيت بذور التين الشوكي 100٪.', usage: '2 إلى 3 قطرات مساءً على الوجه ومحيط العين.', size: '30 مل' },
  },
  'savon-noir-eucalyptus': {
    en: { name: 'Beldi Black Soap with Eucalyptus', shortDescription: 'The hammam ritual, at home.', description: 'Black olive paste, traditionally saponified and scented with eucalyptus. Prepares the skin for the kessa scrub.', ingredients: 'Saponified olive oil, eucalyptus essential oil.', usage: 'Apply to damp skin, leave for 5 min, rinse then scrub.' },
    ar: { name: 'الصابون البلدي بالكاليبتوس', shortDescription: 'طقوس الحمّام في بيتك.', description: 'عجينة زيتون أسود مُصبّنة بالطريقة التقليدية ومعطّرة بالكاليبتوس. تُهيّئ البشرة للتقشير بالكيس.', ingredients: 'زيت زيتون مُصبَّن، زيت الكاليبتوس العطري.', usage: 'يوضع على بشرة مبللة، يُترك 5 دقائق، يُشطف ثم تُقشَّر البشرة.', size: '250 غ' },
  },
  'masque-ghassoul-miel': {
    en: { name: 'Ghassoul, Honey & Rose Mask', shortDescription: 'Purifying Atlas clay softened with honey.', description: 'Ghassoul from the Moulouya valley, combined with honey and rose petals from Kelaat M’Gouna.', ingredients: 'Ghassoul, honey powder, Damask rose powder.', usage: 'Mix with rose water, leave for 10 min, rinse.' },
    ar: { name: 'قناع الغاسول بالعسل والورد', shortDescription: 'طين الأطلس المنقّي مُليَّن بالعسل.', description: 'غاسول وادي ملوية ممزوج بالعسل وبتلات ورد قلعة مكونة.', ingredients: 'غاسول، مسحوق العسل، مسحوق الورد الدمشقي.', usage: 'يُخلط بماء الورد، يُترك 10 دقائق ثم يُشطف.', size: '150 غ' },
  },
  'baume-nuit-argan': {
    en: { name: 'Restorative Night Balm', shortDescription: 'Beeswax, argan and neroli for skin renewed by morning.', description: 'A melting balm that works while you sleep.', ingredients: 'Argan*, beeswax, shea butter*, neroli essential oil.', usage: 'In the evening, warm a small amount between your fingers and apply.' },
    ar: { name: 'بلسم الليل المُرمِّم', shortDescription: 'شمع العسل والأركان وزهر الليمون لبشرة متجددة عند الاستيقاظ.', description: 'بلسم ذائب يعمل أثناء نومك.', ingredients: 'أركان، شمع العسل، زبدة الشيا، زيت زهر الليمون العطري.', usage: 'مساءً، تُدفّأ كمية صغيرة بين الأصابع ثم توضع على البشرة.', size: '50 مل' },
  },
};

export const PRODUCTS = BASE_PRODUCTS.map((p) => ({ ...p, i18n: PRODUCT_I18N[p.slug] || {} }));
