'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Web 2.0 Era Styles
const styles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes loading {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); }
    50% { box-shadow: 0 0 20px rgba(74, 144, 226, 0.8); }
  }

  .web2-button {
    background: linear-gradient(45deg, #4a90e2, #357abd);
    border: none;
    border-radius: 20px;
    color: white;
    padding: 10px 20px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .web2-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  .web2-button:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    background: linear-gradient(45deg, #357abd, #4a90e2);
  }

  .web2-button:hover::before {
    left: 100%;
  }

  .web2-card {
    background: linear-gradient(135deg, #ffffff, #f8f9fa);
    border-radius: 15px;
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  .web2-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4a90e2, #357abd);
    opacity: 0.8;
  }

  .web2-input {
    background: linear-gradient(to right, #ffffff, #f8f9fa);
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 12px;
    transition: all 0.3s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #1E2229;
  }

  .web2-input:focus {
    border-color: #4a90e2;
    box-shadow: 
      0 0 0 3px rgba(74, 144, 226, 0.2),
      inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .web2-avatar {
    border: 3px solid #ffffff;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .web2-loading {
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4a90e2;
    border-radius: 50%;
    animation: loading 1s linear infinite;
  }

  .web2-pulse {
    animation: pulse 2s infinite;
  }

  .web2-shine {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shine 2s infinite;
  }

  .web2-font {
    font-family: "Trebuchet MS", Arial, sans-serif;
    color: #1E2229;
  }

  .web2-gradient-text {
    background: linear-gradient(45deg, #1D2D5C, #3B5998);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .web2-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
  }

  .web2-social-button {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 15px;
    background: linear-gradient(45deg, #f8f9fa, #ffffff);
    border: 1px solid #e2e8f0;
    color: #4a90e2;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .web2-social-button:hover {
    background: linear-gradient(45deg, #ffffff, #f8f9fa);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  .web2-poll-bar {
    height: 12px;
    background: #edf0f5;
    border: 1px solid #d8dfea;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 6px;
  }

  .web2-poll-fill {
    height: 100%;
    background: linear-gradient(to right, #3b5998, #4a90e2);
    transition: width 0.5s ease-out;
    border-radius: 4px;
  }

  .web2-status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    background: linear-gradient(45deg, #4a90e2, #357abd);
    color: white;
    font-size: 0.875rem;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .web2-status-badge::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
    margin-right: 6px;
    box-shadow: 0 0 4px #4ade80;
  }

  .web2-poll-option {
    background: linear-gradient(to bottom, #ffffff, #f4f4f9);
    border: 1px solid #d8dfea;
    border-radius: 6px;
    padding: 8px 12px;
    transition: all 0.2s ease;
  }

  .web2-poll-option:hover {
    background: linear-gradient(to bottom, #f7f9fc, #e9f0fa);
    border-color: #4a90e2;
    box-shadow: 0 1px 2px rgba(65, 132, 234, 0.2);
    transform: translateY(-1px);
  }
`;

interface Web2EraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

interface Profile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  status: string;
  likes: number;
  friends: number;
  posts: number;
}

interface Post {
  id: string;
  profileId: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isSponsored: boolean;
  commentsList?: Comment[];
  showCommentForm?: boolean;
}

interface Comment {
  id: string;
  profileId: string;
  content: string;
  timestamp: Date;
  likes: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Judge {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  likes: number;
}

interface Prize {
  id: string;
  title: string;
  description: string;
  value: string;
  sponsor: string;
  likes: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

const Web2Era: React.FC<Web2EraProps> = ({ onEggCollect, isActive }) => {
  // Client-side only flag
  const [isClient, setIsClient] = useState(false);

  // State management
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      profileId: 'system',
      content: "Can't wait to build something amazing! 🚀",
      timestamp: new Date(2023, 5, 15, 10, 30), // Fixed date to avoid hydration issues
      likes: 42,
      comments: 12,
      shares: 5,
      isSponsored: false,
    },
    {
      id: '2',
      profileId: 'system',
      content: "My code broke, send help! 😭",
      timestamp: new Date(2023, 5, 15, 9, 45), // Fixed date to avoid hydration issues
      likes: 28,
      comments: 8,
      shares: 2,
      isSponsored: false,
    },
    {
      id: '3',
      profileId: 'system',
      content: "Did you guys see the grand prize?! $1M OMG!",
      timestamp: new Date(2023, 5, 15, 8, 15), // Fixed date to avoid hydration issues
      likes: 156,
      comments: 45,
      shares: 23,
      isSponsored: false,
    },
  ]);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '👾 Virtual Reality (VR)', votes: 0, percentage: 0 },
    { id: '2', text: '🤖 AI & Robotics', votes: 0, percentage: 0 },
    { id: '3', text: '📡 5G & Mobile Revolution', votes: 0, percentage: 0 },
    { id: '4', text: '🌐 Web 3.0 & Decentralization', votes: 0, percentage: 0 },
  ]);
  const [judges, setJudges] = useState<Judge[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Tech Innovation Lead',
      bio: 'Former startup founder turned tech evangelist. Passionate about fostering the next generation of innovators.',
      avatar: '/judges/sarah.jpg',
      likes: 1234,
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'AI Research Director',
      bio: 'Leading AI research at major tech companies. Believes in ethical AI development.',
      avatar: '/judges/michael.jpg',
      likes: 987,
    },
  ]);
  const [prizes, setPrizes] = useState<Prize[]>([
    {
      id: '1',
      title: 'Grand Prize',
      description: 'A chance to pitch your project to leading VCs',
      value: '$1,000,000',
      sponsor: 'TechVentures',
      likes: 5678,
    },
    {
      id: '2',
      title: 'Innovation Award',
      description: 'Latest gadgets and development tools',
      value: '$50,000',
      sponsor: 'InnovateCorp',
      likes: 2345,
    },
  ]);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [showPokeModal, setShowPokeModal] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [users] = useState<User[]>([
    { id: '1', name: 'CodeNinja', avatar: 'ninja', status: 'Coding...' },
    { id: '2', name: 'WebWizard', avatar: 'wizard', status: 'Building the future' },
    { id: '3', name: 'ByteMaster', avatar: 'byte', status: 'Debugging...' },
    { id: '4', name: 'PixelPro', avatar: 'pixel', status: 'Designing UI' },
    { id: '5', name: 'DataDiva', avatar: 'data', status: 'Processing data' },
    { id: '6', name: 'CloudKing', avatar: 'cloud', status: 'Deploying...' },
    { id: '7', name: 'ScriptQueen', avatar: 'script', status: 'Writing code' },
    { id: '8', name: 'DevDude', avatar: 'dev', status: 'Committing changes' },
  ]);
  const [commentText, setCommentText] = useState('');
  const [votedOptions, setVotedOptions] = useState<Set<string>>(new Set());

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Inject Web 2.0 styles - client-side only
  useEffect(() => {
    if (!isClient) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isClient]);

  // Auto-update feed with random posts - client-side only
  useEffect(() => {
    if (!isClient || showProfileForm) return;
    
    const interval = setInterval(() => {
      setIsFeedLoading(true);
      const randomUser = getRandomUser();
      const newPost: Post = {
        id: Date.now().toString(),
        profileId: randomUser.id,
        content: getRandomPostContent(),
        timestamp: getRandomTimestamp(),
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        shares: Math.floor(Math.random() * 10),
        isSponsored: false,
      };

      setTimeout(() => {
        setPosts(prev => [newPost, ...prev].slice(0, 10));
        setIsFeedLoading(false);
      }, 1000); // Simulate network delay
    }, 30000); // Add new post every 30 seconds

    return () => clearInterval(interval);
  }, [isClient, showProfileForm]);

  // Format timestamp in Web 2.0 style - client-side only
  const formatTimestamp = (date: Date) => {
    if (!isClient) return date.toLocaleDateString(); // Use stable format for server

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Generate random user
  const getRandomUser = () => {
    return users[Math.floor(Math.random() * users.length)];
  };

  // Generate random post content
  const getRandomPostContent = () => {
    const contents = [
      "Just pushed my latest commit! 🚀",
      "Need help with this bug... 😅",
      "Coffee break! ☕️",
      "Who's up for a coding session? 💻",
      "Found a bug, debugging... 🐛",
      "Team meeting in 5! 👥",
      "Pizza time! 🍕",
      "Just pushed to GitHub! 📤",
      "My code is finally working! 🎉",
      "Anyone know a good React tutorial? 📚",
      "Late night coding session! 🌙",
      "Just discovered a new framework! 🔥",
      "Need more coffee... ☕️☕️",
      "Pair programming anyone? 👥",
      "My IDE is acting up... 😤",
      "Just fixed a major bug! 🎯",
      "Time for a code review! 👀",
      "My keyboard is on fire! 🔥",
      "Anyone else love TypeScript? 💙",
      "Just learned a new design pattern! 🎨",
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  };

  // Generate random timestamp within the last 24 hours
  const getRandomTimestamp = () => {
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    return new Date(now.getTime() - (randomHours * 60 + randomMinutes) * 60000);
  };

  // Simulate AJAX loading states
  const simulateLoading = async (action: () => void) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    action();
    setIsLoading(false);
  };

  // Handle profile customization (MySpace-style)
  const handleCustomizeProfile = (e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    setError("Too much HTML/CSS applied! Your profile might break!");
    setTimeout(() => setError(null), 3000);
    onEggCollect('web2-egg-1');
  };

  // Handle friend request
  const handleFriendRequest = (judgeId: string, e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    simulateLoading(() => {
      setError("Friend request pending... (This is a demo)");
      setTimeout(() => setError(null), 3000);
      onEggCollect('web2-egg-2');
    });
  };

  // Handle share post
  const handleSharePost = (postId: string, e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    simulateLoading(() => {
      setError("Post shared to your wall! (This is a demo)");
      setTimeout(() => setError(null), 3000);
      onEggCollect('web2-egg-3');
    });
  };

  // Handle comment on post
  const handleComment = (postId: string, e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            showCommentForm: !post.showCommentForm,
            commentsList: post.commentsList || []
          } 
        : post
    ));
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    
    simulateLoading(() => {
      if (Math.random() > 0.7) { 
        setError("Error: Comment failed to post. Please try again later!");
        setTimeout(() => setError(null), 3000);
        onEggCollect('web2-egg-4');
        return;
      }
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const randomId = Math.random().toString(36).substring(2, 9);
          const newComment: Comment = {
            id: randomId,
            profileId: profile?.id || 'system',
            content,
            timestamp: new Date(),
            likes: 0
          };
          
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), newComment]
          };
        }
        return post;
      }));
      
      setCommentText('');
      onEggCollect('web2-egg-4');
    });
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    addComment(postId, commentText);
  };

  const handleCommentLike = (postId: string, commentId: string, e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    // Play Facebook like sound with error handling
    try {
      const audio = new Audio('/sounds/facebook-like.mp3');
      audio.play().catch(() => {
        // Silently fail if audio can't play
        console.log('Audio playback not available');
      });
    } catch (error) {
      // Silently fail if audio creation fails
      console.log('Audio creation not available');
    }

    setPosts(posts.map(post => {
      if (post.id === postId && post.commentsList) {
        return {
          ...post,
          commentsList: post.commentsList.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes + 1 } 
              : comment
          )
        };
      }
      return post;
    }));
  };

  // Helper functions
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      avatar: formData.get('avatar') as string,
      bio: formData.get('bio') as string,
      status: formData.get('status') as string,
      likes: 0,
      friends: 0,
      posts: 0,
    };
    setProfile(newProfile);
    setShowProfileForm(false);
  };

  const handleLike = (id: string, type: 'post' | 'judge' | 'prize', e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    // Update likes count
    switch (type) {
      case 'post':
        setPosts(posts.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
        break;
      case 'judge':
        setJudges(judges.map(judge =>
          judge.id === id ? { ...judge, likes: judge.likes + 1 } : judge
        ));
        break;
      case 'prize':
        setPrizes(prizes.map(prize =>
          prize.id === id ? { ...prize, likes: prize.likes + 1 } : prize
        ));
        break;
    }

    // Try to play sound, but don't show errors if it fails
    try {
      const audio = new Audio('/sounds/facebook-like.mp3');
      audio.play().catch(() => {
        // Silently fail if audio can't play
        console.log('Audio playback not available');
      });
    } catch (error) {
      // Silently fail if audio creation fails
      console.log('Audio creation not available');
    }
  };

  const handlePollVote = (optionId: string, e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    // Show visual feedback that the vote was recorded
    setIsLoading(true);
    
    // Add to voted options to track user's votes
    setVotedOptions(prev => new Set(prev).add(optionId));
    
    setTimeout(() => {
      setPollOptions(options => {
        // First update the votes for the selected option
        const updatedOptions = options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        
        // Then calculate the percentages based on the new total
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
        return updatedOptions.map(opt => ({
          ...opt,
          percentage: totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0
        }));
      });
      setIsLoading(false);
    }, 400);
  };

  const handlePoke = (e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    setShowPokeModal(true);
    onEggCollect('web2-egg-6');
  };

  const handlePokeBack = () => {
    setShowPokeModal(false);
    // Do nothing (classic Facebook poke behavior)
  };

  const handleIgnore = () => {
    setShowPokeModal(false);
    setError("You can't ignore the Hackathon Bot!");
    setTimeout(() => setError(null), 3000);
  };

  const handleMusicPlayer = (e?: React.MouseEvent) => {
    // Prevent default browser behavior
    e?.preventDefault();
    
    setShowMusicPlayer(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Silently fail if audio can't play
        console.log('Profile song playback not available');
      });
      onEggCollect('web2-egg-5');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-teal-100 p-4 web2-font">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold web2-gradient-text mb-2">Hackathon 2000s</h1>
          <p className="text-[#333333]">Join the Web 2.0 Revolution!</p>
        </div>

        {/* Profile Form */}
        <AnimatePresence>
          {showProfileForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="web2-card p-6 mb-8"
            >
              <h2 className="text-2xl font-bold web2-gradient-text mb-4">Create Your Profile</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#333333] mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="web2-input w-full text-[#1E2229]"
                  />
                </div>
                <div>
                  <label className="block text-[#333333] mb-2">Avatar Style</label>
                  <select
                    name="avatar"
                    required
                    className="web2-input w-full text-[#1E2229]"
                  >
                    <option value="pixel">👾 Pixel Art</option>
                    <option value="anime">🎭 Anime</option>
                    <option value="corporate">👔 Corporate</option>
                    <option value="default">👤 Default</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#333333] mb-2">Bio</label>
                  <textarea
                    name="bio"
                    required
                    className="web2-input w-full text-[#1E2229]"
                    placeholder="Hacker since 2005 | JavaScript Ninja | Loves Clippy"
                  />
                </div>
                <div>
                  <label className="block text-[#333333] mb-2">Status</label>
                  <input
                    type="text"
                    name="status"
                    required
                    className="web2-input w-full text-[#1E2229]"
                    placeholder="Currently debugging..."
                  />
                </div>
                <button
                  type="submit"
                  className="web2-button w-full"
                >
                  Create Profile
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile & Poll */}
          <div className="space-y-6">
            {profile && (
              <div className="web2-card p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full web2-avatar flex items-center justify-center bg-blue-200 text-2xl"
                  >
                    {profile.avatar === 'pixel' && '👾'}
                    {profile.avatar === 'anime' && '🎭'}
                    {profile.avatar === 'corporate' && '👔'}
                    {profile.avatar === 'default' && '👤'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg web2-gradient-text">{profile.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="web2-status-badge">Online</span>
                      <p className="text-[#333333]">{profile.status}</p>
                    </div>
                  </div>
                </div>
                <p className="text-[#1E2229] mb-4">{profile.bio}</p>
                <div className="flex justify-between text-sm text-[#555555]">
                  <span>{profile.friends} Friends</span>
                  <span>{profile.posts} Posts</span>
                  <span>{profile.likes} Likes</span>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMusicPlayer(e);
                      return false;
                    }}
                    className="web2-button w-full"
                  >
                    <span className="mr-2">🎵</span> Set Profile Song
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCustomizeProfile(e);
                      return false;
                    }}
                    className="web2-button w-full bg-purple-500 hover:bg-purple-600"
                  >
                    <span className="mr-2">🎨</span> Customize My Profile
                  </button>
                </div>
              </div>
            )}

            {/* Poll Section */}
            <div className="web2-card p-4">
              <h3 className="font-bold text-lg web2-gradient-text mb-4">What Tech Will Dominate the Next Decade?</h3>
              {isLoading && (
                <div className="text-center my-2">
                  <div className="web2-loading-indicator mx-auto"></div>
                  <p className="text-sm text-[#3B5998] font-medium mt-1">Recording vote...</p>
                </div>
              )}
              <div className="space-y-3">
                {pollOptions.map(option => (
                  <div key={option.id} className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePollVote(option.id, e);
                        return false;
                      }}
                      className={`w-full text-left p-2 rounded-lg web2-poll-option ${votedOptions.has(option.id) ? 'border-[#3B5998] bg-[#f7f9ff]' : ''}`}
                      disabled={isLoading}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[#1E2229] font-medium">{option.text}</span>
                        <span className="text-[#3B5998] font-bold">{option.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="web2-poll-bar">
                        <div
                          className="web2-poll-fill"
                          style={{ width: `${Math.max(option.percentage, 3)}%` }}
                        />
                      </div>
                    </button>
                  </div>
                ))}
                <div className="mt-2 text-xs text-[#555555] text-right">
                  Total votes: {pollOptions.reduce((sum, opt) => sum + opt.votes, 0)}
                </div>
              </div>
            </div>

            {/* Poke Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePoke(e);
                return false;
              }}
              className="web2-button w-full bg-pink-500 hover:bg-pink-600"
            >
              <span className="mr-2">👉</span> Poke Hackathon Bot
            </button>
          </div>

          {/* Middle Column - Social Feed */}
          <div className="md:col-span-2">
            <div className="web2-card p-4">
              <h3 className="font-bold text-lg web2-gradient-text mb-4">Hackathon Feed</h3>
              <div ref={feedRef} className="space-y-4">
                {isClient && isFeedLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-4"
                  >
                    <div className="web2-loading" />
                  </motion.div>
                )}
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={isClient ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: isClient ? index * 0.1 : 0 }}
                    className="border-b pb-4"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full web2-avatar bg-blue-200"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {post.profileId === 'system' ? 'HB' : users.find(u => u.id === post.profileId)?.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-bold web2-gradient-text">
                        {post.profileId === 'system' ? 'Hackathon Bot' : users.find(u => u.id === post.profileId)?.name}
                      </span>
                      <span className="text-[#555555] text-sm">
                        {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                    <p className="text-[#1E2229] mb-2">{post.content}</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLike(post.id, 'post', e);
                          return false;
                        }}
                        className="web2-social-button"
                      >
                        <span className="mr-2">👍</span>
                        Like ({post.likes})
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleComment(post.id, e);
                          return false;
                        }}
                        className="web2-social-button"
                      >
                        <span className="mr-2">💬</span>
                        Comment ({post.comments})
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSharePost(post.id, e);
                          return false;
                        }}
                        className="web2-social-button"
                      >
                        <span className="mr-2">🔄</span>
                        Share ({post.shares})
                      </button>
                    </div>
                    
                    {/* Comments Section */}
                    {post.commentsList && post.commentsList.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <h4 className="text-sm text-[#555555] mb-2">Comments</h4>
                        <div className="space-y-2">
                          {post.commentsList.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-full web2-avatar bg-blue-200 flex items-center justify-center text-xs"
                                >
                                  {comment.profileId === 'system' ? 'HB' : users.find(u => u.id === comment.profileId)?.name?.charAt(0) || '?'}
                                </div>
                                <span className="font-bold text-sm text-[#1E2229]">
                                  {comment.profileId === 'system' ? 'Hackathon Bot' : profile?.name}
                                </span>
                                <span className="text-[#555555] text-xs">
                                  {formatTimestamp(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-[#1E2229] my-1">{comment.content}</p>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCommentLike(post.id, comment.id, e);
                                  return false;
                                }}
                                className="text-xs text-blue-500 hover:text-blue-700"
                              >
                                Like ({comment.likes})
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Comment Form */}
                    {post.showCommentForm && (
                      <div className="mt-3">
                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                          <div 
                            className="w-6 h-6 rounded-full web2-avatar bg-blue-200 flex-shrink-0"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {profile ? profile.name.charAt(0) : '?'}
                          </div>
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="web2-input flex-grow text-sm px-3 py-1 text-[#1E2229]"
                            placeholder="Write a comment..."
                          />
                          <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="web2-button px-3 py-1 text-sm"
                          >
                            Post
                          </button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Judges Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold web2-gradient-text mb-4">Our Judges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {judges.map(judge => (
              <div key={judge.id} className="web2-card p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full web2-avatar bg-indigo-200 flex items-center justify-center text-xl font-bold"
                  >
                    {judge.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg web2-gradient-text">{judge.name}</h3>
                    <p className="text-[#333333]">{judge.title}</p>
                  </div>
                </div>
                <p className="text-[#1E2229] mb-4">{judge.bio}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(judge.id, 'judge', e);
                      return false;
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <span className="mr-2">👍</span> Like ({judge.likes})
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFriendRequest(judge.id, e);
                      return false;
                    }}
                    className="web2-button"
                  >
                    <span className="mr-2">👋</span> Add Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prizes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold web2-gradient-text mb-4">Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prizes.map(prize => (
              <div key={prize.id} className="web2-card p-4">
                <h3 className="font-bold text-lg web2-gradient-text mb-2">{prize.title}</h3>
                <p className="text-[#1E2229] mb-2">{prize.description}</p>
                <p className="text-[#3B5998] font-bold mb-4">{prize.value}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#333333]">Sponsored by {prize.sponsor}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(prize.id, 'prize', e);
                      return false;
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <span className="mr-2">👍</span> Like ({prize.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="web2-loading" />
        </div>
      )}

      {/* Poke Modal */}
      <AnimatePresence>
        {showPokeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="web2-card p-6 max-w-md w-full">
              <h3 className="text-xl font-bold web2-gradient-text mb-4">You poked the Hackathon Bot!</h3>
              <p className="text-[#1E2229] mb-4">The Hackathon Bot has received your poke!</p>
              <div className="flex space-x-4">
                <button
                  onClick={handlePokeBack}
                  className="web2-button flex-1"
                >
                  <span className="mr-2">👉</span> Poke Back
                </button>
                <button
                  onClick={handleIgnore}
                  className="web2-button flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  <span className="mr-2">🙅</span> Ignore
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Player */}
      <audio 
        ref={audioRef} 
        src="/sounds/myspace-song.mp3" 
        loop 
        preload="none"
        onError={() => {
          console.log('Profile song not available');
        }}
      />
    </div>
  );
};

export default Web2Era; 