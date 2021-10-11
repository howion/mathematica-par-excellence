import {Subject} from 'rxjs'
import {first} from 'rxjs/operators'
import {Service} from '/services/service'
import {ClientUtil} from '/utils/client/client.util'

// TODO: Revise
export class SplashService implements Service<boolean> {
    protected static splashSubject = new Subject<boolean>()
    protected static splashOnMountSubject = new Subject<any>()

    public static showSplash(delay = 0): void {
        setTimeout(() => {
            ClientUtil.freezeDocumentScroll()
            SplashService.splashSubject.next(false)
        }, delay)
    }

    public static async hideSplash(delay = 500): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                ClientUtil.releaseDocumentScroll()
                SplashService.splashSubject.next(true)
                resolve()
            }, delay)
        })
    }

    public static emitDidMount(): void {
        SplashService.splashOnMountSubject.next(undefined)
    }

    public static subscribe(event: 'update', callback: (hidden: boolean) => void): void
    public static subscribe(event: 'onMount', callback: () => void): void
    public static subscribe(event: 'update' | 'onMount', callback: (hidden: boolean) => void): void {
        if (event === 'update') {
            SplashService.splashSubject.asObservable().subscribe(callback)
            return
        }

        if (event === 'onMount') {
            SplashService.splashOnMountSubject.asObservable().pipe(first()).subscribe(callback)
            return
        }

        throw new Error(`Unknown event: ${event}`)
    }
}
