// PACKAGES
import React, { ReactElement } from 'react'
import { NextRouter, withRouter } from 'next/router'
import { BehaviorSubject } from 'rxjs'
import dynamic from 'next/dynamic'
import autoBindReact from 'auto-bind/react'
import c from 'classnames'

// CONSTANTS
import { BlobSchema, BlobSchemaStripMeta } from '/constants/schemas/blob.schema'
import { BlobNavbar } from '/constants/navbars/blob.navbar'

// SERVICES
import { NavbarService } from '/services/navbar.service'
import { SplashService } from '/services/splash.service'
import { ModalService } from '/services/modal.service'
import { mdit } from '/lib/markdown'

// HELPERS/UTILS
import { innerHtml } from '/helpers/inner-html'
import { BlobUtil } from '/utils/client/blob.util'
import { ClientUtil } from '/utils/client/client.util'

// COMPONENTS
import { BlobSection, BlobSectionCol2 } from '/components/blob/blob-section'
import { MonacoEditorProps } from '/components/monaco-editor'
import { Meta } from '/components/meta'
import { BlobDetailsProps } from '/components/blob/blob-details'
import { BlobApiSchemaCreateBlob } from '/constants/schemas/api/blob.api.schema'
import { BlobModals } from '/constants/modals/blob.modals'
import { ApiResponseSchema } from '/types/api'

// DYNAMIC COMPONENTS
const MonacoEditor = dynamic<MonacoEditorProps>(() => import('/components/monaco-editor').then((m) => m.MonacoEditor), {
    ssr: false
})
const BlobDetails = dynamic<BlobDetailsProps>(
    () => import('/components/blob/blob-details').then((m) => m.BlobDetails),
    { ssr: false }
)

// BACK-END
// TODO: Make it client-side.
export { BlobController as getServerSideProps } from '/controllers/blob.controller'

export interface BlobProps {
    appRef: React.MutableRefObject<HTMLDivElement | null>
    router: NextRouter
    mode: ViewMode
    blobObject: BlobSchema
}

export interface BlobState {
    blobName: text
    blobMarkdown: text
    showDiff: boolean /* .../edit */
}

export const ViewMode = ['read', 'edit', 'new'] as const
export type ViewMode = typeof ViewMode[number]

// TODO: Un-Subscriptions
class Blob extends React.Component<BlobProps> {
    public readonly state: BlobState

    protected readonly inEdit: boolean

    protected readonly mdRef: React.MutableRefObject<HTMLDivElement | null>
    protected mdLastSize = 100

    protected readonly blobSubject: BehaviorSubject<BlobSchema>

    constructor(props: BlobProps) {
        super(props)
        autoBindReact(this)

        this.inEdit = props.mode !== 'read'

        this.state = {
            blobName: props.blobObject.name,
            blobMarkdown: props.blobObject.markdown,
            showDiff: false
        }

        this.blobSubject = new BehaviorSubject<BlobSchema>(props.blobObject)
        this.blobSubject.subscribe((obj) => {
            this.setState({
                blobName: obj.name
            })
        })

        this.mdRef = React.createRef<HTMLDivElement>()
    }

    componentDidMount(): void {
        // Update navbar with mount.
        NavbarService.update(
            BlobNavbar({
                mode: this.props.mode,
                blobObject: this.props.blobObject,
                delete: this.deleteBlob,
                save: this.saveBlob
            })
        )

        if (this.mdRef && this.mdRef.current) {
            this.setMdLastSize()
            new ResizeObserver(this.handleMarkdownResize).observe(this.mdRef.current)
        }

        ClientUtil.waitForDocumentReady().then(() => SplashService.hideSplash())
    }

    createApiBlobObject(): BlobApiSchemaCreateBlob {
        const blob = BlobSchemaStripMeta(this.blobSubject.getValue())

        return {
            ...blob,
            initiator: blob.initiator.username,
            branch: blob.branch.code,
            markdown: this.state.blobMarkdown
        }
    }

