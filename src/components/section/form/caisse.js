import React, {useState, useEffect, useRef, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Safe from '../../../svg/vault.svg'
import { useReactToPrint } from 'react-to-print';
import { FirebaseContext, db } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import PerfectScrollbar from 'react-perfect-scrollbar'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';
  import { useTranslation } from "react-i18next"

const Caisse = () =>{
    const { t, i18n } = useTranslation()

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([""])
    const [formValue, setFormValue] = useState({shift: "matin"})
    const {userDB} = useContext(FirebaseContext)
    const [footerState, setFooterState] = useState(true)
    const [filterDate, setFilterDate] = useState(new Date())

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        const notif = t("msh_safe.s_notif")
        addNotification(notif)
        let caisse = document.getElementById("montant").value
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('safe')
            .add({
            author: userDB.username,
            date: moment(new Date()).format('LL'),
            amount: caisse,
            shift: formValue.shift,
            markup: Date.now()
            })
        .then(() => {
            handleReset()
            return handleClose()})
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const change = (a, b, c) => {
        let x = document.getElementById(a).value * b
        const outputValue = document.getElementById(c).value = x.toFixed(2)
        return outputValue
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

    const handleReset = async() =>{
        let montant = document.getElementById("montant")
        let total = document.getElementById('total')
        let table = document.getElementById("moneyBoxes")

        montant.innerHTML = 0
        total.innerHTML = 0
        await table.reset()
        return setFormValue({shift: "matin"})
    }


    const handleDateChange = (date) => {
        setFilterDate(date);
      };

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('safe')
            .where("date", "==", moment(filterDate).format('LL'))
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
           
     },[filterDate])



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
                {t("msh_coolbar.tooltip_safe")}
              </Tooltip>
            }>
                <img src={Safe} className="icon" alt="contact" onClick={handleShow} style={{width: "2vw"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        justifyContent: "space-between", 
                        width: "90%"
                    }}>
                        {t("msh_safe.s_title")}
                        <div style={{
                            maxWidth: "50%",
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between"
                        }}>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label style={{fontSize: "15px", fontWeight: "bolder"}}>{t("msh_safe.s_select.s_label")}</Form.Label>
                            <select class="selectpicker" value={formValue.shift} id="shift" name="shift" onChange={handleChange} 
                            style={{width: "10vw", 
                            height: "4vh", 
                            border: "1px solid lightgrey", 
                            borderRadius: "3px",
                            backgroundColor: "white",
                            marginLeft: "1vw",
                            fontSize: "15px", 
                            paddingLeft: "10px", 
                            marginRight: footerState ? "0px" : "2vw"}}>
                                <option value="matin">{t("msh_safe.s_select.s_morning_shift")}</option>
                                <option value="soir">{t("msh_safe.s_select.s_afternoon_shift")}</option>
                                <option value="nuit">{t("msh_safe.s_select.s_night_shift")}</option>
                            </select>
                            </Form.Group>
                            {!footerState && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                variant="dialog"
                                ampm={false}
                                value={filterDate}
                                onChange={handleDateChange}
                                onError={console.log}
                                format={userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                                autoOk
                            />                                        
                            </MuiPickersUtilsProvider>}
                        </div>
                        </Modal.Title>
                    </Modal.Header>
                    <form id="moneyBoxes"> 

                    <Modal.Body>
                   
                    <Tabs defaultActiveKey="Caisse du shift" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Journal des caisses'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="Caisse du shift" title={t("msh_safe.s_second_tab_title")}>
                            <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover variant="dark" size="sm" className="text-center">
                                <thead>
                                    <tr>
                                    <th>{t("msh_general.g_table.t_value")}</th>
                                    <th>{t("msh_general.g_table.t_quantity")}</th>
                                    <th>{t("msh_general.g_table.t_amount")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>500.00</td>
                                        <td><input id="bank" type="text" onInput={()=> change("bank", 500, "test")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>200.00</td>
                                        <td><input id="bank2" type="text" onInput={()=> change("bank2", 200, "test2")} onInputCapture={()=>total()}  onChange={()=>montant()}></input></td>
                                        <td><output id="test2">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>100.00</td>
                                        <td><input id="bank3" type="text" onInput={()=> change("bank3", 100, "test3")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test3">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>50.00</td>
                                        <td><input id="bank4" type="text" onInput={()=> change("bank4", 50, "test4")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test4">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>20.00</td>
                                        <td><input id="bank5" type="text" onInput={()=> change("bank5", 20, "test5")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test5">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>10.00</td>
                                        <td><input id="bank6" type="text" onInput={()=> change("bank6", 10, "test6")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test6">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>5.00</td>
                                        <td><input id="bank7" type="text" onInput={()=> change("bank7", 5, "test7")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test7">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>2.00</td>
                                        <td><input id="bank8" type="text" onInput={()=> change("bank8", 2, "test8")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test8">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>1.00</td>
                                        <td><input id="bank9" type="text" onInput={()=> change("bank9", 1, "test9")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test9">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.50</td>
                                        <td><input id="bank10" type="text" onInput={()=> change("bank10", 0.5, "test10")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test10">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.20</td>
                                        <td><input id="bank11" type="text" onInput={()=> change("bank11", 0.2, "test11")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test11">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.10</td>
                                        <td><input id="bank12" type="text" onInput={()=> change("bank12", 0.1, "test12")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test12">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.05</td>
                                        <td><input id="bank13" type="text" onInput={()=> change("bank13", 0.05, "test13")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test13">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.02</td>
                                        <td><input id="bank14" type="text" onInput={()=> change("bank14", 0.02, "test14")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test14">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.01</td>
                                        <td><input id="bank15" type="text" onInput={()=> change("bank15", 0.01, "test15")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test15">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3">{t("msh_general.g_table.t_rolls")}</td>
                                    </tr>
                                    <tr>
                                        <td>2.00</td>
                                        <td><input id="bank16" type="text" onInput={()=> change("bank16", 50, "test16")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test16">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>1.00</td>
                                        <td><input id="bank17" type="text" onInput={()=> change("bank17", 25, "test17")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test17">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.50</td>
                                        <td><input id="bank18" type="text" onInput={()=> change("bank18", 20, "test18")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test18">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.20</td>
                                        <td><input id="bank19" type="text" onInput={()=> change("bank19", 8, "test19")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test19">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.10</td>
                                        <td><input id="bank20" type="text" onInput={()=> change("bank20", 4, "test20")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test20">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.05</td>
                                        <td><input id="bank21" type="text" onInput={()=> change("bank21", 2.5, "test21")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test21">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.02</td>
                                        <td><input id="bank22" type="text" onInput={()=> change("bank22", 1.5, "test22")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test22">0.00</output></td>
                                    </tr>
                                    <tr>
                                        <td>0.01</td>
                                        <td><input id="bank23" type="text" onInput={()=> change("bank23", 0.5, "test23")} onInputCapture={()=>total()} onChange={()=>montant()}></input></td>
                                        <td><output id="test23">0.00</output></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td >{t("msh_general.g_table.t_total_qty")}</td>
                                        <td>{t("msh_general.g_table.t_total")}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><output id="total">0.00</output></td>
                                        <td><output id="montant">0.00</output></td>
                                    </tr>
                                </tfoot>
                                </Table>
                                </PerfectScrollbar>
                            </Tab>
                            <Tab eventKey="Journal des caisses" title="Journal des caisses">
                            <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center" ref={componentRef}>
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>{t("msh_general.g_table.t_username")} {t("msh_general.g_table.t_coworker")}</th>
                                    <th>{t("msh_general.g_table.t_amount")}</th>
                                    <th>{t("msh_general.g_table.t_shift")}</th>
                                    <th>{t("msh_general.g_table.t_date")}</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map((flow, key) =>(
                                        <tr key={key}>
                                        <td>{flow.author}</td>
                                        <td>{flow.amount} {t("msh_safe.s_currency")}</td>
                                        <td>{flow.shift}</td>
                                        <td>{moment(flow.markup).format('L')}</td>
                                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('hotels')
                                            .doc(userDB.hotelId)
                                            .collection("safe")
                                            .doc(flow.id)
                                            .delete()
                                            .then(function() {
                                              console.log("Document successfully deleted!");
                                            }).catch(function(error) {
                                                console.log(error);
                                            });
                                        }}>{t("msh_general.g_button.b_delete")}</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </PerfectScrollbar>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        {footerState && <>
                            <Button variant="outline-dark" onClick={handleReset} style={{width: "7vw"}}>{t("msh_general.g_button.b_reset")}</Button>
                            <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
                        </>}
                        {/*!footerState && <Button variant="outline-info" style={{width: "7vw"}} onClick={handlePrint}>Imprimer</Button>*/}
                    </Modal.Footer>
                    </form>
                </Modal>
        </div>
    )
}

export default Caisse