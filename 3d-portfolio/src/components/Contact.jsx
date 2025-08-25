import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="py-20">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-8">Contact Me</h2>
                <form className="max-w-lg mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea id="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded">Send Message</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;