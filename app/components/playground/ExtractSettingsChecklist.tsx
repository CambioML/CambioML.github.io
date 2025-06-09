import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import CheckBox from '../inputs/CheckBox';
import { useTranslation } from '@/lib/use-translation';
import useTheme from '@/app/hooks/useTheme';
import { cn } from '@/lib/cn';

interface ExtractSettingsChecklistProps {
  removePIIOnly?: boolean;
}

const ExtractSettingsChecklist = ({ removePIIOnly }: ExtractSettingsChecklistProps) => {
  const { extractSettings, toggleExtractSetting } = usePlaygroundStore();
  const { t } = useTranslation();
  const theme = useTheme();

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative flex flex-col items-start justify-center gap-4 border-[1px] border-neutral-200 rounded-lg p-4 w-full shadow-md max-w-[450px] lg:max-w-[400px]`}
    >
      <div className={cn('font-semibold text-sm', isDark ? 'text-neutral-100' : 'text-neutral-800')}>
        {t.playground.extractSettings.removeFromOutput}
      </div>
      <div className={`grid ${removePIIOnly ? 'grid-cols-1' : 'grid-cols-2'} lg:grid-cols-1 gap-2`}>
        <CheckBox
          label={t.playground.extractSettings.personalIdentifiableInfo}
          checked={extractSettings.removePII}
          onChange={() => toggleExtractSetting('removePII')}
          id="remove-pii-checkbox"
        />
        {!removePIIOnly && (
          <>
            <CheckBox
              label={t.playground.extractSettings.pageNumbers}
              checked={!extractSettings.includePageNumbers}
              onChange={() => toggleExtractSetting('includePageNumbers')}
            />
            <CheckBox
              label={t.playground.extractSettings.footnotes}
              checked={!extractSettings.includeFootnotes}
              onChange={() => toggleExtractSetting('includeFootnotes')}
            />
            <CheckBox
              label={t.playground.extractSettings.headersFooters}
              checked={!extractSettings.includeHeadersFooters}
              onChange={() => toggleExtractSetting('includeHeadersFooters')}
            />
            <CheckBox
              label={t.playground.extractSettings.tables}
              checked={!extractSettings.includeTables}
              onChange={() => toggleExtractSetting('includeTables')}
            />
            <CheckBox
              label={t.playground.extractSettings.chartsFigures}
              checked={!extractSettings.includeChartsFigures}
              onChange={() => toggleExtractSetting('includeChartsFigures')}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ExtractSettingsChecklist;
