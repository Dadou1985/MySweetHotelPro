import React, { useState, useEffect } from 'react'
import { Form, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap'
import { auth, db, functions } from '../../../../Firebase'
import RegionDetails from '../../../../../hotels/regionDetailsSheet.json'
import { paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur } from "../../../../../hotels"

export default function PhoneGhost({user, userDB, setUserDB}) {
    const [formValue, setFormValue] = useState({username: "", email: "", hotelName: "", city: "", standing: "", phone: "", room: 0, code_postal: "", adress: "", website: "", mail: ""})
    const [info, setInfo] = useState([])
    const [region, setRegion] = useState('Sélectionner une région')
    const [departement, setDepartement] = useState('Sélectionner un département')
    const [arrondissement, setArrondissement] = useState('Sélectionner un arrondissement')
    const [hotel, setHotel] = useState("Sélectionner un hôtel")
    const [hotelId, setHotelId] = useState(null)
    const [hotelName, setHotelName] = useState("Sélectionner un hôtel")
    const [number, setNumber] = useState(0)
    const [ghostMode, setGhostMode] = useState(false)

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
    
    const ghostIn = () => {
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(user.displayName)
        .update({   
        hotelId: hotelId,
        hotelName: hotelName,
        hotelRegion: region,
        hotelDept: departement
        }) 
    }

    const ghostOut = () => {
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(user.displayName)
        .update({   
        hotelId: "06nOvemBre198524SEptEMbrE201211noVEMbre2017",
        hotelName: "Bates Motel",
        hotelRegion: "MilkyWay",
        hotelDept: "zone51"
        }) 
    }

    const enableGhostMode = async() => {
        const notif = `Vous venez d'entrer en mode Ghost Host sur l'hôtel ${hotelName}`
        await ghostIn()
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc("collection")
        .collection('hotel')
        .doc("region")
        .collection(region)
        .doc('departement')
        .collection(departement)
        .doc(`${hotelId}`)
        .collection('guest')
        .doc(user.displayName)
        .get()
        .then((doc) => {
            if (doc.exists) {
            setUserDB(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            addNotification(notif)
        })
    }

    const disableGhostMode = async() => {
        const notif = `Vous venez de sortir du mode Ghost Host sur l'hôtel ${hotelName}`
        await ghostOut()
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc("collection")
        .collection('hotel')
        .doc("region")
        .collection(region)
        .doc('departement')
        .collection(departement)
        .doc(`${hotelId}`)
        .collection('guest')
        .doc(user.displayName)
        .get()
        .then((doc) => {
            if (doc.exists) {
            setUserDB(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            addNotification(notif)
        })
    }
        
        
    return (
        <div style={{
            display: "flex",
            flexFlow: "column wrap",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5%",
            textAlign: "center",
            height: "80vh"
        }}>
            <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Ghost Host</h4>
            <div>
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
            </div>
            <div>
                <Button variant="success" style={{position: "absoute", bottom: "0", width: "100%", marginBottom: "2vh"}} onClick={enableGhostMode}>Entrer en mode Ghost</Button>
                <Button variant="outline-danger" style={{position: "absoute", bottom: "0", width: "100%"}} onClick={disableGhostMode}>Sortir du mode Ghost</Button>
            </div>
        </div>
    )
}
