import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
import Support from '../components/section/assistance'
import {FirebaseContext, db, auth} from '../Firebase'
import Navigation from '../components/section/navigation'

function Assistance() {
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

    return (
       <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>   
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
       <div id="iziChat" className="dark_messenger_communizi_container">
            <h5 className="font-weight-bolder dark_messenger_title">Assistance Technique</h5>
            {!!userDB && !!user&&
            <Support userDB={userDB} user={user} />}
        </div>
    </FirebaseContext.Provider>
    )
}

export default Assistance
