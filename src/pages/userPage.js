import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import UserProfile from '../components/section/form/phoneForm/userProfile'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const UserPage = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}  
        {!!user && !!userDB && !!setUserDB &&
        <UserProfile user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
  )
}

export default withTrans(UserPage)