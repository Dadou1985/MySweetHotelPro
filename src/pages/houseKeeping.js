import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneHouseKeeping from '../components/section/form/phoneForm/phoneHouseKeeping'
import { withTrans } from '../../i18n/withTrans'

const HouseKeeping = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <PhoneHouseKeeping />}
    </>
  )
}

export default withTrans(HouseKeeping)

