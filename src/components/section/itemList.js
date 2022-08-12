import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FirebaseContext } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { fetchCollectionBySorting3, handleDeleteData3 } from '../../helper/globalCommonFunctions';

const ItemList = ({item}) => {

    const [info, setInfo] = useState([])
    const { t } = useTranslation()
    const { userDB } = useContext(FirebaseContext)

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting3("hotels", userDB.hotelId, 'housekeeping', 'item', item, 'markup', 'asc').onSnapshot(function(snapshot) {
            const snapInfo = []
                snapshot.forEach(function(doc) {          
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                    })        
                });
                setInfo(snapInfo)
            });
        return unsubscribe
     },[item])

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
                            <td className="bg-light">
                                <Button variant="outline-danger" size="sm" onClick={()=>{
                                return handleDeleteData3("hotels", userDB.hotelId, "housekeeping", 'item', item, flow.id) 
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