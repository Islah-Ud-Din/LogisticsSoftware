import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection } from 'lexical';

const editorConfig = {
    namespace: 'MyEditor',
    theme: {}, // Custom styling (optional)
    onError(error) {
        console.error(error);
    },
};

export default function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
                contentEditable={<ContentEditable className="editor" />}
                placeholder={<div className="placeholder">Start typing...</div>}
            />
            <HistoryPlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    editorState.read(() => {
                        console.log($getRoot().getTextContent());
                    });
                }}
            />
        </LexicalComposer>
    );
}
