import { create } from 'zustand';
import {
  PlaygroundFile,
  PlaygroundTabs,
  ExtractState,
  TransformState,
  CompareState,
  ExtractTab,
  TableTab,
  ExtractedMDTable,
  ExtractSettings,
  ModelType,
} from '../types/PlaygroundTypes';
import { PresignedResponse } from '../actions/apiInterface';

export interface AddFileParams {
  files: File | File[];
  fileId: string;
  jobId: string;
  userId: string;
}

interface PlaygroundStore {
  modelType: ModelType;
  extractSettings: ExtractSettings;
  selectedFileIndex: number | null;
  fileCollapsed: boolean;
  files: PlaygroundFile[];
  filesToUpload: File[];
  filesFormData: PresignedResponse[];
  token: string;
  userId: string;
  clientId: string;
  loggedIn: boolean;
  totalQuota: number;
  remainingQuota: number;
  setFileCollapsed: (collapsed: boolean) => void;
  setTotalQuota: (totalQuota: number) => void;
  setRemainingQuota: (remainingQuota: number) => void;
  setSelectedFileIndex: (index: number) => void;
  setFiles: (files: File[]) => void;
  setFilesToUpload: (files: File[]) => void;
  setToken: (token: string) => void;
  setClientId: (clientId: string) => void;
  setUserId: (userId: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  addFiles: ({ files }: { files: File | File[] }) => void;
  addHTMLFile: (file: string) => void;
  addFilesFormData: (newResponse: PresignedResponse) => void;
  updateSelectedFile: (property: string, value: string) => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value:
      | string
      | ExtractState
      | TransformState
      | CompareState
      | File
      | string[]
      | ExtractTab
      | TableTab
      | Set<number>
      | { [key: string]: string }
      | ExtractedMDTable[]
      | string[][]
      | { [key: string]: string[] }
      | { key: string; description: string }[]
  ) => void;
  toggleExtractSetting: (settingName: keyof ExtractSettings) => void;
  updateModelType: (modelType: ModelType) => void;
}

const initialFileState = {
  extractResult: [''],
  qaResult: null,
  tableExtractResult: [''],
  tableMdExtractResult: [{ title: '', table: '', tableData: {} }],
  keyMap: {},
  keyValueInputs: [{ key: '', description: '' }],
  tableMapIndices: new Set(),
  s3_file_source: { s3_bucket: '', source_type: '', s3_prefix: '' },
  activeTab: PlaygroundTabs.PLAIN_TEXT,
  extractState: ExtractState.READY,
  extractTab: ExtractTab.INITIAL_STATE,
  tableTab: TableTab.TABLE_EXTRACT,
  qaState: TransformState.READY,
  summarizeState: TransformState.READY,
  instructionExtractState: ExtractState.READY,
  tableMdExtractState: ExtractState.READY,
  compareState: CompareState.READY,
  compareFile: null,
  compareResult: '',
};

const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  modelType: ModelType.BASE,
  extractSettings: {
    removePII: true,
    includePageNumbers: true,
    includeChartsFigures: true,
    includeFootnotes: true,
    includeHeadersFooters: true,
    includeTables: true,
  },
  totalQuota: 0,
  remainingQuota: 0,
  selectedFileIndex: null,
  files: [],
  filesToUpload: [],
  filesFormData: [],
  token: '',
  clientId: '',
  loggedIn: false,
  activeTab: '',
  userId: '',
  fileCollapsed: false,
  setFileCollapsed: (collapsed) => {
    set({ fileCollapsed: collapsed });
  },
  setUserId: (userId) => {
    set({ userId });
  },
  setTotalQuota: (totalQuota) => {
    set({ totalQuota });
  },
  setRemainingQuota: (remainingQuota) => {
    set({ remainingQuota });
  },
  setSelectedFileIndex: (index) => {
    set({ selectedFileIndex: index });
  },
  setFiles: (files) => {
    const playgroundFiles = files.map((file) => ({
      file: file,
      ...initialFileState,
    })) as PlaygroundFile[];
    set({ files: playgroundFiles });
  },
  addFiles: ({ files }: { files: File | File[] }) => {
    set((state) => {
      // Convert input to array if it's a single file
      const filesToAdd = Array.isArray(files) ? files : [files];

      // Map each file to a PlaygroundFile object
      const playgroundFilesToAdd = filesToAdd.map((file) => ({
        file: file,
        ...initialFileState,
      })) as PlaygroundFile[];

      // Filter out any duplicate files
      const uniqueFiles = playgroundFilesToAdd.filter((playgroundFile) =>
        state.files.every(
          (existingFile) =>
            typeof existingFile.file === 'string' ||
            (playgroundFile.file instanceof File && existingFile.file.name !== playgroundFile.file.name)
        )
      );

      // Update selected file index if new files are added
      if (uniqueFiles.length > 0) {
        set({ selectedFileIndex: state.files.length });
      }

      // Return updated state with new files added
      return {
        files: [...state.files, ...uniqueFiles],
      };
    });
  },
  addHTMLFile: (file) => {
    set((state) => {
      const fileToAdd = {
        file: file,
        ...initialFileState,
      } as PlaygroundFile;

      for (const thisFile of state.files) {
        if (typeof thisFile.file === 'string' && thisFile.file === file) {
          return {
            files: [...state.files],
          };
        }
      }

      set({ selectedFileIndex: state.files.length });

      return {
        files: [...state.files, fileToAdd],
      };
    });
  },
  setFilesToUpload: (files) => set({ filesToUpload: files }),
  setToken: (token) => set({ token: token }),
  setClientId: (clientId) => set({ clientId: clientId }),
  updateSelectedFile: (property, value) => {
    set((state) => {
      if (state.selectedFileIndex !== null) {
        const selectedFile = { ...state.files[state.selectedFileIndex], [property]: value };
        const files = [...state.files];
        files[state.selectedFileIndex] = selectedFile;
        return { files };
      }
      return state;
    });
  },
  updateFileAtIndex: (index, property, value) => {
    if (index !== null) {
      set((state) => {
        const selectedFile = { ...state.files[index], [property]: value };
        const files = [...state.files];
        files[index] = selectedFile;
        return { files };
      });
    }
  },
  setLoggedIn: (loggedIn) => {
    set({ loggedIn: loggedIn });
  },
  addFilesFormData: (formData) => {
    set((state: PlaygroundStore) => ({
      ...state,
      filesFormData: [...state.filesFormData, formData],
    }));
  },
  toggleExtractSetting: (settingName: keyof ExtractSettings) => {
    set((state) => {
      // Check if the setting exists in extractSettings
      if (state.extractSettings && settingName in state.extractSettings) {
        // Toggle the boolean value of the setting
        const newSettings = {
          ...state.extractSettings,
          [settingName]: !state.extractSettings[settingName],
        };
        return { extractSettings: newSettings };
      }
      return state; // Return current state if settingName is not found
    });
  },
  updateModelType: (modelType) => {
    set({ modelType });
  },
}));

export default usePlaygroundStore;
