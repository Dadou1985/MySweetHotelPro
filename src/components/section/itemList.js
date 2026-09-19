import React, {useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FirebaseContext } from '../../config/Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { useFirestoreSubscription, useDelete } from '../../utils/hooks/useFirestore'

const ItemList = ({item}) => {

    const { t } = useTranslation()
    const { userDB } = useContext(FirebaseContext)

    const { data: info = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'housekeeping', item, 'item'],
        { orderBy: ['markup', 'asc'] }
    )

    const { mutate: deleteItem } = useDelete(['hotels', userDB.hotelId, 'housekeeping', item, 'item'])

    moment.locale('fr')

    return (
        <div>
            <PerfectScrollbar style={{height: "55vh"}}>
                <Table striped bordered hover size="sm" className="text-center">
                    <thead className="bg-dark text-center text-light">
                        <tr>
                        <th>{t("msh_general.g_table.t_client")}</th>
                        <th>{t("msh_general.g_table.t_room")}</th>
                        <th>{t("msh_general.g_table.t_time")}</th>
                        <th className="bg-dark"></th>
                        </tr>
                </thead>
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            <td>{flow.client}</td>
                            <td>{flow.room}</td>
                            <td>{moment(flow.markup).startOf('hour').fromNow()}</td>
                            <td className="bg-dark">
                                <Button variant="outline-danger" size="sm" onClick={()=>{
                                return deleteItem({ path: ['hotels', userDB.hotelId, 'housekeeping', item, 'item', flow.id] })
                                }}>{t("msh_general.g_button.b_delete")}</Button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </PerfectScrollbar>
        </div>
    )
}

export default ItemList