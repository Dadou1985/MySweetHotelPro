import React, { useContext } from "react"
import PhoneCab from '../components/section/form/phoneForm/phoneCab'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Cab = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
      <div className="landscape-display"></div>
      {!!user && !!userDB &&
      <Navigation user={user} userDB={userDB} />}    
      {!!user && !!userDB &&
      <PhoneCab user={user} userDB={userDB} />}
    </>
  )
}


export default withTrans(Cab)