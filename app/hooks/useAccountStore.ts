import { create } from 'zustand';

export interface ApiKey {
  key: string;
}

interface AccountStore {
  apiKeys: ApiKey[];
  setApiKeys: (apiKeys: ApiKey[]) => void;
  addApiKey: (apiKey: ApiKey) => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  apiKeys: [],
  setApiKeys: (apiKeys) => set({ apiKeys }),
  addApiKey: (apiKey) => set((state) => ({ apiKeys: [apiKey, ...state.apiKeys] })),
}));

export default useAccountStore;
