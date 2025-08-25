import React from 'react';

const Experience = () => {
    return (
        <section className="experience">
            <h2>Experience</h2>
            <div className="experience-list">
                <div className="experience-item">
                    <h3>Job Title at Company Name</h3>
                    <p>Duration: Month Year - Month Year</p>
                    <p>Description of responsibilities and achievements.</p>
                </div>
                <div className="experience-item">
                    <h3>Job Title at Company Name</h3>
                    <p>Duration: Month Year - Month Year</p>
                    <p>Description of responsibilities and achievements.</p>
                </div>
                {/* Add more experience items as needed */}
            </div>
        </section>
    );
};

export default Experience;