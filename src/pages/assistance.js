import React, { useContext } from "react"
import PhoneSupport from '../components/section/form/phoneForm/phoneSupport'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Assistance = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <>
      <div className="landscape-display"></div> 
      {!!user && !!userDB &&
      <Navigation user={user} userDB={userDB} />}    
      {!!user && !!userDB &&
      <PhoneSupport user={user} userDB={userDB} />}
    </>
  )
}


export default withTrans(Assistance)