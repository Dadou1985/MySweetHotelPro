import React, {useState, useEffect } from 'react'
import Maid from '../../../../../svg/maid.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function HousekeepingOverlay({user, userDB}) {
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
        
        let unsubscribe = itemList('toilet-paper').onSnapshot(function(snapshot) {
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
        
        let unsubscribe = itemList('hair-dryer').onSnapshot(function(snapshot) {
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
        
        let unsubscribe = itemList('baby-bed').onSnapshot(function(snapshot) {
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

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);
    return (
        <div>
            <StyledBadge badgeContent={itemBadgeQty} color="secondary">
                <img src={Maid} alt="Maid" className="drawer_icons" onClick={()=>{navigate("/houseKeeping")}} />
            </StyledBadge>

        </div>
    )
}

export default HousekeepingOverlay
