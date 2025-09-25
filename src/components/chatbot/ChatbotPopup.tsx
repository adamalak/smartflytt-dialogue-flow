
import { useState } from 'react';

const ChatbotPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        aria-label="öppna chatbot"
        type="button"
        onClick={() => setOpen(v => !v)}
      >
        Chatbot
      </button>

      {open && (
        <div role="dialog" data-testid="chatbot-container" aria-modal="true">
          Chatbot innehåll
        </div>
      )}
    </div>
  );
};

export default ChatbotPopup;
