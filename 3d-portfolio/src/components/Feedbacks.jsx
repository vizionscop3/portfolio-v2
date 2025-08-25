import React from 'react';

const Feedbacks = () => {
    const testimonials = [
        {
            name: "Client A",
            feedback: "This developer did an amazing job on our project!",
        },
        {
            name: "Client B",
            feedback: "Highly professional and delivered on time.",
        },
        {
            name: "Client C",
            feedback: "Great communication and excellent results.",
        },
    ];

    return (
        <div className="feedbacks">
            <h2>Client Feedback</h2>
            <div className="feedbacks-list">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="feedback-item">
                        <p>"{testimonial.feedback}"</p>
                        <h4>- {testimonial.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feedbacks;