import React, { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useProductionContext } from './ProductionContext';
import updateQuota from '@/app/actions/updateQuota';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import useAccountStore from '@/app/hooks/useAccountStore';
import getNewApiKey from '@/app/actions/account/getNewApiKey';

const QUOTA_YELLOW_THRESHOLD = 50;
const QUOTA_ORANGE_THRESHOLD = 25;
const QUOTA_RED_THRESHOLD = 15;

interface QuotaDisplayProps {
  userId: string;
}

const QuotaDisplay = ({ userId }: QuotaDisplayProps) => {
  const { totalQuota, remainingQuota, token, setTotalQuota, setRemainingQuota, fileCollapsed } = usePlaygroundStore();
  const { apiURL, isProduction } = useProductionContext();
  const [isLoading, setIsLoading] = useState(false);
  const { apiKeys } = useAccountStore();
  const quotaPercent = (remainingQuota / totalQuota) * 100;
  let madeApiKey = false;

  const handleRefresh = async () => {
    setIsLoading(true);
    await updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError: () => {} });
    setIsLoading(false);
  };

  const getBarColor = (quotaPercent: number) => {
    if (quotaPercent > QUOTA_YELLOW_THRESHOLD) return 'bg-green-500';
    if (quotaPercent > QUOTA_ORANGE_THRESHOLD) return 'bg-yellow-500';
    if (quotaPercent > QUOTA_RED_THRESHOLD) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleError = async (e: AxiosError | Error) => {
    console.error(e);
    if (apiKeys.length === 0 && !madeApiKey) {
      if (!userId || !token) {
        console.log('No profile or token', userId, token);
        return;
      }
      madeApiKey = true;
      await getNewApiKey({ userId: userId, token: token, apiURL });
      if (!isProduction) toast.success('API key generated');
      return;
    }
  };

  useEffect(() => {
    const maxRetries = 10;
    let attempts = 0;

    const intervalId = setInterval(async () => {
      if (totalQuota > 0 || attempts >= maxRetries) {
        clearInterval(intervalId);
        return;
      }

      if (!userId || !apiURL || !token) {
        if (attempts < maxRetries) {
          attempts++;
        } else {
          handleError(new Error('Max retries reached without valid inputs'));
        }
        return;
      }

      try {
        await updateQuota({
          api_url: apiURL,
          userId,
          token,
          setTotalQuota,
          setRemainingQuota,
          handleError,
        });
      } catch {
        if (attempts < maxRetries) {
          attempts++;
        } else {
          handleError(new Error('Max retries reached due to updateQuota errors'));
        }
      }

      attempts++;
    }, 1000);

    return () => clearInterval(intervalId);
  }, [userId, apiURL, token, totalQuota]);

  return (
    <div className="w-full flex flex-col items-center pt-2">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className={`font-semibold ${fileCollapsed ? 'inline lg:hidden' : 'inline'} text-lg`}>Quota</h2>
        <div
          className="flex items-center text-neutral-600 justify-center bg-white rounded-md w-[30px] h-[30px] hover:bg-neutral-100 hover:text-neutral-800 hover:border-2 shrink-0 cursor-pointer"
          onClick={handleRefresh}
        >
          <ArrowsClockwise size={20} />
        </div>
      </div>
      {totalQuota === 0 || isLoading ? (
        <>
          <div className={`w-full bg-neutral-300 rounded-full h-2.5 animate-pulse`}> &nbsp;</div>
          <span className="text-xs mt-1">{`--/-- pages`}</span>
        </>
      ) : (
        <>
          <div
            className={`w-full ${remainingQuota === 0 ? 'bg-red-300' : 'bg-neutral-300'} rounded-full h-2.5 flex justify-end`}
          >
            <div
              className={`${getBarColor(quotaPercent)} ${isLoading && 'animate-pulse'} h-2.5 rounded-full`}
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <span className="text-xs mt-1">{`${remainingQuota}/${totalQuota} pages`}</span>
        </>
      )}
    </div>
  );
};

export default QuotaDisplay;
