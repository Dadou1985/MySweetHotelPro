import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../../Firebase'


const UserList = () => {
    const [info, setInfo] = useState([])
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('users')
            .orderBy("markup", "asc")
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
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
     },[])

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Pseudo</th>
                    <th>E-mail</th>
                    <th>Mot de Passe</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {info.map(flow =>(
                    <tr key={flow.markup}>
                    <td></td>
                    <td>{flow.id}</td>
                    <td>{flow.mail}</td>
                    <td>{flow.password}</td>
                    <td className="bg-light"><Button variant="outline-danger" size="sm" onClick={()=>{
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
                        .collection("users")
                        .doc(flow.id)
                        .delete()
                        .then(function() {
                          console.log("Document successfully deleted!");
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }}>Supprimer</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserList