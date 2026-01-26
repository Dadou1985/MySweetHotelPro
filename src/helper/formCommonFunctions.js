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

export const computeSafeTotals = (details, quantities) => {
    return details.reduce(
      (acc, d) => {
        const qty = Number(quantities?.[d.cellInputId] ?? 0) || 0
        acc.totalQty += qty
        acc.totalAmount += qty * Number(d.value)
        return acc
      },
      { totalQty: 0, totalAmount: 0 }
    )
  }