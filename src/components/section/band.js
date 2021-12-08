import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import Divider from '@material-ui/core/Divider';
import AppVisual from '../../images/msh-front-app.png'
import MshScreen from "./mshAppScreenBand"
import '../css/band.css'
import HotelLogo from '../../images/les-forteresses.png'

export default function Band({url, logo}) {
    
    return (
        <div style={{
            width: 1920,
            height: 1080,
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "5%",
            borderRadius: "1px",
            backgroundColor: "white",
            borderRadius: "1px",
            backgroundColor: "white",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "13vw",
            backgroundPositionY: "61vh"
        }}>
            <div style={{
                display: "flex",
                flexFlow: "column",
                height: "100%",
                alignItems: "center",
                width: "30%"
            }}>
                <img src={logo} style={{width: "50%", marginTop: "20%", marginBottom: "20%", filter: "drop-shadow(1px 1px 1px)"}} />
                <MshScreen logo={logo} />
            </div>
            <div style={{
                display: "flex",
                flexFlow: "column",
                height: "90%",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{fontSize: "5em", filter: "drop-shadow(1px 1px 1px)"}}><b>Contactez-nous<br/>en un seul clic</b></h1>
                    <Divider style={{width: "100%", marginBottom: "4vh", marginTop: "4vh", filter: "drop-shadow(1px 1px 1px)"}} />
                    <h6 style={{filter: "drop-shadow(1px 1px 1px)"}}><b>Découvrez notre application web et profitez de nos services<br/>depuis un smartphone ou une tablette</b></h6>
                </div>
                <div style={{filter: "drop-shadow(1px 1px 1px)"}}>
                    <QRCode 
                    value={url.replace(/ /g,'%20')} 
                    size={230}
                    />
                    <h6 style={{marginTop: 0}}>Scannez le qr code ci-dessus</h6>
                </div>
            </div>
        </div>
    )
}
