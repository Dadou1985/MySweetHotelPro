import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileProfile from '../../components/profile/userProfile'
import { withTrans } from '../../../i18n/withTrans'

const ProfilePage = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div> 
        {!!user && !!userDB && !!setUserDB &&
        <MobileProfile user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
  )
}

export default withTrans(ProfilePage)