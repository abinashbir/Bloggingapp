const starterPosts = [
  { id: 1, topic: 'Culture', date: 'May 24, 2024', title: 'The art of the unhurried morning', excerpt: 'On coffee, quiet rooms, and the small rituals that help a day become your own.', author: 'Mara Fields', color: 'coral', body: ['Before the day asks anything of us, there is a small window of possibility. The kettle begins to hum. Light finds the edge of the table. For a few minutes, the morning belongs entirely to itself.', 'An unhurried morning is not about having more time. It is about giving the first few minutes a little more attention. A cup becomes a cup, not fuel. The window becomes a view, not a backdrop.', 'These small rituals are not rules. They are invitations: move slowly enough to notice that you have arrived.'] },
  { id: 2, topic: 'Design', date: 'May 18, 2024', title: 'Why everything feels a little too smooth', excerpt: 'A case for texture, friction, and leaving a little room for the hand of the maker.', author: 'Jon Bell', color: 'blue', body: ['We have become very good at removing resistance. Doors open automatically, interfaces predict our next move, and products arrive polished until they feel almost weightless.', 'But a little friction gives an object a point of view. The uneven glaze on a mug, the click of a stubborn switch, the slight wobble of a handmade chair: these details remind us that something was made, not merely generated.', 'Good design does not always disappear. Sometimes it stays long enough to be felt.'] },
  { id: 3, topic: 'Life', date: 'May 09, 2024', title: 'A field guide to paying attention', excerpt: 'The world is full of signals. Here are a few ways to start noticing them again.', author: 'Anika Shah', color: 'yellow', body: ['Attention is a form of generosity. When we pay attention, we tell a place, a person, or an ordinary moment that it is worth receiving fully.', 'Start with one sense. Notice the warm patch of sun on the floor, the sound of a bus turning the corner, or the particular green of a tree after rain. Description is a way back into the world.', 'The goal is not to notice everything. It is to notice enough that the day feels inhabited.'] },
  { id: 4, topic: 'Culture', date: 'Apr 27, 2024', title: 'The long way home', excerpt: 'What we find when we let the journey take a little longer than planned.', author: 'Mara Fields', color: 'green', body: ['There is a road home that takes twelve minutes, and another that takes forty. The longer road passes the bakery, the old cinema, and a row of gardens that are always changing.', 'We tend to call the longer route inefficient. But a journey can have more than one purpose. Sometimes getting there is only half the point.', 'Take the long way when you can. A familiar place has many versions, and they are usually waiting just one turn away.'] },
  { id: 5, topic: 'Design', date: 'Apr 19, 2024', title: 'Objects with a point of view', excerpt: 'Some things ask to be used. Others ask to be lived with.', author: 'Rui Costa', color: 'plaid', body: ['The best objects do not simply solve a problem. They quietly change the shape of the room around them. A lamp can make a corner feel generous. A well-weighted pen can make a sentence feel possible.', 'We live among decisions made by other people. Material, proportion, color, and sound all speak before we do.', 'To choose an object is to choose a small companion. Choose the ones with enough character to keep surprising you.'] },
  { id: 6, topic: 'Life', date: 'Apr 10, 2024', title: 'In praise of the imperfect list', excerpt: 'A little less productivity, a little more remembering what matters.', author: 'Anika Shah', color: 'lines', body: ['Some lists are built to conquer the day. Others are softer: call Mum, buy lemons, look up at the moon. They do not measure output so much as they hold a place for what we do not want to forget.', 'An imperfect list leaves room for the unexpected. It does not turn every hour into a task or make rest feel like a failure to perform.', 'Write down three things that would make today feel like yours. Let the rest remain unwritten.'] }
];

const savedPosts = JSON.parse(localStorage.getItem('field-notes-posts') || '[]');
const posts = [...savedPosts, ...starterPosts];
const savedBookmarks = JSON.parse(localStorage.getItem('field-notes-bookmarks') || '[]');
let activeFilter = 'All';
let searchTerm = '';

const postGrid = document.querySelector('#post-grid');
const emptyState = document.querySelector('#empty-state');

