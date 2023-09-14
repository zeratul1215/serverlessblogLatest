import {marked} from 'marked';
import hljs from 'highlight.js';
import React,{useState,useEffect, useRef} from 'react';
import "./github-dark.css";
import "./index.css";

const Marked = () => {

    const [text, setText] = useState('');

    

    //config the highlight and marked
    useEffect(() => {
        hljs.configure({
            tabReplace: '',
            classPrefix: 'hljs-',
            languages:['CSS','HTML','JavaScript','Python','TypeScript','Markdown']
        });
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: code => hljs.highlightAuto(code).value,
            gfm: true,
            tables: true,
            breaks: true
        });
    },[]);

    // 处理插入图片操作
    const handleInsertImage = () => {
        
    };

    return (
        <>
            {/* <header>markdown realtime editor</header> */}
            <div className='toolbar'>
                <button onClick={handleInsertImage}>插入图片</button>
                <input type='file' id="imageInput"
                    style={{
                        display:false
                    }}
                ></input>
            </div>
            
            <div className='marked'>
                
                <div
                    className='input-region markdownStyle'
                    id='editableDiv'
                    contentEditable="true"
                    onInput={e => {
                        setText(e.target.innerText);
                    }}
                >
                </div>
                <div
                    className='show-region markdownStyle'
                    dangerouslySetInnerHTML={{
                        __html: marked(text).replace(/<pre>/g, "<pre id='hljs'>"),
                    }}
                ></div>
            </div>
        </>
    );
};

export default Marked;