import { BranchSchemaLite } from '/constants/schemas/branch.schema'
import { Database } from '/lib/database'

const SELECT_EXCLUSIVE = {
    id: true,
    name: true,
    code: true,
    parent_id: true,
    parent: false,
    children: false
}

export class BranchModel {
    // public static async makeTreeExclusiveSlow(rootCode: text): Promise<TreeNode<BranchSchemaExclusive> | null> {
    //     const root = await Database.branch.findUnique({
    //         select: SELECT_EXCLUSIVE,
    //         where: {
    //             code: rootCode
    //         }
    //     })
    //
    //     if (root === null) return null
    //
    //     const tree = new TreeNode<BranchSchemaExclusive>({
    //         name: root.name,
    //         code: root.code,
    //         parent_id: root.parent_id
    //     })
    //
    //     for (const child of root.children) {
    //         const node = await BranchModel.makeTreeExclusive(child.code)
    //         if (node === null) return null
    //         tree.addChild(node)
    //     }
    //
    //     return tree
    // }

    public static async allExclusive(): Promise<BranchSchemaLite[]> {
        return await Database.branch.findMany({
            select: SELECT_EXCLUSIVE
        })
    }

    public static async findRootsExclusive(): Promise<BranchSchemaLite[] | null> {
        return await Database.branch.findMany({
            select: SELECT_EXCLUSIVE,
            where: {
                parent_id: null
            }
        })
    }

    public static async whereCodeLite(code: text): Promise<BranchSchemaLite | null> {
        return await Database.branch.findUnique({
            select: SELECT_EXCLUSIVE,
            where: {
                code: code
            }
        })
    }
}
