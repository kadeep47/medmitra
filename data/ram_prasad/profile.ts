import { UserProfile } from '../../types';

export const PROFILE: UserProfile = {
  userName: 'Nanu', // Nickname
  userPhoto: '/images/profile.jpg',
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