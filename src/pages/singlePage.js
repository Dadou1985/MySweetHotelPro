import React, { useContext } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import ToolBar from "../components/section/toolbar"
import {FirebaseContext} from '../Firebase'
import Dashboard from '../components/section/dashboard'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import Background from "../images/newDeskDigital.png"
import moment from 'moment'
import 'moment/locale/fr';

const SinglePage = () => {
  const firebaseCtx = useContext(FirebaseContext) || { user: null, userDB: null }
  const { userDB, user } = firebaseCtx
  const { t } = useTranslation()

  const isBrowser = () => typeof window !== "undefined"

  return (
    <>
      <div className="landscape-display"></div>
        <div style={{
          display: "flex",
          backgroundImage: isBrowser() && window.innerWidth > 768 ? `url(${Background})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "5vw",
          backgroundPositionY: "-5vh"
        }}>
          <ToolBar />
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            width: "95%"
          }}>
            <div style={{width: isBrowser() && window.innerWidth > 768 ? "50%" : "100%"}}>
              <h3 style={{
                paddingTop: "3vh", 
                paddingLeft: isBrowser() && window.innerWidth > 768 ? "3vw" : "0", 
                textAlign: isBrowser() && window.innerWidth > 768 ? "left" : "center"}}>{t("msh_dashboard.d_title")}</h3>
              <div style={{
                display: "flex", 
                flexFlow: "row", 
                fontSize: "1em", 
                marginLeft: isBrowser() && window.innerWidth > 768 ? "3vw" : "0", 
                marginBottom: isBrowser() && window.innerWidth > 768 ? "0" : "5vh",
                color: "gray", 
                justifyContent: isBrowser() && window.innerWidth > 768 ? "left" : "center"}}>{moment().format('LL')}</div>
              {!!userDB && !!user&&
              <Dashboard userDB={userDB} user={user} />}
            </div>
          </div>
      </div>
    </>
  )
}

export default withTrans(SinglePage)