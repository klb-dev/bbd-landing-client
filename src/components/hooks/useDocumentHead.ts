import { useEffect } from 'react';

type DocumentHeadProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string;
};

/**
 * Custom hook to manage document head metadata
 * Compatible with React 19
 */
export const useDocumentHead = ({
  title,
  description,
  canonical = 'https://bluebyrddevelopment.com',
  ogImage = '../assets/images/bbdBannerSM.png',
  ogType = 'website',
  keywords = 'web development, responsive websites, React, TypeScript, Tailwind CSS, Blue Byrd Development',
}: DocumentHeadProps) => {
  const siteName = 'Blue Byrd Development';
  const fullTitle = `${title} | ${siteName}`;
  
  useEffect(() => {
    document.title = fullTitle;
    
    // Helper functions for updating meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical);
    
    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updatePropertyTag('og:title', fullTitle);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:url', canonical);
    updatePropertyTag('og:image', ogImage);
    updatePropertyTag('og:type', ogType);
    updatePropertyTag('og:site_name', siteName);
    
    // Update Twitter card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
  }, [title, description, canonical, ogImage, ogType, keywords, fullTitle]);
};