import React, { useEffect, useState } from 'react';
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

  const fetchQuotaData = async () => {
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
  };

  const handleRefresh = () => {
    fetchQuotaData();
  };

  useEffect(() => {
    // Only fetch quota data when we have an API key and API URL
    if (apiKey && apiURL) {
      fetchQuotaData();
    }
  }, [apiKey, apiURL]); // Depend on apiKey and apiURL

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

  // Don't render anything if we don't have an API key yet
  if (!apiKey) {
    return (
      <div className="row-span-1 h-full border-t-2 py-2 w-full flex flex-col gap-2 items-center justify-center">
        {!isCollapsed && <div className="text-sm text-neutral-500">Loading quota...</div>}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-2">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className={`font-semibold ${fileCollapsed ? 'inline lg:hidden' : 'inline'} text-lg`}>
          {t.playground.quota.title}
        </h2>
        <div
          className="flex items-center text-neutral-600 justify-center bg-white rounded-md w-[30px] h-[30px] hover:bg-neutral-100 hover:text-neutral-800 hover:border shrink-0 cursor-pointer"
          onClick={handleRefresh}
        >
          <ArrowsClockwise size={20} />
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
