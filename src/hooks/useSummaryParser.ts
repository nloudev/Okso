// This file contains a custom hook for parsing discharge summaries into structured JSON blocks.


import { useState } from 'react';

export type BlockType = //union type - value of this type must be one of those exact strings. nothing else compiles. i.e. no typos.
    | 'medication'
    | 'medication_schedule'
    | 'medication stopped'
    | 'red_flag'
    | 'appointment'
    | 'task'
    | 'info';

export type Priority = 'critical' | 'important' | 'routine';

export interface Block { //describes shape of an object 
    id: string;
    type: BlockType;
    priority: Priority;
    title: string;
    plain_summary: string;
    fields: Record<string>, unknown>; //an object where keys are strings and whose values are of unknown type.
    missing: string[]; //array of strings. when letter doesn't state a dose, the model puts "dose" rather than inventing "5 mg".
    source: { section: string; text: string }; // inline object type. 

}



const useSummaryParser = () => {
    const [parsedSummary, setParsedSummary] = useState(null);
    const [error, setError] = useState(null);

    const parseSummary = (input) => {
        try {
            // Implement parsing logic here
            
            const summaryBlocks = []; // Replace with actual parsing logic
            setParsedSummary(summaryBlocks);
            setError(null);
        } catch (err) {
            setError('Failed to parse summary');
            setParsedSummary(null);
        }
    };

    return { parsedSummary, error, parseSummary };
};

export default useSummaryParser;