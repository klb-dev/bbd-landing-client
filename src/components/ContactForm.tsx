import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast'
import axios from "axios"

type ContactFormProps = {
  formSent: boolean;
  onSuccess?: () => void;
}

const isProduction = 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

const API_URL = isProduction 
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5173";

const ContactForm = ({ onSuccess }: ContactFormProps) => {
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

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ ...formState, isSubmitting: true });
    
    try {
      
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
        toast.success("Your message has been sent successfully!");
        
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        });
        onSuccess?.();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      const errorMessage = 
        err instanceof Error 
          ? err.message 
          : "There was an error sending your message. Please try again.";
      
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

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^\d+]/g, '');

    if (raw.startsWith('+')) {
      const international = '+' + raw.replace(/\+/g, '').slice(0, 15);
      return international;
    }

    if (/^\d{10}$/.test(raw)) {
      const area = raw.slice(0, 3);
      const prefix = raw.slice(3, 6);
      const line = raw.slice(6);
      return `+1 ${area}-${prefix}-${line}`;
    }

    if (/^\d{11,15}$/.test(raw)) {
      return '+' + raw.slice(0, 15);
    }

    return raw;
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.projectType &&
      formData.budget &&
      formData.timeframe &&
      formData.message
    )
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
            placeholder="Carrier pigeon backup? (+1 123-456-7890)"
            required
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
              required
              value={formData.projectType}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
            >
              <option value="">Select project type</option>
              <option value="Website Design & Development">Website Design & Development</option>
              <option value="Web Application">Web Application</option>
              <option value="E-commerce Solutions">E-commerce Solutions</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Maintenance & Support">Maintenance & Support</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Range</label>
              <select
                id="budget"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
              >
                 <option value="">Select a budget</option>
                  <option value="Under $5,000">Less than $5,000</option>
                  <option value="$5,000–$10,000">$5,000–$10,000</option>
                  <option value="$10,000–$25,000">$10,000–$25,000</option>
                  <option value="Over $25,000">More than $25,000</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timeframe</label>
              <select
                id="timeframe"
                name="timeframe"
                required
                value={formData.timeframe}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#285AA9] focus:border-transparent"
              >
                  <option value="">Select a timeframe</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="3–6 months">3–6 months</option>
                  <option value="Flexible / Not urgent">Flexible / Not urgent</option> 
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
        disabled={formState.isSubmitting || !isFormValid()}
        className={`w-full bg-[#285AA9] hover:bg-[#294EA2] text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg relative overflow-hidden ${
          (!isFormValid() || formState.isSubmitting)
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer"
        }`}
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
