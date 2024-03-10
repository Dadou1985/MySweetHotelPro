import React, { useEffect, useState } from "react"
import Loader from '../helper/common/mshLoader'
import Dilema from '../components/section/dilema'
import {FirebaseContext, db, auth} from '../Firebase'
import Navigation from '../components/section/navigation'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const DoorsStage = () => {
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
            <div className="landscape-display"></div>
            <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}
            {!!user && userDB && !!setUserDB &&
              <ShortenUrlProvider config={{ accessToken: '4414aed1636f8815449ff0a59d1b67a513dfc0d1' }}>
                <Dilema user={user} userDB={userDB} setUserDB={setUserDB} />
              </ShortenUrlProvider>}
        </FirebaseContext.Provider>
    )
}

export default withTrans(DoorsStage)