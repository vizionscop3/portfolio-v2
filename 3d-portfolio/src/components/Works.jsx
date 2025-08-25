import React from 'react';

const Works = () => {
    const projects = [
        {
            title: 'Project One',
            description: 'Description of project one.',
            image: 'path/to/image1.jpg',
            link: 'https://link-to-project-one.com'
        },
        {
            title: 'Project Two',
            description: 'Description of project two.',
            image: 'path/to/image2.jpg',
            link: 'https://link-to-project-two.com'
        },
        {
            title: 'Project Three',
            description: 'Description of project three.',
            image: 'path/to/image3.jpg',
            link: 'https://link-to-project-three.com'
        }
    ];

    return (
        <section className="works">
            <h2>My Works</h2>
            <div className="projects-gallery">
                {projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <img src={project.image} alt={project.title} />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Works;