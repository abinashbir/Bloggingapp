const starterPosts = [
  { id: 1, topic: 'Culture', date: 'May 24, 2024', title: 'The art of the unhurried morning', excerpt: 'On coffee, quiet rooms, and the small rituals that help a day become your own.', author: 'Mara Fields', color: 'coral' },
  { id: 2, topic: 'Design', date: 'May 18, 2024', title: 'Why everything feels a little too smooth', excerpt: 'A case for texture, friction, and leaving a little room for the hand of the maker.', author: 'Jon Bell', color: 'blue' },
  { id: 3, topic: 'Life', date: 'May 09, 2024', title: 'A field guide to paying attention', excerpt: 'The world is full of signals. Here are a few ways to start noticing them again.', author: 'Anika Shah', color: 'yellow' },
  { id: 4, topic: 'Culture', date: 'Apr 27, 2024', title: 'The long way home', excerpt: 'What we find when we let the journey take a little longer than planned.', author: 'Mara Fields', color: 'green' },
  { id: 5, topic: 'Design', date: 'Apr 19, 2024', title: 'Objects with a point of view', excerpt: 'Some things ask to be used. Others ask to be lived with.', author: 'Rui Costa', color: 'plaid' },
  { id: 6, topic: 'Life', date: 'Apr 10, 2024', title: 'In praise of the imperfect list', excerpt: 'A little less productivity, a little more remembering what matters.', author: 'Anika Shah', color: 'lines' }
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
      <p class="post-excerpt">${post.excerpt}</p>
    </article>
  `).join('');

  emptyState.hidden = visiblePosts.length !== 0;
  document.querySelectorAll('[data-bookmark]').forEach((button) => {
    button.addEventListener('click', () => toggleBookmark(Number(button.dataset.bookmark)));
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

document.querySelector('#compose-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const newPost = {
    id: Date.now(),
    title: data.get('title'),
    author: data.get('author'),
    topic: data.get('topic'),
    excerpt: data.get('excerpt'),
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
  }
});

renderPosts();
