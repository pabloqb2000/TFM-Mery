import { useState, useEffect, useCallback } from 'react';
import { getUserExtraData, updateUserExtraData } from '../services/usersService';
import type { Input, KeyBindedOption } from '../model/inputs';
import { useExecuteDeferred } from '../hooks/useExecuteDeferred';
import './UserExtraDataInput.css';

interface UserExtraDataInputProps {
  userId: string;
  inputs: Input[];
}

export default function UserExtraDataInput({ userId, inputs }: UserExtraDataInputProps) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Load data on mount and when userId changes
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const extraData = await getUserExtraData(userId);
        setData(extraData || {});
      } catch (error) {
        console.error('Error loading extra data:', error);
        setData({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Debounced save function
  const executeDeferredSave = useExecuteDeferred(
    async (newData: Record<string, any>) => {
      if (!userId) return;
      
      setSaving(true);
      try {
        await updateUserExtraData(userId, newData);
      } catch (error) {
        console.error('Error saving extra data:', error);
      } finally {
        setSaving(false);
      }
    },
    500 // 500ms debounce
  );

  const saveData = useCallback((newData: Record<string, any>) => {
    executeDeferredSave(newData);
  }, [executeDeferredSave]);

  // Handle input change
  const handleChange = useCallback((key: string, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  // Handle field deletion
  const handleDelete = useCallback((key: string) => {
    const newData = { ...data };
    delete newData[key];
    setData(newData);
    saveData(newData);
  }, [data, saveData]);

  // Handle keybindings for select and radio options globally
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      console.log(event.key)
      
      // Only prevent keybindings when user is actively typing in text inputs
      // Allow keybindings globally for select/radio inputs and everywhere else
      const isTextInput = target.tagName === 'INPUT' && 
        ['text', 'email', 'password', 'tel', 'url', 'search', 'number', 'date', 'datetime-local', 'month', 'time', 'week', 'color'].includes((target as HTMLInputElement).type);
      const isTextarea = target.tagName === 'TEXTAREA';
      const isContentEditable = target.isContentEditable;
      
      if (isTextInput || isTextarea || isContentEditable) {
        return;
      }

      // Check each input for matching keybindings
      inputs.forEach((input) => {
        if ((input.type === 'select' || input.type === 'radio') && input.options) {
          const options = input.options;
          options.forEach((option) => {
            if (typeof option === 'object' && 'keyBind' in option) {
              const keyBindedOption = option as KeyBindedOption;
              if (keyBindedOption.keyBind === event.key) {
                event.preventDefault();
                handleChange(input.label, keyBindedOption.option);
              }
            }
          });
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputs, handleChange]);


  if (loading) {
    return <div className="user-extra-data-input">Loading...</div>;
  }

  const renderInput = (input: Input, autoFocus?: boolean) => {
    // Only use data from the loaded data, ignore input.value when data is missing
    // This ensures empty/unchecked state when data is missing from server
    const hasValue = data[input.label] !== undefined;
    const value = hasValue ? data[input.label] : '';
    const inputKey = input.label;

    switch (input.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'search':
        return (
          <input
            key={inputKey}
            type={input.type}
            value={value}
            onChange={(e) => handleChange(inputKey, e.target.value)}
            placeholder={input.placeholder}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'number':
      case 'range':
        // Show empty string when data is missing, otherwise show the value
        const numberValue = hasValue ? value : '';
        return (
          <input
            key={inputKey}
            type={input.type}
            value={numberValue}
            onChange={(e) => {
              const newValue = e.target.value === '' ? '' : (input.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value);
              handleChange(inputKey, newValue);
            }}
            placeholder={input.placeholder}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'date':
      case 'datetime-local':
      case 'month':
      case 'time':
      case 'week':
        return (
          <input
            key={inputKey}
            type={input.type}
            value={value}
            onChange={(e) => handleChange(inputKey, e.target.value)}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'color':
        // Color inputs require a valid hex color, use #000000 as display default when missing
        // Only save when user actually changes the value
        const colorValue = hasValue ? value : '#000000';
        return (
          <input
            key={inputKey}
            type="color"
            value={colorValue}
            onChange={(e) => handleChange(inputKey, e.target.value)}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'textarea':
        return (
          <textarea
            key={inputKey}
            value={value}
            onChange={(e) => handleChange(inputKey, e.target.value)}
            placeholder={input.placeholder}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'checkbox':
        // Only check if value exists in data and is truthy
        return (
          <input
            key={inputKey}
            type="checkbox"
            checked={hasValue && !!value}
            onChange={(e) => handleChange(inputKey, e.target.checked)}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      case 'select':
        // Check if current value exists in options, if not use empty string
        const selectValue = hasValue && input.options?.some(opt => {
          const optValue = typeof opt === 'string' ? opt : (opt as KeyBindedOption).option;
          return optValue === value;
        }) ? value : '';
        
        return (
          <select
            key={inputKey}
            value={selectValue}
            onChange={(e) => handleChange(inputKey, e.target.value)}
            required={input.required}
            disabled={input.disabled}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          >
            <option value="">-- Select --</option>
            {input.options?.map((option, index) => {
              if (typeof option === 'string') {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              } else {
                const keyBindedOption = option as KeyBindedOption;
                return (
                  <option key={index} value={keyBindedOption.option}>
                    {keyBindedOption.option} ({keyBindedOption.keyBind})
                  </option>
                );
              }
            })}
          </select>
        );

      case 'radio':
        if (!input.options) return null;
        return (
          <div key={inputKey} className="radio-group">
            {input.options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : (option as KeyBindedOption).option;
              const optionLabel = typeof option === 'string' ? option : `${(option as KeyBindedOption).option} (${(option as KeyBindedOption).keyBind})`;
              // Only check if value exists in data and matches this option
              const isChecked = hasValue && value === optionValue;
              return (
                <label key={index} className="radio-option">
                  <input
                    type="radio"
                    name={inputKey}
                    value={optionValue}
                    checked={isChecked}
                    onChange={(e) => handleChange(inputKey, e.target.value)}
                    required={input.required}
                    disabled={input.disabled}
                    readOnly={input.readonly}
                  />
                  <span>{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'file':
        return (
          <input
            key={inputKey}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleChange(inputKey, file.name);
              }
            }}
            required={input.required}
            disabled={input.disabled}
            readOnly={input.readonly}
            autoFocus={autoFocus}
            className={input.className}
            style={input.style}
          />
        );

      default:
        return null;
    }
  };

  // Trash icon SVG
  const TrashIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="trash-icon"
    >
      <path
        d="M5.5 5.5C5.77614 5.5 6 5.72386 6 6V11C6 11.2761 5.77614 11.5 5.5 11.5C5.22386 11.5 5 11.2761 5 11V6C5 5.72386 5.22386 5.5 5.5 5.5Z"
        fill="currentColor"
      />
      <path
        d="M8 5.5C8.27614 5.5 8.5 5.72386 8.5 6V11C8.5 11.2761 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.2761 7.5 11V6C7.5 5.72386 7.72386 5.5 8 5.5Z"
        fill="currentColor"
      />
      <path
        d="M11 6C11 5.72386 10.7761 5.5 10.5 5.5C10.2239 5.5 10 5.72386 10 6V11C10 11.2761 10.2239 11.5 10.5 11.5C10.7761 11.5 11 11.2761 11 11V6Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 2C10.7761 2 11 2.22386 11 2.5V3H13.5C13.7761 3 14 3.22386 14 3.5C14 3.77614 13.7761 4 13.5 4H13V12.5C13 13.3284 12.3284 14 11.5 14H4.5C3.67157 14 3 13.3284 3 12.5V4H2.5C2.22386 4 2 3.77614 2 3.5C2 3.22386 2.22386 3 2.5 3H5V2.5C5 2.22386 5.22386 2 5.5 2H10.5ZM4 4V12.5C4 12.7761 4.22386 13 4.5 13H11.5C11.7761 13 12 12.7761 12 12.5V4H4Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="user-extra-data-input">
      {saving && <div className="saving-indicator">Saving...</div>}
      <div className="inputs-container">
        {inputs.map((input, idx) => (
          <div key={input.label} className="input-group">
            <label className="input-label" title={input.label}>
              {input.label}
              {input.required && <span className="required-asterisk">*</span>}
            </label>
            <div className="input-wrapper">
              {renderInput(input, idx === 0)}
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(input.label)}
                title="Remove field"
                aria-label="Remove field"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

