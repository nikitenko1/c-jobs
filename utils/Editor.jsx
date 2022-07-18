import { useRef } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
  ],
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
