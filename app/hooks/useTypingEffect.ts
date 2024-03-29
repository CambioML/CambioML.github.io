import { useState, useEffect } from 'react';

export const useTypingEffect = (
  words: string[],
  typeInterval: number = 200,
  deleteInterval: number = 100,
  pauseInterval = 500
) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function type() {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting ? 1 : -1;
      setText((current) => currentWord.substring(0, current.length - shouldDelete));
      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseInterval);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
      }
    }
    const thisTypeInterval = words[wordIndex].length > 4 ? typeInterval : typeInterval * 1.5;
    const timer = setTimeout(type, isDeleting ? deleteInterval : thisTypeInterval);
    return () => clearTimeout(timer);
  }, [wordIndex, isDeleting, text, deleteInterval, typeInterval, words, pauseInterval]);

  return text;
};
