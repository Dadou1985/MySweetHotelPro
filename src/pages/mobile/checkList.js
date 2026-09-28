import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileCheckList from '../../components/section/sidebar/mobile/checkList.mobile'
import { withTrans } from '../../../i18n/withTrans'

const CheckList = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileCheckList user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(CheckList)

