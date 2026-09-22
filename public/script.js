const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
      alert(data.message);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Não foi possível conectar ao servidor.');
  }
});