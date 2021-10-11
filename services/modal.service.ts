import { Subject } from 'rxjs'
import { ModalButtonProps } from '/components/modal'
import { Service } from '/services/service'
import { ClientUtil } from '/utils/client/client.util'

export interface ModalServiceObject {
    hidden: boolean
    title: text
    text: text
    buttons: ModalButtonProps[]
}

export class ModalService implements Service<ModalServiceObject> {
    protected static modalSubject = new Subject<ModalServiceObject>()

    public static showModal(obj: Omit<ModalServiceObject, 'hidden'>): void {
        ClientUtil.freezeDocumentScroll()

        ModalService.modalSubject.next({ ...obj, hidden: false })
    }

    public static hideModal(): void {
        ClientUtil.releaseDocumentScroll()

        ModalService.modalSubject.next({
            hidden: true,
            title: '',
            text: '',
            buttons: []
        })
    }

    public static subscribe(event: 'update', callback: (obj: ModalServiceObject) => void): void {
        if (event === 'update') {
            ModalService.modalSubject.asObservable().subscribe(callback)
            return
        }
        throw new Error(`Unknown event: ${event}`)
    }
}
