import { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

export function useOTP(initialCountdown: number = 60) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(initialCountdown);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pastedCode = text.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newCode = [...code];

      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });

      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetCountdown = () => setCountdown(initialCountdown);

  const getFullCode = () => code.join('');

  return {
    code,
    countdown,
    inputRefs,
    handleCodeChange,
    handleKeyPress,
    resetCountdown,
    getFullCode
  };
}