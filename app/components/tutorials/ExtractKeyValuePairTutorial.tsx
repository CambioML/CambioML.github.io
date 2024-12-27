import Joyride, { Placement } from 'react-joyride';
import { useLocalStorage } from 'react-use';

const steps = [
  {
    target: 'button[aria-label="Add Key-Value Pair"]',
    content: 'Click to insert new entry below',
    placement: 'left' as Placement,
    offset: -10,
  },
  {
    target: 'button[aria-label="Expand Key Description"]',
    content: 'Click to expand key description',
    placement: 'left' as Placement,
    offset: -10,
  },
];

const ExtractKeyValuePairTutorial = () => {
  const [hasCompletedTutorial, setHasCompletedTutorial] = useLocalStorage('completed-kvp-tutorial', false);

  const handleTourEnd = () => {
    setHasCompletedTutorial(true);
  };

  if (hasCompletedTutorial) {
    return null;
  }

  return (
        <Joyride 
          continuous
          steps={steps} 
          floaterProps={{
              autoOpen: true,
          }}
          styles={{
            options: {
              primaryColor: 'var(--cambio-gray)',
            },
          }}
          disableOverlay 
          disableScrolling
          callback={({ status }) => {
            if (['finished', 'skipped'].includes(status)) {
              handleTourEnd();
            }
          }}
        />
  );
};

export default ExtractKeyValuePairTutorial;