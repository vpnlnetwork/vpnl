import Anthropic from "@anthropic-ai/sdk";
// If using a .env file, uncomment next 2 lines:
// import dotenv from "dotenv";
// dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function main() {
  const res = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content:
          "One-sentence summary of VPNL (Verifiable Performance Network Layer) for the Open Intents Framework.",
      },
    ],
  });
  console.log(res.content[0].text);
}
main().catch(e => { console.error(e); process.exit(1); });
