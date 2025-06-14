import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { Icon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import InfoButton from './InfoButton';
import { usePostHog } from 'posthog-js/react';
import { cn } from '@/lib/cn';
import useTheme from '@/app/hooks/useTheme';

interface PlaygroundTabProps {
  label: string;
  tabKey: string;
  icon?: Icon;
}

const PlaygroundTab = ({ label, tabKey, icon: Icon }: PlaygroundTabProps) => {
  const { selectedFileIndex, files, updateSelectedFile } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const posthog = usePostHog();
  const theme = useTheme();

  const handleClick = () => {
    updateSelectedFile('activeTab', tabKey);
    const module = tabKey.replace(' ', '_').toLocaleLowerCase();
    const posthogLabel = `playground.${module}.tab`.toLocaleLowerCase();
    posthog.capture(posthogLabel, { route: '/playground', module: module });
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  const isSelected = selectedFile?.activeTab === tabKey;
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'text-xl flex items-center justify-center gap-2 cursor-pointer rounded-t-xl font-semibold transition duration-300 border-solid',
        isSelected
          ? `${isDark ? 'text-neutral-100' : 'text-neutral-800'} border border-b-0`
          : `${isDark ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-100'} border-b`
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