function renderPosts() {
  const visiblePosts = posts.filter((post) => {
    const matchesFilter = activeFilter === 'All' || post.topic === activeFilter;
    const haystack = `${post.title} ${post.excerpt} ${post.topic} ${post.author}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm.toLowerCase());
  });

  postGrid.innerHTML = visiblePosts.map((post, index) => `
    <article class="post-card" style="animation-delay: ${index * 60}ms">
      <div class="post-image ${post.color || 'coral'}">
        <span class="post-number">${String(index + 1).padStart(2, '0')}</span>
        <button class="bookmark ${savedBookmarks.includes(post.id) ? 'saved' : ''}" type="button" data-bookmark="${post.id}" aria-label="${savedBookmarks.includes(post.id) ? 'Remove bookmark' : 'Bookmark'} ${post.title}">${savedBookmarks.includes(post.id) ? '♥' : '♡'}</button>
      </div>
      <div class="post-meta"><span>${post.topic}</span><span>${post.date}</span></div>
      <h3>${post.title}</h3>
      <p class="post-author">By ${post.author}</p>
      <p class="post-excerpt">${post.excerpt}</p>
      <button class="read-button" type="button" data-read="${post.id}">Read note <span>↗</span></button>
    </article>
  `).join('');

  emptyState.hidden = visiblePosts.length !== 0;
  document.querySelectorAll('[data-bookmark]').forEach((button) => {
    button.addEventListener('click', () => toggleBookmark(Number(button.dataset.bookmark)));
  });
  document.querySelectorAll('[data-read]').forEach((button) => {
    button.addEventListener('click', () => openReader(Number(button.dataset.read)));
  });
}

function toggleBookmark(id) {
  const index = savedBookmarks.indexOf(id);
  if (index === -1) savedBookmarks.push(id);
  else savedBookmarks.splice(index, 1);
  localStorage.setItem('field-notes-bookmarks', JSON.stringify(savedBookmarks));
  renderPosts();
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.toggle('active', item === button));
    renderPosts();
  });
});

const searchPanel = document.querySelector('#search-panel');
const searchInput = document.querySelector('#search-input');
function closeSearch() {
  searchPanel.classList.remove('open');
  searchPanel.setAttribute('aria-hidden', 'true');
}
document.querySelector('.search-toggle').addEventListener('click', () => {
  searchPanel.classList.add('open');
  searchPanel.setAttribute('aria-hidden', 'false');
  searchInput.focus();
});
document.querySelector('.search-panel .close-button').addEventListener('click', closeSearch);
searchPanel.addEventListener('click', (event) => { if (event.target === searchPanel) closeSearch(); });
searchInput.addEventListener('input', (event) => {
  searchTerm = event.target.value;
  renderPosts();
});

const composeModal = document.querySelector('#compose-modal');
function closeCompose() {
  composeModal.classList.remove('open');
  composeModal.setAttribute('aria-hidden', 'true');
}
document.querySelector('.compose-trigger').addEventListener('click', () => {
  composeModal.classList.add('open');
  composeModal.setAttribute('aria-hidden', 'false');
  document.querySelector('#post-title').focus();
});
document.querySelector('#compose-close').addEventListener('click', closeCompose);
composeModal.addEventListener('click', (event) => { if (event.target === composeModal) closeCompose(); });

const readerModal = document.querySelector('#reader-modal');
function closeReader() {
  readerModal.classList.remove('open');
  readerModal.setAttribute('aria-hidden', 'true');
}
function openReader(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;
  document.querySelector('#reader-topic').textContent = `${post.topic} · ${post.date}`;
  document.querySelector('#reader-title').textContent = post.title;
  document.querySelector('#reader-byline').textContent = `By ${post.author}`;
  document.querySelector('#reader-body').innerHTML = (post.body || [post.excerpt]).map((paragraph) => `<p>${paragraph}</p>`).join('');
  readerModal.classList.add('open');
  readerModal.setAttribute('aria-hidden', 'false');
}
document.querySelector('#reader-close').addEventListener('click', closeReader);
readerModal.addEventListener('click', (event) => { if (event.target === readerModal) closeReader(); });

document.querySelector('#compose-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const newPost = {
    id: Date.now(),
    title: data.get('title'),
    author: data.get('author'),
    topic: data.get('topic'),
    excerpt: data.get('excerpt'),
    body: data.get('body').split('\n').filter(p => p.trim() !== ''),
    date: 'Just now',
    color: 'green'
  };
  posts.unshift(newPost);
  savedPosts.unshift(newPost);
  localStorage.setItem('field-notes-posts', JSON.stringify(savedPosts));
  activeFilter = 'All';
  document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('active', button.dataset.filter === 'All'));
  event.currentTarget.reset();
  closeCompose();
  renderPosts();
  document.querySelector('#latest').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#newsletter-message');
  message.textContent = 'You are on the list. See you soon.';
  event.currentTarget.reset();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSearch();
    closeCompose();
    closeReader();
  }
});

renderPosts();
