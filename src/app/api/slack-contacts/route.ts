import axios from "axios";
import { APP_CONFIGS } from "@/config-global";

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      // get g-recaptcha-response
      const gCaptchaToken = req.headers.get("g-recaptcha-response");
      const config = {
        headers: {
          "g-recaptcha-response": gCaptchaToken,
        },
      };

      const response = await axios.post(APP_CONFIGS.slackApiHook, body, config);
      return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err: any) {
      console.error("Error sending message to Slack:", err);
      return new Response(
        JSON.stringify({
          message: "Failed to send message to Slack",
          error: err.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }
}
