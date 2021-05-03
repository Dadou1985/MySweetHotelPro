import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuSharpIcon from '@material-ui/icons/MenuSharp'
import Lost from '../../../svg/lost-items.svg'
import CheckList from '../../../svg/todoList.svg'
import CallCenter from '../../../svg/call-center.svg'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { navigate } from 'gatsby'
import Notifications from '../notifications'
import Fom from '../../../svg/fom.svg'
import Notebook from '../../../svg/notebook.png'
import Feedback from '../../../svg/feedbackBox.svg'
import { auth } from '../../../Firebase'
import Chat from '../form/phoneForm/phoneToolbarOverlays/chatOverlay'
import Housekeeping from '../form/phoneForm/phoneToolbarOverlays/housekeepingOverlay'
import Cab from '../form/phoneForm/phoneToolbarOverlays/cabOverlay'
import Clock from '../form/phoneForm/phoneToolbarOverlays/clockOverlay'
import Repair from '../form/phoneForm/phoneToolbarOverlays/repairOverlay'
import RoomChange from '../form/phoneForm/phoneToolbarOverlays/roomChangeOverlay'
import Support from '../form/phoneForm/phoneToolbarOverlays/callCenterOverlay'
import FeedbackBox from '../form/feedbackBox';
import Connection from '../../../svg/employee.svg'


export default function TemporaryDrawer({userDB, user}) {
  const [state, setState] = React.useState({left: false,});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () =>{
    auth.signOut().then(()=>navigate('/'))
}

  const list = (anchor) => (
    <div
      className="drawer_listlist drawer_fullList"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        <h4 className="drawer_title">Menu</h4>
        <List className="drawer_listIcons">
        {!!user && !!userDB &&
        <Chat user={user} userDB={userDB} />}
        <img src={Notebook} alt="Notebook" className="drawer_icons" onClick={()=>{navigate("/notebook")}} />
        </List>
        <Divider />
      <List className="drawer_listIcons2">
        {!!user && !!userDB &&
        <Housekeeping user={user} userDB={userDB} />}
        {!!user && !!userDB &&
        <Cab user={user} userDB={userDB} />}
        {!!user && !!userDB &&
        <Clock user={user} userDB={userDB} />}
        {!!user && !!userDB &&
        <Repair user={user} userDB={userDB} />}
        {!!user && !!userDB &&
        <RoomChange user={user} userDB={userDB} />}
        <img src={Lost} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/lostAndFound")}} />
      </List>
      <Divider />
      <List className="drawer_listIcons3">
        <img src={CheckList} alt="Checklist" className="drawer_icons" onClick={()=>{navigate("/checkList")}} />
        <img src={Feedback} alt="Feedback box" className="drawer_icons" onClick={()=>{navigate("/feedback")}} />
        {userDB.adminStatus && <img src={Connection} alt="Feedback box" className="drawer_icons" onClick={()=>{navigate("/adminBoard")}} />}
        <img src={Fom} alt="user-portal" className="drawer_icons" onClick={()=>{navigate("/userPage")}} />
        {!!user && !!userDB &&
        <Support user={user} userDB={userDB} />}
      </List>
      <Divider />
      <List className="drawer_listIcons4">
        <PowerSettingsNewIcon id="drawer_icons2" onClick={handleLogout} />
      </List>
    </div>
  );

  return (
    <div className="drawer">
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <MenuSharpIcon onClick={toggleDrawer(anchor, true)} />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
      {!!userDB && !!user &&
            <Notifications userDB={userDB} user={user} />}
    </div>
  );
}
