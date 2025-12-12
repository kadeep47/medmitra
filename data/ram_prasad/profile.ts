import { UserProfile } from '../../types';

// Using Unsplash source for reliability in demo
const profileImg = 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=400&auto=format&fit=crop&q=60';

export const PROFILE: UserProfile = {
  userName: 'Nanu', // Nickname
  userPhoto: profileImg,
  medical: {
    fullName: 'Ram Prasad', // Official Name
    age: '72',
    bloodType: 'B+',
    height: '5\' 8"',
    weight: '74 kg',
    conditions: 'Type 2 Diabetes, Hypertension',
    allergies: 'None',
    emergencyContactName: 'Rohan Sharma',
    emergencyContactRelation: 'Son',
    emergencyContactPhone: '+91 98765 43210'
  }
};