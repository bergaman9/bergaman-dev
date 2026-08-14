import { VocabularyProvider } from '@/context/VocabularyContext';

export default function VocabularyLayout({ children }) {
  return <VocabularyProvider>{children}</VocabularyProvider>;
}
