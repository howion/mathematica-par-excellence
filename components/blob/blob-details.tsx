import type { ViewMode } from '/pages/blob/[code]/[[...params]]'
import type { BehaviorSubject, Subscription } from 'rxjs'
import React, { ReactElement, ReactNode } from 'react'
import RSelect from 'react-select'
import autoBindReact from 'auto-bind/react'
import moment from 'moment'
import c from 'classnames'
import { BlobKind, BlobKindOptions, BlobSchema } from '/constants/schemas/blob.schema'
import { MiscUtil } from '/utils/misc.util'
import { BLOB_DETAILS_DATETIME_FORMAT } from '/constants/blob'
import { BlobMarks } from '/components/blob/blob-marks'
import { BranchUtil } from '/utils/client/branch.util'
import { MarkUtil } from '/utils/client/mark.util'
import { PatternsMisc } from '/constants/patterns'

export interface BlobDetailsProps {
    mode: ViewMode
    blobSubject: BehaviorSubject<BlobSchema>
}

export interface BlobDetailsState {
    blobObject: BlobSchema
    selectedKind: Option<text>
    selectedMarks: Option<text>[]
    selectedBranch: Option<text>
    isMarkOptionsLoading: boolean
    isBranchOptionsLoading: boolean
    markOptions: Option<text>[]
    branchOptions: Option<text>[]
}

export class BlobDetails extends React.Component<BlobDetailsProps, BlobDetailsState> {
    readonly state: BlobDetailsState
    readonly blobSubscription: Subscription

    constructor(props: BlobDetailsProps) {
        super(props)
        autoBindReact(this)

        this.state = {
            ...this.adjustBlobObjectToState(this.props.blobSubject.getValue()),
            isMarkOptionsLoading: true,
            isBranchOptionsLoading: true,
            markOptions: [],
            branchOptions: []
        }

        this.blobSubscription = this.props.blobSubject.subscribe((obj) => {
            this.setState(this.adjustBlobObjectToState(obj))
        })

        BranchUtil.branches().then((branches) => {
            if (this.blobSubscription.closed) return
            this.setState({
                isBranchOptionsLoading: false,
                branchOptions: branches.map((b) => ({
                    label: b.name,
                    value: b.code
                }))
            })
        })

        MarkUtil.markNames().then((marks) => {
            if (this.blobSubscription.closed) return
            this.setState({
                isMarkOptionsLoading: false,
                markOptions: MiscUtil.makeOptions(marks)
            })
        })
    }

    componentWillUnmount(): void {
        this.blobSubscription.unsubscribe()
    }

    setBlobState(updates: Partial<BlobSchema>): void {
        this.props.blobSubject.next({
            ...this.state.blobObject,
            ...updates
        })
    }

    makeRow({ label, children }: { label: text; children: ReactNode }): ReactElement {
        return (
            <tr>
                <td>{label}</td>
                <td>{children}</td>
            </tr>
        )
    }

