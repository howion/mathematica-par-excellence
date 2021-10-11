import { PatternsMisc } from '/constants/patterns'

export class MiscUtil {
    static readonly REGEX_PATH = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    static readonly REGEX_MATH = /(\$+)(?:(?!\1)[\s\S])*\1/

    static isNumeric(str: text): boolean {
        return /^-?\d+$/.test(str)
    }

    // static normalize<T extends Record<any, any>>(obj: T): Partial<T> {
    //     return _.omitBy<T>(obj, _.isNil)
    // }

    static toKebabCase(str: text): text {
        return str
            .trim()
            .replace(MiscUtil.REGEX_MATH, '') // no math expressions
            .replace(/([a-z])([A-Z])/g, '$1-$2') // dash on new case
            .replace(/[^\w-]/g, '-') // strict
            .replace(/^-+|-+$/g, '') // always in between
            .replace(/-{2,}/g, '-') // collapse
            .toLowerCase()
    }

    static makeOptions(values: text[]): Option<text>[] {
        return values.map((value) => {
            return {
                label: value,
                value: value
            }
        })
    }

    static makeOptionsNumeric(values: text[]): Option<number>[] {
        return values.map((value, i) => {
            return {
                label: value,
                value: i
            }
        })
    }
}
