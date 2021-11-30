import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import ChatLogo from '../../svg/chat.png'
import HousekkepingLogo from '../../svg/maid.svg'
import RepairLogo from '../../svg/repair.svg'
import TimerLogo from '../../svg/timer.svg'
import CabLogo from '../../svg/taxi.svg'


export default function Sticker({url, logo}) {
    return (
        <div style={{
            width: 378,
            height: 378,
            border: "1px solid black",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "5%"
        }}>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-between",
                width: "55%"
            }}>
                <img src={ChatLogo} style={{width: "1vw"}} />
                <img src={HousekkepingLogo} style={{width: "1vw"}} />
                <img src={CabLogo} style={{width: "1vw"}} />
                <img src={TimerLogo} style={{width: "1vw"}} />
                <img src={RepairLogo} style={{width: "1vw"}} />
            </div>
            <QRCode 
            value={url} 
            logoImage={logo}
            size={192}
            logoWidth="50"
            logoHeight="50"
            />
            <h5 style={{marginBottom: 0}}>Tous nos services en</h5>
            <h3 style={{marginTop: -10}}>une seule app</h3>
        </div>
    )
}
