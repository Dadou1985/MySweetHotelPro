import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { db, auth, functions } from '../../../Firebase'
import Switch from '@material-ui/core/Switch';


const UserList = ({user, userDB}) => {
    const [info, setInfo] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('businessUsers')
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

     const changeUserStatus = (documentId, status) => {
        return db.collection('businessUsers')
          .doc(documentId)
          .update({
            adminStatus: status,
        })      
      }

    const deleteUser = functions.httpsCallable('deleteUser')

    return (
        <div>
            <Table striped bordered hover className=" text-center">
                <thead className="bg-dark text-light">
                    <tr>
                    <th>Pseudo</th>
                    <th>E-mail</th>
                    <th>Admin</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {info.map(flow =>(
                    <tr key={flow.markup}>
                    <td>{flow.username}</td>
                    <td>{flow.email}</td>
                    <td>
                        <Switch
                            checked={flow.adminStatus}
                            onChange={() => {
                                let userStatus = !flow.adminStatus
                                return changeUserStatus(flow.id, userStatus)}}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </td>
                    <td className="bg-light"><Button variant="outline-danger" size="sm" onClick={async()=>{
                        await db.collection('businessUsers')
                        .doc(flow.id)
                        .delete()
                        .then(function() {
                          console.log("Document successfully deleted!");
                        }).catch(function(error) {
                            console.log(error);
                        })

                        return deleteUser({uid: flow.userId})
                    }}>Supprimer</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserList