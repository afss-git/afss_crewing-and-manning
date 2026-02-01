import { NextRequest, NextResponse } from 'next/server';

interface DocumentData {
  id: string;
  filename: string;
  doc_type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  size: number;
  url?: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('Documents API - Auth header:', authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Development mocking for CORS issues
    if (process.env.NODE_ENV === 'development') {
      console.log('Documents API - Using development mock data');

      const mockDocuments: DocumentData[] = [
        {
          id: 'doc-1',
          filename: 'company_registration.pdf',
          doc_type: 'Company Registration',
          status: 'approved',
          uploaded_at: new Date().toISOString(),
          size: 2457600, // 2.4MB
          url: '#'
        },
        {
          id: 'doc-2',
          filename: 'imo_certificate.pdf',
          doc_type: 'IMO Certificate',
          status: 'pending',
          uploaded_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          size: 1536000, // 1.5MB
          url: '#'
        },
        {
          id: 'doc-3',
          filename: 'insurance_policy.pdf',
          doc_type: 'Insurance Policy',
          status: 'approved',
          uploaded_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          size: 3788800, // 3.6MB
          url: '#'
        },
        {
          id: 'doc-4',
          filename: 'safety_certificate.pdf',
          doc_type: 'Safety Certificate',
          status: 'rejected',
          uploaded_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          size: 1228800, // 1.2MB
          url: '#'
        }
      ];

      return NextResponse.json(mockDocuments, { status: 200 });
    }

    // Production: Forward to external API
    const externalUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`;
    console.log('Documents API - External URL:', externalUrl);

    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    console.log('Documents API - External response status:', response.status);

    const data = await response.json();
    console.log('Documents API - External response data:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Documents fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
