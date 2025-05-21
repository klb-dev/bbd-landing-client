import FadeInSection from "./ui/FadeInSection";
import ContactForm from "./ContactForm"; 

const Contact = () => {
  return (
    <section id="send-signal" className="py-20 bg-slate-100 dark:bg-slate-900 scroll-mt-24">
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-cyan-700 dark:text-cyan-400 mb-4">
          Send a Signal
        </h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Ready to start your next responsive web project? Let’s bring your idea to life with scalable code and standout design.
        </p>
        <ContactForm />
        </div>
      </FadeInSection>
    </section>
  );
};

export default Contact;

