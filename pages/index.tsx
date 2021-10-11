import type { BlobSchemaLite } from '/constants/schemas/blob.schema'
import React, { ReactElement, useState } from 'react'
import { useDidMount } from 'rooks'
import { NavbarService } from '/services/navbar.service'
import { HomeNavbar } from '/constants/navbars/home.navbar'
import { SplashService } from '/services/splash.service'
import { Meta } from '/components/meta'
import { BlobUtil } from '/utils/client/blob.util'
import { BLOB_DETAILS_DATEONLY_FORMAT } from '/constants/blob'
import { BlobMarks } from '/components/blob/blob-marks'
import ContentLoader from 'react-content-loader'
import moment from 'moment'

function IndexRow({ blob }: { blob: BlobSchemaLite }): ReactElement {
    const code = blob.branch.code + '.' + blob.code
    const path = '/blob/' + code

    return (
        <tr>
            <td>
                <a href={path}>
                    <b>{blob.name}</b>
                    <small>{blob.branch.name}</small>
                </a>
            </td>
            <td>{code}</td>
            <td>
                <BlobMarks marks={blob.marks} />
            </td>
            <td>{BlobUtil.shortenKind(blob.kind)}</td>
            <td>{moment(blob.update_time).format(BLOB_DETAILS_DATEONLY_FORMAT)}</td>
            <td className="action">
                <a href={`${path}/edit`}>
                    <i className="material-icons">drive_file_rename_outline</i>
                </a>
            </td>
        </tr>
    )
}

export default function Index(): ReactElement {
    const [didRetrieve, setDidRetrieve] = useState(false)
    const [blobs, setBlobs] = useState<BlobSchemaLite[]>([])

    useDidMount(() => {
        NavbarService.update(HomeNavbar())
        SplashService.hideSplash()
        BlobUtil.apiRetrieveBlobs().then((blobs) => {
            setBlobs(blobs)
            setDidRetrieve(true)
        })
    })

    // const makeRow = () => null

    return (
        <>
            <Meta/>
            <main className="ma-home-container ma-container">
                {didRetrieve ? (
                    <div className="ma-table-wrapper">
                        <table className="ma-table">
                            <thead>
                                <tr>
                                    <th className="ma-table-fitcol" style={{ minWidth: '200px' }}>
                                        Name
                                    </th>
                                    <th>Code</th>
                                    <th className="">Marks</th>
                                    <th style={{ width: '80px' }}>KIND</th>
                                    <th className="ma-table-fitcol">Last Update</th>
                                    <th className="ma-table-fitcol action">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {blobs.map((blob, i) => (
                                    <IndexRow blob={blob} key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <ContentLoader viewBox="0 0 976 192">
                        <rect x="0" y="0" rx="6" ry="6" width="976" height="53" />
                        <rect x="0" y="70"  rx="6" ry="6" width="976" height="36" />
                        <rect x="0" y="113" rx="6" ry="6" width="976" height="36" />
                        <rect x="0" y="156" rx="6" ry="6" width="976" height="36" />
                    </ContentLoader>
                )}
            </main>
        </>
    )
}
