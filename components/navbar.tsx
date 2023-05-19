import React, { ReactElement, useState } from 'react'
import { ConditionalWrapper } from '../helpers/conditional-wrapper'
import { NavbarService, NavbarServiceObject } from '/services/navbar.service'
import { useService } from '/hooks/use-service'
import { SplashService } from '/services/splash.service'
import c from 'classnames'

export interface NavbarButtonProps {
    icon: text
    className?: text
    href?: text
    rel?: text
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    tooltip?: text
}

export function NavbarButton(props: NavbarButtonProps): ReactElement {
    function wrapper(c: ReactElement): ReactElement {
        return (
            <a href={props.href!} {...(props.rel ? { rel: props.rel } : {})} onClick={() => SplashService.showSplash()}>
                {c}
            </a>
        )
    }

    return (
        <ConditionalWrapper condition={props.href !== undefined} wrapper={wrapper}>
            <div
                className={c('ma-navbar-button', props.className)}
                onClick={props.onClick}
                {...(props.tooltip ? { 'data-tooltip': props.tooltip } : {})}
                data-cursor="pointer"
            >
                <i className="material-icons">{props.icon}</i>
            </div>
        </ConditionalWrapper>
    )
}

// TODO: Revise as header.
export function Navbar(): null | ReactElement {
    const navbarObj = useService<NavbarServiceObject>(NavbarService, {
        disable: true,
        hidden: false,
        buttons: []
    })
    const [showResults, setShowResults] = useState(false)

    if (navbarObj.disable) return null

    return (
        <header
            className={c({
                ['ma-navbar']: true,
                hidden: navbarObj.hidden,
                active: showResults
            })}
        >
            <div className="ma-searchbox ma-container">
                <input
                    className="ma-searchbox-input"
                    type="text"
                    spellCheck={false}
                    placeholder="Search in the database..."
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setShowResults(false)}
                />
                <div className="ma-searchbox-button" data-cursor="pointer">
                    <i className="material-icons">search</i>
                    <span>Search</span>
                </div>
                <div className="ma-searchbox-result-container">
                    <ul className="ma-searchbox-result-wrapper ma-container">
                        <span className="ma-searchbox-result-wrapper-label">SEARCH RESULTS</span>
                        <li className="ma-searchbox-result">
                            <span className="ma-searchbox-result-title">Monotonic Function</span>
                        </li>
                        <li className="ma-searchbox-result">
                            <span className="ma-searchbox-result-title">Monotonic Function</span>
                        </li>
                    </ul>
                </div>
            </div>
            <nav className="ma-navbar-buttons">
                {!navbarObj.buttons ? null : navbarObj.buttons.map((p, i) => <NavbarButton {...p} key={i} />)}
                <a href={'/users/howion'}>
                    <div className="ma-navbar-button shrink" /* data-tooltip="howion" */ data-cursor="pointer">
                        <i className="material-icons">account_circle</i>
                    </div>
                </a>
            </nav>
        </header>
    )
}
