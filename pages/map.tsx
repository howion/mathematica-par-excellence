import React, { ReactElement } from 'react'
import dynamic from 'next/dynamic'
import { NavbarService } from '/services/navbar.service'
import { useDidMount } from 'rooks'
import { MapNavbar } from '/constants/navbars/map.navbar'
import { SplashService } from '/services/splash.service'
import { Meta } from '/components/meta'
import { ClientUtil } from '../utils/client/client.util'

const DynamicMapComponent = dynamic<Record<never, never>>(() => import('/components/map').then((m) => m.Map), {
    ssr: false
})

export default function Map(): ReactElement {
    useDidMount(() => {
        NavbarService.update(MapNavbar())
        ClientUtil.waitForDocumentReady().then(() => SplashService.hideSplash())
    })

    return (
        <>
            <Meta title="Map" />
            <DynamicMapComponent />
        </>
    )
}
