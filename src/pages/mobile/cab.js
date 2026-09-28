import React, { useContext } from "react"
import MobileCab from '../../components/section/sidebar/mobile/cab.mobile'
import {FirebaseContext} from '../../config/Firebase'
import { withTrans } from '../../../i18n/withTrans'

const Cab = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
      <div className="landscape-display"></div>   
      {!!user && !!userDB &&
      <MobileCab user={user} userDB={userDB} />}
    </>
  )
}


export default withTrans(Cab)