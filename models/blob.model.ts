import type { UserSchemaLite } from '/constants/schemas/user.schema'
import type { BranchSchemaLite } from '/constants/schemas/branch.schema'
import type { BlobApiSchemaCreateBlob, BlobApiSchemaPatchBlob } from '/constants/schemas/api/blob.api.schema'
import type { BlobSchema, BlobSchemaLite } from '/constants/schemas/blob.schema'
import { Database, PrismaBlob, PrismaClientKnownRequestError } from '/lib/database'
import { UserModel } from '/models/user.model'
import { BranchModel } from '/models/branch.model'
import { ApiFailureCode } from '/constants/api/api-failure-code'
import moment from 'moment'

// TODO: :(
function handleErrorTodo(e: any): [false, ApiFailureCode, text] {
    if (!(e instanceof Error)) return [false, ApiFailureCode.Unknown, 'Unknown error occurred.']

    if (e instanceof PrismaClientKnownRequestError) {
        // TODO:
        return [false, ApiFailureCode.Unknown, e.message]
    } else {
        return [false, ApiFailureCode.Unknown, e.message]
    }
}

/* prettier-ignore */
const whereCodes = (branchCode: text, blobCode: text): { where: any } => ({
    where: {
        AND: [
            {code: blobCode},
            {branch: {code: branchCode}}
        ]
    }
})

export class BlobModel {
    public static async codeToId(branchCode: text, blobCode: text): Promise<number | null> {
        const blob = await Database.blob.findFirst({
            select: {
                id: true
            },
            where: {
                AND: [{ code: blobCode }, { branch: { code: { equals: branchCode } } }]
            }
        })

        if (blob === null) return null

        return blob.id
    }

    /* prettier-ignore */
    public static async _find(branchCode: text, blobCode: text): Promise<PrismaBlob | null> {
        return await Database.blob.findFirst({
            where: {
                AND: [
                    {code: blobCode},
                    {branch: {code: {equals: branchCode}}}
                ]
            },
            include: {
                initiator: true,
                branch: true,
                marks: true
            }
        })
    }

    public static async exists(branchCode: text, blobCode: text): Promise<boolean> {
        return (await Database.blob.count(whereCodes(branchCode, blobCode))) > 0
    }

    /* prettier-ignore */
    public static async existsSameNameInSameBranch(branchCode: text, blobName: text): Promise<boolean> {
        return (
            (await Database.blob.count({
                where: {
                    AND: [
                        {branch: {code: branchCode}},
                        {name: blobName}
                    ]
                }
            })) > 0
        )
    }

    public static async patch(
        branchCode: text,
        blobCode: text,
        blob: BlobApiSchemaPatchBlob
    ): Promise<[true] | [false, ApiFailureCode, text]> {
        try {
            const id = await BlobModel.codeToId(branchCode, blobCode)
            if (id === null) return [false, ApiFailureCode.BlobNotFound, 'No such blob exists.']

            await Database.blob.update({
                ...whereCodes(branchCode, blobCode),
                where: {
                    id: id
                },
                data: {
                    name: blob.name,
                    code: blob.code,
                    kind: blob.kind,
                    markdown: blob.markdown,
                    ...(blob.initiator ? { initiator: { connect: { username: blob.initiator } } } : {}),
                    ...(blob.branch ? { branch: { connect: { code: blob.branch } } } : {}),
                    ...(blob.marks ? { marks: { set: blob.marks.map((name) => ({ name: name })) } } : {})
                }
            })

            return [true]
        } catch (e) {
            return handleErrorTodo(e)
        }
    }

    public static async delete(branchCode: text, blobCode: text): Promise<[true] | [false, ApiFailureCode, text]> {
        const id = await BlobModel.codeToId(branchCode, blobCode)
        if (id === null) return [false, ApiFailureCode.BlobNotFound, 'No such blob exists.']
        await Database.blob.delete({ where: { id } })
        return [true]
    }

    public static async create(blob: BlobApiSchemaCreateBlob): Promise<[true] | [false, ApiFailureCode, text]> {
        try {
            if (await BlobModel.exists(blob.branch, blob.code)) {
                return [
                    false,
                    ApiFailureCode.BlobWithTheSameBranchAndCodeAlreadyExists,
                    'Blob with the same branch and code already exists.'
                ]
            }

            if (await BlobModel.existsSameNameInSameBranch(blob.branch, blob.name)) {
                return [
                    false,
                    ApiFailureCode.BlobWithTheSameBranchAndNameAlreadyExists,
                    'Blob with the same branch and name already exists.'
                ]
            }

            await Database.blob.create({
                select: { id: true },
                data: {
                    name: blob.name,
                    code: blob.code,
                    kind: blob.kind,
                    initiator: { connect: { username: blob.initiator } },
                    branch: { connect: { code: blob.branch } },
                    marks: { connect: blob.marks.map((name) => ({ name: name })) },
                    markdown: blob.markdown
                }
            })

            return [true]
        } catch (e) {
            return handleErrorTodo(e)
        }
    }

    // public static update(code: text, patch: Partial<BlobSchemaApi>): void {}

    public static async blankBlob(): Promise<BlobSchema | null> {
        const now = moment().valueOf()

        return {
            id: -1,
            name: '',
            code: '',
            kind: 'AXIOM',
            markdown: '',
            initiator: (await UserModel.whereUsernameLite('howion')) as UserSchemaLite,
            branch: (await BranchModel.whereCodeLite('test-branch')) as BranchSchemaLite,
            marks: [],
            create_time: now,
            update_time: now
        }
    }

