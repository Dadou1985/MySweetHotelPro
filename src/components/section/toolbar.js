import React, {useContext} from 'react'
import '../css/section/toolbar.css'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/houseKeeping'
import CheckList from '../checkList/checkList'
import CallCenter from '../support/callCenter'
import Caisse from './form/caisse'
import { FirebaseContext } from '../../config/Firebase'

const ToolBar = () =>{
    const { userDB, user } = useContext(FirebaseContext)

    return(
        <div className="toolbar_container">
            {userDB && user &&
                <HouseKeeping />}
            {userDB && user &&
                <Cab />}
            {userDB && user &&
                <Maid />}
            {userDB && user &&
                <Clock />}
            {userDB && user &&
                <Repair />}
            {userDB && user &&
                <CheckList />}
            {userDB && user &&
                <Caisse />}
            {/* {userDB && user &&
                <CallCenter />}  */}

        </div>
    )
}

export default ToolBar