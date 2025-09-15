import React, { useState } from 'react';

const MinimalContactForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h3 className="text-4xl mb-6 text-center tt-frantz-menu text-cyan-400">
        GET IN TOUCH
      </h3>

      {isSubmitted ? (
        <div className="text-center">
          <div className="text-green-400 text-lg mb-2">✓ Message Sent!</div>
          <p className="text-gray-300">I'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Hi Lee, I'm interested in working together..."
              className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default MinimalContactForm;
