import { useState } from 'react';
import { models } from '../../wailsjs/go/models';

export const useUpdateCheck = () => {
  const [updateInfo, setUpdateInfo] = useState<models.UpdateInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = async () => {
    setChecking(true);
    setError(null);
    try {
      // const info = await CheckForUpdates();
      // setUpdateInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check for updates');
      console.error('Failed to check for updates:', err);
    } finally {
      setChecking(false);
    }
  };

  return {
    updateInfo,
    checking,
    error,
    checkForUpdates,
  };
};
