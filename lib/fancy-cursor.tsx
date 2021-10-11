import React, { ReactElement } from 'react'
import autoBindReact from 'auto-bind/react'
import c from 'classnames'
import { css } from '@emotion/css'

// TODO: Better interactions such as removed focus.

const DisableNativeCursorCss = css({
    '*': {
        cursor: 'none !important'
    }
})

const FancyCursorCss = css({
    'position': 'fixed',
    'zIndex': 99999,
    'display': 'block',
    'pointerEvents': 'none',
    'opacity': '1',
    'transform': 'translate3d(var(--tx, 0px), var(--ty, 0px), 0) scale(var(--scale, 1)) rotate(var(--rotate, 0deg))',
    'willChange': 'top, left',
    '&.cursor-hidden': { opacity: '0' },
    '&.cursor-disabled': { opacity: '0', visibility: 'hidden' }
})

export interface FancyCursorProps {
    className?: string
    style?: React.CSSProperties
    children?: ReactElement | ReactElement[]
}

export interface FancyCursorProviderProps {
    children?: ReactElement | ReactElement[]
}

export interface FancyCursorProviderState {
    disabled: boolean
    disabledNode: HTMLElement | null
    cursor: 'default' | 'hidden' | string
    // focusNode: HTMLElement | null
    // focusRect: DOMRect | null
}

export const CursorContext = React.createContext<FancyCursorProviderState | undefined>(undefined)

const FancyCursorPointerState = {
    px: 0,
    py: 0
    // inMotion: false
}

export class FancyCursor extends React.Component<FancyCursorProps> {
    static contextType = CursorContext
    context!: FancyCursorProviderState

    element!: HTMLDivElement
    requestAnimationReference?: number
    observer?: MutationObserver

    speed = 1
    // focusNode: HTMLElement | null = null
    hidden = true

    x = 0
    y = 0
    w = 0
    h = 0

    constructor(props: Readonly<FancyCursorProps>) {
        super(props)
        autoBindReact(this)
    }

    componentDidMount(): void {
        this.animate()

        this.observer = new MutationObserver(this.handleStyleUpdate)
        this.observer.observe(this.element, {
            attributes: true,
            attributeFilter: ['style']
        })
    }

    componentWillUnmount(): void {
        this.cancelAnimation()
        this.observer!.disconnect()
        delete this.observer
    }

    /**
     * TODO: Should revise this method.
     * @constructor
     */
    UNSAFE_componentWillUpdate(): void {
        // if (!this.state.inMotion) {
        //     this.setState({
        //         inMotion: true
        //     })
        //     this.animate()
        // }

        // if (this.focusNode !== this.context.focusNode) {
        //     this.focusNode = this.context.focusNode
        //
        //     if (this.focusNode === null) {
        //         this.removeFocusProperties()
        //     } else {
        //         this.updateFocusProperties()
        //     }
        // }

        if (!this.hidden && (this.context.cursor === 'hidden' || this.context.cursor === 'disabled')) {
            this.hidden = true
        }
        //
        // if (this.hidden && this.context.cursor !== 'hidden') {
        // }
    }

    render(): ReactElement {
        return (
            // <CursorContext.Consumer>
            //     {({hidden}) => (
            <div
                ref={(ref) => (this.element = ref!)}
                className={c([FancyCursorCss, this.props.className, `cursor-${this.context.cursor}`])}
                style={this.props.style}
                // style={{ transform: `translate(${tx}px, ${ty}px)` }}
            >
                {this.props.children}
            </div>
            //     )}
            // </CursorContext.Consumer>
        )
    }

    protected handleStyleUpdate(): void {
        const style = window.getComputedStyle(this.element)

        // COMPUTE SPEED
        const speed = parseFloat(style.getPropertyValue('--speed'))
        this.w = parseInt(style.width)
        this.h = parseInt(style.height)

        this.speed = speed ? speed : 1
    }

    /**
     * This should be more precise somehow, and we also need to implement
     * cancelAnimation if it is not in motion.
     * @protected
     */
    protected animate(): void {
        // this.inMotion = true
        const { px, py } = FancyCursorPointerState
        let speed = this.speed

        if (this.hidden) {
            speed = 1
            this.hidden = false
        }

        this.x = this.x + (px - this.x) * speed
        this.y = this.y + (py - this.y) * speed

        // const rx = Math.round(nx * 1) / 1
        // const ry = Math.round(ny * 1) / 1

        const tx = Math.round(this.x - this.w / 2)
        const ty = Math.round(this.y - this.h / 2)

        this.element.style.top = ty + 'px'
        this.element.style.left = tx + 'px'

        // if (px === rx && py === ry) {
        //     this.cancelAnimation()
        //     this.inMotion = false
        // } else {
        this.requestAnimationReference = requestAnimationFrame(this.animate)
        // }
    }

