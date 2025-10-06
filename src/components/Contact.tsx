import FadeInSection from "./ui/FadeInSection";
import ContactForm from "./ContactForm"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faPhone, faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";


const Contact = () => {
  const [formSent, setFormSent] = useState(false);
  const handleForSuccess = () => {
    setFormSent(true);
  }

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
          <ContactForm onSuccess={handleForSuccess}/>
           <div className="mt-6 text-center">
            <a
              href="https://bluebyrddev.setmore.com"
              className={`block w-fit mx-auto px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                formSent
                  ? "bg-[#1a3d80] text-white hover:bg-[#285aa9]"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none"
              }`}
            >
              Book Your Flight 
            </a>
          </div>
          <div className="mt-4 text-center text-gray-800 dark:text-gray-200 mb-10 space-y-2">
            <p className="text-[#1A3D80] hover:text-[#285AA9]">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              <a href="tel:+15129605108" aria-label="Phone number for Blue Byrd Development">
                (+1) 830-282-1648
              </a>
            </p>
            <p className="text-[#1A3D80]">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
              United States (all remote clients)
            </p>
            <p>
              <a
                href="mailto:k.byrd@bluebyrddevelopment.com"
                className="text-[#1A3D80] hover:text-[#285AA9]"
                aria-label="Email Blue Byrd Development"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                k.byrd@bluebyrddevelopment.com
              </a>
            </p>
            <p className="mt-4 text-[#1A3D80] hover:text-[#285AA9] flex justify-center flex-wrap gap-4">
              <a href="https://bsky.app/profile/bluebyrddevelopment.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-bluesky text-3xl hover:text-[#285AA9] transition-colors duration-200"></i>
              </a>
              <a href="https://www.linkedin.com/in/blue-byrd/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="text-3xl hover:text-[#285AA9]" />
              </a>
              <a href="https://www.facebook.com/61577208302042/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="text-3xl hover:text-[#285AA9]" />
              </a>
              <a href="https://www.instagram.com/bluebyrddev?igsh=MTh4aTF5bzY5a2pieQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="text-3xl hover:text-[#285AA9]" />
              </a>
            </p>
          </div>
        </div>
        
      </FadeInSection>
    </section>
  );
};

export default Contact;

