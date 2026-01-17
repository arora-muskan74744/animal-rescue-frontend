import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m your Animal First Aid Assistant. I can help you provide immediate care until the rescue team arrives. What type of animal needs help?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // First Aid Knowledge Base
  const firstAidResponses = {
    dog: {
      bleeding: [
        '🩹 For bleeding wounds:',
        '1. Apply direct pressure with clean cloth',
        '2. Don\'t remove cloth if soaked - add more layers',
        '3. Elevate the injured area if possible',
        '4. Keep the dog calm and still',
        '5. Don\'t give food or water',
        '⚠️ If bleeding is severe, maintain pressure until help arrives'
      ],
      injured: [
        '🏥 For injured dog:',
        '1. Approach slowly and speak softly',
        '2. Avoid sudden movements',
        '3. If conscious, check breathing',
        '4. Keep warm with blanket/cloth',
        '5. Don\'t move if spine injury suspected',
        '6. Monitor breathing and consciousness',
        '⏰ Rescue team will arrive in 5-10 minutes'
      ],
      accident: [
        '🚗 For accident victim:',
        '1. Move to safe area if in traffic',
        '2. Check for breathing',
        '3. Look for visible injuries',
        '4. Keep still - don\'t bend limbs',
        '5. Cover with blanket to prevent shock',
        '6. Talk calmly to comfort',
        '📞 Stay with the animal until help arrives'
      ],
      poisoning: [
        '☠️ For suspected poisoning:',
        '1. DO NOT induce vomiting',
        '2. Remove any remaining poison from mouth',
        '3. Keep sample of poison if safe',
        '4. Keep dog calm and still',
        '5. Note symptoms and time',
        '⚡ This is urgent - help is on the way'
      ]
    },
    cat: {
      bleeding: [
        '🩹 For bleeding wounds:',
        '1. Apply gentle pressure with cloth',
        '2. Keep cat calm - use soft voice',
        '3. Don\'t remove blood-soaked cloth',
        '4. Keep in warm, dark place',
        '5. Avoid unnecessary movement',
        '⚠️ Maintain pressure until rescue arrives'
      ],
      injured: [
        '🏥 For injured cat:',
        '1. Approach slowly - cats hide when hurt',
        '2. Use blanket to gently restrain if needed',
        '3. Keep in dark, quiet space',
        '4. Watch for breathing difficulties',
        '5. Don\'t give food/water',
        '⏰ Help arriving in 5-10 minutes'
      ],
      accident: [
        '🚗 For accident victim:',
        '1. Use cardboard box as stretcher',
        '2. Move gently to safe location',
        '3. Check breathing',
        '4. Keep warm and quiet',
        '5. Note visible injuries',
        '📞 Stay calm - rescue team notified'
      ]
    },
    bird: {
      injured: [
        '🦜 For injured bird:',
        '1. Place in small box with air holes',
        '2. Keep warm (not hot)',
        '3. Keep quiet - stress is dangerous',
        '4. Don\'t give food/water',
        '5. Minimize handling',
        '6. Keep away from pets',
        '⏰ Wildlife rescue arriving soon'
      ],
      shock: [
        '😨 For bird in shock:',
        '1. Place in dark, warm box',
        '2. Keep completely quiet',
        '3. No handling unless necessary',
        '4. Cover box partially with cloth',
        '5. Maintain room temperature',
        '⚡ Help is on the way'
      ]
    },
    general: [
      '🆘 General First Aid Steps:',
      '1. Stay calm - animals sense your stress',
      '2. Ensure your own safety first',
      '3. Keep animal still and warm',
      '4. Don\'t give food or water',
      '5. Monitor breathing',
      '6. Note symptoms and time',
      '✅ Rescue team has been notified and is on the way!',
      '',
      '💡 Ask me about specific injuries:',
      '- Type "bleeding" for bleeding wounds',
      '- Type "accident" for traffic accidents',
      '- Type "poisoning" for toxic ingestion',
      '- Type "breathing" for breathing problems'
    ],
    bleeding: [
      '🩹 BLEEDING CONTROL:',
      '1. Use clean cloth/gauze',
      '2. Apply firm, direct pressure',
      '3. Don\'t peek - maintain pressure for 5 min',
      '4. If blood soaks through, add more layers',
      '5. Elevate wound above heart if possible',
      '6. Keep animal calm and still',
      '',
      '⚠️ SEVERE BLEEDING:',
      '- Maintain constant pressure',
      '- Don\'t remove blood clots',
      '- Cover to keep warm',
      '⏰ Rescue team arriving in 5-10 minutes'
    ],
    breathing: [
      '🫁 BREATHING DIFFICULTIES:',
      '1. Clear any obstruction from mouth',
      '2. Extend neck slightly to open airway',
      '3. Don\'t tilt head back',
      '4. Keep calm - stress worsens breathing',
      '5. Provide fresh air',
      '6. Monitor chest movement',
      '',
      '⚠️ IF NOT BREATHING:',
      '- Close mouth, breathe into nose',
      '- 1 breath every 3 seconds',
      '- Watch chest rise',
      '⚡ This is critical - help is coming fast!'
    ],
    shock: [
      '😨 TREATING SHOCK:',
      '1. Keep animal lying down',
      '2. Cover with blanket (not head)',
      '3. Keep calm and quiet',
      '4. Don\'t give food/water',
      '5. Monitor breathing and pulse',
      '',
      '⚠️ Signs of shock:',
      '- Pale gums',
      '- Rapid breathing',
      '- Weak pulse',
      '- Cold extremities',
      '📞 Veterinary help is on the way'
    ]
  };

  // AI Response Logic
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    // Check for specific injuries
    if (input.includes('bleed')) {
      return firstAidResponses.bleeding;
    }
    if (input.includes('breath') || input.includes('chok')) {
      return firstAidResponses.breathing;
    }
    if (input.includes('shock') || input.includes('unconscious')) {
      return firstAidResponses.shock;
    }
    if (input.includes('poison') || input.includes('toxic')) {
      return firstAidResponses.dog.poisoning;
    }

    // Check for animal type
    if (input.includes('dog') || input.includes('puppy')) {
      if (input.includes('accident') || input.includes('hit')) {
        return firstAidResponses.dog.accident;
      }
      return firstAidResponses.dog.injured;
    }
    if (input.includes('cat') || input.includes('kitten')) {
      if (input.includes('accident') || input.includes('hit')) {
        return firstAidResponses.cat.accident;
      }
      return firstAidResponses.cat.injured;
    }
    if (input.includes('bird')) {
      return firstAidResponses.bird.injured;
    }

    // Check for greetings
    if (input.includes('hi') || input.includes('hello') || input.includes('help')) {
      return firstAidResponses.general;
    }

    // Check for accident
    if (input.includes('accident') || input.includes('hit') || input.includes('car')) {
      return firstAidResponses.dog.accident;
    }

    // Default response
    return [
      '🤔 I can help with:',
      '🐕 Dogs - Type "dog injured" or "dog bleeding"',
      '🐈 Cats - Type "cat injured" or "cat accident"',
      '🦜 Birds - Type "bird injured"',
      '',
      '🆘 Specific conditions:',
      '- "bleeding" - For wounds',
      '- "breathing" - For respiratory issues',
      '- "accident" - For traffic accidents',
      '- "poisoning" - For toxic ingestion',
      '',
      '💡 Or just describe the situation and I\'ll help!'
    ];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = getResponse(inputText);
      const botMessage = {
        type: 'bot',
        text: Array.isArray(botResponse) ? botResponse.join('\n') : botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: '🩹 Bleeding', text: 'bleeding' },
    { label: '🫁 Breathing', text: 'breathing problem' },
    { label: '🚗 Accident', text: 'accident' },
    { label: '🐕 Dog', text: 'dog injured' },
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <span className="chat-avatar">🩺</span>
                <div>
                  <h3>First Aid Assistant</h3>
                  <p className="chat-status">
                    <span className="status-dot"></span> Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`message ${msg.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="message-content">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="message bot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-content typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(action.text);
                    setTimeout(handleSend, 100);
                  }}
                  className="quick-action-btn"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="chat-input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the situation..."
                className="chat-input"
              />
              <button onClick={handleSend} className="send-btn">
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

