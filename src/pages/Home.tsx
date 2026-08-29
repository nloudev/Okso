import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
    { title: 'Share your letter', detail: 'Paste the text or upload a photo of your discharge summary.' },
    { title: 'Get plain-language blocks', detail: 'We break it into medications, appointments and red flags you can actually follow.' },
    { title: 'Read it your way', detail: 'Switch language and reading level, or have it read aloud.' },
];

const Home: React.FC = () => {
    return (
        <div className="home-container max-w-2xl mx-auto px-4 py-8 space-y-8">
            <header className="text-center space-y-3">
                <h1 className="text-3xl font-bold">Okso</h1>
                <p className="text-gray-600">
                    Your hospital discharge summary, broken into blocks you can actually follow — in
                    your language, at your reading level, on your phone.
                </p>
            </header>

            <ol className="steps-list space-y-4 list-none pl-0">
                {steps.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                        <span
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
                            aria-hidden="true"
                        >
                            {i + 1}
                        </span>
                        <div>
                            <p className="font-semibold">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.detail}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <nav aria-label="Primary">
                <ul className="text-center list-none pl-0">
                    <li>
                        <Link
                            to="/summary"
                            className="inline-block rounded bg-blue-600 text-white font-semibold px-6 py-3"
                        >
                            View Discharge Summary
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;