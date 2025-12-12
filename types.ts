export type Persona = 'playful' | 'strict' | 'caring' | 'neutral' | 'professional';

// Basic info about a relation
export interface RelationInfo {
  id: string;
  name: string;
  age: string;
  relationship: string; // What they are to the user (e.g., Grandson)
  backwardRelationship: string; // What the user is to them (e.g., Grandfather)
  personality: string;
  photo: string; // Path to asset
}

export interface Message {
  id: string;
  senderId: string; // 'user' or RelationInfo.id or 'system'
  type: 'text' | 'video' | 'image' | 'audio';
  content: string; // Text content or URL
  timestamp: number;
  isRead: boolean;
  metadata?: {
    reminderId?: string;
    videoUrl?: string;
    imageUrl?: string;
  };
}

// A "Folder" for a relationship containing Info + Chat
export interface RelationFolder {
  info: RelationInfo;
  chat: Message[];
  lastMessageTime: number;
  unreadCount: number;
}

export interface Reminder {
  id: string;
  name: string;
  time: string; // HH:mm
  frequency: string;
  instructions?: string;
  assignedFamilyMemberId?: string;
  type: 'medicine' | 'lifestyle';
  history: { date: string; status: 'taken' | 'skipped' }[];
  lastActionDate?: string; 
  lastActionStatus?: 'taken' | 'skipped';
}

export interface MedicalProfile {
  fullName?: string;
  age: string;
  bloodType: string;
  height: string;
  weight: string;
  conditions: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
}

export interface UserProfile {
  userName: string;
  userPhoto: string;
  medical: MedicalProfile;
}

// Complete User Data Structure
export interface UserData {
  profile: UserProfile;
  medications: Reminder[];
  relations: Record<string, RelationFolder>; // Map of ID -> RelationFolder
  meta: {
    demoMode: boolean;
    firstLoadDone: boolean;
  };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}