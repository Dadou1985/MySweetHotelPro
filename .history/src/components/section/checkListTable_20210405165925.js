import React, {useState, useEffect, useContext } from 'react'
import { Button, Table, Form, InputGroup, FormControl } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../Firebase'

const CheckListTable = ({shift}) => {

    const [info, setInfo] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [formValue, setFormValue] = useState({task: ""})
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleIsChecked = () => {
        setIsChecked(!isChecked)
    }

    const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        return this.db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('checkList')
            .doc("lists")
            .collection(shift)
            .add({
            task: formValue.task,
            markup: Date.now()
            })
    }

    useEffect(() => {
        const listOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
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
            <h5 className="checkList_title bg-dark">Check list - {shift}</h5>
            <Button variant="outline-info" className="checkList_allSelected_button" block onClick={handleIsChecked}>Tout sélectionner</Button>
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
            <Table striped bordered hover size="sm">
                <tbody>
                    {info.map(flow =>(
                        <tr key={flow.id}>
                        <td>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" checked={isChecked} />
                            </Form.Group> 
                        </td>
                        <td className="checkList_input">
                            {flow.task}
                        </td>
                        <td className="bg-light">
                            <Button variant="outline-danger" size="sm" onClick={()=>{
                               return db.collection('mySweetHotel')
                               .doc('country')
                               .collection('France')
                               .doc('collection')
                               .collection('hotel')
                               .doc('region')
                               .collection(userDB.hotelRegion)
                               .doc('departement')
                               .collection(userDB.hotelDept)
                               .doc(`${userDB.hotelId}`)
                               .collection("checkList")
                               .doc("lists")
                               .collection('shift')
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