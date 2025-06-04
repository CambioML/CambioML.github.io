import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { Icon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import InfoButton from './InfoButton';
import { usePostHog } from 'posthog-js/react';

interface PlaygroundTabProps {
  label: string;
  tabKey: string;
  icon?: Icon;
}

const unselectedStyle = 'text-neutral-500 hover:bg-neutral-100 border-b-2';
const selectedStyle = 'text-neutral-800 border-2 border-b-0';

const PlaygroundTab = ({ label, tabKey, icon: Icon }: PlaygroundTabProps) => {
  const { selectedFileIndex, files, updateSelectedFile, loggedIn } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const posthog = usePostHog();
  const handleClick = () => {
    if (loggedIn) {
      updateSelectedFile('activeTab', tabKey);
      const module = tabKey.replace(' ', '_').toLocaleLowerCase();
      const posthogLabel = `playground.${module}.tab`.toLocaleLowerCase();
      posthog.capture(posthogLabel, { route: '/playground', module: module });
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);
  return (
    <div
      className={`text-xl flex items-center justify-center gap-2 cursor-pointer rounded-t-xl font-semibold  transition duration-300 border-solid ${selectedFile?.activeTab === tabKey ? selectedStyle : unselectedStyle}`}
      onClick={handleClick}
    >
      <h2>{label}</h2>
      {Icon && <Icon size={24} />}
      <InfoButton infoType={tabKey} />
    </div>
  );
};

export default PlaygroundTab;
