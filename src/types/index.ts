// This file defines TypeScript types and interfaces used throughout the application.

export interface SummaryBlock {
    id: string;
    type: 'medication' | 'schedule' | 'redFlag' | 'appointment' | 'restriction' | 'contact' | 'instruction';
    content: string;
}

export interface DischargeSummary {
    patientName: string;
    date: string;
    blocks: SummaryBlock[];
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