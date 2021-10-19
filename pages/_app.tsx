// PACKAGES
import React, { ReactElement, useRef } from 'react'
import { AppProps } from 'next/app'

// COMPONENTS
import { Modal } from '/components/modal'
import { Navbar } from '/components/navbar'
import { Splash } from '/components/splash'
import { Meta } from '/components/meta'

// SCSS
import '/scss/main.scss'

import { FancyCursor, FancyCursorProvider } from '/lib/fancy-cursor'
// import SmoothScrollbar from 'smooth-scrollbar'
import { useDidMount } from 'rooks'

// DYNAMICS
// const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
//     ssr: false
// })

/*
 * [TODO:]
 * TRANSPILE NODE_MODULES (IE11 ARROW PROBLEM)
 * MATERIAL-ICONS LOAD PROBLEM
 * REMOVE PRETTIER AND USE ESLINT FULLY INSTEAD
 * TAGS
 * SEARCH
 * FILTERS
 * USE MATHJAX INSTEAD OF KATEX !!
 * ENTRIES TABLE
 * SORT
 * KIND =
 * BY TAGS
 * BY CATEGORIES
 * RELATED RECORDS
 * RELATED LINKS
 * DEPENDENCY CHART
 * AUTH!
 * 404 PAGE
 * BETTER HOMEPAGE
 * CUSTOMIZATIONS
 * EDITOR
 * FONTS
 * COLORS
 */

// TODO: Give fancy cursor speed as css variable!

// export function reportWebVitals(metric: NextWebVitalsMetric): void {
//     console.log(metric)
// }

export default function App({Component, pageProps, router}: AppProps): ReactElement {
    const appRef = useRef<HTMLDivElement>(null)

    useDidMount(() => {
        // SmoothScrollbar.init(appRef.current!, {})
    })

    let route = router.route.split('/')[1].trim()
    if (!route) route = 'home'

    return (
        <>
            <Meta _viewport={true}/>
            <div id="app" ref={appRef}>
                {/*<FancyCursorProvider>
                    <FancyCursor className="app-cursor-inner"/>
                    <FancyCursor className="app-cursor-outer"/>
                </FancyCursorProvider>*/}
                <Splash/>
                <Modal/>
                <div className={`ma-app-container ma-${route}`}>
                    <Navbar/>
                    <Component {...pageProps} appRef={appRef}/>
                </div>
            </div>
        </>
    )
}
