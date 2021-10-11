import type { Context, Result } from '/types/controller'
import type { ParsedUrlQuery } from 'querystring'
import { BlobProps, ViewMode } from '/pages/blob/[code]/[[...params]]'
import { BlobModel } from '/models/blob.model'

export interface BlobRoute extends ParsedUrlQuery {
    code: text
    params?: text[]
}

export type BlobControllerResult = Omit<BlobProps, 'appRef' | 'router'>

// Parse Request path: /[code]/[[...params]]
export async function BlobController(context: Context<BlobRoute>): Promise<Result<BlobControllerResult>> {
    const { code, params } = context.params!

    // Read, Edit, New
    let mode: ViewMode

    if (code === 'new') {
        const blankBlob = await BlobModel.blankBlob()

        if (blankBlob === null) return { notFound: true }

        return {
            props: {
                blobObject: blankBlob,
                mode: 'new'
            }
        }
    } else {
        // Make sure mode is valid
        if (params && params[0]) {
            if (ViewMode.includes(params[0] as ViewMode)) {
                mode = params[0] as ViewMode
            } else {
                return { notFound: true }
            }
        } else {
            mode = 'read'
        }
    }

    // branch-code.blob-code
    const [branchCode, blobCode] = code.split('.')

    // Try to find the blob by code.
    const blobObject = await BlobModel.find(branchCode, blobCode ?? '')

    // Check if such blob exists.
    if (blobObject === null) return { notFound: true }

    return {
        props: {
            blobObject: blobObject,
            mode: mode
        }
    }
}
