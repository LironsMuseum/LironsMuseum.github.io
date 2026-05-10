const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const newsletterForm = document.getElementById('newsletterForm');
const formMessage = document.getElementById('formMessage');
const lastUpdate = document.getElementById('lastUpdate');

const currentDateDisplay = document.getElementById('currentDateDisplay');
const availablePostsCount = document.getElementById('availablePostsCount');
const postsContainer = document.getElementById('postsContainer');

const scheduledPosts = [
  {
    title: 'Registro 01 — A porta de serviço que continuava destrancada',
    releaseDate: '2026-05-14',
    excerpt: 'Um relatório tardio sugere que uma entrada secundária do Museu do Liron permaneceu acessível mesmo após o fechamento oficial.',
    content: `
      <p>Em documentos comparados por pesquisadores independentes, a porta de serviço localizada na ala oeste do museu aparece como “lacrada” em um registro e “acessível para manutenção” em outro, ambos datados do mesmo período.</p>
      <p>Isso levanta a hipótese de que parte da estrutura continuou sendo usada depois de 1985, mesmo sem funcionamento público. O detalhe mais incomum é a menção a circulação noturna vinculada ao palco do show animado.</p>
    `
  },
  {
    title: 'Registro 02 — O roteiro perdido da última apresentação',
    releaseDate: '2026-06-02',
    excerpt: 'Um programa incompleto pode indicar que o último espetáculo exibido ao público não foi igual ao roteiro oficial preservado.',
    content: `
      <p>Trechos do que parece ser um roteiro alternativo foram encontrados em um arquivo particular. Nele, há cenas que não constam no programa distribuído aos visitantes, incluindo uma sequência chamada “A vigília do salão central”.</p>
      <p>Testemunhas descreveram uma apresentação final mais longa e silenciosa, com pausas que não seguiam o padrão conhecido. Ainda não foi possível confirmar se esse material era oficial ou experimental.</p>
    `
  },
  {
    title: 'Registro 03 — Os olhos dos personagens',
    releaseDate: '2026-07-18',
    excerpt: 'Anotações técnicas fazem referência a ajustes oculares e resposta à presença, algo incomum para a época.',
    content: `
      <p>Uma folha de manutenção parcialmente preservada cita expressões como “foco ocular”, “rastreamento de movimento” e “resposta a presença”, sugerindo um nível de sofisticação raro para sistemas expositivos do período.</p>
      <p>Se autêntico, o documento pode ajudar a explicar por que tantos visitantes afirmavam que os personagens pareciam observá-los diretamente durante o show.</p>
    `
  }
];

function formatDateLong(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function renderScheduledPosts() {
  if (!postsContainer) return;

  const today = normalizeDate(new Date());
  const formattedToday = today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (currentDateDisplay) {
    currentDateDisplay.textContent = formattedToday;
  }

  let availableCount = 0;

  const postsHTML = scheduledPosts.map(post => {
    const release = new Date(`${post.releaseDate}T00:00:00`);
    const isAvailable = today >= normalizeDate(release);

    if (isAvailable) {
      availableCount++;
    }

    return `
      <article class="scheduled-post">
        <div class="scheduled-post-header">
          <div>
            <p class="post-date">Liberação programada: ${formatDateLong(post.releaseDate)}</p>
            <h3>${post.title}</h3>
          </div>
          <span class="post-badge ${isAvailable ? 'available' : 'locked'}">
            ${isAvailable ? 'Disponível' : 'Bloqueado'}
          </span>
        </div>

        <p class="post-excerpt">${post.excerpt}</p>

        ${
          isAvailable
            ? `<div class="post-content">${post.content}</div>`
            : `
              <div class="locked-overlay">
                <p class="post-release">
                  Este registro ainda não foi liberado ao público.
                  Publicação automática em <strong>${formatDateLong(post.releaseDate)}</strong>.
                </p>
              </div>
            `
        }
      </article>
    `;
  }).join('');

  postsContainer.innerHTML = postsHTML;

  if (availablePostsCount) {
    availablePostsCount.textContent = String(availableCount);
  }
}

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!email) {
      formMessage.textContent = 'Por favor, informe um e-mail válido.';
      return;
    }

    formMessage.textContent = 'Cadastro realizado. Você será avisado sobre novas descobertas.';
    newsletterForm.reset();
  });
}

if (lastUpdate) {
  const now = new Date();
  const formatted = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  lastUpdate.textContent = formatted;
}

renderScheduledPosts();
