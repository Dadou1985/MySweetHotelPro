import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { db, auth, functions } from '../../../Firebase'


const UserList = ({user, userDB}) => {
    const [info, setInfo] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('business')
            .doc('collection')
            .collection('users')
            .where('hotelId', "==", userDB.hotelId)
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

    const deleteUser = functions.httpsCallable('deleteUser')

    return (
        <div>
            <Table striped bordered hover>
                <thead className="bg-dark text-center text-light">
                    <tr>
                    <th>Pseudo</th>
                    <th>E-mail</th>
                    <th>Mot de Passe</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {info.map(flow =>(
                    <tr key={flow.markup}>
                    <td>{flow.id}</td>
                    <td>{flow.email}</td>
                    <td>{flow.password}</td>
                    <td className="bg-light"><Button variant="outline-danger" size="sm" onClick={async()=>{
                        await db.collection('mySweetHotel')
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

                        return deleteUser({uid: flow.userI})
                    }}>Supprimer</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserList