import React, { useEffect, useState } from "react"
import {FirebaseContext, db, auth} from '../Firebase'
import Loader from '../helper/common/mshLoader'

import PropTypes from "prop-types"
import "./css/layout.css"

const Layout = ({ children }) => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          setUser(user)
           await db.collection('businessUsers')
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("ocument!!!!!!", doc.data())
                setUserDB(doc.data())
                let userState = JSON.stringify(doc.data())
                let userAuth = JSON.stringify(user)
                sessionStorage.setItem("userStorage", userState)
                sessionStorage.setItem("userAuth", userAuth)
              } else {
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
      <div>
        <div
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            height: "100%"}}>
          <main className="softSkin">{children}</main>  
        </div>
      </div>
    </FirebaseContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
