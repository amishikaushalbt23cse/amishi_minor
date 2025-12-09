import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_FROM!;


export const twilioClient =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function callInitiator(params: { to: string; sessionId: string }) {
  try {
    if (!twilioClient || !fromNumber) {
      console.warn("[twilio] Not configured; skipping call.");
      return;
    }

    await twilioClient.calls.create({
      from: fromNumber,
      to: params.to,
      twiml: `
        <Response>
          <Say voice="alice">
            Recovery session ${params.sessionId} has started.
            Please open your app to approve the request.
          </Say>
        </Response>
      `,
    });

    console.log(`[twilio] Call initiated to ${params.to}`);
  } catch (err) {
    console.error("Twilio call failed:", err);
  }
}



