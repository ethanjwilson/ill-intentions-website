// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { Item } from "../../@types/db";
import { db } from "../../utils/firebaseAdmin";

type ReqData = {
  dropId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { dropId }: ReqData = req.body;
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
      return tempArray as Item[];
    });
  res.status(200).json(data);
};
