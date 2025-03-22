'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

interface Project {
  name: string;
  automation: number;
  team: string;
  lastUpdate: string;
}

const AIEra: React.FC<AIEraProps> = ({ onEggCollect, isActive }) => {
  const [conversation, setConversation] = useState<string[]>([
    'Welcome to the 2025 AI Hackathon - Where the Future of Development Begins!',
    'I\'m your AI assistant, ready to help you navigate this next-gen development experience.',
    'Try asking about project ideas, team matching, or our AI-powered tools!'
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isSingularityMode, setIsSingularityMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { name: 'Neural Network Visualizer', automation: 95, team: 'AI Pioneers', lastUpdate: '2m ago' },
    { name: 'Quantum Code Optimizer', automation: 92, team: 'Quantum Coders', lastUpdate: '5m ago' },
    { name: 'AI-Powered Debugger', automation: 88, team: 'Debug Masters', lastUpdate: '8m ago' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [hackerAlias, setHackerAlias] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (isActive) {
      const eggTimer = setTimeout(() => {
        setShowEasterEgg(true);
      }, 15000);
      
      return () => clearTimeout(eggTimer);
    }
  }, [isActive]);

  const startVoiceRegistration = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const aliases = ['Neural Ninja', 'Quantum Coder', 'AI Alchemist', 'Binary Bard'];
      setHackerAlias(aliases[Math.floor(Math.random() * aliases.length)]);
      setIsListening(false);
    }, 2000);
  };

  const toggleSingularityMode = () => {
    setIsSingularityMode(true);
    setTimeout(() => setIsSingularityMode(false), 2000);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const input = userInput.trim().toLowerCase();
    setUserInput('');
    setConversation(prev => [...prev, `You: ${userInput}`]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (input.includes('do everything')) {
        response = 'I apologize, but I cannot "do everything" for you. While I can assist with coding, debugging, and project guidance, the creative spark and human ingenuity are essential to innovation. Let\'s work together to create something amazing!';
      } else if (input.includes('prize') || input.includes('money')) {
        response = 'The total prize pool for the 2025 AI Hackathon is $2,000,000! This includes awards for AI Innovation, Ethical AI Implementation, and AI for Social Good. Plus, winners get exclusive access to our AI development tools!';
      } else if (input.includes('register') || input.includes('sign up')) {
        response = 'Registration is voice-activated! Click the microphone icon to start. Our AI will analyze your voice pattern and assign you a unique hacker alias. Join 200,000+ participants from around the world!';
      } else if (input.includes('judges') || input.includes('judging')) {
        response = 'Our distinguished panel includes leading AI researchers, tech innovators, and industry pioneers. They will evaluate projects based on technical innovation, ethical considerations, and real-world impact.';
      } else if (input.includes('easter egg') && showEasterEgg) {
        response = 'You found it! This AI was trained on the complete history of hackathons! Try typing "singularity" for a special surprise...';
        onEggCollect('ai-egg');
      } else if (input.includes('singularity')) {
        toggleSingularityMode();
        response = 'INITIATING SINGULARITY MODE...';
      } else if (input.includes('project idea')) {
        response = 'Here\'s an AI-powered project idea: Create a neural network that can generate and optimize code based on natural language descriptions. Use our provided AI tools to train it on millions of code samples!';
      } else {
        response = 'I\'m here to help you navigate the 2025 AI Hackathon! You can ask about project ideas, team matching, our AI tools, or registration. What would you like to know?';
      }
      
      setConversation(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const renderProjectCard = (project: Project) => (
    <motion.div
      key={project.name}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 transition-all"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-cyan-400">{project.name}</h3>
        <span className="text-sm text-gray-400">{project.lastUpdate}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-purple-400 mr-2">Team:</span>
          <span className="text-gray-300">{project.team}</span>
        </div>
        <div className="flex items-center">
          <span className="text-green-400 mr-2">Automation:</span>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full"
              style={{ width: `${project.automation}%` }}
            />
          </div>
          <span className="ml-2 text-gray-300">{project.automation}%</span>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="ai-era min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(147,51,234,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <motion.div 
        className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <div className="container mx-auto py-8 px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            2025 AI Hackathon
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-center mt-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The Future of Development is Here
          </motion.p>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Tools Panel */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            AI Development Tools
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Available Tools</h3>
              <ul className="space-y-3">
                {['Bolt', 'Cursor', 'GitHub Copilot', 'Replit Ghostwriter'].map((tool, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-400">→</span>
                    <span className="text-gray-300">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-xl font-semibold mb-2 text-green-400">Voice Registration</h3>
              <button
                onClick={startVoiceRegistration}
                className={`w-full py-3 rounded-lg transition-all ${
                  isListening 
                    ? 'bg-green-500/20 border border-green-500 animate-pulse'
                    : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30'
                }`}
              >
                {isListening ? 'Listening...' : 'Start Voice Registration'}
              </button>
              {hackerAlias && (
                <p className="mt-2 text-center text-green-400">
                  Your Hacker Alias: {hackerAlias}
                </p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* AI Assistant */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 flex flex-col"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex-1 overflow-auto mb-4 space-y-4">
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg ${
                  message.startsWith('You:')
                    ? 'bg-purple-900/50 ml-8'
                    : 'bg-gray-900/50 mr-8'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                className="bg-gray-900/50 p-3 rounded-lg mr-8"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                AI is thinking...
              </motion.div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 bg-gray-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="Ask about the hackathon..."
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Send
            </button>
          </form>
        </motion.div>
        
        {/* Leaderboard */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/30"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            AI-Powered Leaderboard
          </h2>
          
          <div className="space-y-4">
            {projects.map(renderProjectCard)}
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div
        className="container mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-gray-400">
          Powered by next-generation AI technology. All interactions are processed in real-time 
          using state-of-the-art language models.
        </p>
        {showEasterEgg && (
          <p className="text-xs text-gray-600 mt-2 animate-pulse">
            Hint: Try asking about Easter eggs or typing "singularity"...
          </p>
        )}
      </motion.div>

      {/* Singularity Mode Effect */}
      <AnimatePresence>
        {isSingularityMode && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-4xl font-bold text-cyan-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              INITIATING SINGULARITY MODE...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIEra; 