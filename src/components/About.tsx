import FadeInSection from "./ui/FadeInSection";

const About = () => {
  return (
    <section id="path-to-soar" className="py-20 bg-[#fff7ed] dark:bg-slate-900 scroll-mt-24">
      <FadeInSection>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#285AA9">Path to Soaring</h2>
          <p className="text-lg">
            Got big, imaginative ideas for your business or passion? Blue Byrd Development gives those amazing concepts the digital wings they need to soar!
          </p>
          <br />
          <p className="text-lg">
            We're all about building beautiful, super-functional websites and online tools. We combine elegant designs with the best tech to turn your boldest visions into powerful online realities.
          </p>
          <br />
          <p className="text-lg">
            As a modern web development team, we excel at creating websites that look great on any device and run incredibly fast. We build custom online applications using robust technologies, ensuring everything works smoothly behind the scenes. Whether you're launching something new, upgrading what you have, or simply aiming for greater digital heights, Blue Byrd Development is your trusted partner. Together, we'll help your ideas truly take flight and soar into the digital sky.
          </p>
        </div>
      </FadeInSection>
    </section>
  );
};

export default About;
