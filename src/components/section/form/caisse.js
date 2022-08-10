import React, {useState, useEffect, useRef, useContext } from 'react'
import { 
    Form, 
    Button, 
    Table, 
    Tabs, 
    Tab, 
    Modal 
} from 'react-bootstrap'
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
import { StyledBadge } from '../../../helper/formCommonUI'
import BadgeContent from '../../../helper/common/badgeContent'
import SafeTableRow from '../../../helper/common/safeTableRow'
import { safeTableDetailsCoins, safeTableDetailsRolls } from '../../../helper/common/safeDetailSheet'
import { 
    fetchCollectionByMapping2, 
    handleSubmitData2, 
    addNotification,
    handleDeleteData2
 } from '../../../helper/globalCommonFunctions'
import {
    handleChange,
    safeTotal,
    safeAmount
} from '../../../helper/formCommonFunctions'

/* 
    ! FIX => BUG SUBMIT DATA (TOTAL AMOUNT AND SHIFT CLONE)
 */

const Caisse = () =>{
    const [list, setList] = useState(false)
    const [info, setInfo] = useState([""])
    const [formValue, setFormValue] = useState({shift: "matin", shiftClone: ""})
    const {userDB} = useContext(FirebaseContext)
    const [footerState, setFooterState] = useState(true)
    const [filterDate, setFilterDate] = useState(new Date())
    const { t } = useTranslation()

    const handleShow = () => setList(true)
    const handleClose = () => {
        setList(false)
        setFormValue("")
        handleReset()
    }

    const notif = t("msh_safe.s_notif")
    const tooltipTitle = t("msh_coolbar.tooltip_safe")
    const componentRef = useRef();

    const newData = {
        author: userDB.username,
        date: moment(new Date()).format('LL'),
        amount: document.getElementById("montant") != null && document.getElementById("montant").innerHTML,
        shift: formValue.shift,
        shiftClone: formValue.shiftClone !== "" ? formValue.shiftClone : t("msh_safe.s_select.s_morning_shift"),
        markup: Date.now()
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
        let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "safe", "date", "==", moment(filterDate).format('LL')).onSnapshot(function(snapshot) {
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
           
     },[filterDate])

    //  const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // })

    console.log('==============================================================', document.getElementById("montant") != null && document.getElementById("montant").innerHTML)

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            width: "33%"
        }}>
            <StyledBadge color="secondary">
                <BadgeContent tooltipTitle={tooltipTitle} icon={Safe} handleShow={handleShow} />
            </StyledBadge>
            <Modal show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        flexFlow: "row",
                        justifyContent: "space-between", 
                        width: "90%"
                    }}>
                        {t("msh_safe.s_title")}
                        <div style={{
                            maxWidth: "70%",
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                        <div style={{fontSize: "15px", fontWeight: "bolder"}}>{t("msh_safe.s_select.s_label")}</div>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Select className="selectpicker" value={formValue.shift} id="shift" name="shift" onChange={(event) => handleChange(event, setFormValue)} 
                            style={{width: "10vw", 
                            height: "4vh", 
                            border: "1px solid lightgrey", 
                            borderRadius: "3px",
                            backgroundColor: "white",
                            marginLeft: "1vw",
                            fontSize: "15px", 
                            paddingLeft: "10px", 
                            marginRight: footerState ? "0px" : "2vw"}}>
                                <option value="morning" onClick={() => setFormValue.shiftClone(t("msh_safe.s_select.s_morning_shift"))}>{t("msh_safe.s_select.s_morning_shift")}</option>
                                <option value="evening" onClick={() => setFormValue.shiftClone(t("msh_safe.s_select.s_afternoon_shift"))}>{t("msh_safe.s_select.s_afternoon_shift")}</option>
                                <option value="night" onClick={() => setFormValue.shiftClone(t("msh_safe.s_select.s_night_shift"))}>{t("msh_safe.s_select.s_night_shift")}</option>
                            </Form.Select>
                            </Form.Group>
                            {!footerState && <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                variant="inline"
                                ampm={false}
                                value={filterDate}
                                label={t('msh_messenger.m_calendar')}
                                disableFuture
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
                                    {safeTableDetailsCoins.map((details) => {
                                        return (
                                            <SafeTableRow
                                                rowId={details.id}
                                                labelValue={details.labelValue}
                                                cellLabelValue={details.labelCellValue}
                                                cellInputId={details.cellInputId}
                                                cellOutputId={details.cellOutputId}
                                                safeTotal={safeTotal}
                                                safeAmount={safeAmount}
                                            />)
                                    })}
                                    <tr>
                                        <td></td>
                                        <td><b>{t("msh_general.g_table.t_rolls")}</b></td>
                                        <td></td>
                                    </tr>
                                    {safeTableDetailsRolls.map((details) => {
                                        return (
                                            <SafeTableRow
                                                rowId={details.id}
                                                labelValue={details.labelValue}
                                                cellLabelValue={details.labelCellValue}
                                                cellInputId={details.cellInputId}
                                                cellOutputId={details.cellOutputId}
                                                safeTotal={safeTotal}
                                                safeAmount={safeAmount}
                                            />)
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td ><b>{t("msh_general.g_table.t_total_qty")}</b></td>
                                        <td><b>{t("msh_general.g_table.t_total")}</b></td>
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
                                            <td>{flow.shiftClone}</td>
                                            <td>{moment(flow.markup).format('L')}</td>
                                            <td className="bg-dark">
                                                <Button variant="outline-danger" size="sm" onClick={()=> handleDeleteData2("hotels", userDB.hotelId, "safe", flow.id)}>
                                                    {t("msh_general.g_button.b_delete")}
                                                </Button>
                                            </td>
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
                            <Button variant="dark" onClick={(event) => {
                                handleSubmitData2(event, "hotels", userDB.hotelId, "safe", newData)
                                addNotification(notif, userDB.hotelId)
                                return handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                        </>}
                        {/*!footerState && <Button variant="outline-info" style={{width: "7vw"}} onClick={handlePrint}>Imprimer</Button>*/}
                    </Modal.Footer>
                    </form>
                </Modal>
        </div>
    )
}

export default Caisse