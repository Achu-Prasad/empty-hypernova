import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
    {
        id: 1,
        role: 'Senior Product Designer',
        company: 'Tech Studio',
        period: '2023 - Present',
        description: 'Leading design systems and product strategy for enterprise clients.',
    },
    {
        id: 2,
        role: 'UI/UX Designer',
        company: 'Creative Agency',
        period: '2021 - 2023',
        description: 'Designed award-winning websites and mobile applications.',
    },
    {
        id: 3,
        role: 'Junior Designer',
        company: 'Startup Inc',
        period: '2020 - 2021',
        description: 'Collaborated with developers to ship features for a SaaS platform.',
    },
];

const Experience = () => {
    return (
        <section className="experience-section" id="about">
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Experience
                </motion.h2>

                <div className="experience-list">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            className="experience-item"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="experience-header">
                                <h3 className="experience-role">{exp.role}</h3>
                                <span className="mono experience-period">{exp.period}</span>
                            </div>
                            <div className="experience-company">{exp.company}</div>
                            <p className="experience-description">{exp.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
