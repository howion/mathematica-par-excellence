import React, { ReactElement } from 'react'
import cns from 'classnames'

type elm = null | Element | ReactElement | React.Component

export interface BlobSectionProps {
    children: elm | elm[]
    title?: text
    className?: text
}

export function BlobSection(props: BlobSectionProps | any): ReactElement {
    return (
        <section {...props} className={cns('ma-blob-section', props.className)}>
            {props.title ? <h2 className="ma-blob-section-title">{props.title}</h2> : null}
            {props.children}
        </section>
    )
}

export function BlobSectionCol2({ children }: { children: elm | elm[] }): ReactElement {
    return <div className="ma-blob-section-col2">{children}</div>
}
