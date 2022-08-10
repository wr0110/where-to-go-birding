import type { NextApiRequest, NextApiResponse } from "next";
import aws from "aws-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { url }: any = req.query;
  const filename = url.split("/").pop();
  aws.config.update({
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
    region: "us-east-1",
    signatureVersion: "v4",
  });
  const endpoint = new aws.Endpoint("s3.wasabisys.com");
  const s3 = new aws.S3({ endpoint });

  const params = {
    Bucket: "birdinghotspots",
    Key: filename,
    ResponseContentDisposition: `attachment; filename=${filename}`,
  };
  const signedUrl = s3.getSignedUrl("getObject", params);

  if (signedUrl) {
    res.redirect(307, signedUrl);
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
}
