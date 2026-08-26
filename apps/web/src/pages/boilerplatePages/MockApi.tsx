// For reference only. if not needed remove in router then delete

import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

interface SampleData {
  website: string;
  message: string;
  timestamp: string;
  items: string[];
  address: string[] | React.ReactNode;
  id: number;
  name: string;
  username?: string;
  email: string;
}

// mock data for development
const MOCK_DATA: SampleData = {
  website: 'localhost:3000',
  message: 'Mock Data',
  timestamp: new Date().toISOString(),
  items: ['React', 'TypeScript', 'Vite', 'React Router'],
  address: ['mock street', 'example city'].join(' '),
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

// simulate API delay
const simulateDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// loader function with mock data
export async function MockLoader({ request, params }: LoaderFunctionArgs) {
  console.log('Loader called with:', { request, params });

  // mock data in development
  if (import.meta.env.DEV) {
    console.log('Using mock data for development');

    // simulate network delay
    const delay = Math.random() * 3000 + 500;
    await simulateDelay(delay);

    // simulate errors for testing
    if (Math.random() < 0.1) {
      console.error('Simulating loader error for testing');
      throw new Response('Mock API Error', {
        status: 500,
        statusText: 'Internal Server Error - Mock Data',
      });
    }

    return MOCK_DATA;
  }

  // production API call
  console.log('Using real API for production');
  try {
    // For staging testing. Remove on Prod
    const delay = Math.random() * 3000 + 500;
    await simulateDelay(delay);

    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users/1'
    );

    if (!response.ok) {
      throw new Response('API Error', {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      address: [data.address?.street, data.address?.city]
        .filter(Boolean)
        .join(' '),
      website: data.website,
      message: 'JSONPlaceholder data',
      timestamp: new Date().toISOString(),
      items: ['React', 'TypeScript', 'Vite', 'React Router'],
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw new Response('Network Error', {
      status: 500,
      statusText: 'Failed to fetch data',
    });
  }
}

// Main component
export function MockApi() {
  const data = useLoaderData() as SampleData;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1
        style={{
          marginBottom: '20px',
          color: '#fff3cd',
        }}
      >
        Sample Page with Loader Data
      </h1>

      {/* Environment Badge */}
      <div className="">
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: import.meta.env.DEV ? '#e8f5e8' : '#fff3cd',
            border: `2px solid ${import.meta.env.DEV ? '#4caf50' : '#ffc107'}`,
            borderRadius: '6px',
            marginBottom: '20px',
            marginRight: '20px',
            display: 'inline-block',
            fontWeight: 'bold',
            color: import.meta.env.DEV ? '#2e7d32' : '#856404',
          }}
        >
          {import.meta.env.DEV ? 'DEVELOPMENT MODE' : 'PRODUCTION MODE'}
        </div>

        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          size="lg"
        >
          Reload
        </Button>
      </div>

      {/* Data Display */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ color: '#495057', marginTop: 0 }}>Loader Data:</h2>
        <pre
          style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #dee2e6',
            overflow: 'auto',
            fontSize: '14px',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Structured Data Display */}
      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <div
          style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #bbdefb',
          }}
        >
          <h3 style={{ color: '#1565c0', marginTop: 0 }}>Message</h3>
          <p style={{ fontSize: '16px', margin: 0 }}>{data.message}</p>
        </div>
        <div
          style={{
            backgroundColor: '#c9f3ac',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #d5fbbb',
          }}
        >
          <h3 style={{ color: '#1565c0', marginTop: 0 }}>Website</h3>
          <p style={{ fontSize: '16px', margin: 0 }}>{data.website}</p>
        </div>

        <div
          style={{
            backgroundColor: '#c9f3ac',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #d5fbbb',
          }}
        >
          <h3 style={{ color: '#1565c0', marginTop: 0 }}>Address</h3>
          <p style={{ fontSize: '16px', margin: 0 }}>{data.address}</p>
        </div>

        <div
          style={{
            backgroundColor: '#f3e5f5',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e1bee7',
          }}
        >
          <h3 style={{ color: '#7b1fa2', marginTop: 0 }}>Timestamp</h3>
          <p style={{ fontSize: '14px', margin: 0 }}>
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #c8e6c9',
            gridColumn: '1 / -1',
          }}
        >
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>User Info</h3>
          <div
            style={{
              display: 'grid',
              gap: '10px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            <div>
              <strong>ID:</strong> {data.id}
            </div>
            <div>
              <strong>Name:</strong> {data.name}
            </div>
            <div>
              <strong>Email:</strong> {data.email}
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div
        style={{
          backgroundColor: '#fff3e0',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ffcc80',
          marginTop: '20px',
        }}
      >
        <h3 style={{ color: '#ef6c00', marginTop: 0 }}>Items List</h3>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {data.items.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Debug Info */}
      <details
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Debug Information
        </summary>
        <div
          style={{
            marginTop: '10px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <p>
            <strong>Environment:</strong> {import.meta.env.MODE}
          </p>
          <p>
            <strong>Loader Used:</strong>{' '}
            {import.meta.env.DEV ? 'Mock Data' : 'Real API'}
          </p>
          <p>
            <strong>Data Type:</strong> {typeof data}
          </p>
          <p>
            <strong>Data Keys:</strong> {Object.keys(data).join(', ')}
          </p>
        </div>
      </details>
    </div>
  );
}
