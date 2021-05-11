import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../Firebase'

const CheckListTable = ({shift}) => {

    const [info, setInfo] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [formValue, setFormValue] = useState({task: "", status: false})

    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

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
 
    const handleIsChecked = () => {
        setIsChecked(!isChecked)
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
            status: formValue.status,
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

    return (
        <div>
            {/*<Button variant="outline-info" className="checkList_allSelected_button" block onClick={handleIsChecked}>Tout sélectionner</Button>*/}
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Ajouter une tâche"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={formValue.task}
                name="task"
                onChange={handleChange}
                />
                <InputGroup.Append>
                <Button variant="outline-success" onClick={handleSubmit}>Valider</Button>
                </InputGroup.Append>
            </InputGroup>
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
        </div>
    )
}

export default CheckListTable