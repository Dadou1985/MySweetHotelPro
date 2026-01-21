import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneClock from '../components/section/form/phoneForm/phoneClock'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Clock = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneClock user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(Clock)