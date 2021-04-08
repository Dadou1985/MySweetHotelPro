import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuSharpIcon from '@material-ui/icons/MenuSharp'
import IziChat from '../../../svg/community.svg'
import IziNews from '../../../svg/chill.png'
import KarenStories from '../../../svg/mask.svg'
import ShiftAdvisor from '../../../svg/hotel.svg'
import Store from '../../../svg/store.svg'
import CallCenter from '../../../svg/call-center.svg'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { navigate } from 'gatsby'
import Notifications from '../notifications'
import Fom from '../../../svg/fom.svg'

export default function TemporaryDrawer({firebase, user, screen}) {
  const [state, setState] = React.useState({left: false,});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () =>{
    firebase.logout().then(()=>navigate('/'))
}

const handleCallCenter = () => {
  return firebase.addNotification({documentId: user.displayName, notification: "Nos équipes vous assistent au : 06.59.87.28.84"})
}

  const list = (anchor) => (
    <div
      className="darkDrawer_listlist darkDrawer_fullList"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        <h3 className="darkDrawer_title">Menu</h3>
        <Divider style={{filter: "drop-shadow(7px 7px)"}} />
      <List className="darkDrawer_listIcons">
        <img src={IziChat} alt="IziChat" className="darkDrawer_icons" onClick={()=> screen("chat")} />
        <img src={IziNews} alt="IziNews" className="darkDrawer_icons" onClick={()=> screen("news")} />
        <img src={KarenStories} alt="KarenStories" className="darkDrawer_icons" onClick={()=> screen("stories")} />
        <img src={ShiftAdvisor} alt="shiftAdvisor" className="darkDrawer_icons" onClick={()=>{navigate("/shiftAdvisor")}} />
        <img src={Store} alt="iziStore" className="darkDrawer_icons" onClick={()=>{navigate("/iziStore")}} />
      </List>
      <Divider style={{filter: "drop-shadow(7px 7px)"}} />
      <List className="darkDrawer_listIcons2">
        <img src={CallCenter} alt="Lost and found" className="darkDrawer_icons" onClick={handleCallCenter} />
        <img src={Fom} alt="user-portal" className="fom-icon" onClick={()=>{navigate("/doorsStage")}} />
      </List>
      <Divider style={{filter: "drop-shadow(7px 7px)"}} />
      <PowerSettingsNewIcon id="darkDrawer_icons2" onClick={handleLogout} />
    </div>
  );

  return (
    <div className="darkDrawer">
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <MenuSharpIcon onClick={toggleDrawer(anchor, true)} />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
      {!!firebase && !!user &&
            <Notifications firebase={firebase} user={user} />}
    </div>
  );
}
