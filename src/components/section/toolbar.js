import React, {useContext} from 'react'
import '../css/toolbar.css'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/HouseKeeping'
import Database from '../../svg/database.png'
import CheckList from './form/checkList'
import CallCenter from './CallCenter'
import Caisse from './form/caisse'
import GuestTerminator from './guestTerminator'
import { FirebaseContext } from '../../Firebase'
import LostOnes from '../../svg/lost-items.svg'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { navigate } from 'gatsby'
import { useTranslation } from "react-i18next"


const ToolBar = () =>{
    const { userDB, user } = useContext(FirebaseContext)
    const { t, i18n } = useTranslation()

    return(
        <div className="toolbar_container">
            {userDB && user &&
                <HouseKeeping userDB={userDB} user={user}  />}
            {userDB && user &&
                <Cab userDB={userDB} user={user}  />}
            {userDB && user &&
                <Maid userDB={userDB} user={user}  />}
            {userDB && user &&
                <Clock userDB={userDB} user={user}  />}
            {userDB && user &&
                <Repair userDB={userDB} user={user}  />}
            {userDB && user &&
                <CheckList userDB={userDB} user={user} />}
            {userDB && user &&
                <Caisse userDB={userDB} user={user} />} 
            {userDB && user &&
                <CallCenter user={user} userDB={userDB} />} 

            {/*userDB && user &&
                <GuestTerminator userDB={userDB} user={user}  />*/} 
        </div>
    )
}

export default ToolBar