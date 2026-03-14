const form = document.getElementById('qrForm');
const textEl = document.getElementById('text');
const result = document.getElementById('result');
const submitBtn = document.getElementById('btn');

function getApiCandidates() {
  const host = window.location.hostname || 'localhost';
  const candidates = [
    `http://${host}:8080/qrcode`,
    'http://localhost:8080/qrcode',
    'http://127.0.0.1:8080/qrcode'
  ];

  return [...new Set(candidates)];
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const text = textEl.value.trim();
  if (!text) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Gerando...';
  result.innerHTML = '<p>Gerando QR Code...</p>';

  try {
    let lastError;

    for (const apiUrl of getApiCandidates()) {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(`Erro na API (${res.status})`);

        const data = await res.json();
        const url = data.url;
        result.innerHTML = `<img src="${url}" alt="QR Code gerado" /><a href="${url}" target="_blank" rel="noreferrer">Abrir QR Code</a>`;
        return;
      } catch (err) {
        lastError = err;
        if (!(err instanceof TypeError)) {
          throw err;
        }
      }
    }

    throw lastError || new TypeError('Falha de rede');
  } catch (err) {
    console.error(err);
    const message = err instanceof TypeError
      ? 'Falha de conexao com a API (possivel CORS ou backend offline).'
      : err.message;
    result.innerHTML = `<p class="error">${message}</p>`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gerar QR Code';
  }
});
