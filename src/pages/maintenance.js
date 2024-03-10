import React, { useEffect, useState } from "react"
import Loader from '../helper/common/mshLoader'
import {FirebaseContext, db, auth} from '../Firebase'
import PhoneRepair from '../components/section/form/phoneForm/phoneRepair'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Maintenance = () => {
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
        <div className="landscape-display"></div>
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>   
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneRepair user={user} userDB={userDB} />}
    </FirebaseContext.Provider>
  )
}

export default withTrans(Maintenance)