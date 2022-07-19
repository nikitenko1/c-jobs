import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ file }) => {
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
        <div className="w-full">
          <Viewer fileUrl={file} />
        </div>
      </Worker>
    </>
  );
};

export default PDFViewer;
