import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

// POST - Upload seafarer documents
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Documents API - Auth header present:", !!authHeader);
    console.log(
      "Documents API - Auth header:",
      authHeader?.substring(0, 30) + "..."
    );

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    console.log("Documents API - FormData keys:", Array.from(formData.keys()));

    // Validate required fields
    const requiredFields = [
      "seaman_book",
      "stcw_basic_safety",
      "psc_lifeboat",
      "coc_or_rating",
      "medical_fitness",
      "sea_service",
    ];

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { detail: `Missing required document: ${field.replace(/_/g, " ")}` },
          { status: 400 }
        );
      }
    }

    console.log("Documents API - Sending to backend...");

    // Forward the form data to the backend
    const response = await fetch(`${API_BASE_URL}/seafarers/documents`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Don't set Content-Type - let fetch set it with boundary for multipart
      },
      body: formData,
    });

    console.log("Documents API - Backend response status:", response.status);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log("Documents API - Backend response text:", text);
      data = { detail: text || `Server error: ${response.status}` };
    }

    console.log("Documents API - Backend response data:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { detail: "Failed to upload documents" },
      { status: 500 }
    );
  }
}

// GET - Fetch seafarer documents (if endpoint exists)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Use AbortController with a 10-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/seafarers/documents`, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { documents: [] };
      }

      if (!response.ok) {
        console.error("Backend returned error:", response.status, data);
        // Return empty array instead of error to prevent redirect
        return NextResponse.json({ documents: [] }, { status: 200 });
      }

      // Validate response structure - check if it's actually documents
      // Documents should have fields like: id, document_type, status, created_at, etc.
      // If we get something else (like user objects with user_id, email, etc.), it's an error
      const isDocumentsArray = Array.isArray(data) && data.length > 0 && 
        (data[0].document_type || data[0].id && data[0].status);
      
      const isDocumentsObject = data && typeof data === 'object' && data.documents && 
        Array.isArray(data.documents);
      
      if (!isDocumentsArray && !isDocumentsObject) {
        // Check if we got user objects instead of documents
        if (Array.isArray(data) && data.length > 0 && data[0].user_id) {
          console.warn("⚠️ Backend /api/v1/seafarers/documents returned user objects instead of documents. This is a backend configuration error.");
          return NextResponse.json({ documents: [] }, { status: 200 });
        }
        // For any other unexpected structure, return empty
        console.warn("Unexpected response structure from backend documents endpoint:", data);
      }

      return NextResponse.json(data);
    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        console.error("Document fetch timeout - backend took too long to respond");
        // Return empty array on timeout instead of error
        return NextResponse.json({ documents: [] }, { status: 200 });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Document fetch error:", error);
    // Return empty array instead of 500 error to prevent redirect
    return NextResponse.json({ documents: [] }, { status: 200 });
  }
}

// PATCH - Update a single document
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const documentId = formData.get("document_id") as string;
    const file = formData.get("file") as File;

    if (!documentId || !file) {
      return NextResponse.json(
        { detail: "Missing document_id or file" },
        { status: 400 }
      );
    }

    console.log("Documents API - Replacing document ID:", documentId);
    console.log("Documents API - Auth header present:", !!authHeader);

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Use the correct backend endpoint: PUT /api/v1/seafarers/documents/{document_id}/replace
    const response = await fetch(
      `${API_BASE_URL}/seafarers/documents/${documentId}/replace`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
        },
        body: backendFormData,
      }
    );

    console.log("Documents API - Backend response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        detail: text || `Server responded with status: ${response.status}`,
      };
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Document update error:", error);
    return NextResponse.json(
      { detail: "Failed to update document" },
      { status: 500 }
    );
  }
}

// PUT - Update document metadata (custom title)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { document_id, custom_title } = body;

    if (!document_id) {
      return NextResponse.json(
        { detail: "Missing document_id" },
        { status: 400 }
      );
    }

    if (!custom_title || typeof custom_title !== "string") {
      return NextResponse.json(
        { detail: "Missing or invalid custom_title" },
        { status: 400 }
      );
    }

    console.log(
      "Documents API - Updating document metadata:",
      document_id,
      custom_title
    );

    const response = await fetch(
      `${API_BASE_URL}/seafarers/documents/${document_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ custom_title }),
      }
    );

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        detail: text || `Server responded with status: ${response.status}`,
      };
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Document metadata update error:", error);
    return NextResponse.json(
      { detail: "Failed to update document metadata" },
      { status: 500 }
    );
  }
}
