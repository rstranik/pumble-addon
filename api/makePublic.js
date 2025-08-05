// api/makePublic.js  –  nejjednodušší CommonJS
const axios = require('axios');

const API_KEY = process.env.PUMBLE_API_KEY;
const BASE    = 'https://pumble-api-keys.addons.marketplace.cake.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { fileId } = req.body;
  if (!fileId)      return res.status(400).json({ error: 'fileId required' });
  if (!API_KEY)     return res.status(500).json({ error: 'PUMBLE_API_KEY missing' });

  try {
    const { data } = await axios.post(`${BASE}/makeFilePublic`,
      { fileId },
      { headers: { 'Api-Key': API_KEY } }
    );

    if (!data.publicPath) throw new Error('no publicPath in response');
    return res.json({ publicPath: data.publicPath });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(502).json({ error: 'makeFilePublic failed', details: err.response?.data || err.message });
  }
};
