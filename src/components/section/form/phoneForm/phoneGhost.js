import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import { db, FirebaseContext } from '../../../../Firebase'
import { Input } from 'reactstrap'

export default function PhoneGhost() {
    const { user, userDB, setUserDB } = useContext(FirebaseContext)
    const [formValue, setFormValue] = useState({
        username: "", 
        email: "", 
        region: "", 
        departement: "", 
        city: "", 
        standing: "", 
        phone: "", 
        room: 0, 
        code_postal: "", 
        adress: "", 
        website: "", 
        mail: "", 
        hotelId: "", 
        hotelName: "", 
        country: "", 
        classement: "",
        appLink: "",
        logo: ""})
    const [info, setInfo] = useState([])
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [hotelName, setHotelName] = useState("Sélectionner un hôtel")

    const handleChangeInitialfilter = event =>{
        setInitialFilter(event.currentTarget.value)
    }

    useEffect(() => {
        const getHotel = () => {
            return db.collection("hotels")
            .where("partnership", "==", true)
            }

        let unsubscribe = getHotel().onSnapshot(function(snapshot) {
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
    }, [filter])

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
    }
    
    const ghostIn = () => {
        return db.collection('businessUsers')
        .doc(user.uid)
        .update({   
            hotelId: formValue.hotelId,
            hotelName: hotelName,
            hotelRegion: formValue.region,
            hotelDept: formValue.departement,
            classement: formValue.classement,
            code_postal: formValue.code_postal,
            city: formValue.city,
            room: formValue.room,
            appLink: formValue.appLink,
            logo: formValue.logo
        }) 
    }

    const ghostOut = () => {
        return db.collection('businessUsers')
        .doc(user.uid)
        .update({   
        hotelId: "06nOvemBre198524SEptEMbrE201211noVEMbre2017",
        hotelName: "Bates Motel",
        hotelRegion: "NOWHERE",
        hotelDept: "EVERYWHERE",
        city: "Gotham",
        classement: "infinity",
        room: "99",
        code_postal: "99999",
        country: "FRANCE",
        mail: "david.simba1985@gmail.com",
        phone: "0659872884",
        website: "https://mysweethotelpro.com/",
        adresse: "11 allée de la Loire",
        appLink: "https://mysweethotel.eu/?url=https://i.postimg.cc/g0tYTRpD/bates-Motel-Icon.png&hotelId=06nOvemBre198524SEptEMbrE201211noVEMbre2017&hotelName=Bates%20Motel",
        logo: "https://i.postimg.cc/g0tYTRpD/bates-Motel-Icon.png"
        }) 
    }

    const enableGhostMode = async() => {
        const notif = `Vous venez d'entrer en mode Ghost Host sur l'hôtel ${hotelName}`
        await ghostIn()
        return db.collection("businessUsers")
        .doc(user.uid)
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
        .doc(user.uid)
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
        
    console.log(initialFilter)
        
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
            <div>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center"
                }}>
                <Input 
                    type="text" 
                    placeholder="Enter un code postal" 
                    value={initialFilter} 
                    onChange={handleChangeInitialfilter}
                    className="text-center"
                    pattern=".{5,}"
                     />
                </Form.Group>
            </div>

            <div>
                <Form.Group style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                }}>
                <DropdownButton id="dropdown-basic-button" title={hotelName} drop="bottom" variant="dark" onClick={() => setFilter(initialFilter)}>
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
                            room: details.room,
                            partnership: details.partnership,
                            phone: details.phone,
                            website: details.website,
                            adresse: details.adresse,
                            mail: details.mail,
                            appLink: details.appLink,
                            logo: details.logo
                        })
                        setHotelName(details.hotelName)
                        }}>{details.hotelName}</Dropdown.Item>
                    ))}
                </DropdownButton>
                </Form.Group>
            </div>
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
