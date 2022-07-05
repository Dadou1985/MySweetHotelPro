import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuSharpIcon from '@material-ui/icons/MenuSharp'
import Lost from '../../../svg/lost-items.svg'
import Dasboard from "../../../images/dashboard.png"
import CheckList from '../../../svg/todoList.svg'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { navigate } from 'gatsby'
import Notifications from '../notifications'
import Fom from '../../../svg/fom.svg'
import Notebook from '../../../svg/notebook.png'
import Feedback from '../../../svg/feedbackBox.svg'
import { auth } from '../../../Firebase'
import Housekeeping from '../form/phoneForm/phoneToolbarOverlays/housekeepingOverlay'
import Support from '../form/phoneForm/phoneToolbarOverlays/callCenterOverlay'
import Connection from '../../../images/admin.png'
import PhoneOverlay from '../../customHooks/phoneOverlayHook'
import { t } from 'i18next';
import '../../css/common/drawer.css'
import { FirebaseContext } from '../../../Firebase'

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({left: false,});
  const {user, userDB} = useContext(FirebaseContext)

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
        <img src={Dasboard} alt="Notebook" className="drawer_icons" onClick={()=>{navigate("/singlePage")}} />
        <PhoneOverlay category="chat" index={3} />
        <img src={Notebook} alt="Notebook" className="drawer_icons" onClick={()=>{navigate("/notebook")}} />
        </List>
        <Divider />
      <List className="drawer_listIcons2">
        <Housekeeping />
        <PhoneOverlay category="cab" index={0} />
        <PhoneOverlay category="clock" index={1} />
        <PhoneOverlay category="maintenance" index={2} />
        <PhoneOverlay category="roomChange" index={4} />
        <img src={Lost} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/lostAndFound")}} />
      </List>
      <Divider />
      <List className="drawer_listIcons3">
        <img src={CheckList} alt="Checklist" className="drawer_icons" onClick={()=>{navigate("/checkList")}} />
        {userDB && userDB.adminStatus && <img src={Connection} alt="Admin Panel" className="drawer_icons" onClick={()=>{navigate("/adminBoard")}} />}
        <img src={Fom} alt="user-portal" className="drawer_icons" onClick={()=>{navigate("/userPage")}} />
        <Support />
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
