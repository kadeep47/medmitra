import { Reminder } from '../../types';

// Helper for history generation
const generateHistory = () => {
  const history: { date: string; status: 'taken' | 'skipped' }[] = [];
  const today = new Date();
  for (let i = 30; i > 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const status = Math.random() > 0.15 ? 'taken' : 'skipped';
    history.push({ date: dateStr, status });
  }
  return history;
};

export const MEDICATIONS: Reminder[] = [
  { 
    id: 'r1', name: 'BP Tablet (Amlodipine)', time: '09:00', frequency: 'Daily', type: 'medicine', 
    assignedFamilyMemberId: 'f2', instructions: 'After breakfast',
    history: generateHistory() 
  },
  { 
    id: 'r2', name: 'Evening Walk', time: '17:30', frequency: 'Daily', type: 'lifestyle', 
    assignedFamilyMemberId: 'f1', instructions: '20 mins in park',
    history: generateHistory() 
  },
  { 
    id: 'r3', name: 'Diabetes Pill (Metformin)', time: '20:00', frequency: 'Daily', type: 'medicine', 
    assignedFamilyMemberId: 'f3', instructions: 'With dinner',
    history: generateHistory() 
  },
  { 
    id: 'r4', name: 'Water Intake', time: '11:00', frequency: 'Daily', type: 'lifestyle', 
    assignedFamilyMemberId: 'f1',
    history: generateHistory() 
  }
];