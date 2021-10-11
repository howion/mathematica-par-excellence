export interface TreeNodeObject<TreeNodeDataType>
{
    children: TreeNodeObject<TreeNodeDataType>[]
    content: TreeNodeDataType
}

export class TreeNode<TreeNodeContentType>
{
    public children: TreeNode<TreeNodeContentType>[] = []
    public parent: TreeNode<TreeNodeContentType> | undefined
    public depth = 0
    public content: TreeNodeContentType

    public constructor(content: TreeNodeContentType)
    {
        this.content = content
    }

    public addChild(child: TreeNode<TreeNodeContentType>): TreeNode<TreeNodeContentType>
    {
        child.parent = this
        child.depth = this.depth + 1

        this.children.push(child)

        return child
    }

    public isRoot(): boolean
    {
        return this.parent === undefined
    }

    public childCount(): number
    {
        return this.children.length
    }

    public childCountRecursive(): number
    {
        let count: number = this.childCount()

        for (const child of this.children) count += child.childCountRecursive()

        return count
    }

    // public toObject(): TreeNodeObject<TreeNodeDataType>
    // {
    //     const obj: TreeNodeObject<TreeNodeDataType> = {
    //         data: null,
    //         children: []
    //     }
    //
    //     for (const child of this.children) {
    //         obj.children.push(child.toObject())
    //     }
    //
    //     return obj
    // }

    // public static fromObject(obj: object): TreeNode
    // {
    //     // todo
    //     return new TreeNode('')
    // }

    // public toJSON(): text
    // {
    //     return JSON.stringify(this.toObject())
    // }

    // public static fromJSON(json: text): TreeNode
    // {
    //     return TreeNode.fromJSON(JSON.parse(json))
    // }
}
