import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';

const ItemList = ({item}) => {

    const [info, setInfo] = useState([])

    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)
    const [expand, setExpand] = useState(false)

    const handleChangeExpand = () => setExpand(!expand)

    useEffect(() => {
        const listOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('housekeeping')
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

     moment.locale('fr')

    return (
        <div>
           
            <Table striped bordered hover size="sm" className="text-center">
                <thead className="bg-dark text-center text-light">
                    <tr>
                    <th>Client</th>
                    <th>Chambre</th>
                    <th>Heure</th>
                    <th className="bg-dark"></th>
                    </tr>
            </thead>
                <tbody>
                    {info.map(flow =>(
                        <tr key={flow.id}>
                        <td>{flow.client}</td>
                        <td>{flow.room}</td>
                        <td>{moment(flow.markup).startOf('hour').fromNow()}</td>
                        <td className="bg-light">
                            <Button variant="outline-danger" size="sm" onClick={()=>{
                               return db.collection('hotels')
                               .doc(userDB.hotelId)
                               .collection('housekeeping')
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