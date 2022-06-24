import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { name, email, message } = req.body;

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
      to: "akjackson1@gmail.com, ken.ostermiller@gmail.com",
      subject: `New Message from ${name}`,
      text: message,
      replyTo: email,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
