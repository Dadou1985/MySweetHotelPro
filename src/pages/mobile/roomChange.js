import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileMaid from '../../components/section/sidebar/mobile/maid.mobile'
import { withTrans } from '../../../i18n/withTrans'

const RoomChange = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>    
        {!!user && !!userDB &&
        <MobileMaid user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(RoomChange)