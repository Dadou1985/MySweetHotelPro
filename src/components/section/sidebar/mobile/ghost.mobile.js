import React, { useState, useContext } from 'react'
import { Form, Button, DropdownButton, Dropdown } from 'react-bootstrap'
import { db, FirebaseContext } from '../../../../config/Firebase'
import { Input } from 'reactstrap'
import { useFirestoreSubscription, useAdd } from '../../../../utils/hooks/useFirestore'
import { handleMutateUpdate } from '../../../../utils/commonFunctions'

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
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [hotelName, setHotelName] = useState("Sélectionner un hôtel")

    const { data: info = [] } = useFirestoreSubscription(['hotels'], { where: ['partnership', '==', true] })

    const { mutate: notify } = useAdd()

    const handleChangeInitialfilter = event =>{
        setInitialFilter(event.currentTarget.value)
    }

    const ghostIn = () => {
        return handleMutateUpdate(['businessUsers', user.uid], {
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
        return handleMutateUpdate(['businessUsers', user.uid], {
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
            notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
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
            notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
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
