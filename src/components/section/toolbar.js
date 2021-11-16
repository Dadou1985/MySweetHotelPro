import React, {useContext} from 'react'
import '../css/toolbar.css'
import Cab from './form/cab'
import Clock from './form/clock'
import Maid from './form/maid'
import Repair from './form/repair'
import HouseKeeping from './form/HouseKeeping'
import Database from '../../svg/database.png'
import GuestTerminator from './guestTerminator'
import { FirebaseContext } from '../../Firebase'
import LostOnes from '../../svg/lost-items.svg'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
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
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Objets trouvés
              </Tooltip>
            }>
                <img src={Database} className="icon" alt="contact" onClick={() => navigate("/crm")} style={{width: "40%", marginRight: "10%"}} />
            </OverlayTrigger>

            {userDB && user &&
                <GuestTerminator userDB={userDB} user={user}  />} 
        </div>
    )
}

export default ToolBar