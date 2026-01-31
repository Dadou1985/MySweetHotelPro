import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneCheckList from '../components/section/form/phoneForm/phoneCheckList'
import { withTrans } from '../../i18n/withTrans'

const CheckList = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <PhoneCheckList user={user} userDB={userDB} />}
    </>
  )
}

export default withTrans(CheckList)

