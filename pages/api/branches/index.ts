import type { ApiRequest, ApiResponse } from '/types/api'
import { BranchSchemaLite } from '/constants/schemas/branch.schema'
import { BranchModel } from '/models/branch.model'
import { ApiFailureCode } from '/constants/api/api-failure-code'

export interface ApiGetBranchesGetResponse {
    branches: BranchSchemaLite[]
}

export default async function ApiGetBranches(
    req: ApiRequest,
    res: ApiResponse<ApiGetBranchesGetResponse>
): Promise<void> {
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
        branches: await BranchModel.allExclusive()
    })
}
