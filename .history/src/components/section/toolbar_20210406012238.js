import React, {useContext} from 'react'
import '../css/toolbar.css'
import Lost from './form/lost'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import { FirebaseContext, db, auth } from '../../Firebase'


const ToolBar = () =>{
    const { userDB } = useContext(FirebaseContext)

    return(
        <div className="toolbar_container">
            {userDB && 
                <Lost userDB={userDB}  />}
           {userDB && 
                <Cab userDB={userDB}  />}
                {userDB && 
                <Maid userDB={userDB}  />}
                {userDB && 
                <Clock userDB={userDB}  />}
                {userDB && 
                <Repair userDB={userDB}  />}
        </div>
    )
}

export default ToolBar