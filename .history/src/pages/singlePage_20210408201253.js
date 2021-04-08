import React, { useEffect, useState, Fragment, useContext } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from '../components/section/common/loader'
import Layout from "../components/layout"
import ToolBar from "../components/section/toolbar"
import Messenger from '../components/section/messenger'
import Memo from '../components/section/memo'
import Navigation from '../components/section/navigation'
import {FirebaseContext, db, auth} from '../Firebase'
import { navigate } from 'gatsby'

const SinglePage = () => {

  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = uUeState(null)


  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          console.log("+++++++", user)
           await db.collection("mySweetHotel")
            .doc("country")
            .collection("France")
            .doc("collection")
            .collection("business")
            .doc("collection")
            .collection('users')
            .doc("Dadou")
            .get()
            .then((doc) => {
              if (doc.exists) {
                setUserDB(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!")
              }
            })
            setUser(user)
            return setHide("none")

        }
      })
    return unsubscribe
}, [])
  
  return (
    <FirebaseContext.Provider value={{ userDB, setUserDB }}>
      <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
        <Loader hide={hide} />
      </div>
      <Navigation />
       {user.displayName ===  <div style={{
          display: "flex",
      }}>
          <ToolBar />
          <Messenger />
          <Memo />
        </div>}
        </FirebaseContext.Provider>
  )
}

export default SinglePage