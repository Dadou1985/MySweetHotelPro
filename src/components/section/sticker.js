import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import ChatLogo from '../../svg/chat.png'
import HousekkepingLogo from '../../svg/maid.svg'
import RepairLogo from '../../svg/repair.svg'
import TimerLogo from '../../svg/timer.svg'
import CabLogo from '../../svg/taxi.svg'
import '../css/sticker.css'

export default function Sticker({url, logo}) {
      console.log('STICKERURL', logo)
    return (
        <div className="sticker_container">
            <div className="sticker_logo_container">
                <img src={ChatLogo} className="sticker_logo" />
                <img src={HousekkepingLogo} className="sticker_logo" />
                <img src={CabLogo} className="sticker_logo" />
                <img src={TimerLogo} className="sticker_logo" />
                <img src={RepairLogo} className="sticker_logo" />
            </div>
            <QRCode 
            value={url.replace(/ /g,'%20')} 
            logoImage={logo}
            size={192}
            logoWidth="50"
            logoHeight="50"
            />
            <h5 className="sticker_bottom_up">Tous nos services en</h5>
            <h3 className="sticker_bottom_down">une seule app</h3>
        </div>
    )
}
