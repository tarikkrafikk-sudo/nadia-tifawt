// Anciens avis d'EXEMPLE de la démo — ils ne sont plus créés.
// Cette liste sert uniquement à les repérer pour les supprimer depuis /admin/avis.
export const SAMPLE_REVIEWS = [
  { product: 'miel-euphorbe-atlas', name: 'Salma B.', city: 'Casablanca', rating: 5, featured: true, text: 'Le miel d’euphorbe est authentique, on sent la différence dès la première cuillère. Emballage très luxueux, parfait pour offrir.' },
  { product: 'amlou-traditionnel-argan', name: 'Youssef A.', city: 'Oujda', rating: 5, featured: true, text: 'Livré en 24h à Oujda, paiement à la livraison. L’amlou est le meilleur que j’ai goûté depuis celui de ma grand-mère.' },
  { product: 'creme-visage-miel-argan', name: 'Imane K.', city: 'Agadir', rating: 5, featured: true, text: 'La crème au miel a transformé ma peau en deux semaines. Texture riche mais qui pénètre vite. Je recommande les yeux fermés.' },
  { product: 'savon-noir-eucalyptus', name: 'Hajar E.', city: 'Rabat', rating: 4, featured: true, text: 'Très beaux produits, service WhatsApp réactif. Le savon noir sent divinement bon.' },
  { product: 'miel-euphorbe-atlas', name: 'Rachid M.', city: 'Berkane', rating: 5, text: 'Goût puissant, typique du vrai daghmous. Je reprendrai.' },
  { product: 'miel-thym-montagne', name: 'Nora L.', city: 'Fès', rating: 5, text: 'Texture crémeuse et parfum incroyable, toute la famille adore.' },
  { product: 'miel-sidr-jujubier', name: 'Khalid T.', city: 'Marrakech', rating: 5, text: 'Un sidr d’exception, notes de caramel. Cher mais ça les vaut.' },
  { product: 'amlou-traditionnel-argan', name: 'Meriem S.', city: 'Tanger', rating: 5, text: 'Onctueux, pas trop sucré, on sent bien l’argan.' },
  { product: 'amlou-miel-premium', name: 'Amine R.', city: 'Kénitra', rating: 4, text: 'Très gourmand, parfait au petit-déjeuner avec du msemen.' },
  { product: 'huile-argan-pure', name: 'Sara O.', city: 'Essaouira', rating: 5, text: 'Huile pure, sans odeur forte, mes cheveux sont plus brillants.' },
  { product: 'huile-figue-barbarie', name: 'Leila H.', city: 'Casablanca', rating: 5, text: 'Mon sérum du soir, ma peau est plus lisse au réveil.' },
  { product: 'creme-visage-miel-argan', name: 'Zineb A.', city: 'Oujda', rating: 5, text: 'Odeur délicate, peau nourrie toute la journée.' },
  { product: 'masque-ghassoul-miel', name: 'Asmae N.', city: 'Meknès', rating: 4, text: 'Peau toute douce après le hammam, je recommande.' },
  { product: 'miel-fleur-oranger', name: 'Hamza B.', city: 'Agadir', rating: 5, text: 'Délicat et parfumé, idéal dans le thé.' },
  { product: 'creme-visage-miel-argan', name: 'Fatima Z.', city: 'Nador', rating: 5, status: 'pending', text: 'Commande reçue hier, très bien emballée. J’attends de voir les résultats !' },
];

export const isSampleReview = (r) => SAMPLE_REVIEWS.some((s) => s.name === r.name && s.text === r.text);
