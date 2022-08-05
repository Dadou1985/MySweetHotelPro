import React from 'react'
import { Button, Table } from 'react-bootstrap'
import Switch from '@material-ui/core/Switch';
import {
    handleUpdateHotelData,
    deleteData
} from '../formCommonFunctions'
import { useTranslation } from "react-i18next"

const TableTemplate = ({data, scale, userDB, dataStatus, responsiveness = null}) => {
    const { t } = useTranslation()

  return (
    <Table striped bordered hover size="sm" responsiveness className="text-center">
        <thead className="bg-dark text-center text-light">
            <tr>
            {scale && <th>{t("msh_general.g_table.t_client")}</th>}
            <th>{t("msh_general.g_table.t_room")}</th>
            {scale && <th>{t("msh_general.g_table.t_date")}</th>}
            <th>{t("msh_general.g_table.t_time")}</th>
            <th>{t("msh_general.g_table.t_passenger")}</th>
            {scale && <th>{t("msh_general.g_table.t_type_of_car")}</th>}
            {scale && <th>{t("msh_general.g_table.t_destination")}</th>}
            <th>{t("msh_general.g_table.t_statut")}</th>
            {scale && <th className="bg-dark"></th>}
            </tr>
        </thead>
        <tbody>
            {data.map(flow =>(
                <tr key={flow.id}>
                {scale && <td>{flow.client}</td>}
                <td>{flow.room}</td>
                {scale && <td>{flow.date}</td>}
                <td>{flow.hour}</td>
                <td>{flow.pax}</td>
                {scale && <td>{flow.modelClone}</td>}
                {scale && <td>{flow.destination}</td>}
                <td>
                <Switch
                    checked={flow.status}
                    onChange={() => handleUpdateHotelData(userDB.hotelId, "cab", flow.id, dataStatus)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                </td>
                {scale && <td className="bg-dark">
                    <Button variant="outline-danger" size="sm" onClick={()=> deleteData(userDB.hotelId, "cab", flow.id)}>
                        {t("msh_general.g_button.b_delete")}
                    </Button>
                </td>}
            </tr>
            ))}
        </tbody>
    </Table>
  )
}

export default TableTemplate