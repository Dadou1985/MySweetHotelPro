import React, { useContext } from "react"
import PhoneSupport from '../components/section/form/phoneForm/phoneSupport'
import {FirebaseContext} from '../Firebase'
import { withTrans } from '../../i18n/withTrans'

const Assistance = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <>
      <div className="landscape-display"></div>     
      {!!user && !!userDB &&
      <PhoneSupport user={user} userDB={userDB} />}
    </>
  )
}


export default withTrans(Assistance)