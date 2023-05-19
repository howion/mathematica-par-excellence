import React, { ReactElement } from 'react'
import { ModalService, ModalServiceObject } from '/services/modal.service'
import cns from 'classnames'
import { useService } from '/hooks/use-service'

export interface ModalButtonProps
{
    label: text
    onClick: () => void
    modifiers?: ('red' | 'blue' | 'green' | 'borderless')[]
}

export function ModalButton(props: ModalButtonProps): ReactElement
{
    const modifiers = props.modifiers ? props.modifiers : []

    return (
        <div className={cns(['ma-modal-button', ...modifiers])} onClick={props.onClick}>
            <span>{props.label}</span>
        </div>
    )
}

export function Modal(): ReactElement
{
    const modalObj = useService<ModalServiceObject>(ModalService, {
        hidden: true,
        title: '',
        text: '',
        buttons: []
    })

    return (
        <div className={cns({'ma-modal-wrapper': true, 'hidden': modalObj.hidden})}>
            <div className="ma-modal">
                <b className="ma-modal-title">{modalObj.title}</b>
                <p className="ma-modal-text">{modalObj.text}</p>
                <div className="ma-modal-buttons">
                    {modalObj.buttons.map((p, i) => <ModalButton {...p} key={i}/>)}
                </div>
            </div>
        </div>
    )
}
