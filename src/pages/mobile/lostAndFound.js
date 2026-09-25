import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileLost from '../../components/section/sidebar/mobile/lost.mobile'
import { withTrans } from '../../../i18n/withTrans'

const LostAndFound = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileLost user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(LostAndFound)