import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/shiftLoader'
import {FirebaseContext, db, auth} from '../Firebase'
import PhoneClock from '../components/section/form/phoneForm/phoneClock'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Clock = () => {
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

  return(
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>   
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneClock user={user} userDB={userDB} />}
    </FirebaseContext.Provider>
  )
}

export default withTrans(Clock)