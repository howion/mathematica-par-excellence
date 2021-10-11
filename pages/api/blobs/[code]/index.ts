import type { ApiQueryType, ApiRequest, ApiResponse } from '/types/api'
import { ApiFailureCode } from '/constants/api/api-failure-code'
import { HTTPStatusCode } from '/constants/http-status-code'
import { ApiPatchBlobJoi } from '/constants/joi/api/blob.joi'
import { BlobApiSchemaPatchBlob } from '/constants/schemas/api/blob.api.schema'
import { BlobModel } from '/models/blob.model'

interface BlobRequestSchema extends ApiQueryType {
    code: text
}

export async function ApiPatchBlob(req: ApiRequest<BlobRequestSchema>, res: ApiResponse): Promise<void> {
    const validation = ApiPatchBlobJoi.validate(req.body)

    if (validation.error !== undefined) {
        return res.status(HTTPStatusCode.BadRequest).json({
            success: false,
            error: {
                code: ApiFailureCode.RequestBodyInvalid,
                message: validation.error.message
            }
        })
    }

    const body: BlobApiSchemaPatchBlob = validation.value
    const [branchCode, blobCode] = req.query.code.split('.')

    const [success, code, message] = await BlobModel.patch(branchCode, blobCode, body)

    if (success) return res.status(HTTPStatusCode.OK).json({ success: true })

    res.status(HTTPStatusCode.BadRequest).json({
        success: false,
        error: {
            code: code!,
            message: message!
        }
    })
}

export async function ApiDeleteBlob(req: ApiRequest<BlobRequestSchema>, res: ApiResponse): Promise<void> {
    const [branchCode, blobCode] = req.query.code.split('.')
    const [success, code, message] = await BlobModel.delete(branchCode, blobCode)

    if (success) return res.status(HTTPStatusCode.OK).json({ success: true })

    res.status(HTTPStatusCode.BadRequest).json({
        success: false,
        error: {
            code: code!,
            message: message!
        }
    })
}

/**
 * Accepts one of the following methods:
 *
 * @param req
 * @param res
 */
export default async function ApiBlob(req: ApiRequest<BlobRequestSchema>, res: ApiResponse): Promise<void> {
    // Patch blob on PATCH.
    if (req.method === 'PATCH') return ApiPatchBlob(req, res)

    // Delete blob on DELETE.
    if (req.method === 'DELETE') return ApiDeleteBlob(req, res)

    // Other request methods...
    return res.status(HTTPStatusCode.MethodNotAllowed).json({
        success: false,
        error: {
            code: ApiFailureCode.RequestMethodInvalid,
            message: 'Invalid request method.'
        }
    })
}
