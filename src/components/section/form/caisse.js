import React, {useState, useEffect, useRef, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Safe from '../../../svg/vault.svg'
import { useReactToPrint } from 'react-to-print';
import { FirebaseContext, db, auth } from '../../../Firebase'


const Caisse = () =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([""])
    const [formValue, setFormValue] = useState({shift: "matin"})
    const [user, setUser] = useState(auth.currentUser)
    const {userDB} = useContext(FirebaseContext)


    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        let caisse = document.getElementById("montant").value
        handleReset()
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
            .collection('safe')
            .add({
            author: user.displayName,
            date: new Date(),
            amount: caisse,
            shift: formValue.shift,
            markup: Date.now()
            })
        .then(handleClose)
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const change = (a, b, c) => {
        let x = document.getElementById(a).value * b
        const outputValue = document.getElementById(c).value = x
        return outputValue.toFixed(2)
    }

    const total = () => {
        const total = document.getElementById("total").innerHTML = Number(document.getElementById("bank").value) 
        + Number(document.getElementById("bank2").value) 
        + Number(document.getElementById("bank3").value)
        + Number(document.getElementById("bank4").value)
        + Number(document.getElementById("bank5").value) 
        + Number(document.getElementById("bank6").value) 
        + Number(document.getElementById("bank7").value) 
        + Number(document.getElementById("bank8").value)
        + Number(document.getElementById("bank9").value) 
        + Number(document.getElementById("bank10").value) 
        + Number(document.getElementById("bank11").value) 
        + Number(document.getElementById("bank12").value)
        + Number(document.getElementById("bank13").value) 
        + Number(document.getElementById("bank14").value) 
        + Number(document.getElementById("bank15").value) 
        + Number(document.getElementById("bank16").value)
        + Number(document.getElementById("bank17").value) 
        + Number(document.getElementById("bank18").value)
        + Number(document.getElementById("bank19").value)
        + Number(document.getElementById("bank20").value) 
        + Number(document.getElementById("bank21").value)
        + Number(document.getElementById("bank22").value) 
        + Number(document.getElementById("bank23").value)
        return total.toFixed(2)
    }

    const montant = () => {
        const total = document.getElementById("montant").innerHTML = Number(document.getElementById("test").value) 
        + Number(document.getElementById("test2").value) 
        + Number(document.getElementById("test3").value)
        + Number(document.getElementById("test4").value)
        + Number(document.getElementById("test5").value) 
        + Number(document.getElementById("test6").value) 
        + Number(document.getElementById("test7").value) 
        + Number(document.getElementById("test8").value)
        + Number(document.getElementById("test9").value) 
        + Number(document.getElementById("test10").value) 
        + Number(document.getElementById("test11").value) 
        + Number(document.getElementById("test12").value)
        + Number(document.getElementById("test13").value) 
        + Number(document.getElementById("test14").value) 
        + Number(document.getElementById("test15").value) 
        + Number(document.getElementById("test16").value)
        + Number(document.getElementById("test17").value) 
        + Number(document.getElementById("test18").value)
        + Number(document.getElementById("test19").value)
        + Number(document.getElementById("test20").value) 
        + Number(document.getElementById("test21").value)
        + Number(document.getElementById("test22").value) 
        + Number(document.getElementById("test23").value)
        return total.toFixed(2)
    }

    const handleReset = () =>{
        return document.getElementById("moneyBoxes").reset()
    }

    useEffect(() => {
        const toolOnAir = () => {
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
            .collection('safe')
            .orderBy("markup", "asc")
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
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

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            width: "33%"
        }}>
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Caisse
              </Tooltip>
            }>
                <img src={Safe}  alt="contact" onClick={handleShow} style={{width: "30%"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                        <form id="moneyBoxes"> 
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        justifyContent: "space-between", 
                        width: "90%"
                    }}>
                        Caisse du Jour
                            <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label style={{fontSize: "15px"}}>Shift</Form.Label>
                            <select class="selectpicker" value={formValue.shift} name="shift" onChange={handleChange} 
                            style={{width: "10vw", 
                            height: "4vh", 
                            border: "1px solid lightgrey", 
                            borderRadius: "3px",
                            backgroundColor: "white",
                            marginLeft: "1vw",
                            fontSize: "15px", 
                            paddingLeft: "1vw"}}>
                                <option>matin</option>
                                <option>soir</option>
                                <option>nuit</option>
                            </select>
                            </Form.Group>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                   
                    <Tabs defaultActiveKey="Caisse du shift" id="uncontrolled-tab-example">
                            <Tab eventKey="Caisse du shift" title="Caisse du shift">
                            <Table striped bordered hover variant="dark" size="sm" className="text-center" ref={componentRef}>
                                <thead fixed="top">
                                    <tr>
                                    <th>Valeur</th>
                                    <th>Quantité</th>
                                    <th>Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>500.00</td>
                                    <td><input id="bank" type="text" onInput={()=> change("bank", 500, "test")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>200.00</td>
                                    <td><input id="bank2" type="text" onInput={()=> change("bank2", 200, "test2")} onInputCapture={()=>total()}  onChange={()=>montant()}></input></td>
                                    <td><output id="test2">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>100.00</td>
                                    <td><input id="bank3" type="text" onInput={()=> change("bank3", 100, "test3")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test3">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>50.00</td>
                                    <td><input id="bank4" type="text" onInput={()=> change("bank4", 50, "test4")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test4">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>20.00</td>
                                    <td><input id="bank5" type="text" onInput={()=> change("bank5", 20, "test5")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test5">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>10.00</td>
                                    <td><input id="bank6" type="text" onInput={()=> change("bank6", 10, "test6")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test6">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>5.00</td>
                                    <td><input id="bank7" type="text" onInput={()=> change("bank7", 5, "test7")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test7">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>2.00</td>
                                    <td><input id="bank8" type="text" onInput={()=> change("bank8", 2, "test8")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test8">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>1.00</td>
                                    <td><input id="bank9" type="text" onInput={()=> change("bank9", 1, "test9")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test9">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.50</td>
                                    <td><input id="bank10" type="text" onInput={()=> change("bank10", 0.5, "test10")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test10">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.20</td>
                                    <td><input id="bank11" type="text" onInput={()=> change("bank11", 0.2, "test11")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test11">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.10</td>
                                    <td><input id="bank12" type="text" onInput={()=> change("bank12", 0.1, "test12")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test12">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.05</td>
                                    <td><input id="bank13" type="text" onInput={()=> change("bank13", 0.05, "test13")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test13">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.02</td>
                                    <td><input id="bank14" type="text" onInput={()=> change("bank14", 0.02, "test14")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test14">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.01</td>
                                    <td><input id="bank15" type="text" onInput={()=> change("bank15", 0.01, "test15")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test15">0</output></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3">Rouleaux de pièces</td>
                                    </tr>
                                    <tr>
                                    <td>2.00</td>
                                    <td><input id="bank16" type="text" onInput={()=> change("bank16", 50, "test16")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test16">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>1.00</td>
                                    <td><input id="bank17" type="text" onInput={()=> change("bank17", 25, "test17")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test17">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.50</td>
                                    <td><input id="bank18" type="text" onInput={()=> change("bank18", 20, "test18")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test18">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.20</td>
                                    <td><input id="bank19" type="text" onInput={()=> change("bank19", 8, "test19")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test19">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.10</td>
                                    <td><input id="bank20" type="text" onInput={()=> change("bank20", 4, "test20")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test20">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.05</td>
                                    <td><input id="bank21" type="text" onInput={()=> change("bank21", 2.5, "test21")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test21">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.02</td>
                                    <td><input id="bank22" type="text" onInput={()=> change("bank22", 1.5, "test22")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test22">0</output></td>
                                    </tr>
                                    <tr>
                                    <td>0.01</td>
                                    <td><input id="bank23" type="text" onInput={()=> change("bank23", 0.5, "test23")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                    <td><output id="test23">0</output></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td >Total quantité</td>
                                        <td>Total</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><output id="total">0</output></td>
                                        <td><output id="montant">0</output></td>
                                    </tr>
                                </tfoot>
                                </Table>
                            </Tab>
                            <Tab eventKey="Journal des caisses" title="Journal des caisses">
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>Nom du collaborateur</th>
                                    <th>Montant</th>
                                    <th>Shift</th>
                                    <th>Date</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                        <td>{flow.author}</td>
                                        <td>{flow.amount}</td>
                                        <td>{flow.shift}</td>
                                        <td>{flow.date}</td>
                                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
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
                                            .collection("safe")
                                            .doc(flow.id)
                                            .delete()
                                            .then(function() {
                                              console.log("Document successfully deleted!");
                                            }).catch(function(error) {
                                                console.log(error);
                                            });
                                        }}>Supprimer</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleSubmit}>Enregistrer</Button>
                        <Button variant="outline-primary" onClick={handleReset} style={{width: "10vw"}}>Reset</Button>
                        <Button variant="outline-info" style={{width: "10vw"}} onClick={handlePrint}>Imprimer</Button>
                    </Modal.Footer>
                    </form>
                </Modal>
        </div>
    )
}

export default Caisse