import React, { useContext } from "react"
import {FirebaseContext} from '../config/Firebase'
import Chat from '../components/chat/chat'
import MobileChat from '../components/chat/mobile/chat.mobile'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import Sidebar from "../components/section/sidebar/sidebar"

const ChatPage = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)
  const { t } = useTranslation()

const isBrowser = () => typeof window !== "undefined"

  return(
    <> 
        <div className="landscape-display"></div> 
          <div style={{
            display: "flex"
          }}>
            {isBrowser() && window.innerWidth > 1023 ?
            <>
              <Sidebar />
              <div id="iziChat" className="dark_messenger_communizi_container">
                <h3 className="dark_messenger_title">{t('msh_chat.c_chat_title')}</h3>
                {!!userDB && !!user&&
                <Chat />}
              </div>
            </> : 
            <>
            {isBrowser() && window.innerWidth > 768 && <Sidebar />}
              <div id="iziChat" className="dark_messenger_communizi_container">
                <h3 className="dark_messenger_title">{t('msh_chat.c_chat_title')}</h3>
                {!!userDB && !!user&&
                <MobileChat />}
              </div>
            </>}
          </div>
    </>
  )
}

export default withTrans(ChatPage)