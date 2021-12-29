import React, {useState, useEffect, useContext } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FirebaseContext, db } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"

const ItemList = ({item}) => {

    const [info, setInfo] = useState([])
    const { t, i18n } = useTranslation()
    const { userDB } = useContext(FirebaseContext)

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