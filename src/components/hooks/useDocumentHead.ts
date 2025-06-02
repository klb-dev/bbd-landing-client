import { useEffect } from 'react';

type DocumentHeadProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string;
};


export const useDocumentHead = ({
  title,
  description,
  canonical = 'https://bluebyrddevelopment.com',
  ogImage = '../assets/images/bbdBannerSM.png',
  ogType = 'website',
  keywords = 'web development, responsive websites, React, TypeScript, Tailwind CSS, Blue Byrd Development',
}: DocumentHeadProps) => {
  const siteName = 'Blue Byrd Development';
  const fullTitle = title ? `${title} | ${siteName}`: siteName;
  
  useEffect(() => {
    document.title = fullTitle; 
  
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
    
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical);
    
    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    
    updatePropertyTag('og:title', fullTitle);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:url', canonical);
    updatePropertyTag('og:image', ogImage);
    updatePropertyTag('og:type', ogType);
    updatePropertyTag('og:site_name', siteName);
    
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
  }, [title, description, canonical, ogImage, ogType, keywords, fullTitle]);
};