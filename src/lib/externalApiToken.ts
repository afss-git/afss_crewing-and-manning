/**
 * Get Bearer token by authenticating with external API credentials.
 * Called only when an authenticated admin requests data.
 */
export async function getExternalApiToken(): Promise<string> {
  const apiBaseUrl = process.env.EXTERNAL_API_BASE_URL;
  const apiEmail = process.env.EXTERNAL_API_EMAIL;
  const apiPassword = process.env.EXTERNAL_API_PASSWORD;

  if (!apiBaseUrl || !apiEmail || !apiPassword) {
    throw new Error(
      "External API credentials not configured. Set EXTERNAL_API_BASE_URL, EXTERNAL_API_EMAIL, and EXTERNAL_API_PASSWORD in .env"
    );
  }

  try {
    console.log("🔑 Fetching token from external API...");

    const formData = new URLSearchParams();
    formData.append("email", apiEmail);
    formData.append("password", apiPassword);

    const response = await fetch(
      `${apiBaseUrl}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `External API auth failed: ${response.status} - ${error}`
      );
    }

    const data = await response.json();
    const { access_token } = data;

    if (!access_token) {
      throw new Error("No access token returned from external API");
    }

    console.log("✅ Got external API token");
    return access_token;
  } catch (error) {
    console.error("❌ Failed to get external API token:", error);
    throw error;
  }
}
