import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { name, email, message, token } = req.body;

    const projectId = "birding-262815";
    const API_key = process.env.NEXT_PUBLIC_GOOGLE_KEY;

    const verifyResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${API_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            token,
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
            expectedAction: "submit",
          },
        }),
      }
    );

    const verifyData = await verifyResponse.json();
    const score = verifyData?.riskAnalysis?.score || 0;

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
