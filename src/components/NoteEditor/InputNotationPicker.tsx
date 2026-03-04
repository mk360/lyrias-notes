import React, { useState } from 'react';
import { Config } from '../../types';

interface InputNotationPickerProps {
  config: Config;
  onInsert: (notation: string) => void;
  onClose: () => void;
}

const DIRECTIONAL_INPUTS = [
  { value: '', label: 'None' },
  { value: '236', label: '236 (QCF)' },
  { value: '214', label: '214 (QCB)' },
  { value: '22', label: '22 (Down Down)' },
  { value: '623', label: '623 (DP)' },
  { value: '632146', label: '632146 (360)' },
  { value: '[4]6', label: '[4]6 (Charge)' },
  { value: '[2]8', label: '[2]8 (Charge)' },
  { value: '236236', label: '236236 (Double QCF)' },
  { value: '214214', label: '214214 (Double QCB)' },
  { value: '5S', label: '5S (Standing Skill)' },
  { value: '6S', label: '6S (Forward Skill)' },
  { value: '4S', label: '4S (Back Skill)' },
  { value: '2S', label: '2S (Down Skill)' },
  { value: '236S', label: '236S (Skill Special)' },
];

const BUTTONS = [
  { value: 'L', label: 'Light (L)', color: 'light' },
  { value: 'M', label: 'Medium (M)', color: 'medium' },
  { value: 'H', label: 'Heavy (H)', color: 'heavy' },
  { value: 'U', label: 'Ultimate (U)', color: 'ultimate' },
  { value: 'S', label: 'Skill (S)', color: 'skill' },
];

const MODIFIERS = [
  { value: '', label: 'None' },
  { value: 'c.', label: 'Close (c.)' },
  { value: 'f.', label: 'Far (f.)' },
  { value: 'j.', label: 'Jump (j.)' },
];

const InputNotationPicker: React.FC<InputNotationPickerProps> = ({
  config,
  onInsert,
  onClose,
}) => {
  const [selectedDirectional, setSelectedDirectional] = useState('');
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [selectedModifier, setSelectedModifier] = useState('');

  const handleButtonToggle = (button: string) => {
    if (selectedButtons.includes(button)) {
      setSelectedButtons(selectedButtons.filter((b) => b !== button));
    } else {
      setSelectedButtons([...selectedButtons, button]);
    }
  };

  const buildNotation = () => {
    let notation = '';

    // Add modifier if present
    if (selectedModifier) {
      notation += selectedModifier;
    }

    // Add directional input
    notation += selectedDirectional;

    // Add buttons with + separator if multiple
    if (selectedButtons.length > 0) {
      if (notation && !notation.endsWith('S')) {
        // For non-skill inputs, buttons are separate
        notation += selectedButtons.join('+');
      } else if (notation.endsWith('S')) {
        // For skill inputs, use +
        notation += '+' + selectedButtons.join('+');
      } else {
        // No directional, just buttons
        notation = selectedButtons.join('+');
      }
    }

    return notation;
  };

  const handleInsert = () => {
    const notation = buildNotation();
    if (notation) {
      onInsert(notation);
    }
  };

  const canInsert = selectedDirectional || selectedButtons.length > 0;
  const previewNotation = buildNotation();

  return (
    <div className="bg-white border border-gray-300 rounded shadow-lg p-4 w-80" style={{
      overflowY: "scroll",
      height: 400
    }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Insert Move Input</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Modifier */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Modifier</label>
        <select
          value={selectedModifier}
          onChange={(e) => setSelectedModifier(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {MODIFIERS.map((mod) => (
            <option key={mod.value} value={mod.value}>
              {mod.label}
            </option>
          ))}
        </select>
      </div>

      {/* Directional Input */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Directional Input</label>
        <select
          value={selectedDirectional}
          onChange={(e) => setSelectedDirectional(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {DIRECTIONAL_INPUTS.map((dir) => (
            <option key={dir.value} value={dir.value}>
              {dir.label}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Buttons (multi-select)
        </label>
        <div className="space-y-1">
          {BUTTONS.map((button) => (
            <label
              key={button.value}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedButtons.includes(button.value)}
                onChange={() => handleButtonToggle(button.value)}
                className="rounded"
              />
              <span
                className="font-medium"
                style={{ color: config.colors[button.color as keyof typeof config.colors] }}
              >
                {button.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      {previewNotation && (
        <div className="mb-3 p-2 bg-gray-100 rounded">
          <div className="text-xs text-gray-600 mb-1">Preview:</div>
          <div className="font-mono font-bold text-lg">{previewNotation}</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleInsert}
          disabled={!canInsert}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Insert
        </button>
      </div>
    </div>
  );
};

export default InputNotationPicker;
