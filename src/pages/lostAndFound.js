import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneLost from '../components/section/form/phoneForm/phoneLost'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const LostAndFound = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneLost user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(LostAndFound)