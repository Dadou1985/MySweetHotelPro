import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import Chat from '../components/section/communIzi'
import PhoneChat from '../components/section/phoneCommunIzi'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import ToolBar from "../components/section/toolbar"

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
            {isBrowser() && window.innerWidth > 768 ?
            <>
              <ToolBar />
              <div id="iziChat" className="dark_messenger_communizi_container">
                <h3 className="dark_messenger_title">{t('msh_chat.c_chat_title')}</h3>
                {!!userDB && !!user&&
                <Chat userDB={userDB} user={user} />}
              </div>
            </> : 
            <div id="iziChat" className="dark_messenger_communizi_container">
              <h3 className="dark_messenger_title">{t('msh_chat.c_chat_title')}</h3>
              {!!userDB && !!user&&
              <PhoneChat userDB={userDB} user={user} />}
            </div>}
          </div>
    </>
  )
}

export default withTrans(ChatPage)