export interface UserSettings {
  tempUnit: 'C' | 'F';
  language: 'en' | 'es' | 'fr';
}


// Simulated online database for user settings
const mockOnlineDatabase: Record<string, UserSettings> = {};

export const uploadSettings = async (uid: string, settings: UserSettings): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockOnlineDatabase[uid] = { ...settings };
      console.log(`[SyncService] Uploaded settings for user ${uid}:`, settings);
      resolve();
    }, 800);
  });
};

export const downloadSettings = async (uid: string): Promise<UserSettings | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const settings = mockOnlineDatabase[uid];
      console.log(`[SyncService] Downloaded settings for user ${uid}:`, settings || 'none');
      resolve(settings ? { ...settings } : null);
    }, 800);
  });
};
