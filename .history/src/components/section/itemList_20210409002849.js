import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../Firebase'
import moment from 'moment'

const ItemList = ({item}) => {

    const [info, setInfo] = useState([])
    const [user, setUser] = useState(auth.currentUser)

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
            .orderBy("markup", "asc")
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
                    setInfo(snapInfo)
                });
                return unsubscribe
           
     },[item])

    return (
        <div>
            <h5 className="checkList_title bg-dark">Click & Wait - {item}</h5>
           
            <Table striped bordered hover size="sm">
                <tbody>
                    {info.map(flow =>(
                        <tr key={flow.id}>
                        <td>{flow.client}</td>
                        <td>{flow.room}</td>
                        <td>{moment(flow.markup).format('LT')}</td>
                        <td className="bg-light">
                            <Button variant="outline-danger" size="sm" onClick={()=>{
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
                               .doc(flow.id)
                               .delete()
                               .then(function() {
                                 console.log("Document successfully deleted!");
                               }).catch(function(error) {
                                   console.log(error);
                               }); 
                            }}>Supprimer</Button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ItemList