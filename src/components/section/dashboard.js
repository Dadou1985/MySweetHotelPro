import React, { useState, useEffect } from 'react';
import Coffee from '../../images/morningCoffee.png'
import { useTranslation } from "react-i18next"

export default function Dashboard({user, userDb}) {
  const { t, i18n } = useTranslation()

  return <div style={{
      display: "flex",
      flexFlow: "column",
      width: "50%",
      padding: "1%",
      marginTop: "2vh"
  }}>
        <div style={{width: "100%", marginBottom: "5vh"}}>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-around"
          }}>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid darkgoldenrod",
              borderRight: "5px solid darkgoldenrod", 
              filter: "drop-shadow(2px 4px 6px gray", 
              color: "darkgoldenrod",
              backgroundColor: "whitesmoke"}}>
                <div style={{display: "flex", borderBottom: "1px solid darkgoldenrod"}}><h3>3</h3> Consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "6vh"}}>Réception</h4>
            </div>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid cornflowerblue",
              borderRight: "5px solid cornflowerblue",
               filter: "drop-shadow(2px 4px 6px gray",
               color: "cornflowerblue",
               backgroundColor: "whitesmoke"}}>
              <div style={{display: "flex", borderBottom: "1px solid cornflowerblue"}}><h3>3</h3>Consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "6vh"}}>Ménage</h4>
              </div>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid red",
              borderRight: "5px solid red", 
              filter: "drop-shadow(2px 4px 6px gray",
              color: "red",
              backgroundColor: "whitesmoke"}}>
              <div style={{display: "flex", borderBottom: "1px solid red"}}><h3>3</h3>Consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "6vh"}}>Maintenance Technique</h4>
            </div>
          </div>
        </div>
      <div style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "space-between",
          width: "90%",
          height: "10vh",
          marginLeft: "2vw", 
          padding: "1%", 
          borderRadius: "10px", 
          filter: "drop-shadow(2px 4px 6px black",
          backgroundColor: "transparent", 
          border: "1px solid lightgrey",
          borderBottom: "15px solid gray",
          borderRight: "5px solid gray",
          color: "gray",
          backgroundColor: "whitesmoke"}}> 
        <div style={{display: "flex"}}><h4>2</h4> conversation(s) active(s)</div>
        <h4 style={{marginTop: "4vh"}}>Chat Client</h4>
      </div>
      <div style={{
        display: "flex", 
        width: "90%", 
        flexFlow: "row",
        justifyContent: "space-between",
        marginTop: "5vh",
        marginLeft: "2vw"
        }}>
        <div style={{
          display: "flex",
          flexFlow: "row",
          padding: "1%",
          width: "8vw", 
          height: "16vh", 
          borderBottom: "15px solid green",
          borderRight: "5px solid green", 
          borderRadius: "50%",   
          filter: "drop-shadow(2px 4px 6px black", 
          backgroundColor: "whitesmoke"}}><h3>5</h3></div>
        <div style={{
          display: "flex",
          flexFlow: "row",
          padding: "1%",
          width: "8vw", 
          height: "16vh", 
          borderBottom: "15px solid green",
          borderRight: "5px solid green", 
          borderRadius: "50%",   
          filter: "drop-shadow(2px 4px 6px black", 
          backgroundColor: "whitesmoke"}}><h3>5</h3></div>
        <div style={{
          display: "flex",
          flexFlow: "row",
          padding: "1%",
          width: "8vw", 
          height: "16vh", 
          borderBottom: "15px solid green",
          borderRight: "5px solid green", 
          borderRadius: "50%",   
          filter: "drop-shadow(2px 4px 6px black", 
          backgroundColor: "whitesmoke"}}><h3>5</h3></div>
        <div style={{
          display: "flex",
          flexFlow: "row",
          padding: "1%",
          width: "8vw", 
          height: "16vh", 
          borderBottom: "15px solid green",
          borderRight: "5px solid green", 
          borderRadius: "50%",   
          filter: "drop-shadow(2px 4px 6px black", 
          backgroundColor: "whitesmoke"}}><h3>5</h3></div>
      </div>
  </div>;
}
