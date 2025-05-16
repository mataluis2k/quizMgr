import React from 'react';
import { Palette, Type, Circle, Square } from 'lucide-react';
import { Styling, Theme, ButtonShape } from '../../types';
import Select from '../ui/Select';
import Input from '../ui/Input';

interface QuizStylingProps {
  styling: Styling;
  onUpdate: (updatedStyling: Styling) => void;
}

const QuizStyling: React.FC<QuizStylingProps> = ({ styling, onUpdate }) => {
  const handleThemeChange = (value: string) => {
    onUpdate({ ...styling, theme: value as Theme });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...styling, fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...styling, fontSize: e.target.value });
  };

  const handleColorChange = (colorType: 'primary' | 'secondary', value: string) => {
    onUpdate({
      ...styling,
      colors: {
        ...styling.colors,
        [colorType]: value,
      },
    });
  };

  const handleButtonShapeChange = (value: string) => {
    onUpdate({
      ...styling,
      buttonStyle: {
        ...styling.buttonStyle,
        shape: value as ButtonShape,
      },
    });
  };

  const handleButtonIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...styling,
      buttonStyle: {
        ...styling.buttonStyle,
        icon: e.target.value,
      },
    });
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'custom', label: 'Custom' },
  ];

  const buttonShapeOptions = [
    { value: 'rounded', label: 'Rounded' },
    { value: 'square', label: 'Square' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Palette className="mr-2 text-indigo-600" size={20} />
        Quiz Styling
      </h3>
      
      <div className="space-y-4">
        <Select
          label="Theme"
          value={styling.theme}
          options={themeOptions}
          onChange={handleThemeChange}
          fullWidth
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Input
              label="Font Family"
              value={styling.fontFamily}
              onChange={handleFontFamilyChange}
              placeholder="Inter, sans-serif"
              fullWidth
            />
          </div>
          <div className="w-full sm:w-1/2">
            <Input
              label="Font Size"
              value={styling.fontSize}
              onChange={handleFontSizeChange}
              placeholder="16px"
              fullWidth
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Colors</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={styling.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#4F46E5"
                  fullWidth
                />
              </div>
              <div 
                className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0" 
                style={{ backgroundColor: styling.colors.primary }}
              />
            </div>
            <div className="w-full sm:w-1/2 flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={styling.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#0D9488"
                  fullWidth
                />
              </div>
              <div 
                className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0" 
                style={{ backgroundColor: styling.colors.secondary }}
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Button Style</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Select
                value={styling.buttonStyle.shape}
                options={buttonShapeOptions}
                onChange={handleButtonShapeChange}
                fullWidth
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Input
                value={styling.buttonStyle.icon}
                onChange={handleButtonIconChange}
                placeholder="check"
                fullWidth
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Type size={16} className="mr-1" />
            Preview
          </h4>
          <div 
            className="p-4 rounded" 
            style={{ 
              backgroundColor: styling.theme === 'dark' ? '#1f2937' : styling.theme === 'light' ? '#ffffff' : '#f9fafb',
              color: styling.theme === 'dark' ? '#f9fafb' : '#1f2937',
              fontFamily: styling.fontFamily,
              fontSize: styling.fontSize,
              border: '1px solid',
              borderColor: styling.theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="mb-3">
              <h3 className="font-semibold" style={{ color: styling.colors.primary }}>Sample Question</h3>
              <p>This is how your questions will appear.</p>
            </div>
            <div className="mb-3">
              <div className="flex space-x-2 items-center mb-2">
                <div 
                  className="w-4 h-4 border rounded-full flex-shrink-0" 
                  style={{ 
                    borderColor: styling.colors.secondary,
                  }}
                ></div>
                <span>Answer choice 1</span>
              </div>
              <div className="flex space-x-2 items-center">
                <div 
                  className="w-4 h-4 border rounded-full flex-shrink-0" 
                  style={{ 
                    borderColor: styling.colors.secondary,
                  }}
                ></div>
                <span>Answer choice 2</span>
              </div>
            </div>
            <div>
              <button 
                className="px-4 py-2 text-white"
                style={{ 
                  backgroundColor: styling.colors.primary,
                  borderRadius: styling.buttonStyle.shape === 'rounded' ? '0.375rem' : '0',
                }}
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStyling;