import { Dispatch, useEffect, useState } from 'react'
import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import { stateToHTML  } from 'draft-js-export-html'
import { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import dynamic from 'next/dynamic'
import Styles from './text-editor.module.css'

type TextEditorProps = {
    setText: Dispatch<string>
    clear?: boolean
    content: string
}
const Editor = dynamic<EditorProps>(() => { 
    return import('react-draft-wysiwyg').then(mod => mod.Editor)
},{
    ssr: false
})

const TextEditor = ({ setText, content }: TextEditorProps) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    useEffect(() => {
        const newcontent = content  ? stateFromHTML(content) : stateFromHTML('')
        const thisContent = stateToHTML(editorState.getCurrentContent())
        content && content !== thisContent && setEditorState(EditorState.createWithContent(newcontent))
    }, [content])

    
    useEffect(() => {
        setText(stateToHTML(editorState.getCurrentContent()))
    }, [editorState, setText])

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName={Styles.wrapperClass}
            editorClassName={Styles.editorBody}
            toolbarClassName={Styles.editorToolBar}
            toolbar={{
                options: ['emoji', 'inline', 'blockType', 'textAlign', 'list', 'link' ],
                inline: {
                    options: ["bold","italic","underline","strikethrough","superscript","subscript"]
                },
            }}
            localization={{
                locale: 'pt',
              }}
        />
    )
}

export default TextEditor

