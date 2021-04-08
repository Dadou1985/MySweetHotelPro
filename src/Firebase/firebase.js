import firebaseConfig from "./config";
import { navigate } from 'gatsby'

class Firebase {
  constructor(app) {
    if(!firebaseInstance) {
      app.initializeApp(firebaseConfig);

      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = app.functions();
      this.storage = app.storage();
    }
  }


  async getUserProfile({userId}){
    return this.db.collection("mySweetHotel")
    .doc("country")
    .collection("France")
    .doc('collection')
    .collection('business')
    .doc('collection')
    .collection('users')
    .where('userId', '==', userId).get();
  }


  async loadUserDB({email, setter}){
    return this.auth.onAuthStateChanged(function(user) {
      if (user) {
        return this.db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc("collection")
        .collection("customer")
        .doc("collection")
        .collection('users')
        .doc(email)
        .get()
        .then((doc) => {
            if (doc.exists) {
              setter(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => navigate('singlePage'))
    }})
  }

  async deleteUserAuth(username){
    const userAuth = await this.auth.currentUser
    await this.db.collection("mySweetHotel")
    .doc("country")
    .collection("France")
    .doc('collection')
    .collection('business')
    .doc('collection')
    .collection('users')
    .doc(username)
    .delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    return userAuth.delete().then(function() {
      // User deleted.
    }).catch(function(error) {
      // An error happened.
    });
  }
  
  redPhoneFilter({filter}){
    return this.deleteDocument.collection("hotels").orderBy(filter)
  }

  resetPassword({email}){
    return this.auth.sendPasswordResetEmail(email).then(function() {
    }).catch(function(error) {
    });
  }

  async createTeammate({email, username, hotelId, hotelName, hotelRegion, hotelDept}) {
    await this.auth.createUserWithEmailAndPassword(email, "password");
    await this.auth.currentUser.updateProfile({displayName: username})
    return this.db.collection("mySweetHotel")
    .doc("country")
    .collection("France")
    .doc('collection')
    .collection('business')
    .doc('collection')
    .collection('users')
    .doc(username)
    .set({   
      adminStatus: false, 
      email: email,
      password: "password",
      hotelId: hotelId,
      hotelName: hotelName,
      hotelRegion: hotelRegion,
      hotelDept: hotelDept,
      createdAt: new Date()
    }) 
    .then(this.resetPassword(email))   
  }

  async workspaceRegister({email, username, userId, refSpace}) {
    await this.auth.currentUser.updateProfile({displayName: refSpace})
    return this.db.collection("hotels")
    .doc(`${refSpace}`)
    .collection("users")
    .doc(username)
    .set({    
      adminStatus: false, 
      userId: userId,
      email: email,
      refSpace: refSpace,
      markup: Date.now()
    }) 
    .then(()=>navigate('/singlePage'))   
  }

  async freeRegister({email, password, username}) {
    const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
    return this.db.collection("iziUsers")
    .doc(username)
    .set({
      userId: newUser.user.uid,
      email: email,
      password: password,
      hotelName: "Bates Motel",
      category: "Jeune Padawan",
      job: "Réceptionniste",
      markup: Date.now()
    })
    .then(()=>navigate('/doorsStage'))   
  }

  login({email, password}) {
    return this.auth.signInWithEmailAndPassword(email, password).then(()=>navigate('/singlePage'));
  }

  async logout() {
    await this.auth.signOut();
  }

  addPhotoProfileUser({img}) {
    return this.auth.currentUser.updateProfile({
      photoURL: img
    }).then(function() {
      console.log("update photo profil success")
    }).catch(function(error) {
      console.log("update photo profil faillure")
    });
  }



  noteOnAir({hotelId, region, departement, date}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('note')
    .where("markup", "<", date)
    .orderBy("markup", "desc")
  }

  stickerOnAir({hotelId, region, departement, userId}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('stickers')
    .where("author", "==", userId)
  }

  overbookingOnAir({hotelId, region, departement, table}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('overbooking')
    .doc("tables")
    .collection(table)
    .orderBy("token", "asc")
  }

  toolOnAir({hotelId, region, departement, collection}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection(collection)
    .orderBy("markup", "asc")
  }

  safeOnAir({hotelId, region, departement}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('safe')
    .orderBy("markup", "asc")
  }

  contactOnAir({hotelId, region, departement}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('contact')
    .orderBy("name")
  }

  listOnAir({documentId, collection}){
    return this.db.collection("hotels")
    .doc(`${documentId}`)
    .collection("checkList")
    .doc("lists")
    .collection(collection)
    .orderBy("markup", "asc")
  }

  itemOnAir({region, departement, hotelId, item}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('housekeeping')
    .doc('item')
    .collection(item)
    .orderBy("markup", "asc")
  }

  phoneOnAir(){
    return this.db.collection("hotels")
    .where("roomAvailable", "<", "0")
  }

  filterOnAir({field, operator, filter}){
    return this.db.collection("hotels")
    .where(field, operator, filter)
  }

  hotelOnAir(){
    return this.db.collection("hotels")
  }

  adminOnAir({hotelId, region, departement, email}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("users")
    .where("email", "==", email)
  }

  adminRegisterOnAir({hotelId, region, departement}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("users")
    .where("adminRegistration", "==", true)
  }

  iziUserOnAir({email}){
    return this.db.collection("iziUsers")
    .where("email", "==", email)
  }

  iziUserOnAir2({userId}){
    return this.db.collection("iziUsers")
    .where("userId", "==", userId)
  }

  moodOnAir(){
    return this.db.collection("iziUsers")
    .where("mood", "in", ["Sky is the limit", "Don't f*ck with me today !!", "Feng Shui Master", "J-1 avant dépression"])
  }

  karenSoriesOnAir(){
    return this.db.collection("karenStories")
    .orderBy("markup", "desc")
  }

  commentOnAir({storyId}){
    return this.db.collection("karenStories")
    .doc(storyId)
    .collection("comment")
    .orderBy("markup", "asc")
  }

  hotelDataOnAir({region, departement, initialFilter, filter}){
    return this.db.collection("IziLife")
    .doc("FunSpace")
    .collection("shiftAdvisor")
    .doc("region")
    .collection(region)
    .doc("departement")
    .collection(departement)
    .where(initialFilter, "==", filter)
  } 
  
  hotelRatingDataOnAir({region, departement, hotelId}){
    return this.db.collection("IziLife")
    .doc("FunSpace")
    .collection("shiftAdvisor")
    .doc("region")
    .collection(region)
    .doc("departement")
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("rating")
  }  

  hotelCommentDataOnAir({region, departement, hotelId}){
    return this.db.collection("IziLife")
    .doc("FunSpace")
    .collection("shiftAdvisor")
    .doc("region")
    .collection(region)
    .doc("departement")
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("comment")
    .orderBy("markup", "desc")
  }  

  chatOnAir({hotelId, region, departement}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('chat')
    .orderBy("markup", "asc")
  }

  chatRoomOnAir({hotelId, region, departement, roomName}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('chat')
    .doc(roomName)
    .collection("chatRoom")
    .orderBy("markup", "desc")
  }



  async deleteDocument({hotelId, region, departement, collection, document}) {
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection(collection)
    .doc(document)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.log(error);
    });
  }

  async deleteOverbooking({refHotel, collection, document}) {
    return this.db.collection("hotels")
    .doc(refHotel)
    .collection("overbooking")
    .doc("tables")
    .collection(collection)
    .doc(`${document}`)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.log(error);
    });
  }

  async deleteTask({hotelId, region, departement, collection, document}) {
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("checkList")
    .doc("lists")
    .collection(collection)
    .doc(document)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.log(error);
    });
  }

  async deleteUser({hotelId, region, departement, document}){
    await this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection("users")
    .doc(document)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.log(error);
    });
  }
  



  async addNote({hotelId, region, departement, noteId, author, text, status, hour, img, markup, userId, date}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('note')
    .doc(`${noteId}`)
    .set({
      author: author,
      text: text,
      status: status,
      hour: hour,
      date: date,
      img: img,
      markup: markup,
      userId: userId
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addSticker({hotelId, region, departement, title, text, author, markup}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('stickers')
    .add({
      title: title,
      text: text,
      author: author,
      markup: markup
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addLostFound({hotelId, region, departement, author, date, description, details, place, markup, type}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('lostNfound')
    .add({
      author: author,
      date: date,
      description: description,
      details: details,
      place: place,
      markup: markup,
      type: type
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addCab({hotelId, region, departement, author, date, client, room, pax, model, destination, markup, hour}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('cab')
    .add({
      author: author,
      date: date,
      destination: destination,
      client: client,
      room: room,
      pax: pax,
      model: model,
      markup: markup,
      hour: hour
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addClock({hotelId, region, departement, author, date, client, room, markup, hour, day}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('clock')
    .add({
      author: author,
      date: date,
      client: client,
      room: room,
      day: day,
      markup: markup,
      hour: hour
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addMaid({hotelId, region, departement, author, date, client, fromRoom, toRoom, reason, state, markup, details}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('maid')
    .add({
      author: author,
      date: date,
      details: details,
      client: client,
      fromRoom: fromRoom,
      markup: markup,
      toRoom: toRoom,
      reason: reason,
      state, state
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addMaintenance({hotelId, region, departement, author, date, client, room, details, markup, type}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('maintenance')
    .add({
      author: author,
      date: date,
      details: details,
      client: client,
      room: room,
      markup: markup,
      type: type
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addSafe({hotelId, region, departement, author, date, amount, shift, markup}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('safe')
    .add({
      author: author,
      date: date,
      amount: amount,
      shift: shift,
      markup: markup
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addContact({hotelId, region, departement, name, mobile, fix, markup}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('contact')
    .add({
      name: name,
      mobile: mobile,
      fix: fix,
      markup: markup
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addTask({hotelId, region, departement, collection, task, markup}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('checkList')
    .doc("lists")
    .collection(collection)
    .add({
      task: task,
      markup: markup
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addOverbookIn({doc, hotelName, client, pax, totalRoom, totalNight, pec, initialPrice, refHotel, status, markup, token}){
    return this.db.collection("hotels")
    .doc(doc).collection("overbooking")
    .doc("tables")
    .collection("overbookIn")
    .doc(`${markup}`)
    .set({
      hotelName: hotelName,
      client: client,
      pax: pax,
      totalRoom: totalRoom,
      totalNight: totalNight,
      initialPrice: initialPrice,
      pec: pec,
      refHotel: refHotel,
      status: status, 
      token: token
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addOverbookOut({doc, hotelName, client, pax, totalRoom, totalNight, pec, initialPrice, refHotel, status, markup, token}){
    return this.db.collection("hotels")
    .doc(doc).collection("overbooking")
    .doc("tables")
    .collection("overbookOut")
    .doc(`${markup}`)
    .set({
      hotelName: hotelName,
      client: client,
      pax: pax,
      totalRoom: totalRoom,
      totalNight: totalNight,
      initialPrice: initialPrice,
      pec: pec,
      refHotel: refHotel,
      status: status,
      token: token
    }).then(function(docRef){
      console.log(docRef.id)
    }).catch(function(error) {
      console.error(error)
    })
  }

  async addNotification({hotelId, region, departement, notification}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('notifications')
    .add({
      content: notification,
      markup: Date.now()})
    .then(doc => console.log('nouvelle notitfication'))
  }


  async updateUsers({userId, newEmail, newPassword, newDisplayName}){
    return this.auth.updateUser(userId, {
      email: newEmail,
      password: newPassword,
      displayName: newDisplayName
    })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully updated user', userRecord.toJSON());
      })
      .catch(function(error) {
        console.log('Error updating user:', error);
      });
     
  }

  async updateUserHotel({username, newHotel}){
    return this.db.collection("publicUsers")
    .doc(username)
    .update({
      hotel: newHotel
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
  }

  async updateRoomAvailable({hotelId, region, departement, room}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .update({
      roomAvailable: room
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
  }

  async updateRack({hotelId, region, departement, rac}){
    return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .update({
      rac: rac
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
  }

  async updateOverbooking({doc, table, overbookingId, status}){
    return this.db.collection("hotels")
    .doc(doc).collection("overbooking")
    .doc("tables")
    .collection(table)
    .doc(`${overbookingId}`)
    .update({
      status: status
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
  }


//Feedback Database

async addFeedback({hotelName, hotelRegion, hotelDept, hotelArrondissement, author, categorie, text}){
  return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('business')
    .doc('collection')
    .collection('feedback')
    .doc('category')
    .collection(categorie)
  .add({
    author: author,
    hotelName: hotelName,
    hotelRegion: hotelRegion,
    hotelDept: hotelDept,
    hotelArrondissement: hotelArrondissement,
    text: text,
    markup: Date.now()
  }).then(function(docRef){
    console.log(docRef.id)
  }).catch(function(error) {
    console.error(error)
  })
}


//IziUsers

async updateIziProfile({username, hotelName, job, level}){
  return this.db.collection("iziUsers")
  .doc(username)
  .update({
    hotelName: hotelName,
    job: job,
    category: level
  })
}


/*IziLife*/

async addIziMessage({author, text, date, hour, userId, mood}){
  return this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("communIzi")
  .add({
    author: author,
    text: text,
    date: date,
    hour: hour,
    userId: userId,
    mood: mood,
    markup: Date.now()
  })
}

async addKarenStory({author, date, story, img, userId}){
  return this.db.collection("karenStories")
  .add({
    author: author,
    story: story,
    userId: userId,
    img: img,
    date: date,
    markup: Date.now()
  })
}

async updateTips({userId, tips}){
  return this.db.collection('iziUsers')
  .doc(userId)
  .update({
    tips: tips
  })
}


async addCommentKarenStories({storyId, author, comment, date}){
  return this.db.collection("karenStories")
  .doc(storyId)
  .collection("comment")
  .add({
    author: author,
    comment: comment,
    date: date,
    markup: Date.now()
  })
}

async addCommentOnHotel({hotelId, region, departement, commentTitle, status, bestOf, bullShift, team, management, customer, wage}){
  await this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("shiftAdvisor")
  .doc("region")
  .collection(region)
  .doc("departement")
  .collection(departement)
  .doc(hotelId)
  .collection("rating")
  .add({
    team: team,
    management: management,
    customer: customer,
    wage: wage,
  })

  return this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("shiftAdvisor")
  .doc("region")
  .collection(region)
  .doc("departement")
  .collection(departement)
  .doc(hotelId)
  .collection("comment")
  .add({
    commentTitle: commentTitle,
    status: status,
    bestOf: bestOf,
    bullShift: bullShift,
    markup: Date.now()
  })
}

async addCommentOnHotelParis({hotelId, region, departement, arrondissement, commentTitle, status, bestOf, bullShift, team, management, customer, wage}){
  await this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("shiftAdvisor")
  .doc("region")
  .collection(region)
  .doc("departement")
  .collection(departement)
  .doc("arrondissement")
  .collection(arrondissement)
  .doc(hotelId)
  .collection("rating")
  .add({
    team: team,
    management: management,
    customer: customer,
    wage: wage,
    markup: Date.now()
  })

  return this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("shiftAdvisor")
  .doc("region")
  .collection(region)
  .doc("departement")
  .collection(departement)
  .doc("arrondissement")
  .collection(arrondissement)
  .doc(hotelId)
  .collection("comment")
  .add({
    commentTitle: commentTitle,
    status: status,
    bestOf: bestOf,
    bullShift: bullShift,
    markup: Date.now()
  })
  
}


async hotelRegistrator({hotelId, arrondissement, hotelName, classement, adresse, room, phone, mail, website, region, departement, code_postal, city, lat, lng}){
  return this.db.collection("IziLife")
  .doc("FunSpace")
  .collection("shiftAdvisor")
  .doc("region")
  .collection("PARIS")
  .doc("departement")
  .collection(`${arrondissement}`)
  .doc(`${hotelId}`)
  .set({
    hotelName: hotelName,
    classement: [classement, "Toutes les étoiles"],
    adresse: adresse,
    room: room,
    phone: phone,
    mail: mail,
    website: website,
    region: ["PARIS", region],
    departement: departement,
    code_postal: code_postal,
    city: city,
    lat: lat,
    lng: lng,
    reputation: 0,
    markup: Date.now()
  })
}


/*iziChat*/

async addChatRoom({hotelId, region, departement, roomName, userId}){
  return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('chat')
  .doc(roomName)
  .set({
    user: userId,
    markup: Date.now()
  })
}

async addMessageIziChat({hotelId, region, departement, roomName, author, text, date, hour, userId, mood}){
  return this.db.collection('mySweetHotel')
    .doc('country')
    .collection('France')
    .doc('collection')
    .collection('hotel')
    .doc('region')
    .collection(region)
    .doc('departement')
    .collection(departement)
    .doc(`${hotelId}`)
    .collection('chat')
  .doc(`${roomName}`)
  .collection('chatRoom')
  .add({
    author: author,
    text: text,
    date: date,
    hour: hour,
    userId: userId,
    mood: mood,
    markup: Date.now()
  })
}
  
}



let firebaseInstance;

function getFirebaseInstance(app) {
  if(!firebaseInstance && app){
    firebaseInstance = new Firebase(app);
    return firebaseInstance;
  }else if(firebaseInstance){
    return firebaseInstance
  }else{
    return null;
  }
}

export default getFirebaseInstance;
