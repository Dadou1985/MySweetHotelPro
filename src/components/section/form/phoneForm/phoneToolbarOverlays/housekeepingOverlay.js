import React, { useState, useEffect, useContext } from 'react'
import Maid from '../../../../../svg/maid.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'
import { FirebaseContext } from '../../../../../Firebase'

function HousekeepingOverlay() {
    const [towel, setTowel] = useState([])
    const [soap, setSoap] = useState([])
    const [toiletPaper, setToiletPaper] = useState([])
    const [hairDryer, setHairDryer] = useState([])
    const [blanket, setBlanket] = useState([])
    const [pillow, setPillow] = useState([])
    const [iron, setIron] = useState([])
    const [babyBed, setBabyBed] = useState([])
    const {user, userDB} = useContext(FirebaseContext)

    const itemList = (item) => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('housekeeping')
        .doc("item")
        .collection(item)
        .orderBy("markup", "asc")
    }


    useEffect(() => {
        
        let unsubscribe = userDB && itemList('towel').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setTowel(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('soap').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setSoap(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('toiletPaper').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setToiletPaper(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('hairDryer').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setHairDryer(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('pillow').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setPillow(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('blanket').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setBlanket(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('iron').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setIron(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = userDB && itemList('babyBed').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setBabyBed(snapInfo)
        });
        return unsubscribe
    }, [])

    let itemQty = [towel.length, soap.length, toiletPaper.length, hairDryer.length, pillow.length, blanket.length, iron.length, babyBed.length]
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let itemBadgeQty = itemQty.reduce(reducer)
    return (
        <div>
            <img src={Maid} alt="Maid" className="drawer_icons" onClick={()=>{navigate("/houseKeeping")}} />
            {itemBadgeQty > 0 && <span style={{
              borderRadius: "50%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "17%", 
              height: "6%", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px"}}>{itemBadgeQty}</span>}
        </div>
    )
}

export default HousekeepingOverlay
