import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';

const AnimatedPlaceholderInput = ({ style, ...props }) => {
  const placeholders = ['Seattle', 'New York', 'Los Angeles', 'San Francisco', 'Tokyo', 'London', 'Paris'];
  const typingSpeed = 150; // ms per character when typing
  const deletingSpeed = 75; // ms per character when deleting
  const pauseTime = 2000; // pause after full word is typed

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = placeholders[placeholderIndex];
    let timeout;

    if (!isDeleting && charIndex <= currentText.length) {
      // Typing phase: add one more character
      timeout = setTimeout(() => {
        setCurrentPlaceholder(currentText.substring(0, charIndex));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex > currentText.length) {
      // Pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
        setCharIndex(charIndex - 1);
      }, pauseTime);
    } else if (isDeleting && charIndex >= 0) {
      // Deleting phase: remove one character
      timeout = setTimeout(() => {
        setCurrentPlaceholder(currentText.substring(0, charIndex));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex < 0) {
      // Move to next placeholder and start typing again
      setIsDeleting(false);
      setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex]);

  return (
    <TextInput
      {...props}
      style={style}
      placeholder={currentPlaceholder}
      placeholderTextColor="#aaa"
    />
  );
};

export default AnimatedPlaceholderInput;
