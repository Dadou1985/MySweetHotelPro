import {storage} from '../Firebase'
import { db } from '../Firebase'

export const addNotification = (notification, hotelId) => {
    return db.collection('notifications')
        .add({
        content: notification,
        hotelId: hotelId,
        markup: Date.now()
    })
}

/* FETCH DATA */

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

/* UPDATE DATA */

export const handleUpdateData1 = (collection, document, data) => {
    return db.collection(collection)
    .doc(document)
    .update(data)
}

export const handleUpdateData2 = (collection, document, data) => {
    return db.collection(collection)
    .doc(document)
    .collection(collection)
    .doc(document)
    .update(data)
}

export const handleUpdateData3 = (collection, document, data) => {
    return db.collection(collection)
    .doc(document)
    .collection(collection)
    .doc(document)
    .collection(collection)
    .doc(document)
    .update(data)
}

/* SUBMIT DATA */

export const handleSubmitData1 = (event, collection, data) => {
    event.preventDefault()
        return db.collection(collection)
        .add(data)
}

export const handleSubmitData2 = (event, collection1, document, collection2, data) => {
    event.preventDefault()
        return db.collection(collection1)
        .doc(document)
        .collection(collection2)
        .add(data)
}

export const handleSubmitData3 = (event, collection1, document1, collection2, document2, collection3, data) => {
    event.preventDefault()
        return db.collection(collection1)
        .doc(document1)
        .collection(collection2)
        .doc(document2)
        .collection(collection3)
        .add(data)
}


export const handleCreateData1 = (event, collection, document, data) => {
    event.preventDefault()
        return db.collection(collection)
        .doc(document)
        .set(data)
}

export const handleCreateData2 = (event, collection1, document1, collection2, document2, data) => {
    event.preventDefault()
        return db.collection(collection1)
        .doc(document1)
        .collection(collection2)
        .doc(document2)
        .set(data)
}

export const handleCreateData3 = (event, collection1, document1, collection2, document2, collection3, document3, data) => {
    event.preventDefault()
        return db.collection(collection1)
        .doc(document1)
        .collection(collection2)
        .doc(document2)
        .collection(collection3)
        .doc(document3)
        .set(data)
}

/* DELETE DATA */

export const handleDeleteData1 = async (collection, document) => {
    try {
        await db.collection(collection)
            .doc(document)
            .delete()
        console.log("Document successfully deleted!")
    } catch (error) {
        console.log(error)
    }
}

export const handleDeleteData2 = async (collection1, document1, collection2, document2) => {
    try {
        await db.collection(collection1)
            .doc(document1)
            .collection(collection2)
            .doc(document2)
            .delete()
        console.log("Document successfully deleted!")
    } catch (error) {
        console.log(error)
    }
}

export const handleDeleteData3 = async (collection1, document1, collection2, document2, collection3, document3) => {
    try {
        await db.collection(collection1)
            .doc(document1)
            .collection(collection2)
            .doc(document2)
            .collection(collection3)
            .doc(document3)
            .delete()
        console.log("Document successfully deleted!")
    } catch (error) {
        console.log(error)
    }
}


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