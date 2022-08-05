import type { NextApiRequest, NextApiResponse } from "next";
import connect from "lib/mongo";
import Hotspot from "models/Hotspot.mjs";
import Upload from "models/Upload";
import { Image } from "lib/types";
import admin from "lib/firebaseAdmin";
import { verifyRecaptcha } from "lib/helpers";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const authToken = req.headers.authorization;
  await connect();
  const { locationId, name, email, images, token: recaptchaToken } = req.body;
  const hotspot = await Hotspot.findOne({ locationId });

  try {
    await admin.verifyIdToken(authToken || "");
    const formattedImages = images.map((it: Image) => ({
      ...it,
      by: name,
    }));
    let featuredImg = hotspot.featuredImg;
    if (!featuredImg?.smUrl) {
      featuredImg = formattedImages?.[0] || null;
    }
    // @ts-ignore
    await Hotspot.updateOne({ locationId }, { featuredImg, $push: { images: { $each: formattedImages } } });
    res.status(200).json({ success: true });
    return;
  } catch (error) {}

  try {
    const score = await verifyRecaptcha(recaptchaToken);
    console.log("Score:", score);
    if (score > 0.5) {
      await Promise.all(
        images.map(async (image: Image) => {
          await Upload.create({
            ...image,
            locationId,
            by: name,
            email,
            countryCode: hotspot.countryCode,
            stateCode: hotspot.stateCode,
          });
        })
      );

      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "noreply.birdinghotspots@gmail.com",
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: '"BirdingHotspots.org" <noreply.birdinghotspots@gmail.com>',
          to: process.env.ADMIN_EMAILS,
          subject: `${images.length} ${images.length === 1 ? "photo" : "photos"} uploaded by ${name} (Review required)`,
          html: `${name} uploaded ${images.length} ${
            images.length === 1 ? "photo" : "photos"
          } to <a href="https://birdinghotspots.org${hotspot.url}" target="_blank">${
            hotspot.name
          }</a><br /><br /><a href="https://birdinghotspots.org/image-review">Review Images</a><br /><br />Reply to this email to contact ${name} directly.<br />Email: ${email}`,
          replyTo: email,
        });
      } catch (error) {}

      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: "You might be a robot" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
