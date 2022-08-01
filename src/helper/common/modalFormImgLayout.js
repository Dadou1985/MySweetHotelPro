import React from "react";
import Close from '../../svg/close.svg'

export default function ModalFormImgLayout({setImgFrame, img}) {
  
  return (
    <div style={{
      display: "flex",
      flexFlow: 'column',
      alignItems: "center",
      padding: "2%"
    }}>
      <div style={{
        width: "100%"
      }}>
        <img src={Close} style={{
          width: "1vw",
          float: "right",
          cursor: "pointer"
        }} onClick={() => setImgFrame(false)} /> 
      </div>
        <img src={img} style={{
        width: "70%"
      }} />
    </div>
  )
}
  