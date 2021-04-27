import React, {useContext} from 'react'
import '../css/toolbar.css'
import Lost from './form/lost'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/HouseKeeping'
import { FirebaseContext} from '../../Firebase'


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
                <Lost userDB={userDB} user={user}  />}
        </div>
    )
}

export default ToolBar