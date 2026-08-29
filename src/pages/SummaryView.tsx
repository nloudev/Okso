import React from 'react';
import DischargeSummary from '../components/DischargeSummary/DischargeSummary';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import { Block } from '../hooks/useSummaryParser';

const sampleBlocks: Block[] = [
    {
        id: '1',
        type: 'medication',
        priority: 'important',
        title: 'Paracetamol',
        content: 'Take paracetamol 500mg every 6 hours as needed.',
        plain_summary: 'Take this for pain relief.',
        fields: { dose: '500 mg', frequency: 'every 6 hours' },
        missing: [],
        source: { section: 'Medications', text: 'Take paracetamol 500mg every 6 hours as needed.' },
    },
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