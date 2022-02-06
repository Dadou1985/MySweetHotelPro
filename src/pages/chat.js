import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
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
  const { t, i18n } = useTranslation()

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          await setUser(user)
          await db.collection('businessUsers')
          .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("+++++++", doc.data())
                setUserDB(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!")
              }
            })
            return setHide("none")
        }
      })
    return unsubscribe
}, [])

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
            {typeof window && window.innerWidth > 768 ?
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