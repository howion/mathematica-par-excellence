import React, { ReactElement, useState } from 'react'
import Editor, { DiffEditor, useMonaco } from '@monaco-editor/react'
import { MONACO_EDITOR_DEFAULT_OPTIONS } from '/constants/monaco-editor'
import {useDebounce, useThrottle} from 'rooks'

export interface MonacoEditorProps {
    initialValue: text
    onValueUpdate: (newValue: text) => void
    showDiff?: boolean
}

const commonProps = {
    width: '100%',
    height: '540px',
    language: 'markdown',
    className: 'ma-blob-editor',
    options: MONACO_EDITOR_DEFAULT_OPTIONS
}

/**
 * Note that this component should be used on client-side only.
 */
export function MonacoEditor(props: MonacoEditorProps): ReactElement {
    const [didRender, setDidRender] = useState(false)
    const [value, setValue] = useState<text>(props.initialValue)
    const onUpdateDebounced = useDebounce(() => props.onValueUpdate(value), 50)
    const monaco = useMonaco()

    if (!didRender && monaco) {
        setDidRender(true)
        fetch('/assets/vendor/monaco-editor/themes/Xcode_default.json')
            .then((data) => data.json())
            .then((theme) => monaco.editor.defineTheme('custom', theme))
            .then(() => monaco.editor.setTheme('custom'))
    }

    return props.showDiff ? (
        <DiffEditor
            {...{
                ...commonProps,
                options: { ...commonProps.options, readOnly: true }
            }}
            original={props.initialValue}
            modified={value}
        />
    ) : (
        <Editor
            {...{
                ...commonProps,
                options: { ...commonProps.options, readOnly: false }
            }}
            value={props.initialValue}
            onChange={async (newValue) => {
                if (newValue === undefined) newValue = ''
                setValue(newValue)
                onUpdateDebounced()
            }}
        />
    )
}
