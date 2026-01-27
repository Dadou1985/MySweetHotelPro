import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneMaid from '../components/section/form/phoneForm/phoneMaid'
import { withTrans } from '../../i18n/withTrans'

const RoomChange = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>    
        {!!user && !!userDB &&
        <PhoneMaid user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(RoomChange)