    protected cancelAnimation(): void {
        if (this.requestAnimationReference !== undefined) {
            cancelAnimationFrame(this.requestAnimationReference)
            delete this.requestAnimationReference
        }
    }

    // protected updateFocusProperties(): void {
    //     this.element.style.setProperty('--focus-x', Math.round(this.context.focusRect!.x) + 'px')
    //     this.element.style.setProperty('--focus-y', Math.round(this.context.focusRect!.y) + 'px')
    //     this.element.style.setProperty('--focus-w', Math.round(this.context.focusRect!.width) + 'px')
    //     this.element.style.setProperty('--focus-h', Math.round(this.context.focusRect!.height) + 'px')
    // }
    //
    // protected removeFocusProperties(): void {
    //     this.element.style.removeProperty('--focus-x')
    //     this.element.style.removeProperty('--focus-y')
    //     this.element.style.removeProperty('--focus-w')
    //     this.element.style.removeProperty('--focus-h')
    // }
}

export class FancyCursorProvider extends React.Component<FancyCursorProviderProps, FancyCursorProviderState> {
    inViewport = false

    constructor(props: Readonly<FancyCursorProviderProps>) {
        super(props)
        autoBindReact(this)

        this.state = {
            cursor: 'hidden',
            // focusRect: null,
            // focusNode: null,
            disabledNode: null,
            disabled: true
        }
    }

    componentDidMount(): void {
        this.disableNativeCursor()

        // ADD EVENT LISTENERS
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseleave', this.handleMouseViewportOut)
        document.addEventListener('mouseover', this.handleMouseOver as (e: MouseEvent) => void)
    }

    componentWillUnmount(): void {
        this.enableNativeCursor()

        // REMOVE EVENT LISTENERS
        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseenter', this.handleMouseViewportIn)
        document.removeEventListener('mouseleave', this.handleMouseViewportOut)
    }

    render(): ReactElement {
        return <CursorContext.Provider value={this.state}>{this.props.children}</CursorContext.Provider>
    }

    /**
     * This one ALSO handles the mouseenter.
     * @param e MouseEvent
     */
    protected handleMouseMove(e: MouseEvent): void {
        FancyCursorPointerState.px = e.clientX
        FancyCursorPointerState.py = e.clientY

        if (!this.inViewport) this.handleMouseViewportIn()
    }

    protected handleMouseViewportIn(): void {
        this.inViewport = true

        // this.setState({
        //     cursor: this.lastCursor
        // })
    }

    protected handleMouseViewportOut(): void {
        this.inViewport = false

        this.setState({
            cursor: 'hidden'
        })
    }

    protected handleMouseOver(e: MouseEvent & { path: HTMLElement[] }): void {
        // window > document > html > ...
        const path = e.path || (e.composedPath && e.composedPath())

        let cursor = 'default'
        let disabled = false
        let disabledNode: HTMLElement | null = null
        let focusNode: HTMLElement | null = null

        if (path.length > 3) {
            for (const node of path) {
                if (typeof node.hasAttribute === 'undefined') continue

                const cursorAttribute = node.getAttribute('data-cursor')

                if (cursorAttribute && !focusNode) {
                    focusNode = node
                    cursor = cursorAttribute
                }

                if (node.hasAttribute('data-cursor-disabled')) {
                    disabledNode = node
                    disabled = true
                }
            }

            if (disabled) cursor = 'disabled'
        }

        const updates: any = {}

        // if (this.state.focusNode !== focusNode) {
        //     updates.focusNode = focusNode
        //     updates.focusRect = focusNode ? focusNode.getBoundingClientRect() : null
        // }

        if (this.state.disabled !== disabled) {
            updates.disabled = disabled
            disabled ? this.enableNativeCursor() : this.disableNativeCursor()
        }

        if (this.state.disabledNode !== disabledNode) updates.disabledNode = disabledNode
        if (this.state.cursor !== cursor) updates.cursor = cursor

        if (Object.keys(updates).length !== 0) this.setState(updates)
    }

    protected disableNativeCursor(): void {
        document.body.classList.add(DisableNativeCursorCss)
    }

    protected enableNativeCursor(): void {
        document.body.classList.remove(DisableNativeCursorCss)
    }
}
