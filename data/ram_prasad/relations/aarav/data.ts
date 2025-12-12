import { RelationFolder } from '../../../../types';

const aaravImg = 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=400&auto=format&fit=crop&q=60';
const drawingImg = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60';

const NOW = Date.now();
const ONE_DAY = 86400000;
const ONE_HOUR = 3600000;

export const AARAV_DATA: RelationFolder = {
  info: {
    id: 'f1',
    name: 'Aarav',
    age: '10',
    relationship: 'Grandson',
    backwardRelationship: 'Grandfather',
    personality: 'Playful, energetic, cricket lover. Loves his Nanu.',
    photo: aaravImg
  },
  unreadCount: 1,
  lastMessageTime: NOW,
  chat: [
    { id: 'm1_1', senderId: 'f1', type: 'text', content: 'Nanu, look what I drew in school!', timestamp: NOW - (ONE_DAY * 12), isRead: true, metadata: { imageUrl: drawingImg } },
    { id: 'm1_2', senderId: 'user', type: 'text', content: 'Very nice beta! Is that me?', timestamp: NOW - (ONE_DAY * 12) + ONE_HOUR, isRead: true },
    { id: 'm1_3', senderId: 'f1', type: 'text', content: 'Nanu, papa says you missed your walk. Go now!', timestamp: NOW - (ONE_DAY * 5), isRead: true },
    { id: 'm1_4', senderId: 'user', type: 'text', content: 'Going now, don\'t worry.', timestamp: NOW - (ONE_DAY * 5) + (ONE_HOUR/2), isRead: true },
    { id: 'm1_5', senderId: 'f1', type: 'text', content: 'Are we watching the match on Sunday?', timestamp: NOW - (ONE_DAY * 2), isRead: true },
    { id: 'm1_6', senderId: 'user', type: 'text', content: 'Yes, if I finish my exercises.', timestamp: NOW - (ONE_DAY * 2) + ONE_HOUR, isRead: true },
    { id: 'm1_7', senderId: 'f1', type: 'video', content: 'Nanu, please take your medicine so we can play cricket tomorrow! 🏏❤️', timestamp: NOW, isRead: false }
  ]
};