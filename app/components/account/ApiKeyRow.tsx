import { ApiKey } from '@/app/hooks/useAccountStore';
import { Copy } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

interface ApiKeyRowProps {
  apiKey: ApiKey;
}

const ApiKeyRow = ({ apiKey }: ApiKeyRowProps) => {
  const maskApiKey = (key: string | undefined) => {
    if (!key || key.length <= 6) {
      return key || 'Invalid key'; // Handle undefined/null keys
    }
    const maskedLength = key.length - 6;
    const maskedPart = '•'.repeat(maskedLength);
    return `${key.slice(0, 3)}${maskedPart}${key.slice(-3)}`;
  };

  // Use api_key as the primary field
  const actualKey = apiKey.api_key;
  const maskedKey = maskApiKey(actualKey);

  const copyToClipboard = () => {
    if (!actualKey) {
      toast.error('No API key available to copy');
      return;
    }
    navigator.clipboard.writeText(actualKey);
    toast.success('API Key copied to clipboard!');
  };

  // Show additional info from the new API response
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full bg-neutral-100 p-4 rounded-xl grid grid-cols-1 gap-3 text-neutral-800">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-mono text-sm">{maskedKey}</div>
          {apiKey.email && <div className="text-xs text-gray-600 mt-1">Email: {apiKey.email}</div>}
        </div>
        <button
          className="p-2 bg-neutral-200 text-neutral-600 rounded-md hover:bg-neutral-500 hover:text-white focus:outline-none"
          onClick={copyToClipboard}
        >
          <Copy size={16} />
        </button>
      </div>

      {/* Show additional metadata if available */}
      {(apiKey.quota !== undefined || apiKey.plan || apiKey.status || apiKey.created_at) && (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t border-gray-300 pt-2">
          {apiKey.quota !== undefined && <div>Quota: {apiKey.quota}</div>}
          {apiKey.plan && <div>Plan: {apiKey.plan}</div>}
          {apiKey.status && <div>Status: {apiKey.status}</div>}
          {apiKey.created_at && <div>Created: {formatDate(apiKey.created_at)}</div>}
        </div>
      )}
    </div>
  );
};

export default ApiKeyRow;
