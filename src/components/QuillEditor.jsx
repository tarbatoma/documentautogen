import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      return () => {
        if (editor) {
          editor.off('text-change');
        }
      };
    }
  }, []);

  const handleChange = (content) => {
    // Sanitize content before passing it to parent
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
        'ul', 'ol', 'li', 'span', 'div'
      ],
      ALLOWED_ATTR: ['style', 'class'],
    });
    onChange(sanitizedContent);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  return (
    <div ref={wrapperRef} className="quill-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        className="h-64"
      />
    </div>
  );
};

export default QuillEditor;