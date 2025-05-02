// === TYPES ===
type MoxFieldCard = {
    Count: number;
    Name: string;
    Edition: string;
    Condition: string;
    Language: string;
    Foil?: string;
    CollectorNumber: string | number;
    PurchasePrice?: string | number;
};

type ManaBoxCard = {
    Name: string;
    'Set code': string;
    'Set name': string;
    'Collector number': string | number;
    Foil: string;
    Rarity: string;
    Quantity: number;
    'Purchase price': string | number;
    Condition: string;
    Language: string;
};

type LigaMagicCard = {
    'Edicao (PTBR)': string;
    'Edicao (EN)': string;
    'Edicao (Sigla)': string;
    'Card (PT)': string;
    'Card (EN)': string;
    Quantidade: number;
    'Qualidade (M NM SP MP HP D)': string;
    'Idioma (BR EN DE ES FR IT JP KO RU TW)': string;
    'Raridade (M R U C)': string;
    'Cor': string;
    'Extras': string;
    'Card #': string;
    'Comentario': string;
};

// === HELPERS ===
function normalizeLanguage(lang: string): string {
    const lower = lang?.toLowerCase() || '';
    if (lower.startsWith('pt') || lower.startsWith('br')) return 'pt';
    if (lower.startsWith('en')) return 'en';
    return 'en';
}

function normalizeCondition(condition: string): string {
    const lower = condition?.toLowerCase();
    if (lower.includes('near')) return 'Near Mint';
    if (lower.includes('moderate')) return 'Moderate Play';
    return 'Moderate Play';
}

// === CONVERSIONS ===
function moxfieldToManabox(cards: MoxFieldCard[]): ManaBoxCard[] {
    return cards.map((card) => ({
    Name: card.Name || '',
    'Set code': card.Edition?.toUpperCase() || '',
    'Set name': '',
    'Collector number': String(card.CollectorNumber ?? ''),
    Foil: card.Foil?.toLowerCase() === 'foil' ? 'foil' : 'normal',
    Rarity: 'common',
    Quantity: card.Count || 1,
    'Purchase price': card.PurchasePrice ?? '0.00',
    Condition: card.Condition?.toLowerCase().replace(' ', '_') || 'near_mint',
    Language: normalizeLanguage(card.Language),
    }));
}

function manaboxToMoxfield(cards: ManaBoxCard[]): MoxFieldCard[] {
    return cards.map((card) => ({
    Count: card.Quantity || 1,
    Name: card.Name || '',
    Edition: card['Set code']?.toLowerCase() || '',
    Condition: normalizeCondition(card.Condition),
    Language: card.Language === 'pt' ? 'Portuguese' : 'English',
    Foil: card.Foil === 'foil' ? 'foil' : '',
    CollectorNumber: card['Collector number'] ?? '',
    PurchasePrice: card['Purchase price'] ?? '0.00',
    }));
}

function moxfieldToLigamagic(cards: MoxFieldCard[]): LigaMagicCard[] {
    return cards
    .filter((card) => card && card.Name && card.Edition)
    .map((card) => ({
        'Edicao (PTBR)': '',
        'Edicao (EN)': card.Edition?.toUpperCase() || '',
        'Edicao (Sigla)': card.Edition?.toLowerCase() || '',
        'Card (PT)': '',
        'Card (EN)': card.Name || '',
        Quantidade: card.Count || 1,
        'Qualidade (M NM SP MP HP D)': card.Condition === 'Near Mint' ? 'NM' : 'MP',
        'Idioma (BR EN DE ES FR IT JP KO RU TW)': card.Language?.startsWith('Port') ? 'BR' : 'EN',
        'Raridade (M R U C)': 'C',
        'Cor': '',
        'Extras': card.Foil?.toLowerCase() === 'foil' ? 'Foil' : '',
        'Card #': String(card.CollectorNumber ?? ''),
        'Comentario': '',
    }));
}

function manaboxToLigamagic(cards: ManaBoxCard[]): LigaMagicCard[] {
    return cards.map((card) => ({
    'Edicao (PTBR)': '',
    'Edicao (EN)': card['Set code']?.toUpperCase() || '',
    'Edicao (Sigla)': card['Set code']?.toLowerCase() || '',
    'Card (PT)': '',
    'Card (EN)': card.Name || '',
    Quantidade: card.Quantity || 1,
    'Qualidade (M NM SP MP HP D)': card.Condition === 'Near Mint' ? 'NM' : 'MP',
    'Idioma (BR EN DE ES FR IT JP KO RU TW)': card.Language?.startsWith('pt') ? 'BR' : 'EN',
    'Raridade (M R U C)': card.Rarity?.charAt(0).toUpperCase() || '',
    'Cor': '',
    'Extras': card.Foil === 'foil' ? 'Foil' : '',
    'Card #': String(card['Collector number'] ?? ''),
    'Comentario': '',
    }));
}

function ligamagicToMoxfield(cards: LigaMagicCard[]): MoxFieldCard[] {
    return cards.map((card) => ({
    Count: card.Quantidade || 1,
    //Needed to remove the text inside the parentheses, normally cards with some kind of variant (ex: Atractions of Unffinity)
    // IF _ repeat more than 5 times, trim to 5 times
    Name: (card['Card (EN)']?.replace(/\s*\(.*?\)\s*/g, '') || '').replace(/_{6,}/g, '_____'),
    Edition: card['Edicao (Sigla)'] || '',
    Condition: card['Qualidade (M NM SP MP HP D)'] === 'NM' ? 'Near Mint' : 'Moderate Play',
    Language: card['Idioma (BR EN DE ES FR IT JP KO RU TW)'] === 'BR' ? 'Portuguese' : 'English',
    CollectorNumber: card['Card #']?.replace(/\s*\(.*?\)\s*/g, '') || '',
    }));
}

function ligamagicToManabox(cards: LigaMagicCard[]): ManaBoxCard[] {
    return cards.map((card) => ({
    Name: card['Card (EN)'] || '',
    'Set code': card['Edicao (Sigla)']?.toUpperCase() || '',
    'Set name': '',
    'Collector number': String(card['Card #'] ?? ''),
    Foil: card['Qualidade (M NM SP MP HP D)'] === 'NM' ? 'normal' : 'foil',
    Rarity: card['Raridade (M R U C)']?.toLowerCase() || 'common',
    Quantity: card.Quantidade || 1,
    'Purchase price': '0.00',
    Condition: card['Qualidade (M NM SP MP HP D)'] === 'NM' ? 'Near Mint' : 'Moderate Play',
    Language: card['Idioma (BR EN DE ES FR IT JP KO RU TW)']?.startsWith('BR') ? 'pt' : 'en',
    }));
}

// === EXPORTS ===
export {
    moxfieldToManabox,
    manaboxToMoxfield,
    moxfieldToLigamagic,
    ligamagicToMoxfield,
    manaboxToLigamagic,
    ligamagicToManabox,
    type MoxFieldCard,
    type ManaBoxCard,
    type LigaMagicCard,
};


// ________-o-saurus
// _____-o-saurus
// Wolf in _____ Clothing
//________ Bird Gets the Worm"
// _____-o-saurus