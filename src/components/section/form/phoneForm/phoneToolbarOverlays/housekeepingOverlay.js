import React, {useState, useEffect } from 'react'
import Maid from '../../../../../svg/maid.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'

function HousekeepingOverlay({userDB}) {
    const [list, setList] = useState(false)
    const [towel, setTowel] = useState([])
    const [soap, setSoap] = useState([])
    const [toiletPaper, setToiletPaper] = useState([])
    const [hairDryer, setHairDryer] = useState([])
    const [blanket, setBlanket] = useState([])
    const [pillow, setPillow] = useState([])
    const [iron, setIron] = useState([])
    const [babyBed, setBabyBed] = useState([])

    const itemList = (item) => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('housekeeping')
        .doc("item")
        .collection(item)
        .orderBy("markup", "asc")
    }


    useEffect(() => {
        
        let unsubscribe = itemList('towel').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setTowel(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('soap').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
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
            console.log(snapInfo)
            setToiletPaper(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('hairDryer').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setHairDryer(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('pillow').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setPillow(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('blanket').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setBlanket(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('iron').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setIron(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('babyBed').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
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
