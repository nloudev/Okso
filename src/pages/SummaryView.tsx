import React from 'react';
import DischargeSummary from '../components/DischargeSummary/DischargeSummary';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import { SummaryBlock } from '../types';

const sampleBlocks: SummaryBlock[] = [
    { id: '1', type: 'medication', content: 'Take paracetamol 500mg every 6 hours as needed.' },
];

const SummaryView: React.FC = () => {
    return (
        <div className="summary-view">
            <h1 className="text-2xl font-bold mb-4">Discharge Summary</h1>
            <LanguageSelector />
            <DischargeSummary summaryBlocks={sampleBlocks} />
        </div>
    );
};

export default SummaryView;