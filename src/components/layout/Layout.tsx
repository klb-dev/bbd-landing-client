import type { ReactNode } from 'react';
import { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy'; 
import { AnimatePresence, motion } from 'framer-motion';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const activeID = useScrollSpy(['hero', 'about', 'projects', 'contact'], 100);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-100 dark:bg-slate-900 shadow-sm">
        <nav className="max-w-7xl w-full mx-auto flex items-center justify-between px-[10px] p-4 bg-slate-100 font-bold">
          <img className="w-15" src="/images/BBD-Logo.webp" alt="Blue Byrd Development Logo" />

          {/* desktop nav */}
          <ul className="hidden md:flex gap-6 text-md">
            {[
              { id: 'path-to-soar', label: 'Path to Soar' },
              { id: 'sites-that-soar', label: 'Sites that Soar' },
              { id: 'lift-offs', label: 'Lift-Offs' },
              { id: 'send-signal', label: 'Send Signal' },
            ].map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`hover:text-[#285AA9] ${
                    activeID === id ? 'text-[#1A3D80] font-bold' : ''
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* hamburger button */}
          <button
            className={`md:hidden focus:outline-none z-50 transition-transform duration-200 ${
              menuOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100'
            }`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-[#285AA9] rounded"></span>
              <span className="block w-6 h-0.5 bg-[#285AA9] rounded"></span>
              <span className="block w-6 h-0.5 bg-[#285AA9] rounded"></span>
            </div>
          </button>
        </nav>

        {/* AnimatePresence wraps both the overlay and panel */}
        <AnimatePresence
           onExitComplete={() => {
            if (scrollTarget) {
              const el = document.getElementById(scrollTarget);
              el?.scrollIntoView({ behavior: 'smooth' });
              setScrollTarget(null);
            }
          }}
        >
          {menuOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                key="mobile-menu"
                className="fixed top-0 right-0 h-full w-1/2 bg-[#fff7ed]  dark:bg-slate-800 shadow-lg z-40"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative flex flex-col justify-center items-center h-full gap-6 font-bold p-6 rounded-xl shadow-md text-left transition-transform duration-300 snap-center shrink-0 w-full max-w-xs mx-auto"
                >
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="absolute top-4 right-4 text-cyan-700 hover:text-[#285AA9] text-4xl font-bold"
                  >
                    ×
                  </button>
                  {['path-to-soar', 'sites-that-soar', 'lift-offs' ,'send-signal'].map((id, i) => (
                    <motion.button
                      key={id}
                      onClick={() => {
                        setScrollTarget(id);
                        setMenuOpen(false);
                      }}
                      className="text-xl hover:text-[#285AA9] capitalize bg-transparent border-none focus:outline-none"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4, ease: 'easeOut' }}
                    >
                      {id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <div className="min-h-[calc(100vh-4rem)] overflow-x-hidden text-gray-800 bg-slate-100 dark:bg-slate-900 dark:text-white transition-colors duration-300">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
