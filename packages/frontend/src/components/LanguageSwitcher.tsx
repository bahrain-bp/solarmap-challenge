// LanguageSwitcher.tsx
import React from 'react';

interface LanguageSwitcherProps {
  onChangeLanguage: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onChangeLanguage }) => {
  return (
    <select onChange={(e) => onChangeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="ar">Arabic</option>
    </select>
  );
}

export default LanguageSwitcher;
