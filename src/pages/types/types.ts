import { Timestamp } from 'firebase/firestore';


// Define all valid project types
export type ProjectType =
  | 'Website Design & Development'
  | 'Web Application'
  | 'E-commerce Solutions'
  | 'Website Redesign'
  | 'Maintenance & Support'
  | 'Other';

// Firestore Timestamp can be any for now unless you want to import Firebase types
export type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: ProjectType;
  budget?: string;
  timeframe?: string;
  message: string;
  createdAt?: Timestamp; // or use firebase.firestore.Timestamp
  status?: string;
  reply?: string;
  repliedAt?: Timestamp;
};

export const allProjectTypes: ProjectType[] = [
  'Website Design & Development',
  'Web Application',
  'E-commerce Solutions',
  'Website Redesign',
  'Maintenance & Support',
  'Other',
];


export type FilterStatus =
  | 'all'
  | 'new'
  | 'considering'
  | 'inprogress'
  | 'completed'
  | 'replied'
  | 'archived'
  | 'deleted'
