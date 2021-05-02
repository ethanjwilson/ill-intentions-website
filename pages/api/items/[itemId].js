// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../../utils/firebaseAdmin";

export default async (req, res) => {
  const { itemId } = req.query;
  const data = await db
    .collection("items")
    .doc(itemId)
    .get()
    .then((doc) => doc.data());
  res.status(200).json(data);
};
