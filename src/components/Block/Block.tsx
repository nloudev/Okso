import React from 'react';

interface BlockProps {
    type: string;
    content: string;
}

const Block: React.FC<BlockProps> = ({ type, content }) => {
    const renderContent = () => {
        switch (type) {
            case 'medication':
                return <div className="block medication">{content}</div>;
            case 'schedule':
                return <div className="block schedule">{content}</div>;
            case 'red-flag':
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