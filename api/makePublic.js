// api/makePublic.js  –  nejjednodušší CommonJS
const axios = require('axios');

const API_KEY = process.env.PUMBLE_API_KEY;
const BASE    = 'https://pumble-api-keys.addons.marketplace.cake.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
  res.setHeader('Allow', ['POST', 'GET']);
  return res.status(405).json({ error: 'Method not allowed' });
  }

  const fileId = req.method === 'GET' ? req.query.fileId : req.body.fileId;
  if (!fileId)      return res.status(400).json({ error: 'fileId required' });
  if (!API_KEY)     return res.status(500).json({ error: 'PUMBLE_API_KEY missing' });

try {
  // Pumble Add-ons API vyžaduje GET + query param
  const { data } = await axios.get(`${BASE}/makeFilePublic`, {
    params: { fileId },
    headers: { 'Api-Key': API_KEY },
  });

  if (!data.publicPath) throw new Error('no publicPath in response');
  return res.json({ publicPath: data.publicPath });

} catch (err) {
  console.error(err.response?.data || err.message);
  return res
    .status(502)
    .json({ error: 'makeFilePublic failed', details: err.response?.data || err.message });
}

