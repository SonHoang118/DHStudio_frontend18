import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.scss'

const EditorConvertToHTML = ({ text, setText }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  // console.log('editorState', editorState)

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {

    setText(convertToRaw(editorState.getCurrentContent()))
  }, [editorState])


  useEffect(() => {
    if (!text) return
    try {
      const content = JSON.parse(text);
      setEditorState(EditorState.createWithContent(convertFromRaw(content)))
      return;
    } catch (e) {
      return;
    }
  }, [])






  const uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ data: { link: reader.result } });
        };
        reader.onerror = () => {
          reject('Upload failed');
        };
        reader.readAsDataURL(file);
      }
    );
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}

        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
            bold: { className: 'custom-bold-button' },
            italic: { className: 'custom-italic-button' },
            underline: { className: 'custom-underline-button' },
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2'],
          },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            previewImage: true,
            defaultSize: {
              height: 'auto',
              width: '100%',
            },
          },
        }}
      />
    </div>
  );
}
export default EditorConvertToHTML;