    public static async find(branchCode: text, blobCode: text): Promise<BlobSchema | null> {
        const blob: PrismaBlob | null = await BlobModel._find(branchCode, blobCode)

        if (blob === null) {
            return null
        } else {
            return await BlobModel.prisma2schema(blob)
        }
    }

    public static async retrieveAllLite(): Promise<BlobSchemaLite[]> {
        const blobs: PrismaBlob[] = await Database.blob.findMany({
            include: {
                initiator: true,
                branch: true,
                marks: true
            }
        })

        return await Promise.all(
            blobs.map((blob) => {
                return BlobModel.prisma2schemaLite(blob)
            })
        )
    }

    public static async prisma2schemaLite(dbBlob: PrismaBlob): Promise<BlobSchemaLite> {
        return {
            name: dbBlob.name,
            code: dbBlob.code,
            kind: dbBlob.kind,
            initiator: {
                name: dbBlob.initiator.name,
                surname: dbBlob.initiator.surname,
                username: dbBlob.initiator.username,
                role: dbBlob.initiator.role,
                avatar: dbBlob.initiator.avatar
            },
            branch: {
                id: dbBlob.branch.id,
                parent_id: dbBlob.branch.parent_id,
                name: dbBlob.branch.name,
                code: dbBlob.branch.code
            },
            marks: dbBlob.marks.map((mark) => mark.name),
            create_time: moment(dbBlob.create_time).valueOf(),
            update_time: moment(dbBlob.update_time).valueOf()
        }
    }

    public static async prisma2schema(dbBlob: PrismaBlob): Promise<BlobSchema> {
        return {
            ...(await BlobModel.prisma2schemaLite(dbBlob)),
            id: dbBlob.id,
            markdown: dbBlob.markdown
        }
    }

    // static async where(idOrCode: text | number): Promise<BlobObject | null> {
    //     if (typeof idOrCode === 'number') return BlobModel.whereId(idOrCode)
    //     if (MiscUtil.isNumeric(idOrCode))
    //         return BlobModel.whereId(MiscUtil.toInt(idOrCode))
    //     return BlobModel.whereCode(idOrCode)
    // }
    //
    // static async whereCode(code: text): Promise<BlobObject | null> {
    //     // Find blob by path.
    //     const dbBlob = await Database.blob.findUnique({ where: { code } })
    //
    //     // Check if such blob exists.
    //     if (dbBlob === null) return null
    //
    //     const x = (await Database.blob.findUnique({ where: { code }, include: {marks: true} }))
    //     console.log(x)
    //     // Here it is.
    //     return BlobModel.databaseBlobReadToBlob(dbBlob)
    // }
    //
    // static async whereId(id: number): Promise<BlobObject | null> {
    //     // Find blob by id.
    //     const dbBlob = await Database.blob.findUnique({ where: { id } })
    //
    //     // Check if such blob exists.
    //     if (dbBlob === null) return null
    //
    //     // Voila!
    //     return BlobModel.databaseBlobReadToBlob(dbBlob)
    // }
    //
    // static async create(blobReduced: BlobObjectReduced): Promise<boolean> {
    //     const [, e] = await cautiousPromise(
    //         Database.blob.create({
    //             data: BlobModel.blobReducedToDatabaseBlobWrite(
    //                 blobReduced
    //             ) as DatabaseBlobWrite
    //         })
    //     )
    //
    //     if (e !== undefined) return false
    //     return true
    // }
    //
    // static async update(
    //     blobReduced: Partial<BlobObjectReduced>,
    //     _where?: number | text
    // ): Promise<boolean> {
    //     const where: any = {}
    //
    //     if (_where !== undefined) {
    //         if (typeof _where === 'number') {
    //             where.id = _where
    //         } else {
    //             if (MiscUtil.isNumeric(_where)) {
    //                 where.id = MiscUtil.toInt(_where)
    //             } else {
    //                 where.code = _where
    //             }
    //         }
    //     } else {
    //         where.code = blobReduced.Code
    //     }
    //
    //     const [, e] = await cautiousPromise(
    //         Database.blob.update({
    //             where: where,
    //             data: BlobModel.blobReducedToDatabaseBlobWrite(blobReduced)
    //         })
    //     )
    //
    //     if (e !== undefined) return false
    //     return true
    // }
    //
    // static blobReducedToDatabaseBlobWrite(
    //     blobReduced: Partial<BlobObjectReduced>
    // ): Partial<DatabaseBlobWrite> {
    //     return MiscUtil.normalize({
    //         name: blobReduced.Name,
    //         kind: blobReduced.Kind,
    //         code: blobReduced.Code,
    //         class_id: blobReduced.ClassId,
    //         marks: blobReduced.Marks,
    //         markdown: blobReduced.Markdown
    //     })
    // }
    //
    // static databaseBlobReadToBlob(dbBlobRead: DatabaseBlobRead): BlobObject {
    //     return {
    //         Id: dbBlobRead.id,
    //         Name: dbBlobRead.name,
    //         Kind: dbBlobRead.kind,
    //         Code: dbBlobRead.code,
    //         ClassId: dbBlobRead.class_id,
    //         Marks: dbBlobRead.marks,
    //         Markdown: dbBlobRead.markdown,
    //         Creation: dbBlobRead.create_time.getTime(),
    //         Update: dbBlobRead.update_time.getTime(),
    //         References: 0,
    //         Dependencies: [],
    //         Dependents: []
    //     }
    // }
    //
    // static reduceBlobObject(blob: BlobObject): BlobObjectReduced {
    //     return _.omit(blob, 'Id', 'Creation', 'Update')
    // }
}
