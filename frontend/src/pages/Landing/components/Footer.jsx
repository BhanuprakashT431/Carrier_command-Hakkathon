import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 pt-16 pb-8 relative z-10 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <span className="font-bold text-surface-900 dark:text-white transition-colors">Career Command</span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-xs transition-colors">
              A multi-agent AI system designed to analyze, stress-test, and adapt your career strategy.
            </p>
            <div className="flex gap-4 text-surface-400 dark:text-surface-500">
              <a href="https://x.com/akp63640" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Twitter</a>
              <a href="https://github.com/Abhishekkp-12345" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/abhishek-kp-?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">LinkedIn</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-surface-900 dark:text-white mb-4 transition-colors">Product</h4>
            <ul className="space-y-3 text-sm text-surface-500 dark:text-surface-400">
              <li><a href="#intelligence" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">9-Agent Intelligence</a></li>
              <li><a href="#simulation" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Career Simulator</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Evidence Verification</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Adaptive Roadmaps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-surface-900 dark:text-white mb-4 transition-colors">Resources</h4>
            <ul className="space-y-3 text-sm text-surface-500 dark:text-surface-400">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-surface-900 dark:text-white mb-4 transition-colors">Company</h4>
            <ul className="space-y-3 text-sm text-surface-500 dark:text-surface-400">
              <li><a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-surface-100 dark:border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          <span className="text-sm text-surface-400 dark:text-surface-500 transition-colors">
            © {new Date().getFullYear()} Career Command Center. All rights reserved.
          </span>
          <div className="flex items-center gap-2 text-sm text-surface-400 dark:text-surface-500 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  );
}
