// api/proxy.js
export default async function handler(request, response) {
  const targetUrl = request.query.url;

  if (!targetUrl) {
    return response.status(400).json({ error: 'De "url" query parameter is verplicht.' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers['content-type'] || 'application/json',
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });
    
    // Antwoord van de externe API terugsturen
    response.status(apiResponse.status);
    const data = await apiResponse.text();
    response.send(data);

  } catch (error) {
    console.error('Proxy Fout:', error);
    response.status(500).json({ error: 'Fout bij het doorsturen van het verzoek.' });
  }
}
