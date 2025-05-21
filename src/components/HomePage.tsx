import { Suspense, lazy } from 'react';
import { useDocumentHead } from '../components/hooks/useDocumentHead';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Loading from '../components/ui/Loading';
const TechCarousel = lazy(() => import('../components/TechCarousel'));
const Testimonials = lazy(() => import('../components/Testimonials'));

const HomePage = () => {
  useDocumentHead({
    title: 'Modern Web Development that Soars',
    description: 'Blue Byrd Development creates responsive websites and web applications with clean UI design and scalable code to help your brand soar in the digital landscape.'
  });

  return (
    <>
      <Hero />
      <About />
      <Suspense fallback={<Loading />}>
        <TechCarousel />
      </Suspense>
      <Projects />
      <Suspense fallback={<Loading />}>
        <Testimonials />
      </Suspense>
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;