    render(): ReactElement {
        const Row = this.makeRow
        const { blobObject } = this.state
        const { mode } = this.props

        const creationTime = moment(blobObject.create_time).format(BLOB_DETAILS_DATETIME_FORMAT)
        const updateTime = moment(blobObject.update_time).format(BLOB_DETAILS_DATETIME_FORMAT)

        // const marks = blobObject.marks.

        return (
            <div className="ma-blob-details-wrapper">
                <table className="ma-blob-details">
                    <tbody>
                        {mode !== 'new' ? <Row label="Blob Id">{blobObject.id}</Row> : null}
                        {mode === 'read' ? (
                            <>
                                <Row label="Kind">{blobObject.kind}</Row>
                                <Row label="Branch">{blobObject.branch.name}</Row>
                                <Row label="Code">{blobObject.code}</Row>
                                <Row label="References">Soon</Row>
                                <Row label="Dependencies">Soon</Row>
                                <Row label="Dependents">Soon</Row>
                                <Row label="Marks">
                                    <BlobMarks marks={blobObject.marks} />
                                </Row>
                            </>
                        ) : null}
                        {['edit', 'new'].includes(mode) ? (
                            <>
                                <Row label="Name">
                                    <div className="ma-input-wrapper">
                                        <input
                                            className={c({
                                                ['ma-input-text']: true,
                                                ['ma-is-invalid']: blobObject.name === ''
                                            })}
                                            // @ts-ignore spellcheck madness
                                            spellCheck={false}
                                            value={blobObject.name}
                                            onChange={({ target: { value } }) =>
                                                this.setBlobState({
                                                    name: value,
                                                    code: MiscUtil.toKebabCase(value)
                                                })
                                            }
                                        />
                                    </div>
                                </Row>
                                <Row label="Kind">
                                    <RSelect
                                        instanceId="rselect-kind"
                                        isSearchable={false}
                                        isMulti={false}
                                        isClearable={false}
                                        isLoading={false}
                                        className="ma-blob-details-select"
                                        value={this.state.selectedKind}
                                        options={BlobKindOptions}
                                        onChange={(opt) =>
                                            this.setBlobState({
                                                kind: opt!.label as BlobKind
                                            })
                                        }
                                    />
                                </Row>
                                <Row label="Branch">
                                    <RSelect
                                        instanceId="rselect-branch"
                                        isSearchable={true}
                                        isMulti={false}
                                        isClearable={false}
                                        isLoading={this.state.isBranchOptionsLoading}
                                        className="ma-blob-details-select"
                                        value={this.state.selectedBranch}
                                        options={this.state.branchOptions}
                                        onChange={async (code) => {
                                            this.setBlobState({
                                                branch: await BranchUtil.pickBranch(code!.value)
                                            })
                                        }}
                                    />
                                </Row>
                                <Row label="Code">
                                    <div className="ma-input-wrapper">
                                        <div className="ma-input-prepend">
                                            <span className="ma-input-span">{blobObject.branch.code}.</span>
                                        </div>
                                        <input
                                            className={c({
                                                ['ma-input-text']: true,
                                                ['ma-is-invalid']: !PatternsMisc.kebabCase.test(blobObject.code)
                                            })}
                                            // @ts-ignore spellcheck madness
                                            spellCheck={false}
                                            value={blobObject.code}
                                            onChange={(e) =>
                                                this.setBlobState({
                                                    code: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </Row>
                                <Row label="References">Soon</Row>
                                <Row label="Dependencies">Soon</Row>
                                <Row label="Dependents">Soon</Row>
                                <Row label="Marks">
                                    <RSelect
                                        instanceId="rselect-marks"
                                        styles={{
                                            multiValue: (provided) => ({
                                                ...provided,
                                                marginLeft: -3,
                                                marginRight: 6
                                            })
                                        }}
                                        isSearchable={true}
                                        isMulti={true}
                                        isClearable={true}
                                        className="ma-blob-details-select"
                                        value={this.state.selectedMarks}
                                        options={this.state.markOptions}
                                        onChange={(opts) => {
                                            this.setBlobState({
                                                marks: opts.map((opt) => opt.value)
                                            })
                                        }}
                                    />
                                </Row>
                            </>
                        ) : null}
                        <Row label="Creation Time">{creationTime}</Row>
                        <Row label="Last Update">{updateTime}</Row>
                    </tbody>
                </table>
            </div>
        )
    }

    protected adjustBlobObjectToState(
        next: BlobSchema
    ): Pick<BlobDetailsState, 'blobObject' | 'selectedKind' | 'selectedMarks' | 'selectedBranch'> {
        return {
            blobObject: next,
            selectedKind: { label: next.kind, value: next.kind },
            selectedMarks: next.marks.map((m) => ({ label: m, value: m })),
            selectedBranch: { label: next.branch.name, value: next.branch.code }
        }
    }
}
