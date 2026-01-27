import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext } from '../../Firebase'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { handleChange } from '../../helper/formCommonFunctions'
import { 
    handleUpdateData3, 
    fetchCollectionBySorting3, 
    handleSubmitData3, 
    handleDeleteData3,
    addNotification
} from '../../helper/globalCommonFunctions'
import '../css/section/checkList.css'

const CheckListTable = ({shift}) => {

    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({task: "", status: false})
    const { t } = useTranslation()

    const { userDB } = useContext(FirebaseContext)

    const checkboxStatusCleaned = {status: false}
    const notif = "Votre tâche vient d'être ajouter à la liste !"
    const newData = {
        task: formValue.task,
        status: false,
        markup: Date.now()
    }
    const isMobile = window.innerWidth < 768

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting3("hotels", userDB.hotelId, "checkList", "lists", shift, "markup", "asc").onSnapshot(function(snapshot) {
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
    },[shift])

    let taskStatus = info.length > 0 && info.filter(status => status.status === true)

    const handleCleanCheckboxes = () => {
        taskStatus.length > 0 && taskStatus.map(task => {
            return handleUpdateData3("hotels", userDB.hotelId, "checkList", "lists", shift, task.id, checkboxStatusCleaned)
        })
    }

    return (
        <div>
            <Button variant='link' className="btn-msh-outline checkList_allSelected_button" block onClick={handleCleanCheckboxes}>{t("msh_check_list.c_button.b_uncheck_all")}</Button>
            <InputGroup className="mb-3">
                <FormControl
                placeholder={t("msh_check_list.c_input_placeholder")}
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={formValue.task}
                name="task"
                onChange={(event) => handleChange(event, setFormValue)}
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        setFormValue({task: ""})
                        addNotification(notif, userDB.hotelId)
                        return handleSubmitData3(e, "hotels", userDB.hotelId, "checkList", "lists", shift, newData)
                    }
                }}
                />
                    <Button className='btn-msh' onClick={(event) => {
                        setFormValue({task: ""})
                        return handleSubmitData3(event, "hotels", userDB.hotelId, "checkList", "lists", shift, newData)
                    }}>{t("msh_check_list.c_button.b_validate")}</Button>
            </InputGroup>
            <PerfectScrollbar style={{height: "55vh"}}>
                <Table striped bordered hover size="sm" className="text-center">
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            <td>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" checked={flow.status} onChange={() => {
                                        return handleUpdateData3("hotels", userDB.hotelId, "checkList", "lists", shift, flow.id, {status: !flow.status})
                                    }} />
                                </Form.Group> 
                            </td>
                            <td className="checkList_input">
                                {flow.task}
                            </td>
                            <td className="bg-light">
                                <Button variant={isMobile ? "danger" : "outline-danger"} size="sm" onClick={()=>{
                                    return handleDeleteData3('hotels', userDB.hotelId, "checkList", "lists", shift, flow.id)
                                }}>{isMobile ? "x": t("msh_general.g_button.b_delete")}</Button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </PerfectScrollbar>
        </div>
    )
}

export default CheckListTable