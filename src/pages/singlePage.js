import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from '../components/section/common/loader'
import ToolBar from "../components/section/toolbar"
import Memo from '../components/section/memo'
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
          backgroundImage: typeof window && window.innerWidth > 768 ? `url(${Background})` : "none",
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
            <div style={{width: typeof window && window.innerWidth > 768 ? "50%" : "100%"}}>
              <h3 style={{
                paddingTop: "3vh", 
                paddingLeft: typeof window && window.innerWidth > 768 ? "3vw" : "0", 
                textAlign: typeof window && window.innerWidth > 768 ? "left" : "center"}}>Tableau de bord</h3>
              <div style={{
                display: "flex", 
                flexFlow: "row", 
                fontSize: "1em", 
                marginLeft: typeof window && window.innerWidth > 768 ? "3vw" : "0", 
                marginBottom: typeof window && window.innerWidth > 768 ? "0" : "5vh",
                color: "gray", 
                justifyContent: typeof window && window.innerWidth > 768 ? "left" : "center"}}>{moment().format('LL')}</div>
              {!!userDB && !!user&&
              <Dashboard userDB={userDB} user={user} />}
            </div>
            {/*<div style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              width: "50%",
              paddingTop: "3vh",
            }}>
              {!!user && !! userDB &&
              <Memo user={user} userDB={userDB} />}
              </div>*/}
          </div>
      </div>
    </FirebaseContext.Provider>
  )
}

export default withTrans(SinglePage)