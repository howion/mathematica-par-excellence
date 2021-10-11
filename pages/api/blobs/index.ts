import type { ApiRequest, ApiResponse } from '/types/api'
import type { BlobApiSchemaCreateBlob } from '/constants/schemas/api/blob.api.schema'
import { ApiFailureCode } from '/constants/api/api-failure-code'
import { ApiCreateBlobJoi } from '/constants/joi/api/blob.joi'
import { HTTPStatusCode } from '/constants/http-status-code'
import { BlobModel } from '/models/blob.model'
import { BlobSchemaLite } from '/constants/schemas/blob.schema'

async function ApiCreateBlob(req: ApiRequest, res: ApiResponse): Promise<void> {
    const validation = ApiCreateBlobJoi.validate(req.body)

    if (validation.error !== undefined) {
        return res.status(HTTPStatusCode.BadRequest).json({
            success: false,
            error: {
                code: ApiFailureCode.RequestBodyInvalid,
                message: validation.error.message
            }
        })
    }

    const body: BlobApiSchemaCreateBlob = validation.value

    const [result, code, message] = await BlobModel.create(body)

    if (result) {
        res.status(HTTPStatusCode.OK).json({
            success: true
        })
    } else {
        res.status(HTTPStatusCode.BadRequest).json({
            success: false,
            error: {
                code: code!,
                message: message!
            }
        })
    }
}

export interface ApiRetrieveBlobsResponse {
    blobs: BlobSchemaLite[]
}

async function ApiRetrieveBlobs(req: ApiRequest, res: ApiResponse<ApiRetrieveBlobsResponse>): Promise<void> {
    res.status(HTTPStatusCode.OK).json({
        success: true,
        blobs: await BlobModel.retrieveAllLite()
    })
}

export default async function ApiBlob(req: ApiRequest, res: ApiResponse): Promise<void> {
    if (req.method === 'GET') return ApiRetrieveBlobs(req, res)
    if (req.method === 'POST') return ApiCreateBlob(req, res)

    return res.status(HTTPStatusCode.MethodNotAllowed).json({
        success: false,
        error: {
            code: ApiFailureCode.RequestMethodInvalid,
            message: 'Invalid request method.'
        }
    })
}
