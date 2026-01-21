import React, { useContext } from "react"
import {FirebaseContext, db, auth} from '../Firebase'
import PhoneMaid from '../components/section/form/phoneForm/phoneMaid'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const RoomChange = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}     
        {!!user && !!userDB &&
        <PhoneMaid user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(RoomChange)