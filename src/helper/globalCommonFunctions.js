import {storage} from '../Firebase'

const handleDeleteImg = (imgId) => {
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