import React from 'react';
import { SummaryBlock } from '../../types';

interface BlockProps {
    block: SummaryBlock;
}

const Block: React.FC<BlockProps> = ({ block }) => {
    const { type, content } = block;
    const renderContent = () => {
        switch (type) {
            case 'medication':
                return <div className="block medication">{content}</div>;
            case 'schedule':
                return <div className="block schedule">{content}</div>;
            case 'redFlag':
                return <div className="block red-flag">{content}</div>;
            default:
                return <div className="block default">{content}</div>;
        }
    };

    return (
        <div className="block-container">
            {renderContent()}
        </div>
    );
};

export default Block;