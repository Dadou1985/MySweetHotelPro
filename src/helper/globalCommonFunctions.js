import {storage} from '../Firebase'
import { db } from '../Firebase'

export const handleDeleteImg = (imgId) => {
    const storageRef = storage.refFromURL(imgId)
    const imageRef = storage.ref(storageRef.fullPath)

    imageRef.delete()
    .then(() => {
        console.log(`${imgId} has been deleted succesfully`)
    })
    .catch((e) => {
        console.log('Error while deleting the image ', e)
    })
}

export const addNotification = (notification, hotelId) => {
    return db.collection('notifications')
        .add({
        content: notification,
        hotelId: hotelId,
        markup: Date.now()
    })
}

export const fetchCollectionBySorting = (hotelId, collection, field, order) => {
    return db.collection('hotels')
    .doc(hotelId)
    .collection(collection)
    .orderBy(field, order)
}

export const fetchCollectionByMapping = (hotelId, collection, field, operator, data) => {
    return db.collection('hotels')
    .doc(hotelId)
    .collection(collection)
    .where(field, operator, data)
}