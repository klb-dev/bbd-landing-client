import FadeInSection from "./ui/FadeInSection";

const About = () => {
  return (
    <section id="path-to-soar" className="py-20 bg-[#fff7ed] dark:bg-slate-900 scroll-mt-24">
      <FadeInSection>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-4 text-cyan-700">Path to Soaring</h2>
          <p className="text-lg">
            Blue Byrd Development empowers visionary ideas to achieve digital flight. We specialize in crafting sophisticated and scalable web experiences, characterized by elegant design, precise code, and cutting-edge frameworks. Our expertise transforms ambitious concepts into impactful digital realities.
          </p>
          <br />
          <p className="text-lg">
            As a contemporary web development studio, Byrd Blue Development excels in creating responsive websites and performance-optimized designs. We build custom web applications utilizing robust technologies such as React, TypeScript, and scalable backend solutions. Whether you are initiating a new venture, refining an existing platform, or striving for greater digital heights, Blue Byrd Devlopoment is your dedicated partner in navigating the digital landscape. Together, we'll help your ideas take wing and soar.
          </p>
        </div>
      </FadeInSection>
    </section>
  );
};

export default About;
