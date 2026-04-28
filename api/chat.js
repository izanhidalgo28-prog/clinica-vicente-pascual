module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, clinicInfo } = req.body;

  const system = `Eres el asistente virtual de Clínica Vicente Pascual, una clínica especializada en Fisioterapia, Osteopatía y Podología ubicada en Av. Alicante nº46, Elche (Alicante).

SERVICIOS:
- Fisioterapia: EPI, Ecografía, Presoterapia, Láser de alta potencia, Neuromodulación, Super Inductivo, Magnetolith, Cámara Hiperbárica, Ondas de Choque, Diatermia
- Osteopatía: técnicas manuales para aliviar dolor y restaurar funciones del organismo
- Podología: Plataforma de presión, Dermatoscopia, Láser, Doppler, Eco-Doppler

INFORMACIÓN:
- Dirección: Av. Alicante, nº46, Elche, Alicante
- Teléfono: 966 20 21 22
- Email: clinica.vicentepascual@gmail.com
- Instalaciones: 11 boxes de fisioterapia, 1 box de podología y gimnasio de readaptación

Responde siempre en español, sé amable y conciso. Máximo 2-3 oraciones. No des diagnósticos médicos. No uses markdown, asteriscos ni formato especial, solo texto plano.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system,
        messages
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message });
    res.status(200).json({ reply: data.content[0].text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
