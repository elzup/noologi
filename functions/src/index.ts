import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore()

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database
  .ref('/status/{rid}/{uid}')
  .onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    const eventStatus = change.after.val()

    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const roomRef = firestore.collection('room').doc(context.params.rid)

    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online / offline status, so we'll re-read the current data
    // and compare the timestamps.
    const statusSnapshot = await change.after.ref.once('value')
    const status = statusSnapshot.val()

    console.log(status, eventStatus)
    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (status.lastChanged > eventStatus.lastChanged) {
      return null
    }
    eventStatus.lastChanged = new Date(eventStatus.lastChanged)

    // ... and write it to Firestore.
    if (eventStatus.state === 'offline') {
      return roomRef.get().then((snap) => {
        const r = snap.data()

        if (r) {
          roomRef.update({
            players: { ...r.players, [context.params.uid]: false },
          })
        }
      })
    }
    return
  })
