import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({children, showDialog, hideShow}) {

  return (
    <div>
      <Dialog fullScreen open={showDialog} onClose={hideShow} TransitionComponent={Transition}>
            <main style={{width: "100%", height: "90%"}}>{children}</main>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "10vh",
                fontSize: "20px",
                color: "gray",
                backgroundColor: "ghostwhite"
            }}
            onClick={hideShow}>Revenir au portail</div>
      </Dialog>
    </div>
  );
}
