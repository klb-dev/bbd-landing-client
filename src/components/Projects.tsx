import ProjectCard from "./ui/ProjectCard";
import FadeInSection from "./ui/FadeInSection";

const projectData = [
  {
    title: 'Born To Ride 501(c)(3)',
    description: 'Born to Ride is a responsive landing page for a 501(c)(3) nonprofit. Built with Three.js and modern web frameworks to showcase custom design and donation functionality.',
    image: "/images/BornToRide.webp",
    link: 'https://borntoridepleasantontx.org',
    tags: ['Three.js', 'HTML', 'CSS', 'Vanilla JS', 'Node.js', 'Express', 'Cors', 'Stripe SDK'],
  },
  {
    title: 'Forever Home',
    description: 'Forever Home is a sophisticated web application designed to seamlessly connect prospective adopters with available pets in their vicinity. Developed using the progressive capabilities of React and the robust backend services of Firebase,the platform enables users to efficiently search for companion animals based on specific criteria, including breed, age, and geographic location.  Forever Home provides a fluid and engaging experience for individuals seeking to welcome a new pet into their lives.',
    image: "/images/ForeverHome.webp",
    link: 'https://forever-home-b1dba.web.app/',
    tags: ['React', 'Vite', 'Node.js', 'Express', 'Axios', 'Styled-Components'],
  },
];

const Projects = () => {
  return (
    <section id="sites-that-soar" className="py-20 bg-slate-100 dark:bg-slate-800 scroll-mt-24">
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-cyan-700">Sites that Soar</h2>
        <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          A look at web experiences we've crafted and built to soar.
        </p>
        <FadeInSection>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 max-w-full overflow-hidden">
            {projectData.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                image={project.image}
                link={project.link}
                tags={project.tags} 
                delay={index * 0.2}
              />
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default Projects;