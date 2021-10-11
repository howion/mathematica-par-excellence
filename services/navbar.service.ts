import { Subject } from 'rxjs'
import { NavbarButtonProps } from '/components/navbar'
import { Service } from '/services/service'

export interface NavbarServiceObject {
    disable?: boolean
    hidden?: boolean
    buttons?: NavbarButtonProps[]
}

export class NavbarService implements Service<NavbarServiceObject> {
    protected static navbarSubject = new Subject<NavbarServiceObject>()

    public static update(options: NavbarServiceObject): void {
        NavbarService.navbarSubject.next(options)
    }

    public static subscribe(event: 'update', callback: (obj: NavbarServiceObject) => void): void {
        if (event === 'update') {
            NavbarService.navbarSubject.asObservable().subscribe(callback)
            return
        }
        throw new Error(`Unknown event: ${event}`)
    }
}
