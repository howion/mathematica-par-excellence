// import { Database } from '/services/database.service'

import type { MarkSchemaLite } from '/constants/schemas/mark.schema'
import { Database } from '/lib/database'

export class MarkModel {
    public static async all(): Promise<MarkSchemaLite[]> {
        return await Database.mark.findMany({
            select: {
                name: true,
                color: true
            }
        })
    }

    // public static async everyMarkExists(names: text[]): Promise<boolean> {
    //     return (
    //         names.length ===
    //         (await Database.mark.count({
    //             where: {
    //                 name: {
    //                     in: names
    //                 }
    //             }
    //         }))
    //     )
    // }
}
