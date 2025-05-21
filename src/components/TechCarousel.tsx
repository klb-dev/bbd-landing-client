import {
  FaReact, FaStripe, FaHtml5, FaCss3Alt, FaJs, FaNodeJs,
} from 'react-icons/fa';
import {
  SiTailwindcss, SiTypescript, SiFirebase, SiVite,
  SiFramer, SiExpress, SiMongodb,
} from 'react-icons/si';

const tools = [
  { name: 'HTML', icon: FaHtml5, color: '#E44D26' },
  { name: 'CSS', icon: FaCss3Alt, color: '#1572B6' },
  { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React', icon: FaReact, color: '#61DAFB' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Vite', icon: SiVite, color: '#646CFF' },
  { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { name: 'Framer Motion', icon: SiFramer, color: '#E64CFF' },
  { name: 'Stripe', icon: FaStripe, color: '#635BFF' },
  { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  { name: 'Express', icon: SiExpress, color: '#000000' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
];

const TechCarousel = () => {
  return (
    <section id="tools" className="pb-10 px-6 bg-[#fff7ed] dark:bg-slate-900 text-gray-800 dark:text-white overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-cyan-700">Tools That Help Us Soar</h2>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-12 animate-scroll">
            {tools.concat(tools).map(({ name, icon: Icon, color }, i) => (
              <div key={i} className="min-w-[100px] flex flex-col items-center">
                <span role="img" aria-label={name}>
                  <Icon
                    className="w-12 h-12 mb-2"
                    style={{ color }}
                    title={name}
                  />
                </span>
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechCarousel;
