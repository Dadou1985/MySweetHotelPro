import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from '../components/section/common/loader'
import ToolBar from "../components/section/toolbar"
import Navigation from '../components/section/navigation'
import {FirebaseContext, db, auth} from '../Firebase'
import Dashboard from '../components/section/dashboard'
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import Background from "../images/newDeskDigital.png"
import moment from 'moment'
import 'moment/locale/fr';

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
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "5vw"
        }}>
          <ToolBar />
          <div className="dark_messenger_communizi_container">
            <h3 style={{paddingTop: "3vh", paddingLeft: "3vw"}}>Tableau de bord</h3>
            <div style={{display: typeof window && window.innerWidth < 768 ? "none" : "flex", fontSize: "1em", marginLeft: "3vw", color: "gray"}}>{moment().format('LL')}</div>
            {!!userDB && !!user&&
            <Dashboard userDB={userDB} user={user} />}
          </div>
      </div>
    </FirebaseContext.Provider>
  )
}

export default withTrans(SinglePage)