    async saveBlob(): Promise<void> {
        const propsBlob = this.props.blobObject
        const newBlob = this.createApiBlobObject()

        const propsCode = BlobUtil.codeOf(propsBlob)
        const newCode = BlobUtil.codeOf(newBlob)

        ModalService.hideModal()
        await SplashService.showSplash()

        let result: ApiResponseSchema

        if (this.props.mode === 'new') {
            result = await BlobUtil.apiCreateBlob(newBlob)
        } else {
            result = await BlobUtil.apiPatchBlob(propsCode, newBlob)
        }

        if (result.success) {
            ClientUtil.redirect(`/blob/${newCode}`)
        } else {
            // Something is wrong...
            await SplashService.hideSplash()
            ModalService.showModal(BlobModals.onFailure(result.error))
        }
    }

    async deleteBlob(): Promise<void> {
        const propsCode = BlobUtil.codeOf(this.props.blobObject)
        ModalService.hideModal()
        await SplashService.showSplash()

        const result = await BlobUtil.apiDeleteBlob(propsCode)

        if (result.success) {
            ClientUtil.redirect('/')
        } else {
            // Something is wrong...
            await SplashService.hideSplash()
            ModalService.showModal(BlobModals.onFailure(result.error))
        }
    }

    handleMarkdownResize(): void {
        const prior = this.mdLastSize
        const diff = this.setMdLastSize() - prior
        this.props.appRef.current?.scrollBy(0, diff)
    }

    setMdLastSize(): number {
        if (!this.mdRef || !this.mdRef.current) return this.mdLastSize
        return (this.mdLastSize = this.mdRef.current.getBoundingClientRect().height)
    }

    // handleTitleUpdate(e: React.FormEvent): void {
    //     const _title = e.currentTarget.textContent ?? ''
    //     this.blobSubject.next({
    //         ...this.blobSubject.getValue(),
    //         name: _title,
    //         code: MiscUtil.toKebabCase(_title)
    //     })
    // }

    render(): ReactElement {
        const { blobObject } = this.props

        return (
            <>
                <Meta title={this.state.blobName} noindex={this.inEdit} nofollow={this.inEdit} />

                <main className={`ma-blob-container ma-container ma-blob--${this.inEdit ? 'edit' : 'read'}`}>
                    <div className="ma-blob-head">
                        <h1
                            className={c({
                                ['ma-blob-title']: true,
                                ['ma-is-invalid']: this.inEdit && this.state.blobName.trim() === ''
                            })}
                            // contentEditable={this.inEdit}
                            // spellCheck={false}
                            // suppressContentEditableWarning={true}
                            // onInput={this.handleTitleUpdate}
                            data-blob-edit-title="Title"
                        >
                            {this.state.blobName || <>&nbsp;</>}
                        </h1>

                        <BlobDetails blobSubject={this.blobSubject} mode={this.props.mode} />
                    </div>

                    <BlobSection className="ma-blob-section-markdown" data-blob-edit-title="Markdown">
                        <div
                            className="ma-markdown"
                            ref={this.mdRef}
                            {...innerHtml(mdit(`## ${this.state.blobName || '&nbsp;'}\n\n${this.state.blobMarkdown}`))}
                        />
                        {this.inEdit ? (
                            <div className="ma-blob-editor-wrapper">
                                <MonacoEditor
                                    initialValue={blobObject.markdown}
                                    onValueUpdate={(md) => this.setState({ blobMarkdown: md })}
                                    showDiff={this.state.showDiff}
                                />
                            </div>
                        ) : null}
                    </BlobSection>

                    <BlobSection title="References">
                        <p>Soon</p>
                    </BlobSection>

                    <BlobSection title="Dependencies">
                        <p>Soon</p>
                    </BlobSection>

                    <BlobSectionCol2>
                        <BlobSection title="Related Records">
                            <p>Soon</p>
                        </BlobSection>
                        <BlobSection title="Related Links">
                            <p>Soon</p>
                        </BlobSection>
                    </BlobSectionCol2>
                </main>
            </>
        )
    }
}

export default withRouter(Blob)
