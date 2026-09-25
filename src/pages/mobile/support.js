import React, { useContext } from "react"
import MobileSupport from '../../components/section/sidebar/mobile/support.mobile'
import {FirebaseContext} from '../../config/Firebase'
import { withTrans } from '../../../i18n/withTrans'

const Support = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <>
      <div className="landscape-display"></div>     
      {!!user && !!userDB &&
      <MobileSupport />}
    </>
  )
}


export default withTrans(Support)