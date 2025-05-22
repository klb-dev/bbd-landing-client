import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast'
import axios from "axios"

const isProduction = 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';


const API_URL = isProduction 
  ? "https://bbd-landing-server-production.up.railway.app" 
  : "http://localhost:5173";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeframe: "",
    message: "",
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null as string | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ ...formState, isSubmitting: true });
    
    try {
      // Send the form data to your API
      const response = await axios.post(`${API_URL}/api/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        budget: formData.budget,
        timeframe: formData.timeframe,
        message: `
          Project Type: ${formData.projectType}
          Budget: ${formData.budget}
          Timeframe: ${formData.timeframe}

          Message:
          ${formData.message}
                  `
                });
                
                if (response.data.success) {
                  // Show success toast
                  toast.success("Your message has been sent successfully!");
                  
                  setFormState({
                    isSubmitting: false,
                    isSubmitted: true,
                    error: null
                  });
                } else {
                  throw new Error("Failed to send message");
                }
              } catch (err) {
                const errorMessage = 
                  err instanceof Error 
                    ? err.message 
                    : "There was an error sending your message. Please try again.";
                
                // Show error toast
                toast.error(errorMessage);
                
                setFormState({
                  isSubmitting: false,
                  isSubmitted: false,
                  error: errorMessage
                });
                
                console.error("Form submission error:", err);
              }
            };

  if (formState.isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 dark:bg-slate-700 rounded-lg p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
          <FaCheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Signal Received!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thanks for reaching out! We'll review your project and get back to you within a couple of days.
        </p>
        <button
          onClick={() => {
            setFormState({ 
              isSubmitting: false, 
              isSubmitted: false, 
              error: null 
            });
            setFormData({
              name: "",
              email: "",
              phone: "",
              projectType: "",
              budget: "",
              timeframe: "",
              message: "",
            });
          }}
          className="text-[#1A3D80] hover:text-[#285AA9] font-medium cursor-pointer"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Who's sending the signal?"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Where should we reply?"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Carrier pigeon backup?"
            required
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            title="Format: 123-456-7890"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Project Details</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Type</label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
            >
              <option value="">Select project type</option>
              <option value="website">Website Design & Development</option>
              <option value="webapp">Web Application</option>
              <option value="ecommerce">E-commerce Solution</option>
              <option value="redesign">Website Redesign</option>
              <option value="maintenance">Maintenance & Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Range</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="<5k">Less than $5,000</option>
                <option value="5-10k">$5,000 - $10,000</option>
                <option value="10-25k">$10,000 - $25,000</option>
                <option value="25k+">$25,000+</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeframe</label>
              <select
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
              >
                <option value="">Select timeframe</option>
                <option value="asap">ASAP</option>
                <option value="1-3months">1-3 months</option>
                <option value="3-6months">3-6 months</option>
                <option value="6months+">6+ months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Details</label>
            <textarea
              id="message"
              name="message"
              autoComplete="off"
              placeholder="Unpack your ideas here..."
              required
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full bg-[#285AA9] hover:bg-[#294EA2] text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg relative overflow-hidden disabled:opacity-70 cursor-pointer"
      >
        {formState.isSubmitting ? (
          <>
            <span className="opacity-0">Send Signal</span>
                        <span className="absolute inset-0 flex items-center justify-center">
              <FaSpinner className="h-5 w-5 text-white animate-spin" />
            </span>
          </>
        ) : (
          <span className="flex items-center justify-center">
            Send Signal
            <FaArrowRight className="h-5 w-5 ml-2" />
          </span>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
