import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneHouseKeeping from '../components/section/form/phoneForm/phoneHouseKeeping'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const HouseKeeping = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneHouseKeeping user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(HouseKeeping)

