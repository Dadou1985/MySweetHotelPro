import React from 'react'
import StickList from './stickList'
import '../css/section/memo.css'
import Divider from '@material-ui/core/Divider'
import { useTranslation } from "react-i18next"

const Memo =({userDB})=>{
    const { t } = useTranslation()

    return(
        
            <div style={{display: typeof window !== `undefined` && window.innerWidth > 768 ? "flex" : "none"}} className="memo_container">
                <h5 className="memo_title"><b>{t("msh_memo.m_title")}</b> - {t("msh_memo.m_subtitle")}</h5>
                <Divider/>
                {userDB && 
                <StickList userDB={userDB} />}
            </div>
    )
}

export default Memo