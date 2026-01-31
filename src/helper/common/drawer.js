import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuSharpIcon from '@material-ui/icons/MenuSharp'
import Lost from '../../svg/lost-items.svg'
import Dasboard from "../../images/dashboard.png"
import CheckList from '../../svg/todoList.svg'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { navigate } from 'gatsby'
import Notifications from '../../components/section/notifications'
import Fom from '../../svg/fom.svg'
import Notebook from '../../svg/notebook.png'
import Feedback from '../../svg/feedbackBox.svg'
import { auth } from '../../Firebase'
import Housekeeping from '../../components/section/form/phoneForm/phoneToolbarOverlays/housekeepingOverlay'
import Support from '../../components/section/form/phoneForm/phoneToolbarOverlays/callCenterOverlay'
import Connection from '../../images/admin.png'
import PhoneOverlay from '../../components/customHooks/phoneOverlayHook'
import { t } from 'i18next';
import '../../components/css/common/drawer.css'

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
        <h4 className="drawer_title">{t("msh_drawer.d_menu")}</h4>
        <List className="drawer_listIcons">
        <img src={Dasboard} alt="Dashboard" className="drawer_icons" onClick={()=>{navigate("/singlePage")}} />
        {!!user && !!userDB &&
        <PhoneOverlay category="chat" userDB={userDB} index={3} />}
        <img src={Notebook} alt="Notebook" className="drawer_icons" onClick={()=>{navigate("/notebook")}} />
        </List>
        <Divider />
      <List className="drawer_listIcons2">
        {!!user && !!userDB &&
        <Housekeeping user={user} userDB={userDB} />}
        {!!user && !!userDB &&
        <PhoneOverlay category="cab" userDB={userDB} index={0} />}
        {!!user && !!userDB &&
        <PhoneOverlay category="clock" userDB={userDB} index={1} />}
        {!!user && !!userDB &&
        <PhoneOverlay category="maintenance" userDB={userDB} index={2} />}
        {!!user && !!userDB &&
        <PhoneOverlay category="roomChange" userDB={userDB} index={4} />}
        <img src={Lost} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/lostAndFound")}} />
      </List>
      <Divider />
      <List className="drawer_listIcons3">
        <img src={CheckList} alt="Checklist" className="drawer_icons" onClick={()=>{navigate("/checkList")}} />
        {userDB.adminStatus && <img src={Connection} alt="Admin Panel" className="drawer_icons" onClick={()=>{navigate("/adminBoard")}} />}
        <img src={Fom} alt="user-portal" className="drawer_icons" onClick={()=>{navigate("/userPage")}} />
        {/* {!!user && !!userDB &&
        <Support user={user} userDB={userDB} />} */}
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
