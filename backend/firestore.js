const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "cit412-final-project-494116"
  });
}

const db = admin.firestore();
db.settings({ databaseId: "cit412-final-project-firestore-db" });
module.exports = db;