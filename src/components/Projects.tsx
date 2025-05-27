import ProjectCard from "./ui/ProjectCard";
import FadeInSection from "./ui/FadeInSection";

const projectData = [
  {
    title: 'Born To Ride 501(c)(3)',
    description: 'Born to Ride is a non-profit that helps young people find their footing through skateboarding. Skateboarders tend to be seen as troubled. But BTR sees them differently. These young people are often incredibly creative, super determined, great at thinking through problems, and really coordinated. There\'s something truly special about the skateboarding community.',
    image: "/images/BornToRide.webp",
    link: 'https://borntoridepleasantontx.org',
  },
  {
    title: 'Forever Home',
    description: 'Forever Home is a user-friendly website that makes it easy to find pets ready for adoption in your area. You can quickly search for a new furry friend based on things like their breed, age, or how close they are to you. It\'s all about making the process of finding your perfect pet a smooth and enjoyable experience.',
    image: "/images/ForeverHome.webp",
    link: 'https://forever-home-b1dba.web.app/'
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