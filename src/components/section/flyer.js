import React, { memo } from 'react'
import { QRCode } from 'react-qrcode-logo';
import Divider from '@material-ui/core/Divider';
import MshScreen from "./mshAppScreenFlyer"
import '../css/section/flyer.css'
import { useTranslation } from "react-i18next"
import MshLogo from '../../svg/new-logo-msh.png'

const Flyer = ({url, logo}) => {
    const { t } = useTranslation()

    return (
        <div style={{
            width: 794,
            height: 1123,
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "5%",
            borderRadius: "1px",
            backgroundColor: "white",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
        }}>
            <div>
                <h1 style={{fontSize: "4em", filter: "drop-shadow(1px 1px 1px)"}}>{t("msh_user_panel.u_section.s_visuals.v_flyer.f_message.part_one")}<br/>{t("msh_user_panel.u_section.s_visuals.v_flyer.f_message.part_two")}</h1>
                <Divider style={{width: "100%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                <h6 style={{filter: "drop-shadow(1px 1px 1px)"}}>{t("msh_user_panel.u_section.s_visuals.v_flyer.f_message.part_three")}<br/>{t("msh_user_panel.u_section.s_visuals.v_flyer.f_message.part_four")}</h6>
            </div>
            {logo ? <MshScreen logo={logo} /> : <MshScreen logo={MshLogo} />}
            <div style={{filter: "drop-shadow(1px 1px 1px)"}}>
                <QRCode 
                value={url.replace(/ /g,'%20')} 
                size={192}
                />
                <h6 style={{marginTop: 0}}>{t("msh_user_panel.u_section.s_visuals.v_flyer.f_message.part_five")}</h6>
            </div>
        </div>
    )
}

export default memo(Flyer)