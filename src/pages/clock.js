import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneClock from '../components/section/form/phoneForm/phoneClock'
import { withTrans } from '../../i18n/withTrans'

const Clock = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <PhoneClock user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(Clock)