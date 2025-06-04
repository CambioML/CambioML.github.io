import { useRouter } from 'next/navigation';
import Button from './Button';
import { useTranslation } from '@/lib/use-translation';

interface DemoButtonProps {
  small?: boolean;
}

const DemoButton = ({ small }: DemoButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className={small ? 'w-[200px]' : 'w-[300px]'}>
      <Button
        label={t.homepage.hero.tryFree}
        onClick={() => {
          router.push('/playground');
        }}
        small={small}
      />
    </div>
  );
};

export default DemoButton;
