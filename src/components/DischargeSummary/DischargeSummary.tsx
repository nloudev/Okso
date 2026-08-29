import React from 'react';
import Block from '../Block/Block';
import { SummaryBlock } from '../../types';

interface DischargeSummaryProps {
    summaryBlocks: SummaryBlock[];
}

const sectionOrder: SummaryBlock['type'][] = [
    'redFlag',
    'medication',
    'schedule',
    'appointment',
    'restriction',
    'contact',
    'instruction',
];

const sectionTitles: Record<SummaryBlock['type'], string> = {
    redFlag: '⚠️ Red Flags — When to Get Help',
    medication: '💊 Medications',
    schedule: '🗓️ Your Day',
    appointment: '📅 Appointments',
    restriction: '🚫 Restrictions & Care',
    contact: '📞 Contacts',
    instruction: 'ℹ️ Instructions',
};

const DischargeSummary: React.FC<DischargeSummaryProps> = ({ summaryBlocks }) => {
    if (!summaryBlocks || summaryBlocks.length === 0) {
        return (
            <p className="text-gray-500 text-center py-8">
                No summary loaded yet.
            </p>
        );
    }

    const grouped = summaryBlocks.reduce<Record<string, SummaryBlock[]>>((acc, block) => {
        (acc[block.type] ??= []).push(block);
        return acc;
    }, {});

    return (
        <div className="discharge-summary space-y-6">
            {sectionOrder.map((type) => {
                const blocks = grouped[type];
                if (!blocks || blocks.length === 0) return null;

                return (
                    <section key={type} aria-label={sectionTitles[type]}>
                        <h2 className="text-lg font-semibold mb-2">{sectionTitles[type]}</h2>
                        <div>
                            {blocks.map((block) => (
                                <Block key={block.id} block={block} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

export default DischargeSummary;