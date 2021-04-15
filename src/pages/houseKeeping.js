import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
import {FirebaseContext, db, auth} from '../Firebase'
import PhoneHouseKeeping from '../components/section/form/phoneForm/phoneHouseKeeping'
import Navigation from '../components/section/navigation'

const HouseKeeping = () => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          await setUser(user)
           await db.collection("mySweetHotel")
            .doc("country")
            .collection("France")
            .doc("collection")
            .collection("business")
            .doc("collection")
            .collection('users')
            .doc(user.displayName)
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
        {!!user && !!userDB &&
        <PhoneHouseKeeping user={user} userDB={userDB} />}
    </FirebaseContext.Provider>
  )
}

export default HouseKeeping

