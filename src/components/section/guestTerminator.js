import React, {useState, useEffect } from 'react'
import { db } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';

export default function GuestTerminator({userDB}) {
    const [guest, setGuest] = useState([])
    let checkoutHour = new Date().getHours() > 14

    useEffect(() => {
        const guestOnAir = () => {
          return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('guest')
          }
  
        let unsubscribe = guestOnAir().onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setGuest(snapInfo)
        });
        return unsubscribe
       },[])
  
       const deleteGuest = (guestId) => {
        return db.collection('mySweetHotel')
        .doc('country')
        .collection('France')
        .doc('collection')
        .collection('hotel')
        .doc('region')
        .collection(userDB.hotelRegion)
        .doc('departement')
        .collection(userDB.hotelDept)
        .doc(`${userDB.hotelId}`)
        .collection('guest')
        .doc(guestId)
        .delete()
       }
  
    return (
        <div>
            {guest.forEach(doc => {
                if((doc.checkoutDate === moment(new Date()).format('LL')) && (checkoutHour === true)) {
                    setTimeout(() => {
                        deleteGuest(doc.id)
                    }, 10000);
                }else{}
            })}
        </div>
    )
}
