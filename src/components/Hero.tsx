import FadeInSection from "./ui/FadeInSection";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center animate-gradient text-white">
      <FadeInSection>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, type: "spring" }} 
            className="relative mb-8"
          >
            <motion.div 
              className="absolute -inset-4 rounded-full opacity-30 blur-xl bg-brand-200" 
              animate={{ 
                scale: [1, 1.05, 1], 
                opacity: [0.2, 0.3, 0.2] 
              }} 
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }} 
            />
            <img 
              src="/images/BBD-Logo.webp"
              alt="Blue Byrd Development Logo" 
              className="w-24 sm:w-32 md:w-48 lg:w-56 relative z-10 mx-auto drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" 
            />
          </motion.div>

          <h1 className="heading-1 mb-6">
            Modern Web Development
            <span className="block text-brand-50">that Soars</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mt-4 max-w-2xl mx-auto mb-12 text-brand-50">
            Handcrafted web experiences built to help brands soar in the digital sky.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#send-signal"
              className="btn btn-secondary"
            >
              Get in Touch
              <FaArrowRight className="ml-2" />
            </a>
            <a
              href="#sites-that-soar"
              className="btn btn-outline"
            >
              View Our Work
            </a>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
};

export default Hero;