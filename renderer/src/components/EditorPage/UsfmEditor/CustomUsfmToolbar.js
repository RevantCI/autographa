import React, { useContext } from 'react';
import {
    UsfmToolbar,
   //  withChapterSelection,
} from 'usfm-editor';
import { ReferenceContext } from '@/components/context/ReferenceContext';

const CustomUsfmToolbar = () => {
    const {
        state: {
          myEditorRef,
        },
      } = useContext(ReferenceContext);

    return (
      <div style={{ marginLeft: '-30px' }}>
        <UsfmToolbar
          editor={myEditorRef.current}
        />
      </div>
    );
};

export default CustomUsfmToolbar;
