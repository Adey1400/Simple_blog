import React from 'react';

const DebugInfo = () => {
  // Only show in development mode
  if (import.meta.env.PROD) return null;

  const envVars = {
    'VITE_APPWRITE_ENDPOINT': import.meta.env.VITE_APPWRITE_ENDPOINT,
    'VITE_APPWRITE_PROJECT_ID': import.meta.env.VITE_APPWRITE_PROJECT_ID,
    'VITE_APPWRITE_DATABASE_ID': import.meta.env.VITE_APPWRITE_DATABASE_ID,
    'VITE_APPWRITE_COLLECTION_ID': import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    'VITE_APPWRITE_BUCKET_ID': import.meta.env.VITE_APPWRITE_BUCKET_ID,
  };

  const hasValidConfig = Object.values(envVars).every(value => 
    value && value !== 'your_project_id_here' && value !== 'your_database_id_here' && 
    value !== 'your_collection_id_here' && value !== 'your_bucket_id_here'
  );

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-sm z-50">
      <h4 className="font-semibold mb-2">🔧 Debug Info (Dev Mode)</h4>
      
      <div className={`mb-2 p-2 rounded ${hasValidConfig ? 'bg-green-700' : 'bg-red-700'}`}>
        <strong>Configuration Status:</strong> {hasValidConfig ? '✅ Valid' : '❌ Invalid'}
      </div>

      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key.replace('VITE_APPWRITE_', '')}:</span>
            <span className={value && !value.includes('your_') ? 'text-green-400' : 'text-red-400'}>
              {value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : 'Missing'}
            </span>
          </div>
        ))}
      </div>

      {!hasValidConfig && (
        <div className="mt-3 p-2 bg-yellow-700 rounded text-xs">
          <strong>⚠️ Setup Required:</strong>
          <br />
          1. Copy .env.example to .env
          <br />
          2. Fill in your Appwrite credentials
          <br />
          3. Restart the dev server
        </div>
      )}
    </div>
  );
};

export default DebugInfo;