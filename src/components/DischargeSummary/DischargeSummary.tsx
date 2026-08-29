import React from 'react';
import { Block } from '../Block/Block';
import { SummaryBlock } from '../../types';

interface DischargeSummaryProps {
    summaryBlocks: SummaryBlock[];
}

const DischargeSummary: React.FC<DischargeSummaryProps> = ({ summaryBlocks }) => {
    return (
        <div className="discharge-summary">
            {summaryBlocks.map((block, index) => (
                <Block key={index} block={block} />
            ))}
        </div>
    );
};

export default DischargeSummary;