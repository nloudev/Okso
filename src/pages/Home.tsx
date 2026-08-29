import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Okso</h1>
            <p>Your hospital discharge summary, broken into blocks you can actually follow - in your language, at your reading level, on your phone.</p>
            <nav>
                <ul>
                    <li><Link to="/summary">View Discharge Summary</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;