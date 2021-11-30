import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import Divider from '@material-ui/core/Divider';
import AppVisual from '../../images/msh-front-app.png'
import HotelLogo from '../../images/les-forteresses.png'

export default function Band({url, logo}) {
    return (
        <div style={{
            width: 1920,
            height: 1080,
            border: "1px solid black",
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "5%"
        }}>
            <div style={{
                display: "flex",
                flexFlow: "column",
                height: "100%",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <img src={logo} style={{width: "280px"}} />
                <img src={AppVisual} style={{width: "20vw"}} />
            </div>
            <div style={{
                display: "flex",
                flexFlow: "column",
                height: "90%",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{fontSize: "5em"}}><b>Contactez-nous<br/>en un seul clic</b></h1>
                    <Divider style={{width: "100%", marginBottom: "4vh", marginTop: "4vh"}} />
                    <h6><b>Découvrez notre application web et profitez de nos services<br/>depuis un smartphone ou une tablette</b></h6>
                </div>
                <div>
                    <QRCode 
                    value={url} 
                    logoImage={logo}
                    size={192}
                    logoWidth="50"
                    logoHeight="50"
                    />
                    <h6 style={{marginTop: 0}}>Scannez le qr code ci-dessus</h6>
                </div>
            </div>
            <img src={logo} style={{width: "115px", height: "85px", position: "absolute", borderRadius: "5px", bottom: "70px", left: "410px"}} />
        </div>
    )
}
