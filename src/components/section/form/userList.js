import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { db, functions } from '../../../Firebase'
import Switch from '@material-ui/core/Switch';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"


const UserList = ({userDB}) => {
    const [info, setInfo] = useState([])
    const { t, i18n } = useTranslation()

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
            <h5 style={{marginBottom: "2vh", textAlign: "center"}}>{t("msh_admin_board.a_second_tab_title")}</h5>
            <PerfectScrollbar style={{height: "55vh"}}>
                <Table striped bordered hover className=" text-center">
                    <thead className="bg-dark text-light">
                        <tr>
                        <th>{t("msh_general.g_table.t_username")}</th>
                        <th>{t("msh_connexion.c_email_maj")}</th>
                        <th>{t("msh_general.g_table.t_administrator")}</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {info.map((flow, key) =>(
                        <tr key={key}>
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
                        }}>{t("msh_general.g_button.b_delete")}</Button></td>
                    </tr>
                    ))}
                    </tbody>
                </Table>
            </PerfectScrollbar>
        </div>
    )
}

export default UserList