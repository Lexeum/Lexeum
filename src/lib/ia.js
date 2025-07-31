export async function consultaIA(mensaje) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2:free',
      messages: [
        {
          role: 'user',
          content: mensaje
        }
      ]
    })
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('❌ Error al consultar la IA:', result);
    throw new Error(`Error en API externa: ${response.status}`);
  }

  if (!result.choices || !result.choices[0]?.message?.content) {
    console.error('⚠️ Respuesta inesperada:', result);
    throw new Error('Respuesta inválida de la IA');
  }

  return result.choices[0].message.content;
}
