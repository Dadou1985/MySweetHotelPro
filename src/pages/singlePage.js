import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from '../components/section/common/loader'
import ToolBar from "../components/section/toolbar"
import Memo from '../components/section/memo'
import Navigation from '../components/section/navigation'
import {FirebaseContext, db, auth} from '../Firebase'
import Chat from '../components/section/communIzi'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"

const SinglePage = () => {

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
                let userState = JSON.stringify(doc.data())
                let userAuth = JSON.stringify(user)
                sessionStorage.setItem("userStorage", userState)
                sessionStorage.setItem("userAuth", userAuth)
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

  console.log("******", userDB)
  
  return (
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}>
      <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
        <Loader hide={hide} />
      </div>
      {!!user && !!userDB &&
      <Navigation user={user} userDB={userDB} />}
        <div style={{
          display: "flex",
      }}>
          <ToolBar />
          <div className="dark_messenger_communizi_container">
            <h5 className="font-weight-bolder dark_messenger_title">{t("chat.chat_title")}</h5>
            {!!userDB && !!user&&
            <Chat userDB={userDB} user={user} />}
        </div>
          <Memo />
        </div>
        </FirebaseContext.Provider>
  )
}

export default withTrans(SinglePage)