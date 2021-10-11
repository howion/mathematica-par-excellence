import React, { ReactElement, useState } from 'react'
import { MarkUtil } from '/utils/client/mark.util'
import { useDidMount } from 'rooks'

export function BlobMarks({ marks }: { marks: text[] }): ReactElement {
    const [didDownload, setDidDownload] = useState(false)

    useDidMount(() => {
        MarkUtil.marks().then(() => {
            setDidDownload(true)
        })
    })

    return (
        <>
            {marks.map((name) => (
                <span
                    className="ma-mark"
                    key={name}
                    style={didDownload ? { backgroundColor: `#${MarkUtil.colorOf(name)}` } : {}}
                >
                    {name}
                </span>
            ))}
        </>
    )
}
