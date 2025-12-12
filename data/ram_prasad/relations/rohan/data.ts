import { RelationFolder } from '../../../../types';

const rohanImg = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=60';

const NOW = Date.now();
const ONE_DAY = 86400000;
const ONE_HOUR = 3600000;

export const ROHAN_DATA: RelationFolder = {
  info: {
    id: 'f2',
    name: 'Rohan',
    age: '30',
    relationship: 'Son',
    backwardRelationship: 'Father',
    personality: 'Responsible, organized, slightly strict but caring. Works in IT.',
    photo: rohanImg
  },
  unreadCount: 0,
  lastMessageTime: NOW - (ONE_HOUR * 2),
  chat: [
    { id: 'm2_1', senderId: 'f2', type: 'text', content: 'Dad, I ordered the sugar free sweets for the festival.', timestamp: NOW - (ONE_DAY * 13), isRead: true },
    { id: 'm2_2', senderId: 'user', type: 'text', content: 'Good, don\'t bring the oily ones.', timestamp: NOW - (ONE_DAY * 13) + ONE_HOUR, isRead: true },
    { id: 'm2_3', senderId: 'f2', type: 'text', content: 'Did you check your BP today morning?', timestamp: NOW - (ONE_DAY * 8), isRead: true },
    { id: 'm2_4', senderId: 'user', type: 'text', content: '130/85. It is normal.', timestamp: NOW - (ONE_DAY * 8) + (ONE_HOUR * 4), isRead: true },
    { id: 'm2_5', senderId: 'f2', type: 'text', content: 'Okay. I restocked the strips for the glucometer yesterday.', timestamp: NOW - (ONE_DAY * 1), isRead: true },
    { id: 'm2_6', senderId: 'f2', type: 'text', content: 'Please verify if the strips are in the drawer.', timestamp: NOW - (ONE_HOUR * 2), isRead: true }
  ]
};