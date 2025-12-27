import { HistoryRecord, AnalysisResult } from './models/types';

const HISTORY_KEY = 'scoliosis_history';

export function getHistory(userEmail?: string): HistoryRecord[] {
  if (typeof window === 'undefined') return [];
  
  const historyJson = localStorage.getItem(HISTORY_KEY);
  if (!historyJson) return [];

  try {
    const allHistory: HistoryRecord[] = JSON.parse(historyJson);
    if (userEmail) {
      return allHistory.filter(record => record.userEmail === userEmail);
    } else {
      // Return records without userEmail (anonymous)
      return allHistory.filter(record => !record.userEmail);
    }
  } catch (e) {
    console.error('Failed to parse history', e);
    return [];
  }
}

export function addHistory(result: AnalysisResult, imageData: string, userEmail?: string): HistoryRecord {
  const record: HistoryRecord = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    result,
    imageData, // Note: storing large base64 strings in localStorage is not ideal for production
    userEmail
  };

  if (typeof window === 'undefined') return record;

  const historyJson = localStorage.getItem(HISTORY_KEY);
  let allHistory: HistoryRecord[] = [];
  if (historyJson) {
    try {
      allHistory = JSON.parse(historyJson);
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  }

  // Add new record to the beginning
  allHistory.unshift(record);
  
  // Limit storage size (e.g., keep last 50 records total to avoid quota limit)
  if (allHistory.length > 50) {
    allHistory = allHistory.slice(0, 50);
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  } catch (e) {
    console.error('Failed to save history (likely quota exceeded)', e);
    // Try to save without image data if full
    const recordWithoutImage = { ...record, imageData: '' };
    allHistory[0] = recordWithoutImage;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    } catch (e2) {
      console.error('Still failed to save history', e2);
    }
  }

  return record;
}

export function clearHistory(userEmail?: string) {
  if (typeof window === 'undefined') return;

  const historyJson = localStorage.getItem(HISTORY_KEY);
  if (!historyJson) return;

  let allHistory: HistoryRecord[] = JSON.parse(historyJson);
  
  if (userEmail) {
    // Remove only user's history
    allHistory = allHistory.filter(record => record.userEmail !== userEmail);
  } else {
    // Remove only anonymous history
    allHistory = allHistory.filter(record => !!record.userEmail);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
}
