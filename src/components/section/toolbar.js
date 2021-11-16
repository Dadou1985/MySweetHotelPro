import React, {useContext} from 'react'
import '../css/toolbar.css'
import Lost from './form/lost'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/HouseKeeping'
import UserDatabase from './form/UserDatabase'
import GuestTerminator from './guestTerminator'
import { FirebaseContext } from '../../Firebase'
import LostOnes from '../../svg/lost-items.svg'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import { navigate } from 'gatsby'


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
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Objets trouvés
              </Tooltip>
            }>
                <img src={LostOnes} className="icon" alt="contact" onClick={() => navigate("/Lost")} style={{width: "40%", marginRight: "10%"}} />
            </OverlayTrigger>
            {userDB && user &&
                <UserDatabase userDB={userDB} user={user}  />}

            {userDB && user &&
                <GuestTerminator userDB={userDB} user={user}  />} 
        </div>
    )
}

export default ToolBar