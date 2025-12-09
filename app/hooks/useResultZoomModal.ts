import { create } from 'zustand';

interface ResultZoomModalStore {
  isOpen: boolean;
  content: React.ReactElement | (() => React.ReactElement) | null;
  page: number; // New page state
  title: string;
  setPage: (page: number) => void; // New function to set page
  setTitle: (title: string) => void;
  onOpen: () => void;
  onClose: () => void;
  setContent: (content: React.ReactElement | (() => React.ReactElement)) => void;
}

const useResultZoomModal = create<ResultZoomModalStore>((set) => ({
  isOpen: false,
  content: null,
  page: 0, // Initialize page state
  title: '',
  setPage: (page) => set({ page }), // Implement setPage function
  setTitle: (title) => set({ title }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content) => set({ content }),
}));

export default useResultZoomModal;
