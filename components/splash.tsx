import React, { ReactElement } from 'react'
import cns from 'classnames'
import { useDidMount } from 'rooks'
import { useService } from '/hooks/use-service'
import { EmblemAbstract } from '/components/emblem-abstract'
import { SplashService } from '/services/splash.service'

export function Splash(): ReactElement {
    // Emit mount event
    useDidMount(() => {
        SplashService.emitDidMount()
    })

    // Check whether it's hidden with the splash service
    const hidden = useService(SplashService, false)

    // Render
    return (
        <div className={cns('ma-splash', hidden ? 'hidden' : null)}>
            <EmblemAbstract />
        </div>
    )
}
