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
      <h3 className="text-4xl mb-6 text-center tt-frantz-menu text-[#00F7ED]">
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
              className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#00F7ED] focus:ring-1 focus:ring-[#00F7ED] transition-colors"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="py-2 px-6 bg-gradient-to-r from-[#00F7ED] to-[#8A038C] text-black font-semibold rounded-lg hover:from-[#00F7ED]/90 hover:to-[#8A038C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MinimalContactForm;
