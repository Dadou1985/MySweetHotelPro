export const handleChange = (event, setFormValue) =>{
    event.persist()
    setFormValue(currentValue =>({
        ...currentValue,
        [event.target.name]: event.target.value
    }))
}

export const handleSubmit = (event, hotelId, collection, data) => {
    event.preventDefault()
    setFormValue("")
    setStep(false)
    const notif = t("msh_cab.c_notif") 
    addNotification(notif)
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

export const addNotification = (notification, hotelId) => {
    return db.collection('notifications')
        .add({
        content: notification,
        hotelId: hotelId,
        markup: Date.now()
    })
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