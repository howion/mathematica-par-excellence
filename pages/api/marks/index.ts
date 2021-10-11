import type { ApiRequest, ApiResponse } from '/types/api'
import type { MarkSchemaLite } from '/constants/schemas/mark.schema'
import { ApiFailureCode } from '/constants/api/api-failure-code'
import { MarkModel } from '/models/mark.model'

export interface ApiGetMarksGetResponse {
    marks: MarkSchemaLite[]
}

export default async function ApiGetMarks(req: ApiRequest, res: ApiResponse<ApiGetMarksGetResponse>): Promise<void> {
    if (req.method !== 'GET') {
        return res.status(404).json({
            success: false,
            error: {
                code: ApiFailureCode.RequestMethodInvalid,
                message: 'Invalid request method.'
            }
        })
    }

    res.status(200).json({
        success: true,
        marks: await MarkModel.all()
    })
}
