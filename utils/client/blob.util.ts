import type { BlobApiSchemaCreateBlob, BlobApiSchemaPatchBlob } from '/constants/schemas/api/blob.api.schema'
import type { ApiResponseSchema } from '/types/api'
import { ApiEndpoints } from '/constants/api/api-endpoints'
import { APIUtil } from '/utils/client/api.util'
import { BranchSchemaLite } from '/constants/schemas/branch.schema'
import { ApiRetrieveBlobsResponse } from '/pages/api/blobs'
import { BlobSchemaLite } from '/constants/schemas/blob.schema'

export class BlobUtil {
    static codeOf(blob: { code: text; branch: text | BranchSchemaLite }): text {
        if (typeof blob.branch === 'object') {
            return `${blob.branch.code}.${blob.code}`
        } else {
            return `${blob.branch}.${blob.code}`
        }
    }

    static shortenKind(kind: text): text {
        switch (kind) {
            case 'AXIOM':
                return 'AXM'
            case 'DEFINITION':
                return 'DEF'
            case 'THEOREM':
                return 'THM'
            case 'FORMULA':
                return 'FML'
        }

        return '?'
    }

    static async apiRetrieveBlobs(): Promise<BlobSchemaLite[]> {
        return new Promise((resolve) => {
            APIUtil.use(ApiEndpoints.blobs.retrieveAll)
                .then((response) => response.json())
                .then((json: ApiResponseSchema<ApiRetrieveBlobsResponse>) => {
                    if (json.success) resolve(json.blobs)
                })
        })
    }

    static async apiCreateBlob(blob: BlobApiSchemaCreateBlob): Promise<ApiResponseSchema> {
        return new Promise<ApiResponseSchema>((resolve) => {
            APIUtil.use(ApiEndpoints.blobs.create, {}, blob)
                .then((response) => response.json())
                .then((json) => resolve(json))
        })
    }

    static async apiDeleteBlob(code: text): Promise<ApiResponseSchema> {
        return new Promise<ApiResponseSchema>((resolve) => {
            APIUtil.use(ApiEndpoints.blobs.delete, { code })
                .then((response) => response.json())
                .then((json: ApiResponseSchema) => resolve(json))
        })
    }

    static async apiPatchBlob(code: text, blob: BlobApiSchemaPatchBlob): Promise<ApiResponseSchema> {
        return new Promise<ApiResponseSchema>((resolve) => {
            APIUtil.use(ApiEndpoints.blobs.patch, { code }, blob)
                .then((response) => response.json())
                .then((json) => resolve(json))
        })
    }

    // static async patchBlob(code: text, blob: BlobSchemaWithoutMeta): Promise<boolean> {
    //     // return new Promise((resolve) => {
    //     //     APIUtil.PATCH(`blob/${blob.code}`, blob).then(() => {
    //     //         // TODO:
    //     //         resolve(true)
    //     //     })
    //     // })
    //     return false
    // }
}
