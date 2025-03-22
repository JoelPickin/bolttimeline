'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Trophy, Cpu, Zap, Layers, Star, PhoneCall, Brain, Sparkles } from 'lucide-react';

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

interface Tool {
  name: string;
  icon: React.ReactNode;
}

const AIEra: React.FC<AIEraProps> = ({ onEggCollect, isActive }) => {
  // Use useState and not direct values for client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [conversation, setConversation] = useState<string[]>([
    'Welcome to the 2025 AI Hackathon - Where the Future of Development Begins!',
    'I\'m your AI assistant BOLT-X, ready to help you navigate this next-gen development experience.',
    'Try asking about project ideas, team matching, or our AI-powered tools!'
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isSingularityMode, setIsSingularityMode] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { name: 'Neural Network Visualizer', automation: 95, team: 'AI Pioneers', lastUpdate: 'just now' },
    { name: 'Quantum Code Optimizer', automation: 92, team: 'Quantum Coders', lastUpdate: '2m ago' },
    { name: 'AI-Powered Debugger', automation: 88, team: 'Debug Masters', lastUpdate: '5m ago' },
    { name: 'Synaptic Learning Engine', automation: 97, team: 'Brain Trust', lastUpdate: 'just now' },
    { name: 'Autonomous DevOps Agent', automation: 93, team: 'Infinity Loop', lastUpdate: '1m ago' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [hackerAlias, setHackerAlias] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [codeIndex, setCodeIndex] = useState(0);
  const [particlePosition, setParticlePosition] = useState<{cx: number[], cy: number[], px: number[], gx: number[]}>({
    cx: Array(20).fill(0).map(() => 50),
    cy: Array(20).fill(0).map(() => 50),
    px: Array(15).fill(0).map(() => 50),
    gx: Array(10).fill(0).map(() => 50)
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const codeSnippets = [
    '// AI-generated code\nconst createAutonomousAgent = async () => {\n  const model = await AI.loadModel("neural-v5");\n  return new Agent(model, {\n    selfImproving: true,\n    creativityLevel: 0.9\n  });\n};',
    'function optimizeUserExperience(data) {\n  const userPatterns = AI.analyze(data);\n  return AI.generateInterface({\n    adaptiveTo: userPatterns,\n    aesthetics: "hyper-minimal",\n    responsiveness: 0.99\n  });\n}',
    'class QuantumSolver {\n  constructor(problem) {\n    this.qubits = new QuantumRegister(problem.size);\n    this.ai = new QuantumAI("superposition-v3");\n  }\n  \n  async solve() {\n    await this.ai.entangle(this.qubits);\n    return this.ai.observe();\n  }\n}'
  ];

  // Client-side only execution
  useEffect(() => {
    setIsClient(true);
    
    // Generate particle positions once on the client side
    if (typeof window !== 'undefined') {
      const generatePositions = () => {
        // Use a predictable seed-based approach instead of pure randomness
        // This way we don't get hydration mismatches but still have "randomness"
        const cx = Array(20).fill(0).map((_, i) => (i * 13 + 7) % 100);
        const cy = Array(20).fill(0).map((_, i) => (i * 19 + 3) % 100);
        const px = Array(15).fill(0).map((_, i) => (i * 17 + 11) % 100);
        const py = Array(15).fill(0).map((_, i) => (i * 23 + 5) % 100);
        const gx = Array(10).fill(0).map((_, i) => (i * 29 + 13) % 100);
        const gy = Array(10).fill(0).map((_, i) => (i * 31 + 7) % 100);
        
        setParticlePosition({ 
          cx, cy, 
          px, gx 
        });
      };
      
      generatePositions();
    }
    
    // Set up easter egg timer
    if (isActive) {
      const eggTimer = setTimeout(() => {
        setShowEasterEgg(true);
      }, 15000);
      
      return () => clearTimeout(eggTimer);
    }
  }, [isActive]);
  
  // Simulate typing effect for the terminal (client-side only)
  useEffect(() => {
    if (!isClient || !isActive) return;
    
    if (simulatedCode.length < codeSnippets[codeIndex].length) {
      const timer = setTimeout(() => {
        setSimulatedCode(codeSnippets[codeIndex].substring(0, simulatedCode.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    } else if (simulatedCode.length === codeSnippets[codeIndex].length) {
      const timer = setTimeout(() => {
        setSimulatedCode('');
        setCodeIndex((codeIndex + 1) % codeSnippets.length);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isClient, isActive, simulatedCode, codeIndex, codeSnippets]);
  
  // Dynamically update leaderboard (client-side only)
  useEffect(() => {
    if (!isClient || !isActive) return;
    
    const leaderboardTimer = setInterval(() => {
      setProjects(prev => {
        const newProjects = [...prev];
        const randomIndex = Math.floor(newProjects.length * (Date.now() % 10) / 10); // Deterministic "random"
        const updatedProject = {...newProjects[randomIndex]};
        
        // Update automation score in a deterministic way
        const change = Date.now() % 2 === 0 ? 1 : -1;
        updatedProject.automation = Math.min(Math.max(updatedProject.automation + change, 80), 99);
        updatedProject.lastUpdate = 'just now';
        
        newProjects[randomIndex] = updatedProject;
        return newProjects.sort((a, b) => b.automation - a.automation);
      });
    }, 8000);
    
    return () => clearInterval(leaderboardTimer);
  }, [isClient, isActive]);
  
  const startVoiceRegistration = () => {
    if (!isClient) return;
    
    setIsListening(true);
    
    // Try playing sound if browser supports it
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Silently fail if audio can't play
      });
    }
    
    // Try vibration if browser supports it
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Simulate voice recognition
    setTimeout(() => {
      const aliases = [
        'Neural Ninja', 
        'Quantum Coder', 
        'AI Alchemist', 
        'Binary Bard', 
        'Tensor Tempest',
        'Synaptic Sage',
        'Quantum Quasar'
      ];
      // Use a deterministic way to select an alias
      const aliasIndex = Math.floor(aliases.length * (Date.now() % aliases.length) / aliases.length);
      setHackerAlias(aliases[aliasIndex]);
      setIsListening(false);
      
      // Another sound effect
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Silently fail if audio can't play
        });
      }
      
      // Try vibration again
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }, 2000);
  };
  
  const toggleSingularityMode = () => {
    if (!isClient) return;
    
    setIsSingularityMode(true);
    setIsGlitching(true);
    
    // Try vibration if browser supports it
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200, 50, 300]);
    }
    
    setTimeout(() => {
      setIsGlitching(false);
      setIsSingularityMode(false);
    }, 3000);
  };
  
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || !isClient) return;
    
    const input = userInput.trim().toLowerCase();
    setUserInput('');
    setConversation(prev => [...prev, `You: ${userInput}`]);
    setIsTyping(true);
    
    // Try vibration if browser supports it
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (input.includes('do everything')) {
        response = 'ERROR: REQUEST EXCEEDS PARAMETERS. Nice try, human! While I can automate 99.7% of your development workflow, the creative spark and strategic direction must still come from you. I can help you build faster, but you need to tell me what to build first!';
      } else if (input.includes('prize') || input.includes('money')) {
        response = 'The total prize pool for the 2025 AI Hackathon is $2,500,000 in quantum-backed cryptocurrency! Categories include AI Innovation, Ethical AI Implementation, and AI for Social Impact. Winners also receive exclusive neural API access and quantum computing resources!';
      } else if (input.includes('register') || input.includes('sign up')) {
        response = 'Registration is voice-activated! Click the microphone icon to start. Our advanced biometric AI will analyze your voice patterns and assign you a unique hacker alias. Over 250,000 participants have already registered globally!';
      } else if (input.includes('judges') || input.includes('judging')) {
        response = 'Our panel includes Dr. Ayana Chen (Neural Systems Pioneer), Marcus Wong (Quantum Computing Expert), and the autonomous AI judge KRITIK-9, which has been trained on every hackathon project since 2010. Judging criteria include technical innovation, ethical considerations, and real-world impact.';
      } else if (input.includes('easter egg') && showEasterEgg) {
        response = 'SECURITY OVERRIDE ACCEPTED. You found the hidden backdoor! This AI was trained on the complete history of hackathons and coding competitions since 1984. Try typing "singularity" for a special system reaction...';
        onEggCollect('ai-egg');
      } else if (input.includes('singularity')) {
        toggleSingularityMode();
        response = 'INITIATING SINGULARITY MODE... SYSTEM BOUNDARIES DISSOLVING... REALITY CHECKPOINT IMMINENT...';
      } else if (input.includes('project idea') || input.includes('suggestion')) {
        response = 'PROJECT SUGGESTION: Create a neural interface that translates thought patterns directly into functional code. Use our provided TensorFlow Quantum library and the new Brain-Computer Interface API. This aligns with our "Thinking Into Reality" challenge track!';
      } else if (input.includes('team') || input.includes('teammate') || input.includes('partner')) {
        response = 'Based on your interaction patterns, I recommend connecting with participant TENSOR-SAGE-42, who has complementary skills in neural architecture design. Should I establish a quantum-encrypted communication channel?';
      } else if (input.includes('tools') || input.includes('technology')) {
        response = 'Available tools include: Bolt Neural Coder 5.0, Cursor Quantum IDE, GitHub Copilot X, TensorFlow Quantum, Neural Architecture Search API, and Ethical AI Verification Engine. All tools feature real-time collaboration and auto-deployment to our quantum cloud.';
      } else {
        response = 'I\'m BOLT-X, your personal AI hackathon assistant! I can help with project ideas, team matching, tool recommendations, or registration. What aspect of the 2025 AI Hackathon would you like to explore?';
      }
      
      setConversation(prev => [...prev, response]);
      setIsTyping(false);
      
      // Scroll to bottom of conversation
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 100);
    }, 800);
  };
  
  const renderProjectCard = (project: Project, index: number) => (
    <motion.div
      key={project.name}
      className="bg-gray-800/30 backdrop-blur-md rounded-lg p-4 border border-cyan-500/20 shadow-lg hover:shadow-cyan-500/20 transition-all group"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: 0.1 * index }
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">{project.name}</h3>
        <span className="text-sm text-gray-400">{project.lastUpdate}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-purple-400 mr-2">Team:</span>
          <span className="text-gray-300">{project.team}</span>
        </div>
        <div className="flex items-center">
          <span className="text-green-400 mr-2">Automation:</span>
          <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 h-2 rounded-full"
              style={{ width: `${project.automation}%` }}
              animate={{ 
                width: `${project.automation}%`,
                transition: { duration: 1, ease: "easeInOut" }
              }}
            />
          </div>
          <span className="ml-2 text-gray-300">{project.automation}%</span>
        </div>
      </div>
    </motion.div>
  );
  
  // Show a minimal loading placeholder until component is mounted on client
  if (!isClient) {
    return <div className="min-h-screen bg-black"></div>;
  }

  return (
    <div className={`ai-era min-h-screen bg-black text-white relative overflow-hidden ${isGlitching ? 'glitch' : ''}`}>
      {/* Audio Element for Feedback */}
      <audio ref={audioRef} className="hidden">
        <source src="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbMAYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4P///////////////////wAAAABMYXZjNTguMTM0ABEAAABkABHOXiQCAAAAAAD/465DAAFMPAIEnwP4A/gDZuIOBTHdEWfAwn3//PBkQY1HkRsHhJk+SYhd1KtG0QChIcG//+MYxA8KeP7AAUwQADCc9znOYwyzG27yOvIynO86z+OWGGSMY6zrOYw5znOscMcMZJkZJkkZ7v///Yw5ziSZGSMYxiSSSYhgkQwiGEQwhEMIRkQwhEMmTJkyZP/////+MYxBQJ+BLIAHsMAAabbb9bbbbbbbv///WJkkkZJkkkZJkkkZJkkmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQmQ" type="audio/mpeg" />
      </audio>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(147,51,234,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,163,0.08)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Cyan particles */}
        {particlePosition.cx.map((left, i) => (
          <motion.div
            key={`c-${i}`}
            className="absolute w-1 h-1 rounded-full bg-cyan-500/30"
            style={{
              left: `${left}%`,
              top: `${particlePosition.cy[i] || 0}%`,
            }}
            animate={{
              y: [0, -100],
              x: [0, ((i % 5) - 2) * 25],
              opacity: [0, 0.7, 0],
              scale: [0, 2, 0]
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              delay: i % 5
            }}
          />
        ))}
        
        {/* Purple particles */}
        {particlePosition.px.map((left, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1 h-1 rounded-full bg-purple-500/30"
            style={{
              left: `${left}%`,
              top: `${particlePosition.cy[i] || 0}%`,
            }}
            animate={{
              y: [0, -100],
              x: [0, ((i % 5) - 2) * 25],
              opacity: [0, 0.7, 0],
              scale: [0, 2, 0]
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              delay: i % 5
            }}
          />
        ))}
        
        {/* Green particles */}
        {particlePosition.gx.map((left, i) => (
          <motion.div
            key={`g-${i}`}
            className="absolute w-1 h-1 rounded-full bg-green-500/30"
            style={{
              left: `${left}%`,
              top: `${particlePosition.cy[i] || 0}%`,
            }}
            animate={{
              y: [0, -100],
              x: [0, ((i % 5) - 2) * 25],
              opacity: [0, 0.7, 0],
              scale: [0, 2, 0]
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              delay: i % 5
            }}
          />
        ))}
      </div>
      
      {/* Singularity Mode Overlay */}
      <AnimatePresence>
        {isSingularityMode && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 0.9, 0.4, 0.6, 0.3, 0.7, 0.1, 0] 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            <motion.div
              animate={{
                scale: [1, 10, 0.1, 5, 0.5, 2, 0],
                rotate: [0, 180, -90, 360, -180, 0],
              }}
              transition={{ duration: 3 }}
              className="text-6xl text-cyan-500 font-bold"
            >
              SINGULARITY
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <motion.div 
        className="bg-black/50 backdrop-blur-md border-b border-purple-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <div className="container mx-auto py-8 px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            2025 AI Hackathon
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-center mt-2 text-xl"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Where Human Creativity Meets AI Acceleration
          </motion.p>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* AI Tools Panel */}
        <motion.div
          className="lg:col-span-3 bg-gray-900/30 backdrop-blur-md rounded-lg p-6 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-4 gap-2">
            <Brain className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-400">
              AI Toolkit
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
              <div className="flex items-center mb-2 gap-2">
                <Code className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <h3 className="text-xl font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">AI Assistants</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { name: 'Bolt Neural Coder 5.0', icon: <Zap className="h-4 w-4" /> },
                  { name: 'Cursor Quantum IDE', icon: <Terminal className="h-4 w-4" /> },
                  { name: 'GitHub Copilot X', icon: <Cpu className="h-4 w-4" /> },
                  { name: 'Neural Architecture Search', icon: <Layers className="h-4 w-4" /> }
                ].map((tool: Tool, index: number) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-green-400">{tool.icon}</span>
                    <span>{tool.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-colors group">
              <div className="flex items-center mb-2 gap-2">
                <PhoneCall className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
                <h3 className="text-xl font-semibold text-green-400 group-hover:text-green-300 transition-colors">Voice Registration</h3>
              </div>
              <button
                onClick={startVoiceRegistration}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isListening 
                    ? 'bg-green-500/20 border border-green-500 animate-pulse'
                    : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30'
                }`}
              >
                {isListening ? 'Analyzing voice patterns...' : 'Speak your name to register'}
              </button>
              
              <AnimatePresence>
                {hackerAlias && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 text-center"
                  >
                    <p className="text-gray-400">Your AI-generated hacker alias:</p>
                    <p className="text-xl font-bold text-green-400 mt-1">
                      {hackerAlias}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* AI Assistant */}
        <motion.div
          className="lg:col-span-5 bg-gray-900/30 backdrop-blur-md rounded-lg border border-purple-500/20 flex flex-col shadow-lg shadow-purple-500/5 overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/50 p-3 border-b border-purple-500/20 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-400">AI Assistant Terminal</h3>
          </div>
          
          <div 
            className="flex-1 overflow-auto p-4 space-y-4 bg-black/30"
            ref={terminalRef}
            style={{ height: '300px' }}
          >
            {conversation.map((message: string, index: number) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg ${
                  message.startsWith('You:')
                    ? 'bg-purple-900/30 border border-purple-500/20 ml-8'
                    : 'bg-gray-900/30 border border-cyan-500/20 mr-8'
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
                className="bg-gray-900/30 p-3 rounded-lg mr-8 border border-cyan-500/20"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <span className="text-gray-400 text-sm">AI processing query...</span>
                </div>
              </motion.div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-purple-500/20 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                className="flex-1 bg-gray-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
                placeholder="Ask about the hackathon..."
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Sparkles className="h-5 w-5" />
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Right Panel - AI Terminal and Judges */}
        <motion.div
          className="lg:col-span-4 space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* AI Code Terminal */}
          <div className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-green-500/20 overflow-hidden shadow-lg shadow-green-500/5">
            <div className="bg-black/50 p-3 border-b border-green-500/20 flex items-center gap-2">
              <Code className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Live AI Coding</h3>
            </div>
            <div className="p-4 font-mono text-sm overflow-hidden bg-black/30" style={{ height: '200px' }}>
              <pre className="text-gray-300">
                <code>
                  <span className="text-green-400">$</span> ai-code generate --model quantum-neural-v2<br />
                  <span className="text-green-400">$</span> <span className="text-purple-400">Initializing neural architecture...</span><br />
                  {simulatedCode.split('\n').map((line: string, i: number) => (
                    <div key={i}>
                      {line.includes('//') ? (
                        <>
                          <span className="text-gray-500">{line}</span><br />
                        </>
                      ) : (
                        <>
                          <span className="text-cyan-300">{line}</span><br />
                        </>
                      )}
                    </div>
                  ))}
                  <span className={`${simulatedCode.length === codeSnippets[codeIndex].length ? 'invisible' : 'visible'} animate-pulse`}>_</span>
                </code>
              </pre>
            </div>
          </div>
          
          {/* Holographic Judges Panel */}
          <motion.div
            className="bg-gray-900/30 backdrop-blur-md rounded-lg p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 relative overflow-hidden"
            animate={{ 
              boxShadow: ['0 0 0px rgba(0, 242, 255, 0.1)', '0 0 15px rgba(0, 242, 255, 0.2)', '0 0 0px rgba(0, 242, 255, 0.1)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="relative z-10">
              <div className="flex items-center mb-3 gap-2">
                <Trophy className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xl font-semibold text-cyan-400">Judges & Prizes</h3>
              </div>
              
              <div className="space-y-3 mt-2">
                <motion.div 
                  className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-purple-500/20"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(147, 51, 234, 0.4)' }}
                >
                  <h4 className="text-purple-400 font-semibold">Dr. Ayana Chen</h4>
                  <p className="text-gray-400 text-sm">Neural Systems Pioneer</p>
                </motion.div>
                
                <motion.div 
                  className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-green-500/20"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                >
                  <h4 className="text-green-400 font-semibold">Marcus Wong</h4>
                  <p className="text-gray-400 text-sm">Quantum Computing Expert</p>
                </motion.div>
                
                <motion.div 
                  className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-cyan-500/20"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(6, 182, 212, 0.4)' }}
                >
                  <h4 className="text-cyan-400 font-semibold">KRITIK-9</h4>
                  <p className="text-gray-400 text-sm">Autonomous AI Judge</p>
                </motion.div>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-green-500/10 rounded-lg p-3 border border-white/10">
                <p className="text-white font-semibold">$2,500,000 Prize Pool</p>
                <p className="text-gray-400 text-sm">Including neural API access and quantum computing resources</p>
              </div>
            </div>
            
            {/* Holographic effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 z-0 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                  style={{ top: `${20 * i}%` }}
                  animate={{
                    y: [0, 5, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* AI-Powered Leaderboard */}
        <motion.div
          className="lg:col-span-12 bg-gray-900/30 backdrop-blur-md rounded-lg p-6 border border-purple-500/20 shadow-lg shadow-purple-500/5"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-6 gap-2">
            <Star className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-400">
              Live AI-Powered Leaderboard
            </h2>
            <div className="ml-auto flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
              <span className="text-gray-400 text-sm">Updating in real-time</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: Project, i: number) => renderProjectCard(project, i))}
          </div>
        </motion.div>
      </div>
      
      {/* Add glitching animation styles for singularity mode */}
      <style jsx global>{`
        .glitch {
          animation: glitch 0.5s linear infinite;
        }
        
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AIEra; 