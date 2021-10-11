import type { ApiResponseSchema } from '/types/api'
import { ApiEndpoints } from '/constants/api/api-endpoints'
import { APIUtil } from '/utils/client/api.util'
import { ApiGetMarksGetResponse } from '/pages/api/marks'
import { MarkSchemaLite } from '/constants/schemas/mark.schema'
import { Subject } from 'rxjs'

export class MarkUtil {
    protected static _marksCache: MarkSchemaLite[] | null = null
    // protected static _onCachedSubject = new Subject()

    static async markNames(): Promise<text[]> {
        return new Promise((resolve) => {
            MarkUtil.marks()
                .then((marks) => marks.map((m) => m.name))
                .then((names) => resolve(names))
        })
    }

    // static onMarksDownload(cb: () => void): void {
    //     MarkUtil._onCachedSubject.subscribe(cb)
    // }

    static colorOf(name: text): text {
        if (MarkUtil._marksCache === null) throw new Error('Marks must be downloaded first.')
        const mark = MarkUtil._marksCache.find((m) => m.name === name)
        if (mark === undefined) throw new Error(`No mark called ${name} exists.`)
        return mark.color
    }

    static async marks(): Promise<MarkSchemaLite[]> {
        if (MarkUtil._marksCache !== null) return MarkUtil._marksCache
        const marks = await MarkUtil.downloadMarks()
        MarkUtil._marksCache = marks
        return marks
    }

    static async downloadMarks(): Promise<MarkSchemaLite[]> {
        return new Promise<MarkSchemaLite[]>((resolve) => {
            APIUtil.use(ApiEndpoints.marks.retrieveAll, {})
                .then((response) => response.json())
                .then((json: ApiResponseSchema<ApiGetMarksGetResponse>) => {
                    if (json.success) {
                        resolve((MarkUtil._marksCache = json.marks))
                    } else {
                        // TODO: Revise
                    }
                })
        })
    }
}
