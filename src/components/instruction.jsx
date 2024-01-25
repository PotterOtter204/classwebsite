import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language ?? 'python'} style={materialDark}>
      {value}
    </SyntaxHighlighter>
  );
};

const CustomMarkdown = ({ text }) => {
  const regex = /(\{[^{}]*\}|《[^《》]*》|```[\s\S]*?```)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          return <CodeBlock key={index} value={part.slice(1, -1).trim()} />;
        } else if (part.startsWith('《') && part.endsWith('》')) {
          return <CodeBlock key={index} value={part.slice(1, -1).trim()} />;
        } else if (part.startsWith('```') && part.endsWith('```')) {
          return <CodeBlock key={index} value={part.slice(3, -3).trim()} />;
        } else {
          return <span key={index} className="formatted-text">{part}</span>;
        }
      })}
    </>
  );
};


const customText = `
This is regular text.

{const example = 'This is a code block using curly braces';}

This is regular text again.

\`\`\`
const example2 = 'This is a code block using triple backticks';
\`\`\`

This is regular text again.
`;

const Instruction = (props) => {
  return <CustomMarkdown text={props.text} />;
};

export default Instruction;
