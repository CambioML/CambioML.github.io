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
    const moduleKey = tabKey.replace(' ', '_').toLocaleLowerCase();
    const posthogLabel = `playground.${moduleKey}.tab`.toLocaleLowerCase();
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
        'text-xl flex items-center justify-center gap-2 cursor-pointer rounded-t-xl font-semibold transition duration-300 border-solid',
        isSelected
          ? 'text-neutral-800 dark:text-neutral-100 border border-b-0'
          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b'
      )}
      onClick={handleClick}
    >
      <h2>{label}</h2>
      {Icon && <Icon size={24} />}
      <InfoButton infoType={tabKey} />
    </div>
  );
};

export default PlaygroundTab;
