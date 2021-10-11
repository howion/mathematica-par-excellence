export type DatabaseUtilSelectObject<T extends text> = { select: Record<T, boolean> }

export class DatabaseUtil {
    static select<T extends text>(...selects: T[]): DatabaseUtilSelectObject<T> {
        const objs = selects.map((s) => ({ [s as T]: true })) as Record<T, boolean>[]

        return {
            select: Object.assign({}, ...objs)
        }
    }
}
