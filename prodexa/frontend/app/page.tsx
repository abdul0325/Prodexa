'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/api';
import { 
  GitBranch, 
  Activity, 
  Brain, 
  Trophy, 
  ClipboardX, 
  EyeOff, 
  Layers, 
  Zap, 
  Monitor, 
  Package, 
  Server, 
  Database,
  Rocket
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Import landing page components
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { MLShowcaseSection } from '@/components/landing/MLShowcaseSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/projects');
    }
  }, [router]);

  // Data for all sections
  const statsData = [
    { value: '98.8%', label: 'Model Accuracy' },
    { value: '<2s', label: 'Analysis Time' },
    { value: '6', label: 'Core Modules' },
    { value: '100+', label: 'Real-time Updates' }
  ];

  const problemsData = [
    {
      icon: <ClipboardX size={44} />,
      title: 'Manual tracking wastes hours',
      description: 'Countless hours lost to copying data between spreadsheets and tools instead of focusing on what matters',
      color: '#ff6b6b'
    },
    {
      icon: <EyeOff size={44} />,
      title: 'No early warning system',
      description: 'Discovering critical issues when it\'s already too late, instead of preventing them before they impact delivery',
      color: '#ffb830'
    },
    {
      icon: <Layers size={44} />,
      title: 'Data scattered everywhere',
      description: 'Making crucial calls based on intuition rather than data-driven insights and predictive analytics',
      color: '#9d5bff'
    }
  ];

  const featuresData = [
    {
      icon: <GitBranch size={28} />,
      title: 'GitHub Integration',
      description: 'Seamlessly connect your repositories and automatically sync commits, PRs, and issues in real-time',
      color: '#5b7fff',
      gradient: 'linear-gradient(135deg, #5b7fff, #7c9dff)'
    },
    {
      icon: <Activity size={28} />,
      title: 'Real-time Dashboard',
      description: 'Monitor team productivity with live metrics, health scores, and performance trends updated instantly',
      color: '#06d6e0',
      gradient: 'linear-gradient(135deg, #06d6e0, #00c9cc)'
    },
    {
      icon: <Brain size={28} />,
      title: 'ML Risk Prediction',
      description: 'Advanced Random Forest AI algorithms predict delivery risks with 98.8% accuracy before they impact your timeline',
      color: '#9d5bff',
      gradient: 'linear-gradient(135deg, #9d5bff, #b47dff)'
    },
    {
      icon: <Trophy size={28} />,
      title: 'Developer Leaderboard',
      description: 'Track individual performance, celebrate top contributors, and foster healthy competition within your team',
      color: '#ffb830',
      gradient: 'linear-gradient(135deg, #ffb830, #ffc940)'
    },
    {
      icon: <Zap size={28} />,
      title: 'Smart Notifications',
      description: 'Get intelligent alerts for critical changes, risk factors, and milestones that need your attention',
      color: '#10e88a',
      gradient: 'linear-gradient(135deg, #10e88a, #00e076)'
    },
    {
      icon: <Monitor size={28} />,
      title: 'Admin Control Panel',
      description: 'Comprehensive admin dashboard for managing projects, users, and system settings with granular controls',
      color: '#ff6b6b',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff8787)'
    }
  ];

  const stepsData = [
    {
      number: 1,
      icon: <GitBranch size={32} />,
      title: 'Connect',
      description: 'Sign in with GitHub and select your repository. No setup required - we handle everything automatically.'
    },
    {
      number: 2,
      icon: <Zap size={32} />,
      title: 'Analyze',
      description: 'Prodexa fetches commits, PRs, and issues automatically, building a comprehensive project intelligence profile.'
    },
    {
      number: 3,
      icon: <Brain size={32} />,
      title: 'Predict',
      description: 'AI generates health scores, risk assessments, and developer insights that help you ship better, faster.'
    }
  ];

  const mlDemoData = [
    { developer: 'muneeb', score: 74.3, trend: 'Rising', risk: 'Low' },
    { developer: 'zain', score: 58.1, trend: 'Stable', risk: 'Medium' },
    { developer: 'shahzaib', score: 41.2, trend: 'Falling', risk: 'High' },
    { developer: 'moiz-ur-rehman', score: 65.2, trend: 'Rising', risk: 'low' }
  ];
const isDark = theme === 'dark';

  const techStackData = [
    {
      icon: <Package size={32} />,
      name: 'Next.js',
      role: 'Frontend Framework',
        color: isDark ? '#ffffff' : '#000000'
    },
    {
      icon: <Server size={32} />,
      name: 'NestJS',
      role: 'Backend API',
      color: '#e0234e'
    },
    {
      icon: <Zap size={32} />,
      name: 'FastAPI',
      role: 'ML Microservice',
      color: '#059669'
    },
    {
      icon: <Database size={32} />,
      name: 'PostgreSQL',
      role: 'Database',
      color: '#336791'
    },
    {
      icon: <Server size={32} />,
      name: 'Redis',
      role: 'Real-time Queue',
      color: '#d82c20'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <Navbar onThemeToggle={toggleTheme} />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Bar */}
      <StatsBar stats={statsData} />
      
      {/* Problem Section */}
      <ProblemSection 
        title="Project management is broken"
        subtitle="Stop wasting time on outdated workflows that drain productivity and obscure real insights."
        problems={problemsData}
      />
      
      {/* Features Section */}
      <FeaturesSection 
        title="Everything you need to run better projects"
        features={featuresData}
      />
      
      {/* How It Works Section */}
      <HowItWorksSection 
        title="Up and running in minutes"
        steps={stepsData}
      />
      
      {/* ML Showcase Section */}
      <MLShowcaseSection 
        badge="Powered by Random Forest AI"
        title="Predict delivery risk before it happens"
        points={[
          "Productivity score per developer (0–100)",
          "Delivery risk: Low / Medium / High",
          "Trend: Improving / Stable / Declining",
          "Real-time health score updates",
          "98.8% model accuracy on test data"
        ]}
        demoData={mlDemoData}
      />
      
      {/* Tech Stack Section */}
      <TechStackSection 
        title="Built with production-grade technology"
        techs={techStackData}
      />
      
      {/* CTA Section */}
      <CTASection 
        title="Start tracking your team's productivity today"
        subtitle="Join thousands of developers who are already shipping faster with AI-powered project intelligence."
        buttonText="Sign in with GitHub"
        note="Built by Abdul Rehman · CS Final Year Project 2026"
      />
      
      {/* Footer */}
      <Footer
  logo="Prodexa"
  tagline="AI-powered project intelligence"
  navLinks={[
    { label: 'Features', id: 'features-section' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Tech Stack', id: 'tech-stack' },
    { label: 'Dashboard', id: 'dashboard' },
  ]}
  techBadge="Next.js · NestJS · FastAPI · PostgreSQL · Redis"
  copyright="© 2026 Prodexa · Abdul Rehman"
  githubLink="https://github.com/abdul0325/Prodexa"
/>
    </div>
  );
}
