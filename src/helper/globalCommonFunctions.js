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

export const fetchCollectionBySorting1 = (collection, field, order, limit = 1000) => {
    return db.collection(collection)
    .orderBy(field, order)
    .limit(limit)
}

export const fetchCollectionBySorting2 = (collection1, document, collection2, field, order, limit = 1000) => {
    return db.collection(collection1)
    .doc(document)
    .collection(collection2)
    .orderBy(field, order)
    .limit(limit)
}
export const fetchCollectionBySorting3 = (collection1, document1, collection2, document2, collection3, field, order, limit = 1000) => {
    return db.collection(collection1)
    .doc(document1)
    .collection(collection2)
    .doc(document2)
    .collection(collection3)
    .orderBy(field, order)
    .limit(limit)
}


export const fetchCollectionByMapping1 = (collection, field, operator, data) => {
    return db.collection(collection)
    .where(field, operator, data)
}

export const fetchCollectionByMapping2 = (collection1, document, collection2, field, operator, data) => {
    return db.collection(collection1)
    .doc(document)
    .collection(collection2)
    .where(field, operator, data)
}
export const fetchCollectionByMapping3 = (collection1, document1, collection2, document2, collection3, field, operator, data) => {
    return db.collection(collection1)
    .doc(document1)
    .collection(collection2)
    .doc(document2)
    .collection(collection3)
    .where(field, operator, data)
}