// src/components/FadeInSection.tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type FadeInSectionProps = {
  children: React.ReactNode;
  delay?: number;
};

const FadeInSection = ({ children, delay = 0 }: FadeInSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="w-full overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
