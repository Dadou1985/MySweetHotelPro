import { db } from '../Firebase'
import { addNotification } from "./globalCommonFunctions"

export const handleChange = (event, setState) =>{
    event.persist()
    setState(currentValue =>({
        ...currentValue,
        [event.target.name]: event.target.value
    }))
}

export const handleSubmit = (event, notif, hotelId, collection, document, subCollection, data, handleClose) => {
    event.preventDefault()
    addNotification(notif, hotelId)
        return db.collection(collection)
        .doc(document)
        .collection(subCollection)
        .add(data)
        .then(handleClose)
}

export const handleUpdateHotelData = (hotelId, collection, documentId, data) => {
    return db.collection('hotels')
    .doc(hotelId)
    .collection(collection)
    .doc(documentId)
    .update(data)      
}

export const handleUpdateUserData = (userId, data) => {
    return db.collection('guestUsers')
    .doc(userId)
    .update(data)
}

export const deleteData = async (hotelId, collection, documentId) => {
    try {
        await db.collection('hotels')
            .doc(hotelId)
            .collection(collection)
            .doc(documentId)
            .delete()
        console.log("Document successfully deleted!")
    } catch (error) {
        console.log(error)
    }
}

export const safeTotal = () => {
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

export const safeAmount = () => {
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

