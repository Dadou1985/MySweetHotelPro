import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneRepair from '../components/section/form/phoneForm/phoneRepair'
import { withTrans } from '../../i18n/withTrans'

const Maintenance = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <PhoneRepair user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(Maintenance)