import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

export default function ProgramView() {
   

  return (
    <div>
   <Editor 
   height="90vh" 
   defaultLanguage="python" 
   defaultValue="// some comment" />;
    </div>
  )
}