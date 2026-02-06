import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/seafarers/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Seafarer profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('Seafarer API Route - Auth header:', authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Create FormData from the incoming request
    const formData = await request.formData();
    console.log('Seafarer API Route - Form data keys:', Array.from(formData.keys()));
    
    // Log all FormData contents for debugging
    console.log('Seafarer API Route - FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
    }

    const externalUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seafarers/profile`;
    console.log('Seafarer API Route - External URL:', externalUrl);
    
    // Check if NEXT_PUBLIC_API_URL is set
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('Seafarer API Route - NEXT_PUBLIC_API_URL not set!');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Forward the request to the external API
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData,
    });

    console.log('Seafarer API Route - External response status:', response.status);
    console.log('Seafarer API Route - External response headers:', Object.fromEntries(response.headers));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Seafarer API Route - Non-JSON response:', text);
      return NextResponse.json(
        { error: `External API returned non-JSON response: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Seafarer API Route - External response data:', data);
    
    // Log validation errors in detail
    if (response.status === 422 && Array.isArray(data.detail)) {
      console.log('Seafarer API Route - Validation errors:');
      data.detail.forEach((error: { loc?: string[]; msg: string; type: string }, index: number) => {
        console.log(`  ${index + 1}. Field: ${error.loc?.join('.')}, Error: ${error.msg}, Type: ${error.type}`);
      });
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Seafarer profile creation error:', error);

    // More specific error logging
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('JSON parsing error - likely received HTML/text response instead of JSON');
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
