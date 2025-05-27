import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';



const testimonials = [
  {
    name: "The Byrdman",
    role: "Founder, Born to Ride",
    quote: "Blue Byrd Development absolutely nailed it! They took our vision and brought it to life with an animated, full-stack website that's not just lightning-fast, but was completely tailor-made for us. They truly built something special.",
    logo: "/images/btr-Logo.webp", 
  },
  {
    name: "Krystal Z.",
    role: "Director of Marketing, Forever Home",
    quote: "Blue Byrd Development truly delivered beyond expectations with the Forever Home application! They were professional, great at communicating, and incredibly precise. The site even launched ahead of schedule, and it turned out better than we ever imagined.",
    logo: "/images/FH-Logo.webp",
  },
  {
    name: "Keily A.",
    role: "Product Manager",
    quote: "This time, working with Blue Byrd Development was a game-changer. Unlike past experiences with other developers, I never had to explain anything twice – they just got it right away.",
  },
];


interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  logo?: string;
  index: number;
}

const TestimonialCard = ({ quote, name, role, logo, index }: TestimonialCardProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ width: '100%' });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.4, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className="relative flex flex-col justify-between min-h-[200px] bg-slate-100 dark:bg-slate-900 p-6 rounded-xl shadow-md text-left transition-transform duration-300 snap-center shrink-0 w-[90%] max-w-xs hover:shadow-xl"
    >
      <div>
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.3 }}
          transition={{ delay: index * 0.3 + 0.4, duration: 0.5 }}
          className="absolute top-4 left-4 text-4xl text-cyan-500"
        >
          <FaQuoteLeft />
        </motion.div>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-50 animate-pulse" />
              {logo ? (
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="w-10 h-10 object-contain rounded-full bg-[#fff7ed] p-1 relative z-10"
                />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffd5a3`}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover relative z-10"
                />
              )}
          </div>
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{role}</p>
          </div>
        </div>

        <p className="text-sm italic text-gray-700 dark:text-gray-300">
          “{quote}”
        </p>
      </div>

      <div className="mt-4">
        <div className="w-full h-1 bg-gray-300 rounded">
          <motion.div
            className="h-full bg-cyan-500 rounded"
            initial={{ width: 0 }}
            animate={controls}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth * 0.9;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth * 0.9;
        const nextIndex = (activeIndex + 1) % testimonials.length;
        carouselRef.current.scrollTo({ left: cardWidth * nextIndex, behavior: 'smooth' });
        setActiveIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const scrollByAmount = (amount: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }; 

  return (
    <section id="lift-offs" className="py-20 bg-[#fff7ed] dark:bg-slate-800 scroll-mt-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-cyan-700">People we’ve helped soar</h2>

        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden flex gap-6 snap-x snap-mandatory px-2 pb-4 scroll-smooth justify-start" ref={carouselRef} onScroll={handleScroll}>
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} index={i} {...t} />
            ))}
          </div>

          {/* Arrow Buttons for larger screens */}
          <div className="hidden md:flex absolute top-1/2 left-0 right-0 justify-between items-center px-2 -translate-y-1/2">
            <button onClick={() => scrollByAmount(-300)} className="text-cyan-500 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md hover:bg-cyan-500 hover:text-white">
              <FaChevronLeft />
            </button>
            <button onClick={() => scrollByAmount(300)} className="text-cyan-500 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md hover:bg-cyan-500 hover:text-white">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2 md:hidden">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-cyan-500' : 'bg-gray-300'} transition-colors duration-300`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
