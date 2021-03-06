import React from 'react'
import AppVisual from '../../images/msh-front-app.png'

export default function MshAppScreenBand({logo}) {
    return (
        <div style={{
            width: "80%",
            backgroundColor: "white",
            backgroundImage: `url(${AppVisual})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundPosition: "center"
        }}>
            <img src={logo} style={{width: "32%", height: "28%", marginBottom: "34%", marginTop: "10%"}} />
        </div>
    )
}
