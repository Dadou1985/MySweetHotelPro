import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const BadgeContent = ({tooltipTitle, icon, handleShow}) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="title">
                {tooltipTitle}
            </Tooltip>}>
            <img src={icon} className="icon" alt="contact" onClick={handleShow} style={{ width: "2vw" }} />
        </OverlayTrigger>
        );
};
export default BadgeContent;
