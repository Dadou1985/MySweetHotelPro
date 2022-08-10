import React, {useState, useEffect } from 'react'
import Maid from '../../../../../svg/maid.svg'
import { navigate } from 'gatsby'
import { fetchCollectionBySorting3 } from '../../../../../helper/globalCommonFunctions'

function HousekeepingOverlay({userDB}) {
    const [towel, setTowel] = useState([])
    const [soap, setSoap] = useState([])
    const [toiletPaper, setToiletPaper] = useState([])
    const [hairDryer, setHairDryer] = useState([])
    const [blanket, setBlanket] = useState([])
    const [pillow, setPillow] = useState([])
    const [iron, setIron] = useState([])
    const [babyBed, setBabyBed] = useState([])

    useEffect(() => {
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'towel', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'soap', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'toiletPaper', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'hairDryer', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'pillow', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'blanket', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'iron', "markup", 'asc').onSnapshot(function(snapshot) {
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
      let unsubscribe = fetchCollectionBySorting3('hotels', userDB.hotelId, 'housekeeping', 'item', 'babyBed', "markup", 'asc').onSnapshot(function(snapshot) {
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
