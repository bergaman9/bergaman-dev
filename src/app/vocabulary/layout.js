export const metadata = {
  title: 'Vocabulary Vault',
  description: 'Build and retain English vocabulary with anonymous progress tracking in Bergaman Labs.',
  alternates: { canonical: '/vocabulary' },
};

export default function VocabularyLayout({ children }) {
  return <VocabularyProvider>{children}</VocabularyProvider>;
}
import { VocabularyProvider } from '@/context/VocabularyContext';
