import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import UserProfile from '../components/section/form/phoneForm/userProfile'
import { withTrans } from '../../i18n/withTrans'

const UserPage = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div> 
        {!!user && !!userDB && !!setUserDB &&
        <UserProfile user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
  )
}

export default withTrans(UserPage)