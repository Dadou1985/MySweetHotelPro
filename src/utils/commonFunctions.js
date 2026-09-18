import {storage} from '../config/Firebase'
import { db } from '../config/Firebase'

export const buildRef = (path) => {
    if (!Array.isArray(path) || path.length === 0)
        throw new Error('buildRef: path must be a non-empty array')

    let ref = db.collection(path[0])
    for (let i = 1; i < path.length; i++) {
        ref = i % 2 === 1
            ? ref.doc(path[i])
            : ref.collection(path[i])
    }
    return ref
}

export const handleMutateAdd    = (path, data) => buildRef(path).add(data)
export const handleMutateSet    = (path, data) => buildRef(path).set(data)
export const handleMutateUpdate = (path, data) => buildRef(path).update(data)
export const handleMutateDelete = (path)       => buildRef(path).delete()

/* ADD NOTIFICATION */

export const addNotification = (notification, hotelId) => {
    return db.collection('notifications')
        .add({
        content: notification,
        hotelId: hotelId,
        markup: Date.now()
    })
}

/* DELETE IMG */

export const deleteImg = (imgId) => {
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