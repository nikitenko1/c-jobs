import { useRef } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const Editor = ({ content, setContent }) => {
  const quillRef = useRef();

  return (
    <div className="mt-3">
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write somethings..."
        onChange={(e) => setContent(e)}
        value={content}
        ref={quillRef}
      />
    </div>
  );
};

export default Editor;
