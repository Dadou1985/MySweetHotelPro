import React, { useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { functions, FirebaseContext } from '../../config/Firebase'
import Switch from '@material-ui/core/Switch';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { useFirestoreSubscription, useUpdate, useDelete } from '../../utils/hooks/useFirestore'

const UserList = () => {
    const { userDB } = useContext(FirebaseContext)
    const { t } = useTranslation()
    const isTablet = window && window.innerWidth > 1023 && "none"

    const { data: info = [] } = useFirestoreSubscription(
        ['businessUsers'],
        { where: ['hotelId', '==', userDB.hotelId] }
    )

    const { mutate: updateUser } = useUpdate(['businessUsers'])
    const { mutate: deleteUser2 } = useDelete(['businessUsers'])

    const deleteUser = functions.httpsCallable('deleteUser')

    return (
        <div>
            <h5 style={{marginBottom: "2vh", textAlign: "center"}}>{t("msh_admin_board.a_second_tab_title")}</h5>
            <PerfectScrollbar style={{height: "fit-content"}}>
                <Table striped bordered hover className=" text-center">
                    <thead className="bg-dark text-light">
                        <tr>
                        <th>{t("msh_general.g_table.t_username")}</th>
                        <th style={{display: isTablet}}>{t("msh_connexion.c_email_maj")}</th>
                        {userDB?.adminStatus && <th>{t("msh_general.g_table.t_administrator")}</th>}
                        <th className="bg-dark"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {info.map((flow, key) =>(
                        <tr key={key}>
                        <td>{flow.username}</td>
                        <td style={{display: isTablet}}>{flow.email}</td>
                        {userDB?.adminStatus && <td>
                            <Switch
                                checked={flow.adminStatus}
                                onChange={() => {
                                    let userStatus = !flow.adminStatus
                                    return updateUser({ path: ['businessUsers', flow.id], data: { adminStatus: userStatus } })}}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </td>}
                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={async()=>{
                            deleteUser2({ path: ['businessUsers', flow.id] })
                            return deleteUser({uid: flow.userId})
                        }}>{window?.innerWidth > 1439 ? t("msh_general.g_button.b_delete") : "X"}</Button></td>
                    </tr>
                    ))}
                    </tbody>
                </Table>
            </PerfectScrollbar>
        </div>
    )
}

export default UserList