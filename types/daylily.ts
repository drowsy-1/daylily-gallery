// types/daylily.ts

export interface Daylily {
    url: string;
    scraped_at: string;
    name: string;
    hybridizer: string;
    year: string;
    scape_height: string;
    bloom_size: string;
    bloom_season: string;
    ploidy: string;
    foliage_type: string;
    fragrance?: string;
    bloom_habit?: string;
    bud_count: string;
    branches: string;
    seedling_#?: string;
    color_description: string;
    parentage: string;
    image_url: string;
    form?: string;
    sculpting?: string;
    notes?: string;
}

export interface FilterState {
    search: string;
    matchType: 'exact' | 'partial';
    yearRange: {
        start: string;
        end: string;
    };
    hybridizer: string;
    hybridizerMatchType: 'exact' | 'partial';
    ploidy: string;
    bloomSize: {
        min: string;
        max: string;
    };
    scapeHeight: {
        min: string;
        max: string;
    };
    branches: {
        min: string;
        max: string;
    };
    budCount: {
        min: string;
        max: string;
    };
    bloomSeason: string[];
    rebloom: boolean;
    foliageType: string;
}

export const BLOOM_SEASONS = [
    "Extra Early",
    "Early",
    "Early-Mid",
    "Midseason",
    "Mid-Late",
    "Late",
    "Very Late"
] as const;

export const FOLIAGE_TYPES = [
    'Dormant',
    'Evergreen',
    'Semi-Evergreen'
] as const;

export const INITIAL_FILTER_STATE: FilterState = {
    search: '',
    matchType: 'partial',
    yearRange: {
        start: '',
        end: ''
    },
    hybridizer: '',
    hybridizerMatchType: 'partial',
    ploidy: '',
    bloomSize: {
        min: '',
        max: ''
    },
    scapeHeight: {
        min: '',
        max: ''
    },
    branches: {
        min: '',
        max: ''
    },
    budCount: {
        min: '',
        max: ''
    },
    bloomSeason: [],
    rebloom: false,
    foliageType: ''
};