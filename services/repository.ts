import { UserData, Reminder } from '../types';

// Import Ram Prasad's Data Folders
import { PROFILE } from '../data/ram_prasad/profile';
import { MEDICATIONS } from '../data/ram_prasad/medications';
import { HISTORY_CSV } from '../data/ram_prasad/history_csv';

// Import Relations
import { AARAV_DATA } from '../data/ram_prasad/relations/aarav/data';
import { ROHAN_DATA } from '../data/ram_prasad/relations/rohan/data';
import { PRIYA_DATA } from '../data/ram_prasad/relations/priya/data';
import { DR_SHARMA_DATA } from '../data/ram_prasad/relations/dr_sharma/data';

const STORAGE_KEY_PREFIX = 'mm_user_';
// Increment this version to force a reset of local storage on client devices
const DATA_VERSION = 3; 

export class Repository {
  private userId: string;
  private data: UserData | null = null;

  constructor(userId: string = 'ram_prasad') {
    this.userId = userId;
  }

  // Helper to parse CSV history
  private parseHistoryCSV(csv: string): Record<string, { date: string; status: 'taken' | 'skipped' }[]> {
    const historyMap: Record<string, { date: string; status: 'taken' | 'skipped' }[]> = {};
    
    const lines = csv.trim().split('\n');
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const [date, reminderId, status] = lines[i].split(',');
      if (!reminderId || !date || !status) continue;
      
      if (!historyMap[reminderId]) {
        historyMap[reminderId] = [];
      }
      historyMap[reminderId].push({ 
        date, 
        status: status.trim() as 'taken' | 'skipped' 
      });
    }
    return historyMap;
  }

  public load(): UserData {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:47',message:'Repository.load started',data:{userId:this.userId,storageKey:`${STORAGE_KEY_PREFIX}${this.userId}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    // 1. Try Local Storage
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${this.userId}`);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:49',message:'LocalStorage check',data:{hasStored:!!stored,storedLength:stored?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:53',message:'Parsed stored data',data:{hasMeta:!!parsed.meta,version:parsed.meta?.version,expectedVersion:DATA_VERSION,versionMatch:parsed.meta?.version===DATA_VERSION},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Check version. If mismatch, fall through to re-initialize data
        if (parsed.meta && parsed.meta.version === DATA_VERSION) {
           this.data = parsed;
           // #region agent log
           fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:56',message:'Returning cached data',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
           // #endregion
           return this.data!;
        }
        console.log("Data version mismatch, reloading from source...");
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:61',message:'Corrupt local data',data:{error:e?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error("Corrupt local data", e);
      }
    }

    // 2. If new user "ram_prasad" or version mismatch, load from Static Data Folders + CSV
    if (this.userId === 'ram_prasad') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:66',message:'Loading from static data',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      const parsedHistory = this.parseHistoryCSV(HISTORY_CSV);
      const today = new Date().toISOString().split('T')[0];
      
      // Merge CSV history into Medications
      const medsWithHistory = MEDICATIONS.map(m => {
        const history = parsedHistory[m.id] || [];
        const lastEntry = history.length > 0 ? history[history.length - 1] : null;
        
        return {
          ...m,
          history: history,
          // Set last action based on today's entry in CSV if exists
          lastActionDate: lastEntry?.date === today ? lastEntry.date : undefined,
          lastActionStatus: lastEntry?.date === today ? lastEntry.status : undefined
        };
      });

      const initialData: UserData = {
        profile: PROFILE,
        medications: medsWithHistory,
        relations: {
          [AARAV_DATA.info.id]: AARAV_DATA,
          [ROHAN_DATA.info.id]: ROHAN_DATA,
          [PRIYA_DATA.info.id]: PRIYA_DATA,
          [DR_SHARMA_DATA.info.id]: DR_SHARMA_DATA
        },
        meta: {
          demoMode: true,
          firstLoadDone: true,
          // @ts-ignore
          version: DATA_VERSION
        }
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:100',message:'Initial data created',data:{hasProfile:!!initialData.profile,medCount:initialData.medications.length,relationCount:Object.keys(initialData.relations).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      this.save(initialData);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:102',message:'Returning initial data',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return initialData;
    }

    // 3. Fallback for brand new empty user
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'repository.ts:106',message:'User not found error',data:{userId:this.userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    throw new Error("User not found and no template available.");
  }

  public save(data: UserData) {
    this.data = data;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${this.userId}`, JSON.stringify(data));
  }

  public reset() {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${this.userId}`);
    window.location.reload();
  }

  // --- Accessors ---

  public get currentData() {
    if (!this.data) return this.load();
    return this.data;
  }
}

export const nanuRepo = new Repository('ram_prasad');