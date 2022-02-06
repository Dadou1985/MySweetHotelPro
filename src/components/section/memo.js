import React, {useState} from 'react'
import StickList from './stickList'
import '../css/memo.css'
import Divider from '@material-ui/core/Divider'
  import { useTranslation } from "react-i18next"


const Memo =({userDB})=>{
    const { t, i18n } = useTranslation()

    return(
        
            <div style={{display: typeof window !== `undefined` && window.innerWidth > 768 ? "flex" : "none"}} className="memo_container">
                <h5 className="memo_title"><b>{t("Le Mur")}</b> - Expression libre</h5>
                <Divider/>
                {userDB && 
                <StickList userDB={userDB} />}
            </div>
    )
}

export default Memo