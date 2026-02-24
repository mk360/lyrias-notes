import React from 'react';
import { useAppContext } from '../../context/AppContext';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  const { config } = useAppContext();

  if (!isOpen || !config) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const openRepository = () => {
    if (config.app.repository) {
      window.open(config.app.repository, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl">
        {/* App Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{config.app.name}</h2>
          <p className="text-gray-400">Version {config.app.version}</p>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-4 text-center">
          A web app that helps you sort through combo notations, matchup knowledge, and other things about GBVSR characters!
        </p>

        {/* Author */}
        <p className="text-gray-400 mb-4 text-center">
          Built by: <span className="text-white">{config.app.author}</span>
        </p>

        {/* Repository Link */}
        <div className="mb-6 text-center">
          <button
            onClick={openRepository}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {config.app.repository}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
