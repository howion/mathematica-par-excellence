export class AppUtil {
    static readonly isClientSide: boolean = process.browser
    static readonly isNode: boolean = !AppUtil.isClientSide

    // TODO: .env
    static readonly baseUrl = 'http://localhost:3000'
}
