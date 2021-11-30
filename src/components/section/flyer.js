import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import Divider from '@material-ui/core/Divider';
import AppVisual from '../../images/msh-front-app.png'
import HotelLogo from '../../images/les-forteresses.png'

export default function Flyer({url, logo}) {
    return (
        <div style={{
            width: 794,
            height: 1123,
            border: "1px solid black",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "5%"
        }}>
            <div>
                <h1 style={{fontSize: "4em"}}>Contactez-nous<br/>en un seul clic</h1>
                <Divider style={{width: "100%", marginBottom: "2vh"}} />
                <h6>Découvrez notre application web et profitez de nos services<br/>depuis un smartphone ou une tablette</h6>
            </div>
            <img src={AppVisual} style={{width: "20vw"}} />
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
            <img src={logo} style={{width: "115px", height: "85px", position: "absolute", borderRadius: "5px", bottom: "295px"}} />
        </div>
    )
}
