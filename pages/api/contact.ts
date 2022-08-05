import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { verifyRecaptcha } from "lib/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { name, email, message, token } = req.body;

    const score = await verifyRecaptcha(token);

    if (score > 0.5) {
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
        subject: `New Message from ${name}`,
        text: message,
        replyTo: email,
      });
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: "Recaptcha failed" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
