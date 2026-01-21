import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneCheckList from '../components/section/form/phoneForm/phoneCheckList'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const CheckList = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneCheckList user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(CheckList)

