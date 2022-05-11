import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/shiftLoader'
import PhoneGhost from '../components/section/form/phoneForm/phoneGhost'
import {FirebaseContext, db, auth} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const GhostHost = () => {
    const [hide, setHide] = useState("flex")
    const [userDB, setUserDB] = useState(null)
    const [user, setUser] = useState(null)
  
    useEffect(() => {     
      if(!user && !userDB){
        const userStorage = JSON.parse(sessionStorage.getItem('userStorage'))
      const userAuth = JSON.parse(sessionStorage.getItem('userAuth'))
      
      setUser(userAuth)
      setUserDB(userStorage)
      return setHide("none")
      }
          
  }, [user, userDB])

    return (
       <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>   
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB && !!setUserDB &&
        <PhoneGhost user={user} userDB={userDB} setUserDB={setUserDB} />}
    </FirebaseContext.Provider>
    )
}

export default withTrans(GhostHost)
