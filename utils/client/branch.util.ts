import { BranchSchemaLite } from '/constants/schemas/branch.schema'
import { APIUtil } from '/utils/client/api.util'
import { ApiGetBranchesGetResponse } from '/pages/api/branches'
import { ApiResponseSchema } from '/types/api'
import {ApiEndpoints} from '/constants/api/api-endpoints'

// import { TreeNode } from '/lib/tree-node'

export class BranchUtil {
    protected static _branchesCache: BranchSchemaLite[] | null = null

    // region Branch Tree Related Functions
    //
    // static async makeBranchTrees(): Promise<TreeNode<BranchSchemaLite>[]> {
    //     const branches = await BranchUtil.branches()
    //     const roots = branches.filter((b) => b.parent_id === null)
    //     const trees: TreeNode<BranchSchemaLite>[] = []
    //
    //     for (const root of roots) {
    //         trees.push(await BranchUtil.makeBranchTreeById(root.id))
    //     }
    //
    //     return trees
    // }
    //
    // static async makeBranchTreeById(rootId: number): Promise<TreeNode<BranchSchemaLite>> {
    //     const branches = await BranchUtil.branches()
    //
    //     const root = branches.filter((b) => b.id === rootId)[0]
    //     const children = branches.filter((b) => b.parent_id === rootId)
    //     const tree = new TreeNode<BranchSchemaLite>(root)
    //
    //     for (const child of children) {
    //         tree.addChild(await BranchUtil.makeBranchTreeById(child.id))
    //     }
    //
    //     return tree
    // }
    //
    // endregion

    static async downloadBranches(): Promise<BranchSchemaLite[]> {
        return new Promise((resolve, reject) => {
            APIUtil.use(ApiEndpoints.branches.retrieveAll, {})
                .then((response) => response.json())
                .then((result: ApiResponseSchema<ApiGetBranchesGetResponse>) => {
                    if (!result.success) {
                        reject()
                    } else {
                        resolve(result.branches as BranchSchemaLite[])
                    }
                })
        })
    }

    static async pickBranch(code: text): Promise<BranchSchemaLite | undefined> {
        const branches = await BranchUtil.branches().then()
        return branches.find((b) => b.code === code)
    }

    static async branches(): Promise<BranchSchemaLite[]> {
        if (BranchUtil._branchesCache !== null) return BranchUtil._branchesCache
        return (BranchUtil._branchesCache = await BranchUtil.downloadBranches())
    }
}
