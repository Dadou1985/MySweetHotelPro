import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/shiftLoader'
import {FirebaseContext, db, auth} from '../Firebase'
import Chat from '../components/section/communIzi'
import PhoneChat from '../components/section/phoneCommunIzi'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import ToolBar from "../components/section/toolbar"

const ChatPage = () => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {     
    if(!user && !userDB){
      const userStorage = JSON.parse(sessionStorage.getItem('userStorage'))
    const userAuth = JSON.parse(sessionStorage.getItem('userAuth'))
    
    setUser(userAuth)
    setUserDB(userStorage)
    return setHide("none")
    }
        
}, [user, userDB])

const isBrowser = () => typeof window !== "undefined"

  return(
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
          <Loader hide={hide} />
        </div>     
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}  
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
    </FirebaseContext.Provider>
  )
}

export default withTrans(ChatPage)