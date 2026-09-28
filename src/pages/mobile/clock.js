import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileClock from '../../components/section/sidebar/mobile/clock.mobile'
import { withTrans } from '../../../i18n/withTrans'

const Clock = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileClock user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(Clock)