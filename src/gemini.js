const API_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function askGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.error("Gemini error:", data);
    throw new Error(data.error?.message || "Gemini call failed");
  }
  return data.candidates[0].content.parts[0].text;
}