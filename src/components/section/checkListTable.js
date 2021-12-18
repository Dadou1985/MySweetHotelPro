import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext, db } from '../../Firebase'
import PerfectScrollbar from 'react-perfect-scrollbar'

const CheckListTable = ({shift}) => {

    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({task: "", status: false})

    const { userDB } = useContext(FirebaseContext)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleCheckboxChange = (taskId, currentStatus) => {
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('checkList')
            .doc("lists")
            .collection(shift)
            .doc(taskId)
            .update({
            status: !currentStatus,
        })
    }

    const handleSubmit = event => {
        event.preventDefault()
        setFormValue({task: ""})
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('checkList')
            .doc("lists")
            .collection(shift)
            .add({
            task: formValue.task,
            status: false,
            markup: Date.now()
            })
    }

    useEffect(() => {
        const listOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("checkList")
            .doc("lists")
            .collection(shift)
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
           
     },[shift])

    let taskStatus = info.length > 0 && info.filter(status => status.status === true)

    const handleCleanCheckboxes = () => {
        taskStatus.length > 0 && taskStatus.map(task => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('checkList')
            .doc("lists")
            .collection(shift)
            .doc(task.id)
            .update({
            status: false,
        })
        })
    }

    console.log(taskStatus)

    return (
        <div>
            <Button variant="outline-info" className="checkList_allSelected_button" block onClick={handleCleanCheckboxes}>Tout dé-sélectionner</Button>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Ajouter une tâche"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={formValue.task}
                name="task"
                onChange={handleChange}
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        handleSubmit(e)
                    }
                }}
                />
                <InputGroup.Append>
                <Button variant="outline-success" onClick={handleSubmit}>Valider</Button>
                </InputGroup.Append>
            </InputGroup>
            <PerfectScrollbar style={{height: "55vh"}}>
                <Table striped bordered hover size="sm" className="text-center">
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            <td>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" checked={flow.status} onChange={() => handleCheckboxChange(flow.id, flow.status)} />
                                </Form.Group> 
                            </td>
                            <td className="checkList_input">
                                {flow.task}
                            </td>
                            <td className="bg-light">
                                <Button variant="outline-danger" size="sm" onClick={()=>{
                                return db.collection('hotels')
                                .doc(userDB.hotelId)
                                .collection("checkList")
                                .doc("lists")
                                .collection(shift)
                                .doc(flow.id)
                                .delete()
                                .then(function() {
                                    console.log("Document successfully deleted!");
                                }).catch(function(error) {
                                    console.log(error);
                                }); 
                                }}>Supprimer</Button>
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