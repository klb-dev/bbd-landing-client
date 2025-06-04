import FadeInSection from "./ui/FadeInSection";
import ContactForm from "./ContactForm"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPhone, faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <section id="send-signal" className="py-20 bg-slate-100 dark:bg-slate-900 scroll-mt-24">
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A3D80] dark:text-[#285AA9] mb-4">
          Send a Signal
        </h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Ready to start your next responsive web project? Let’s bring your idea to life with scalable code and design that soars.
        </p>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Contact us today to discuss your project and see how we can help you achieve your goals.
        </p>
        <ContactForm />
          <div className="mt-4 text-center text-gray-800 dark:text-gray-200 mb-10 space-y-2">
            <p className="text-[#1A3D80] hover:text-[#285AA9]">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              <a href="tel:+15129605108" aria-label="Phone number for Blue Byrd Development">
                (+1) 512-960-5108
              </a>
            </p>
            <p className="text-[#1A3D80]">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
              United States (remote clients)
            </p>
            <p>
              <a
                href="mailto:bluebyrddevelopment@gmail.com"
                className="text-[#1A3D80] hover:text-[#285AA9]"
                aria-label="Email Blue Byrd Development"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                bluebyrddevelopment@gmail.com
              </a>
            </p>
            <p className="mt-4 text-[#1A3D80] hover:text-[#285AA9]">
              <a href="https://bsky.app/profile/bluebyrddevelopment.com" className="target=_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-bluesky text-3xl text-[#1A3D80] hover:text-[#285AA9] transition-colors duration-200"></i>
              </a>
              <a href="https://www.linkedin.com/in/blue-byrd/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="text-[#1A3D80] hover:text-[#285AA9] text-3xl ml-4" />
              </a>
              <a href="https://github.com/blue-byrd-dev" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="text-[#1A3D80] hover:text-[#285AA9] text-3xl ml-4" />
              </a>
            </p>
          </div>
        </div>
        
      </FadeInSection>
    </section>
  );
};

export default Contact;

