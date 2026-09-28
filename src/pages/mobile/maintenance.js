import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileMaintenance from '../../components/section/sidebar/mobile/maintenance.mobile'
import { withTrans } from '../../../i18n/withTrans'

const Maintenance = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileMaintenance user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(Maintenance)