import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-fonts.css';

// Suprascrie formatul de font cu clase clare
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'times-new-roman'];
Quill.register(Font, true);

const QuillEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  const handleChange = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'span', 'div', 'sub', 'sup'
      ],
      ALLOWED_ATTR: ['style', 'class'],
    });
    onChange(sanitizedContent);
  };

  const modules = {
    toolbar: [
      [{ font: Font.whitelist }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['clean']
    ]
  };

  const formats = [
    'font', 'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'list', 'bullet',
    'indent', 'align'
  ];

  return (
    <div className="quill-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="h-64"
      />
    </div>
  );
};

export default QuillEditor;
