import React from 'react';
import dynamic from 'next/dynamic';
import SectionPlaceholder1 from './SectionPlaceholder1';
import SectionPlaceholder2 from './SectionPlaceholder2';

const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);
const SectionContainer = () => (
  <div className="grid grid-flow-col auto-cols-fr m-3 gap-2">
    <SectionPlaceholder1 />
    <SectionPlaceholder2 />
    <div className="bg-white border-b-2 border-secondary rounded-md shadow h-editor overflow-hidden">
      <UsfmEditor />
    </div>
  </div>
  );
export default SectionContainer;
