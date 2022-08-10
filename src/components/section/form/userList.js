import React, {useState, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { functions } from '../../../Firebase'
import Switch from '@material-ui/core/Switch';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { fetchCollectionByMapping1, handleUpdateData1, handleDeleteData1 } from '../../../helper/globalCommonFunctions';

const UserList = ({userDB}) => {
    const [info, setInfo] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        let unsubscribe = fetchCollectionByMapping1('businessUsers', "hotelId", "==", userDB.hotelId).onSnapshot(function(snapshot) {
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
                                    return handleUpdateData1("businessUsers", flow.id, {adminStatus: userStatus})}}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </td>
                        <td className="bg-light"><Button variant="outline-danger" size="sm" onClick={async()=>{
                            await handleDeleteData1('businessUsers', flow.id)
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