import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Okso</h1>
            <p>Your hospital discharge summary, broken into blocks you can actually follow - in your language, at your reading level, on your phone.</p>
            <nav>
                <ul>
                    <li><a href="/summary">View Discharge Summary</a></li>
                    <li><a href="/about">About Us</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;