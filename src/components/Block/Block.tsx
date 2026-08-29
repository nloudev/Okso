import React from 'react';
import { Block as ParsedBlock } from '../../hooks/useSummaryParser';

interface BlockProps {
    block: ParsedBlock;
}

const priorityStyles: Record<ParsedBlock['priority'], string> = {
    critical: 'border-red-500 bg-red-50',
    important: 'border-amber-500 bg-amber-50',
    routine: 'border-gray-300 bg-gray-50',
};

const typeLabels: Record<ParsedBlock['type'], string> = {
    medication: '💊 Medication',
    medicationSchedule: '🗓️ Medication Schedule',
    medicationStopped: '🛑 Stopped Medication',
    redFlag: '⚠️ Red Flag',
    appointment: '📅 Appointment',
    task: '✅ Task',
    info: 'ℹ️ Info',
};

const renderFields = (block: ParsedBlock) => {
    const { type, fields } = block;

    switch (type) {
        case 'medication':
            return (
                <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                    {fields.dose ? <><dt className="text-gray-500">Dose</dt><dd>{String(fields.dose)}</dd></> : null}
                    {fields.frequency ? <><dt className="text-gray-500">Frequency</dt><dd>{String(fields.frequency)}</dd></> : null}
                    {fields.timing ? <><dt className="text-gray-500">Timing</dt><dd>{(fields.timing as string[]).join(', ')}</dd></> : null}
                    {fields.duration ? <><dt className="text-gray-500">Duration</dt><dd>{String(fields.duration)}</dd></> : null}
                    {fields.purpose ? <><dt className="text-gray-500">For</dt><dd>{String(fields.purpose)}</dd></> : null}
                </dl>
            );

        case 'medicationSchedule': {
            const steps = (fields.steps as Array<{ from: string; to: string; dose: string; note?: string }>) ?? [];
            return (
                <ul className="text-sm list-disc list-inside">
                    {steps.map((step, i) => (
                        <li key={i}>
                            {step.from} → {step.to}: {step.dose} {step.note ? `(${step.note})` : ''}
                        </li>
                    ))}
                </ul>
            );
        }

        case 'medicationStopped':
            return (
                <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                    {fields.reason ? <><dt className="text-gray-500">Reason</dt><dd>{String(fields.reason)}</dd></> : null}
                    {fields.replaced_by ? <><dt className="text-gray-500">Replaced by</dt><dd>{String(fields.replaced_by)}</dd></> : null}
                </dl>
            );

        case 'redFlag': {
            const items = (fields.items as string[]) ?? [];
            return (
                <div className="text-sm">
                    {fields.action ? <p className="font-semibold">{String(fields.action)}</p> : null}
                    {items.length > 0 && (
                        <ul className="list-disc list-inside">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>
            );
        }

        case 'appointment':
            return (
                <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                    {fields.when ? <><dt className="text-gray-500">When</dt><dd>{String(fields.when)}</dd></> : null}
                    {fields.where ? <><dt className="text-gray-500">Where</dt><dd>{String(fields.where)}</dd></> : null}
                    {fields.booked_by ? (
                        <>
                            <dt className="text-gray-500">Booked by</dt>
                            <dd>
                                {fields.booked_by === 'hospital' && 'The hospital'}
                                {fields.booked_by === 'patient' && 'You need to book this'}
                                {fields.booked_by === 'service_will_contact' && 'They will contact you'}
                            </dd>
                        </>
                    ) : null}
                </dl>
            );

        case 'task':
            return (
                <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                    {fields.what ? <><dt className="text-gray-500">What</dt><dd>{String(fields.what)}</dd></> : null}
                    {fields.by_when ? <><dt className="text-gray-500">By when</dt><dd>{String(fields.by_when)}</dd></> : null}
                </dl>
            );

        case 'info':
        default:
            return fields.detail ? <p className="text-sm">{String(fields.detail)}</p> : null;
    }
};

const Block: React.FC<BlockProps> = ({ block }) => {
    return (
        <div
            className={`block border-l-4 rounded p-3 mb-2 ${priorityStyles[block.priority]}`}
            data-block-type={block.type}
            data-block-priority={block.priority}
        >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {typeLabels[block.type]}
            </p>
            <p className="font-semibold">{block.title}</p>
            <p className="text-sm text-gray-700">{block.plain_summary}</p>

            {renderFields(block)}

            {block.missing.length > 0 && (
                <p className="text-xs italic text-orange-700 mt-1">
                    Check this with your nurse: {block.missing.join(', ')}
                </p>
            )}
        </div>
    );
};

export default Block;