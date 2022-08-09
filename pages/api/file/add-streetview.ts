import type { NextApiRequest, NextApiResponse } from "next";
import admin from "lib/firebaseAdmin";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const token = req.headers.authorization;
  aws.config.update({
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
    region: "us-east-1",
    signatureVersion: "v4",
  });
  const endpoint = new aws.Endpoint("s3.wasabisys.com");
  const s3 = new aws.S3({ endpoint });

  try {
    await admin.verifyIdToken(token || "");
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const uploadUrlToS3 = async (url: string, key: string) => {
    const response = await s3
      .putObject({
        Bucket: "birdinghotspots",
        Key: key,
        ACL: "public-read",
        //@ts-ignore
        Body: await fetch(url).then((res) => res.buffer()),
      })
      .promise();

    return response;
  };

  const { lat, lng, heading, fov, pitch }: any = req.body;
  const adjustedFov = parseInt(fov) + 20; //The static API has a max of 120 versus 100 for the embed API

  const smGoogleUrl = `https://maps.googleapis.com/maps/api/streetview?size=640x413&location=${lat},${lng}&fov=${adjustedFov}&heading=${heading}&pitch=${pitch}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
  const smFilename = `streetview${uuidv4()}_small.jpg`;

  try {
    await uploadUrlToS3(smGoogleUrl, smFilename);

    res.status(200).json({
      success: true,
      small: `https://s3.us-east-1.wasabisys.com/birdinghotspots/${smFilename}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
}
