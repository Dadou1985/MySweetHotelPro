import React, {useContext} from 'react'
import '../../../css/section/toolbar.css'
import Cab from './desktop/cab'
import Clock from './desktop/clock'
import Maid from './desktop/maid'
import Maintenance from './desktop/maintenance'
import HouseKeeping from './desktop/houseKeeping'
import CheckList from '../../checkList/checkList'
import CallCenter from '../../support/callCenter'
import Caisse from './desktop/safe'
import { FirebaseContext } from '../../../config/Firebase'

const Sidebar = () =>{
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
                <Maintenance />}
            {userDB && user &&
                <CheckList />}
            {userDB && user &&
                <Caisse />}
            {/* {userDB && user &&
                <CallCenter />}  */}

        </div>
    )
}

export default Sidebar