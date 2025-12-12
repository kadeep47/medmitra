import { RelationFolder } from '../../../../types';
// @ts-ignore
import doctorImg from './images/doctor.jpg';
// @ts-ignore
import newsBpImg from './images/news_bp.jpg';
// @ts-ignore
import newsDiabetesImg from './images/news_diabetes.jpg';

const NOW = Date.now();
const ONE_DAY = 86400000;
const ONE_HOUR = 3600000;

export const DR_SHARMA_DATA: RelationFolder = {
  info: {
    id: 'f4',
    name: 'Dr. Sharma',
    age: '55',
    relationship: 'Family Doctor',
    backwardRelationship: 'Patient',
    personality: 'Professional, knowledgeable, patient.',
    photo: doctorImg
  },
  unreadCount: 2,
  lastMessageTime: NOW - (ONE_HOUR * 5),
  chat: [
    { id: 'd1', senderId: 'f4', type: 'text', content: 'Hello! Your blood work looks stable. Keep the salt intake low.', timestamp: NOW - (ONE_DAY * 14), isRead: true },
    { id: 'd2', senderId: 'user', type: 'text', content: 'Okay doctor. I am trying.', timestamp: NOW - (ONE_DAY * 13.9), isRead: true },
    { id: 'd3', senderId: 'f4', type: 'image', content: 'Interesting read on how sleep affects BP levels in seniors.', timestamp: NOW - (ONE_DAY * 7), isRead: true, metadata: { imageUrl: newsBpImg } },
    { id: 'd4', senderId: 'f4', type: 'text', content: 'Make sure you get 7 hours of rest.', timestamp: NOW - (ONE_DAY * 7) + 1000, isRead: true },
    { id: 'd5', senderId: 'f4', type: 'image', content: 'Recent findings on walking and insulin sensitivity.', timestamp: NOW - (ONE_HOUR * 5) - 5000, isRead: false, metadata: { imageUrl: newsDiabetesImg } },
    { id: 'd6', senderId: 'f4', type: 'text', content: 'Please do not skip the evening dose. It is crucial for overnight stability.', timestamp: NOW - (ONE_HOUR * 5), isRead: false }
  ]
};