import { db } from '../Firebase'
import { addNotification } from "./globalCommonFunctions"

export const handleChange = (event, setState) =>{
    event.persist()
    setState(currentValue =>({
        ...currentValue,
        [event.target.name]: event.target.value
    }))
}

export const handleSubmit = (event, notif, hotelId, collection, data, handleClose) => {
    event.preventDefault()
    addNotification(notif, hotelId)
        return db.collection('hotels')
        .doc(hotelId)
        .collection(collection)
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

export const fetchCollectionBySorting = (hotelId, collection) => {
    return db.collection('hotels')
    .doc(hotelId)
    .collection(collection)
    .orderBy("markup", "asc")
}

export const fetchCollectionBySearching = (hotelId, collection) => {
    return db.collection('hotels')
    .doc(hotelId)
    .collection(collection)
    .where("status", "==", true)
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