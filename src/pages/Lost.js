import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
import {FirebaseContext, db, auth} from '../Firebase'
import LostNFound from '../components/section/LostNFound'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Lost = () => {
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
        {!!user && !!userDB &&
        <LostNFound user={user} userDB={userDB} />}
    </FirebaseContext.Provider>
  )
}

export default withTrans(Lost)