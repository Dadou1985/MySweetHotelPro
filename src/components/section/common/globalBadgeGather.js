import React, {useState, useEffect, useContext } from 'react'
import { FirebaseContext, db, auth } from '../../../Firebase'


export default function BadgeMaker({item}) {
    const [data, setData] = useState([])

    const { userDB, setUserDB } = useContext(FirebaseContext)


    useEffect(() => {
        const listOnAir = () => {
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
            .collection("housekeeping")
            .doc("item")
            .collection(item)
        }
    
        let unsubscribe = listOnAir().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    console.log(snapInfo)
                    setData(snapInfo)
                });
                return unsubscribe
           
     },[item])


    return (<div>{data.length}</div>)
}
