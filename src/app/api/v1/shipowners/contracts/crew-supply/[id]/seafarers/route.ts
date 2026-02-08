export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Missing authorization header" },
      { status: 401 }
    );
  }

  try {
    const backendUrl = `https://crew-manning.onrender.com/api/v1/shipowners/contracts/crew-supply/${id}/seafarers`;
    console.log("Fetching seafarers from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("Backend seafarers response:", data);

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error("Seafarers fetch error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch seafarers" },
      { status: 500 }
    );
  }
}
