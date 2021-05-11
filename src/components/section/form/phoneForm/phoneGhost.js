import React, { useState, useEffect } from 'react'
import { Form, Button, Table, DropdownButton, Dropdown } from 'react-bootstrap'
import { auth, db, functions } from '../../../../Firebase'
import RegionDetails from '../../../../../hotels/regionDetailsSheet.json'
import { paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur } from "../../../../../hotels"
import { Input } from 'reactstrap'

export default function PhoneGhost({user, userDB, setUserDB}) {
    const [formValue, setFormValue] = useState({username: "", email: "", region: "", departement: "", city: "", standing: "", phone: "", room: 0, code_postal: "", adress: "", website: "", mail: "", hotelId: "", hotelName: "", country: "", classement: ""})
    const [activateAdminMaker, setActivateAdminMaker] = useState(false)
    const [activateCreateHotel, setActivateCreateHotel] = useState(false)
    const [info, setInfo] = useState([])
    const [filter, setFilter] = useState("")
    const [hotelName, setHotelName] = useState("Sélectionner un hôtel")
    const [ghostMode, setGhostMode] = useState(false)

    const deptDetails = [paris_arrondissement, ile_de_france, auvergne_rhone_alpes, bourgogne_franche_comte, bretagne, centre_val_de_loire, corse, grand_est, hauts_de_france, normandie, nouvelle_aquitaine, occitanie, pays_de_la_loire,provence_alpes_cote_d_azur]

    const handleChangeFilter = event =>{
        setFilter(event.currentTarget.value)
    }

    useEffect(() => {
        const getHotel = () => {
            return db.collection("hotels")
                .where("code_postal", "==", filter)
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
    }, [filter])

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }
    
    const ghostIn = () => {
        return db.collection('businessUsers')
        .doc(user.displayName)
        .update({   
            hotelId: formValue.hotelId,
            hotelName: hotelName,
            hotelRegion: formValue.region,
            hotelDept: formValue.departement,
            classement: formValue.classement,
            code_postal: formValue.code_postal,
            city: formValue.city,
            room: formValue.room,
        }) 
    }

    const ghostOut = () => {
        return db.collection('businessUsers')
        .doc(user.displayName)
        .update({   
        hotelId: "06nOvemBre198524SEptEMbrE201211noVEMbre2017",
        hotelName: "Bates Motel",
        hotelRegion: "MilkyWay",
        hotelDept: "zone51",
        city: "Gotham",
        classement: "infinity",
        room: "99",
        code_postal: "99999"
        }) 
    }

    const enableGhostMode = async() => {
        const notif = `Vous venez d'entrer en mode Ghost Host sur l'hôtel ${hotelName}`
        await ghostIn()
        return db.collection("businessUsers")
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
        return db.collection("businessUsers")
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
            <h4 style={{marginBottom: "5vh", fontWeight: "bold"}}>Ghost Host</h4>
            <div style={{width: "90%", display: "flex", flexFlow: "column", alignItems: "center"}}>
            <Form.Row>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                }}>
                <Input 
                    type="text" 
                    placeholder="Enter un code postal" 
                    value={filter} 
                    onChange={handleChangeFilter}
                    className="text-center" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                }}>
                <DropdownButton id="dropdown-basic-button" title={hotelName} drop="bottom" variant="dark">
                {info.map(details => (
                    <Dropdown.Item  onClick={()=>{
                        setFormValue({
                            hotelId: details.id,
                            departement: details.departement,
                            region: details.region,
                            classement: details.classement,
                            city: details.city,
                            code_postal: details.code_postal,
                            country: details.country,
                            room: details.room
                        })
                        setHotelName(details.hotelName)
                        }}>{details.hotelName}</Dropdown.Item>
                    ))}
                </DropdownButton>
                </Form.Group>
            </Form.Row>
            </div>
            <div>
                <Button variant="success" style={{position: "absoute", bottom: "0", width: "100%", marginBottom: "2vh"}} onClick={() => {
                    enableGhostMode()
                    setFilter('')
                    setFormValue("" || 0)
                    setHotelName("Sélectionner un hôtel")
                    }}>Entrer en mode Ghost</Button>
                <Button variant="outline-danger" style={{position: "absoute", bottom: "0", width: "100%"}} onClick={disableGhostMode}>Sortir du mode Ghost</Button>
            </div>
        </div>
    )
}
