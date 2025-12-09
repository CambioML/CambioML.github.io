import React, { useCallback, useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useProductionContext } from './ProductionContext';
import useAccountStore from '@/app/hooks/useAccountStore';
import { useTranslation } from '@/lib/use-translation';
import { checkQuota } from '@/app/actions/account/ApiKey';

const QUOTA_YELLOW_THRESHOLD = 50;
const QUOTA_ORANGE_THRESHOLD = 25;
const QUOTA_RED_THRESHOLD = 15;

interface QuotaDisplayProps {
  isCollapsed?: boolean;
}

// Define the quota data type based on checkQuota return type
interface CheckQuotaRequest {
  remaining_quota: number;
  total_used: number;
}

const QuotaDisplay = ({ isCollapsed }: QuotaDisplayProps) => {
  const { totalQuota, remainingQuota, setTotalQuota, setRemainingQuota, fileCollapsed, loadingQuota, setLoadingQuota } =
    usePlaygroundStore();
  const { apiURL } = useProductionContext();
  const { t } = useTranslation();
  const { apiKeys } = useAccountStore();
  const [quotaData, setQuotaData] = useState<CheckQuotaRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the first available API key
  const apiKey = apiKeys && apiKeys.length > 0 ? apiKeys[0].api_key : null;

  const fetchQuotaData = useCallback(async () => {
    // Don't fetch if we don't have an API key yet
    if (!apiKey || !apiURL) {
      console.log('No API key or API URL available yet, skipping quota fetch');
      return;
    }

    setIsLoading(true);

    try {
      const result = await checkQuota({ apiKey, apiURL });
      setQuotaData(result);
      // Update the playground store with the new quota data
      const totalQuotaValue = result.remaining_quota + result.total_used;
      setTotalQuota(totalQuotaValue);
      setRemainingQuota(result.remaining_quota);
      setLoadingQuota(false); // Clear the playground store loading state
    } catch (err) {
      console.error('Error fetching quota data:', err);
      // Note: Error is logged but not stored in state for now
      setLoadingQuota(false); // Clear loading state even on error
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, apiURL, setTotalQuota, setRemainingQuota, setLoadingQuota]);

  const handleRefresh = () => {
    fetchQuotaData();
  };

  useEffect(() => {
    // Only fetch quota data when we have an API key and API URL
    if (apiKey && apiURL) {
      fetchQuotaData();
    }
  }, [apiKey, apiURL, fetchQuotaData]);

  // Use local quotaData as fallback if playground store values aren't ready
  const displayTotalQuota =
    totalQuota > 0 ? totalQuota : quotaData ? quotaData.remaining_quota + quotaData.total_used : 0;
  const displayRemainingQuota = totalQuota > 0 ? remainingQuota : quotaData ? quotaData.remaining_quota : 0;

  const quotaPercent = displayTotalQuota > 0 ? (displayRemainingQuota / displayTotalQuota) * 100 : 0;

  const getBarColor = (quotaPercent: number) => {
    if (quotaPercent > QUOTA_YELLOW_THRESHOLD) return 'bg-green-500';
    if (quotaPercent > QUOTA_ORANGE_THRESHOLD) return 'bg-yellow-500';
    if (quotaPercent > QUOTA_RED_THRESHOLD) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Don't render anything if we don't have an API key yet - just show a compact loading state
  if (!apiKey) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-2">
          <h2 className="font-semibold text-sm text-muted-foreground">{t.playground.quota.title}</h2>
        </div>
        <div className="w-full bg-neutral-300 rounded-full h-2.5 animate-pulse">&nbsp;</div>
        <span className="text-xs mt-1 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className={`font-semibold ${fileCollapsed ? 'inline lg:hidden' : 'inline'} text-sm`}>
          {t.playground.quota.title}
        </h2>
        <div
          className="flex items-center text-neutral-600 dark:text-neutral-400 justify-center bg-white dark:bg-gray-800 rounded-md w-[24px] h-[24px] hover:bg-neutral-100 dark:hover:bg-gray-700 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border shrink-0 cursor-pointer"
          onClick={handleRefresh}
        >
          <ArrowsClockwise size={16} />
        </div>
      </div>
      {displayTotalQuota === 0 || isLoading || loadingQuota ? (
        <>
          <div className={`w-full bg-neutral-300 rounded-full h-2.5 animate-pulse`}> &nbsp;</div>
          <span className="text-xs mt-1">{`--/-- ${t.playground.quota.pages}`}</span>
        </>
      ) : (
        <>
          <div
            className={`w-full ${displayRemainingQuota === 0 ? 'bg-red-300' : 'bg-neutral-300'} rounded-full h-2.5 flex justify-start`}
          >
            <div
              className={`${getBarColor(quotaPercent)} ${isLoading && 'animate-pulse'} h-2.5 rounded-full`}
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <span className="text-xs mt-1">
            {`${displayRemainingQuota}/${displayTotalQuota}`} {!isCollapsed && ` ${t.playground.quota.pages}`}
          </span>
        </>
      )}
    </div>
  );
};

export default QuotaDisplay;
