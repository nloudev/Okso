import React from 'react';
import DischargeSummary from '../components/DischargeSummary/DischargeSummary';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';

const SummaryView: React.FC = () => {
    return (
        <div className="summary-view">
            <h1 className="text-2xl font-bold mb-4">Discharge Summary</h1>
            <LanguageSelector />
            <DischargeSummary />
        </div>
    );
};

export default SummaryView;