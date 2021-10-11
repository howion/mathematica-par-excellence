import React, { ReactElement } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

/**
 * This component should be used only in the client-side!
 */
export function Map(): ReactElement {
    const { innerWidth: w, innerHeight: h } = window

    return (
        <div className="ma-map-wrapper">
            <TransformWrapper
                defaultScale={3}
                defaultPositionX={-w}
                defaultPositionY={-((w * 3) / 2) + h / 2}
                wheel={{
                    disabled: false,
                    step: 120
                }}
                zoomIn={{ animation: false }}
                zoomOut={{ animation: false }}
                reset={{ animation: false }}
                scalePadding={{ animationTime: 0, animationType: 'linear' }}
                pan={{
                    animationTime: 0,
                    animationType: 'linear',
                    velocityBaseTime: 0
                }}
                options={{
                    limitToBounds: false
                }}
            >
                <TransformComponent>
                    <img className="ma-map-map" src={'/api/map'} alt="" />
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}
