import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
import {FirebaseContext, db, auth} from '../Firebase'
import GuestDatabase from '../components/section/guestDatabase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'
import ToolBar from "../components/section/toolbar"

const UserDatabase = () => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          await setUser(user)
          await db.collection('businessUsers')
          .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
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
          <ToolBar />
          {!!user && !!userDB &&
          <GuestDatabase user={user} userDB={userDB} />}
        </div>
    </FirebaseContext.Provider>
  )
}

export default withTrans(UserDatabase)