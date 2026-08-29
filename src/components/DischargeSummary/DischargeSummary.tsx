import React from 'react';
import Block from '../Block/Block';
import { SummaryBlock } from '../../types';

interface DischargeSummaryProps {
    summaryBlocks: SummaryBlock[];
}

const DischargeSummary: React.FC<DischargeSummaryProps> = ({ summaryBlocks }) => {
    if (!summaryBlocks || summaryBlocks.length === 0) {
        return <p className="text-gray-500">No summary loaded yet.</p>;
    }

    return (
        <div className="discharge-summary">
            {summaryBlocks.map((block) => (
                <Block key={block.id} block={block} />
            ))}
        </div>
    );
};

export default DischargeSummary;