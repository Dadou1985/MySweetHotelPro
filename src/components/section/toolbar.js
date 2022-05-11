import React, {useContext} from 'react'
import '../css/section/toolbar.css'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/HouseKeeping'
import CheckList from './form/checkList'
import CallCenter from './CallCenter'
import Caisse from './form/caisse'
import { FirebaseContext } from '../../Firebase'

const ToolBar = () =>{
    const { userDB, user } = useContext(FirebaseContext)

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

        </div>
    )
}

export default ToolBar