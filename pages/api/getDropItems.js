// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { db } from "../../utils/firebaseAdmin";

export default async (req, res) => {
  const dropId = req.body.dropId;
  const data = await db
    .collection("items")
    .where("drop", "==", dropId)
    .get()
    .then((snap) => {
      const tempArray = [];
      snap.forEach((docRef) => {
        const doc = docRef.data();
        doc.id = docRef.id;
        tempArray.push(doc);
      });
      return tempArray;
    });
  res.status(200).json(data);
};
