import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";


const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-slate-600 via-slate-800 to-slate-900 animate-gradient text-sm text-gray-200 pt-10 pb-6 mt-20 border-t border-slate-500">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-around text-center sm:text-left gap-6 mb-6">
          <img
            src="/images/BBD-Logo.webp"
            alt="Blue Byrd Logo"
            className="w-24 sm:w-28 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]"
          />
          <div className="text-base leading-snug font-medium sm:text-right sm:self-center">
            <p>Crafted with clean code</p>
            <p>and a sharp eye</p>
            <p className="text-[#FFBF1E] dark:text-[#FFCC47]">built to soar</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-4">
           <a href="https://bsky.app/profile/bluebyrddevelopment.com" className="target=_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-bluesky text-2xl text-gray-200 hover:text-[#FFBF1E] transition-colors duration-200"></i>
            </a>
            <a href="https://www.linkedin.com/in/blue-byrd/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className="text-gray-200 hover:text-[#FFBF1E] text-2xl ml-4" />
            </a>
            <a href="https://github.com/blue-byrd-dev" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} className="text-gray-200 hover:text-[#FFBF1E] text-2xl ml-4" />
            </a>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Blue Byrd Development. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
