const WEB3FORMS_KEY = "c74a1e41-6c48-4510-878f-fdf48b0a6065";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

/**
 * Sends a notification email via Web3Forms — same access key and delivery
 * inbox already configured for the contact/booking forms.
 */
export async function sendBandNotification(fields: Record<string, string>) {
  const response = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      from_name: "Silver Lining Band Website",
      ...fields,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Web3Forms submission failed");
  }
}
