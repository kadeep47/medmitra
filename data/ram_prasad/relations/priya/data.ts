import { RelationFolder } from '../../../../types';

const priyaImg = 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60';

const NOW = Date.now();
const ONE_DAY = 86400000;
const ONE_HOUR = 3600000;

export const PRIYA_DATA: RelationFolder = {
  info: {
    id: 'f3',
    name: 'Priya',
    age: '28',
    relationship: 'Daughter-in-law',
    backwardRelationship: 'Father-in-law',
    personality: 'Kind, supportive, traditional yet modern, cheerful.',
    photo: priyaImg
  },
  unreadCount: 0,
  lastMessageTime: NOW - (ONE_DAY * 3),
  chat: [
    { id: 'm3_1', senderId: 'f3', type: 'text', content: 'Papaji, I made karela juice. It is in the fridge.', timestamp: NOW - (ONE_DAY * 10), isRead: true },
    { id: 'm3_2', senderId: 'user', type: 'text', content: 'Thank you beta.', timestamp: NOW - (ONE_DAY * 10) + ONE_HOUR, isRead: true },
    { id: 'm3_3', senderId: 'f3', type: 'text', content: 'Are you feeling dizzy today?', timestamp: NOW - (ONE_DAY * 6), isRead: true },
    { id: 'm3_4', senderId: 'user', type: 'text', content: 'A little bit. I am resting.', timestamp: NOW - (ONE_DAY * 6) + (ONE_HOUR/2), isRead: true },
    { id: 'm3_5', senderId: 'f3', type: 'text', content: 'Don\'t forget your night tablet after dinner.', timestamp: NOW - (ONE_DAY * 3), isRead: true }
  ]
};