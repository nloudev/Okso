// This file defines TypeScript types and interfaces used throughout the application.

export interface DischargeSummaryBlock {
    id: string;
    type: 'medication' | 'schedule' | 'redFlag' | 'instruction';
    content: string;
}

export interface DischargeSummary {
    patientName: string;
    date: string;
    blocks: DischargeSummaryBlock[];
}

export interface LanguageOption {
    code: string;
    label: string;
}

export interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
}