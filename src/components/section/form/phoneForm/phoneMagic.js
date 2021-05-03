import React, { useState, useEffect } from 'react'
import { Form, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap'
import { auth, db, functions } from '../../../../Firebase'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider';
import RegionDetails from '../../../../../hotels/regionDetailsSheet.json'
import { paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur } from "../../../../../hotels"

export default function PhoneMagic({user, userDB}) {
    const [formValue, setFormValue] = useState({username: "", email: "", hotelName: "", city: "", standing: "", phone: "", room: 0, code_postal: "", adress: "", website: "", mail: ""})
    const [activateAdminMaker, setActivateAdminMaker] = useState(false)
    const [activateCreateHotel, setActivateCreateHotel] = useState(false)
    const [info, setInfo] = useState([])
    const [region, setRegion] = useState('Sélectionner une région')
    const [departement, setDepartement] = useState('Sélectionner un département')
    const [arrondissement, setArrondissement] = useState('Sélectionner un arrondissement')
    const [hotel, setHotel] = useState("Sélectionner un hôtel")
    const [hotelId, setHotelId] = useState(null)
    const [hotelName, setHotelName] = useState("Sélectionner un hôtel")
    const [number, setNumber] = useState(0)

    const deptDetails = [paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur]

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    useEffect(() => {
        const getHotel = () => {
            if(departement === 'PARIS') {
                return db.collection("mySweetHotel")
                    .doc('country')
                    .collection('France')
                    .doc('collection')
                    .collection('hotel')
                    .doc("region")
                    .collection(region)
                    .doc('departement')
                    .collection(departement)
                    .doc("arrondissement")
                    .collection(arrondissement)
                    .orderBy("markup", "asc")
            }else{
                return db.collection("mySweetHotel")
                    .doc('country')
                    .collection('France')
                    .doc('collection')
                    .collection('hotel')
                    .doc("region")
                    .collection(region)
                    .doc('departement')
                    .collection(departement)
                    .orderBy("markup", "asc")
            }
                }

        let unsubscribe = getHotel().onSnapshot(function(snapshot) {
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
    }, [region, departement, arrondissement])

    const addNotification = (notification) => {
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
            .collection('notifications')
            .add({
            content: notification,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

        const getPartner = () => {
            const notif = `${hotelName} a été activé avec succès !`
            if(departement === 'PARIS') {
                return db.collection("mySweetHotel")
                    .doc('country')
                    .collection('France')
                    .doc('collection')
                    .collection('hotel')
                    .doc("region")
                    .collection(region)
                    .doc('departement')
                    .collection(departement)
                    .doc("arrondissement")
                    .collection(arrondissement)
                    .doc(`${hotelId}`)
                    .update({
                        partnership: true
                    })
                    .then(addNotification(notif))
            }else{
                return db.collection("mySweetHotel")
                    .doc('country')
                    .collection('France')
                    .doc('collection')
                    .collection('hotel')
                    .doc("region")
                    .collection(region)
                    .doc('departement')
                    .collection(departement)
                    .doc(`${hotelId}`)
                    .update({
                        partnership: true
                    })   
                    .then(addNotification(notif))
         
                }
            }

                const createHotel = () => {
                    if(departement === 'PARIS') {
                        return db.collection("mySweetHotel")
                            .doc('country')
                            .collection('France')
                            .doc('collection')
                            .collection('hotel')
                            .doc("region")
                            .collection(region)
                            .doc('departement')
                            .collection(departement)
                            .doc("arrondissement")
                            .collection(arrondissement)
                            .add({
                                hotelName: formValue.hotelName,
                                adresse: formValue.adress,
                                classement: formValue.standing,
                                departement: departement,
                                region: region,
                                city: formValue.city,
                                code_postal: formValue.code_postal,
                                room: formValue.room,
                                website: formValue.website,
                                phone: formValue.phone,
                                mail: formValue.mail,
                                markup: Date.now(),
                                partnership: true
                            })
                            .then(()=>{
                                setFormValue("" || 0)
                                setActivateCreateHotel(false)
                            }) 
                    }else{
                        return db.collection("mySweetHotel")
                            .doc('country')
                            .collection('France')
                            .doc('collection')
                            .collection('hotel')
                            .doc("region")
                            .collection(region)
                            .doc('departement')
                            .collection(departement)
                            .add({
                                hotelName: formValue.hotelName,
                                adresse: formValue.adress,
                                classement: formValue.standing,
                                departement: departement,
                                region: region,
                                city: formValue.city,
                                code_postal: formValue.code_postal,
                                room: formValue.room,
                                website: formValue.website,
                                phone: formValue.phone,
                                mail: formValue.mail,
                                markup: Date.now(),
                                partnership: true
                            })    
                            .then(()=>{
                                setFormValue("" || 0)
                                setActivateCreateHotel(false)
                            })        
                        }
                    }
        

        const createUser = functions.httpsCallable('createUser')

        let newUid = userDB.hotelId + Date.now()
        
        const adminMaker = async(event) => {
            event.preventDefault()
            //setFormValue("")
            await createUser({email: formValue.email, password: "password", username: formValue.username, uid: newUid})
            return db.collection("mySweetHotel")
            .doc("country")
            .collection("France")
            .doc('collection')
            .collection('business')
            .doc('collection')
            .collection('users')
            .doc(formValue.username)
            .set({   
            adminStatus: true, 
            email: formValue.email,
            password: "password",
            hotelId: hotelId,
            hotelName: hotelName,
            hotelRegion: region,
            hotelDept: departement,
            createdAt: Date.now(),
            userId: newUid
            }) 
            .then(()=>{
                setFormValue("" || 0)
                setActivateAdminMaker(false)
            }) 
        }

            

    return (
        <div style={{
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "5%",
            textAlign: "center"
        }}>
            <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Magic Box</h4>
            <Form.Row>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                }}>
                <DropdownButton id="dropdown-basic-button" title={region} drop="bottom">
                {RegionDetails.map(details => (
                    <Dropdown.Item  onClick={()=>{
                        setRegion(details.region)
                        setNumber(details.number)
                        }}>{details.region}</Dropdown.Item>
                    ))}
                </DropdownButton>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                }}>
                
                {region !== "sélectionner une région" ? <DropdownButton id="dropdown-basic-button" title={departement} variant='info' drop="bottom">
                    
                {region === "PARIS" ? deptDetails[number].map(details => (
                    <Dropdown.Item  onClick={()=>{
                        setArrondissement(details.nom)
                        }}>{details.nom}</Dropdown.Item>
                    )) : deptDetails[number].map(details => (
                        <Dropdown.Item  onClick={()=>{
                            setDepartement(details.nom)
                            }}>{details.nom}</Dropdown.Item>
                        ))}
                </DropdownButton> 
                :
                <></>}
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                }}>
                <DropdownButton id="dropdown-basic-button" title={hotelName} drop="bottom" variant="dark">
                {info.map(details => (
                    <Dropdown.Item  onClick={()=>{
                        setHotelName(details.hotelName)
                        setHotelId(details.id)
                        }}>{details.hotelName}</Dropdown.Item>
                    ))}
                </DropdownButton>
                </Form.Group>
            </Form.Row>
            <div style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                marginTop: "3vh",
                paddingTop: "5vh",
                borderTop: "1px solid lightgrey"
            }}>
                <Button variant="outline-primary" style={{marginBottom: "2vh"}} onClick={getPartner}>Activer un hôtel</Button>
                <Button variant="outline-info" style={{marginBottom: "2vh"}} onClick={() => setActivateAdminMaker(true)}>Créér un administrateur</Button>
                <Button variant="outline-dark" style={{marginBottom: "2vh"}} onClick={() => setActivateCreateHotel(true)}>Créér un hôtel</Button>
            </div>
            <Drawer anchor="bottom" open={activateAdminMaker} onClose={() => setActivateAdminMaker(false)}  className="phone_container_drawer">
                <div style={{
                    display: "flex",
                    flexFlow: "column wrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "5%",
                    textAlign: "center"
                }}>
                    <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Créér un administrateur</h4>
                    <Form.Group controlId="formGroupName">
                        <Form.Control style={{width: "80vw"}} value={formValue.username} name="username" type="text" placeholder="Prénom et Nom du collaborateur" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formGroupRefHotel">
                        <Form.Control style={{width: "80vw"}} value={formValue.email} name="email" type="text" placeholder="E-mail du collaborateur" onChange={handleChange} required />
                    </Form.Group>

                    <Button variant="success" onClick={adminMaker}>Créér un administrateur maintenant</Button>
                </div>
            </Drawer>
            <Drawer anchor="bottom" open={activateCreateHotel} onClose={() => setActivateCreateHotel(false)}  className="phone_container_drawer">
                <div style={{
                        display: "flex",
                        flexFlow: "column wrap",
                        justifyContent: "space-around",
                        alignItems: "center",
                        padding: "5%",
                        textAlign: "center"
                    }}>
                        <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Créér un hôtel</h4>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.hotelName} name="hotelName" type="text" placeholder="Nom de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.city} name="city" type="text" placeholder="Ville" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.code_postal} name="code_postal" type="text" placeholder="Code postal" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.standing} name="standing" type="text" placeholder="Classement" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.room} name="room" type="number" placeholder="Nombre de chambre" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.adress} name="adress" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.phone} name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.mail} name="mail" type="text" placeholder="E-mail du manager" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "80vw"}} value={formValue.website} name="website" type="text" placeholder="Site web" onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" onClick={createHotel}>Créér un hôtel maintenant</Button>
                </div>            
            </Drawer>
        </div>
    )
}
