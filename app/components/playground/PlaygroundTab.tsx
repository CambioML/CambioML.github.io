import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { Icon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import InfoButton from './InfoButton';
import { usePostHog } from 'posthog-js/react';
import { cn } from '@/lib/cn';

interface PlaygroundTabProps {
  label: string;
  tabKey: string;
  icon?: Icon;
}

const PlaygroundTab = ({ label, tabKey, icon: Icon }: PlaygroundTabProps) => {
  const { selectedFileIndex, files, updateSelectedFile } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const posthog = usePostHog();

  const handleClick = () => {
    updateSelectedFile('activeTab', tabKey);
    const moduleKey = tabKey.replace(' ', '_').toLowerCase();
    const posthogLabel = `playground.${moduleKey}.tab`;
    posthog.capture(posthogLabel, { route: '/playground', module: moduleKey });
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  const isSelected = selectedFile?.activeTab === tabKey;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 h-10',
        isSelected
          ? 'bg-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
      )}
      onClick={handleClick}
      role="tab"
      aria-selected={isSelected}
    >
      {Icon && <Icon size={18} />}
      <span className="whitespace-nowrap">{label}</span>
      <div className="flex items-center">
        <InfoButton infoType={tabKey} />
      </div>
    </div>
  );
};

export default PlaygroundTab;
