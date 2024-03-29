import React from 'react'
import { QRCode } from 'react-qrcode-logo';
import Divider from '@material-ui/core/Divider';
import MshScreen from "./mshAppScreenBand"
import '../css/section/band.css'
import MshLogo from '../../svg/new-logo-msh.png'
import { useTranslation } from "react-i18next"
import { StaticImage } from 'gatsby-plugin-image'

export default function Band({url, logo}) {
    const { t } = useTranslation()

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
            {logo ? <div style={{
                display: "flex",
                flexFlow: "column",
                height: "100%",
                alignItems: "center",
                width: "30%"
            }}>
                <img src={logo} style={{width: "50%", marginTop: "20%", marginBottom: "20%", filter: "drop-shadow(1px 1px 1px)"}} />
                <MshScreen logo={logo} />
            </div> : <div style={{
                display: "flex",
                flexFlow: "column",
                height: "100%",
                alignItems: "center",
                width: "30%"
            }}>
                <StaticImage objectFit='contain' src='../../svg/new-logo-msh.png' placeholder="blurred" style={{width: "70%", marginTop: "20%", marginBottom: "20%", filter: "drop-shadow(1px 1px 1px)"}} />
                <MshScreen logo={MshLogo} />
            </div>}
            <div style={{
                display: "flex",
                flexFlow: "column",
                height: "90%",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{fontSize: "5em", filter: "drop-shadow(1px 1px 1px)"}}><b>{t("msh_user_panel.u_section.s_visuals.v_band.b_message.part_one")}<br/>{t("msh_user_panel.u_section.s_visuals.v_band.b_message.part_two")}</b></h1>
                    <Divider style={{width: "100%", marginBottom: "4vh", marginTop: "4vh", filter: "drop-shadow(1px 1px 1px)"}} />
                    <h6 style={{filter: "drop-shadow(1px 1px 1px)"}}><b>{t("msh_user_panel.u_section.s_visuals.v_band.b_message.part_three")}<br/>{t("msh_user_panel.u_section.s_visuals.v_band.b_message.part_four")}</b></h6>
                </div>
                <div style={{filter: "drop-shadow(1px 1px 1px)"}}>
                    <QRCode 
                    value={url && url.replace(/ /g,'%20')} 
                    size={230}
                    />
                    <h6 style={{marginTop: 0}}>{t("msh_user_panel.u_section.s_visuals.v_band.b_message.part_five")}</h6>
                </div>
            </div>
        </div>
    )
}
