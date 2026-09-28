import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileHouseKeeping from '../../components/section/sidebar/mobile/houseKeeping.mobile'
import { withTrans } from '../../../i18n/withTrans'

const HouseKeeping = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileHouseKeeping />}
    </>
  )
}

export default withTrans(HouseKeeping)

