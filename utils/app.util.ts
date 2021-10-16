export class AppUtil {
    static readonly isClientSide: boolean = process.browser
    static readonly isNode: boolean = !AppUtil.isClientSide

    static readonly appBaseUrl = process.env.APP_BASE_URL as text
    static readonly apiBaseUrl = process.env.API_BASE_URL as text
}
