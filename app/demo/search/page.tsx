'use client';

import dynamic from 'next/dynamic';

const SearchExamples = dynamic(() => import('@/components/examples/search-examples').then(mod => ({ default: mod.SearchExamples })), {
  ssr: false,
  loading: () => <div className="p-6">Loading search examples...</div>
});

export default function SearchDemoPage() {
  return <SearchExamples />;
}
