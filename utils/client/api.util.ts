import { AppUtil } from '/utils/app.util'
import { ApiEndpoint } from '/constants/api/api-endpoints'
import urlcat from 'urlcat'

export class APIUtil {
    static readonly baseApiUrl = `${AppUtil.baseUrl}/api`

    static async use(
        endpoint: ApiEndpoint,
        params: Record<text, any> = {},
        body?: SafeObject | null
    ): Promise<Response> {
        return APIUtil.fetch(endpoint.method, urlcat(APIUtil.baseApiUrl, endpoint.path, params), body)
    }

    static async fetch(method: text, path: text, body?: SafeObject | null): Promise<Response> {
        return fetch(`${path}`, {
            method: method,
            cache: 'no-cache',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        })
    }
}
