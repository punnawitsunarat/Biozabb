// BioZabb Flashcards Application Logic
document.addEventListener('DOMContentLoaded', () => {
  // LocalStorage for Custom User Cards
  let userCards = [];
  try {
    const savedCards = localStorage.getItem('biozabb_user_cards');
    if (savedCards) userCards = JSON.parse(savedCards);
  } catch (e) {
    console.warn('LocalStorage error (user cards):', e);
  }

  // LocalStorage for Deleted Card IDs (Can delete ANY card)
  let deletedIds = new Set();
  try {
    const savedDel = localStorage.getItem('biozabb_deleted_card_ids');
    if (savedDel) deletedIds = new Set(JSON.parse(savedDel));
  } catch (e) {
    console.warn('LocalStorage error (deleted cards):', e);
  }

  // LocalStorage for Starred / Bookmarked cards
  let starredIds = new Set();
  try {
    const savedStars = localStorage.getItem('biozabb_starred_cards');
    if (savedStars) starredIds = new Set(JSON.parse(savedStars));
  } catch (e) {
    console.warn('LocalStorage error (starred cards):', e);
  }

  // Function to get active list of cards (excluding deleted cards)
  function getCombinedCards() {
    return [...FLASHCARDS_DATA, ...userCards].filter(c => !deletedIds.has(c.id));
  }

  // State
  let allCards = getCombinedCards();
  let currentCards = [...allCards];
  let currentIndex = 0;
  let isFlipped = false;
  let activeFilter = 'all';
  let searchQuery = '';
  let viewMode = 'flashcard'; // 'flashcard' or 'list'
  let ttsRate = 1.0;
  let isSpeaking = false;

  // DOM Elements - Flashcard View
  const flashcardEl = document.getElementById('main-flashcard');
  const cardPerspectiveEl = document.getElementById('card-perspective');
  const frontQuestionEl = document.getElementById('card-question-text');
  const backAnswerEl = document.getElementById('card-answer-text');
  const frontBadgeEl = document.getElementById('front-badge');
  const frontNumEl = document.getElementById('front-card-number');
  const backNumEl = document.getElementById('back-card-number');
  const frontStarBtn = document.getElementById('front-star-btn');
  const backStarBtn = document.getElementById('back-star-btn');
  const frontDelBtn = document.getElementById('front-del-btn');
  const backDelBtn = document.getElementById('back-del-btn');
  const ttsBtn = document.getElementById('tts-btn');
  const keywordTagsEl = document.getElementById('keyword-tags');

  // Controls & Action Elements
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const flipBtn = document.getElementById('flip-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const resetBtn = document.getElementById('reset-btn');
  const restoreBtn = document.getElementById('restore-btn');
  const deletedCountBadge = document.getElementById('deleted-count');
  const progressText = document.getElementById('progress-text');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const starCountBadge = document.getElementById('star-count-badge');
  const totalCountBadge = document.getElementById('total-count-badge');
  const generalCountBadge = document.getElementById('general-count-badge');
  const indepthCountBadge = document.getElementById('indepth-count-badge');

  // Containers
  const flashcardArena = document.getElementById('flashcard-arena');
  const listViewContainer = document.getElementById('list-view-container');
  const listColumnsWrapper = document.getElementById('list-columns-wrapper');
  const listCountInfo = document.getElementById('list-count-info');
  const expandAllBtn = document.getElementById('expand-all-btn');
  const collapseAllBtn = document.getElementById('collapse-all-btn');
  const emptyState = document.getElementById('empty-state');

  // Add Question Modal Elements
  const addCardBtn = document.getElementById('add-card-btn');
  const addCardModal = document.getElementById('add-card-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const addCardForm = document.getElementById('add-card-form');
  const inputQuestion = document.getElementById('input-question');
  const inputAnswer = document.getElementById('input-answer');
  const inputKeywords = document.getElementById('input-keywords');
  const toastMsg = document.getElementById('toast-msg');

  // Mode Switch Tabs
  const modeFlashcardBtn = document.getElementById('mode-flashcard-btn');
  const modeListBtn = document.getElementById('mode-list-btn');

  // Category Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');

  // TTS Speed Selector Buttons
  const ttsSpeedBtns = document.querySelectorAll('.tts-speed-btn');

  // Speech Synthesis setup
  const synth = window.speechSynthesis;
  let englishVoice = null;

  function loadVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    englishVoice = voices.find(v => v.lang === 'en-US' && !v.name.includes('Compact')) ||
                   voices.find(v => v.lang.startsWith('en')) ||
                   null;
  }

  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  // Toast Notification helper
  let toastTimer = null;
  function showToast(msg) {
    if (!toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2800);
  }

  // Modal Open & Close
  function openAddModal() {
    const modal = document.getElementById('add-card-modal');
    if (!modal) return;
    const form = document.getElementById('add-card-form');
    if (form) form.reset();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const qInput = document.getElementById('input-question');
      if (qInput) qInput.focus();
    }, 80);
  }
  window.openAddModal = openAddModal;

  function closeAddModal() {
    const modal = document.getElementById('add-card-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  window.closeAddModal = closeAddModal;

  // Highlight key terms in answers
  function formatAnswerWithHighlights(text, keywords) {
    if (!keywords || keywords.length === 0) return escapeHtml(text);
    let escaped = escapeHtml(text);
    keywords.forEach(kw => {
      try {
        const escapedKw = escapeHtml(kw).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reg = new RegExp(`(${escapedKw})`, 'gi');
        escaped = escaped.replace(reg, '<strong>$1</strong>');
      } catch (e) {}
    });
    return escaped;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Update Counters on Badges
  function updateBadgeCounts() {
    if (totalCountBadge) totalCountBadge.textContent = allCards.length;
    if (generalCountBadge) generalCountBadge.textContent = allCards.filter(c => c.category === 'general').length;
    if (indepthCountBadge) indepthCountBadge.textContent = allCards.filter(c => c.category === 'indepth').length;
    if (starCountBadge) starCountBadge.textContent = starredIds.size;

    // Restore Button Visibility
    if (restoreBtn) {
      if (deletedIds.size > 0) {
        restoreBtn.style.display = 'inline-flex';
        if (deletedCountBadge) deletedCountBadge.textContent = deletedIds.size;
      } else {
        restoreBtn.style.display = 'none';
      }
    }
  }

  function saveStarred() {
    try {
      localStorage.setItem('biozabb_starred_cards', JSON.stringify([...starredIds]));
    } catch (e) {}
    updateBadgeCounts();
  }

  // Delete ANY card
  function deleteCard(id) {
    const target = allCards.find(c => c.id === id);
    const qText = target ? target.question : `ข้อ #${id}`;
    if (!confirm(`ต้องการลบคำถาม:\n"${qText}"\nใช่หรือไม่?`)) {
      return;
    }

    deletedIds.add(id);
    try {
      localStorage.setItem('biozabb_deleted_card_ids', JSON.stringify([...deletedIds]));
    } catch (e) {}

    // If custom, also remove from userCards
    userCards = userCards.filter(c => c.id !== id);
    try {
      localStorage.setItem('biozabb_user_cards', JSON.stringify(userCards));
    } catch (e) {}

    starredIds.delete(id);
    saveStarred();

    allCards = getCombinedCards();
    updateBadgeCounts();

    if (currentIndex >= allCards.length) {
      currentIndex = Math.max(0, allCards.length - 1);
    }

    applyFilterAndSearch();
    showToast('🗑️ ลบคำถามเรียบร้อย');
  }
  window.deleteCard = deleteCard;

  // Restore All Deleted Cards
  function restoreAllCards() {
    if (deletedIds.size === 0) {
      showToast('ไม่มีคำถามที่ถูกลบ');
      return;
    }
    if (confirm(`ต้องการกู้คืนคำถามที่เคยลบไปทั้งหมด (${deletedIds.size} ข้อ) ใช่หรือไม่?`)) {
      deletedIds.clear();
      try {
        localStorage.removeItem('biozabb_deleted_card_ids');
      } catch (e) {}
      allCards = getCombinedCards();
      updateBadgeCounts();
      applyFilterAndSearch();
      showToast('✅ กู้คืนคำถามทั้งหมดเรียบร้อย!');
    }
  }
  window.restoreAllCards = restoreAllCards;

  // Filter and Search
  function applyFilterAndSearch() {
    let list = [...allCards];

    // Filter
    if (activeFilter === 'general') {
      list = list.filter(c => c.category === 'general');
    } else if (activeFilter === 'indepth') {
      list = list.filter(c => c.category === 'indepth');
    } else if (activeFilter === 'starred') {
      list = list.filter(c => starredIds.has(c.id));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.question.toLowerCase().includes(q) ||
        c.answer.toLowerCase().includes(q) ||
        (c.keywords && c.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    currentCards = list;
    if (currentIndex >= currentCards.length) {
      currentIndex = 0;
    }

    renderCurrentView();
  }

  // Render Flashcard
  function renderFlashcard() {
    stopTTS();
    isFlipped = false;
    flashcardEl.classList.remove('is-flipped');

    if (currentCards.length === 0) {
      flashcardArena.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    flashcardArena.style.display = 'flex';
    emptyState.style.display = 'none';

    const card = currentCards[currentIndex];

    // Question front
    frontQuestionEl.textContent = card.question;
    frontNumEl.textContent = `#${card.id} (${currentIndex + 1}/${currentCards.length})`;
    backNumEl.textContent = `#${card.id} (${currentIndex + 1}/${currentCards.length})`;

    // Category Badge (Identical clean style for all cards)
    frontBadgeEl.className = 'badge-tag ' + card.category;
    frontBadgeEl.innerHTML = (card.category === 'general' ? '🌿 ' : '🔬 ') + card.categoryName;

    // Star State
    const isStarred = starredIds.has(card.id);
    [frontStarBtn, backStarBtn].forEach(btn => {
      if (btn) {
        btn.classList.toggle('is-starred', isStarred);
        btn.setAttribute('title', isStarred ? 'เลิกติดดาว' : 'ติดดาวเพื่อทบทวน');
      }
    });

    // Answer back
    backAnswerEl.innerHTML = formatAnswerWithHighlights(card.answer, card.keywords);

    // Keywords Tags
    keywordTagsEl.innerHTML = '';
    if (card.keywords && card.keywords.length > 0) {
      card.keywords.forEach(kw => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = kw;
        keywordTagsEl.appendChild(chip);
      });
    }

    // Progress Bar
    const percent = Math.round(((currentIndex + 1) / currentCards.length) * 100);
    progressBarFill.style.width = `${percent}%`;
    progressText.textContent = `ข้อที่ ${currentIndex + 1} จาก ${currentCards.length} (${percent}%)`;

    // Navigation buttons state
    prevBtn.disabled = currentCards.length <= 1;
    nextBtn.disabled = currentCards.length <= 1;
  }

  // Create individual sleek horizontal list row (identical style, delete button on all)
  function createListRowItem(card) {
    const isStarred = starredIds.has(card.id);
    const item = document.createElement('div');
    item.className = 'list-row-item';
    item.dataset.id = card.id;

    item.innerHTML = `
      <div class="list-row-header">
        <div class="list-row-left">
          <span class="list-row-id">#${card.id}</span>
          <span class="list-row-q">${escapeHtml(card.question)}</span>
        </div>
        <div class="list-row-right">
          <button class="btn-icon star-btn ${isStarred ? 'is-starred' : ''}" data-id="${card.id}" title="ติดดาว" style="width:28px; height:28px; font-size:0.85rem;">
            ★
          </button>
          <button class="btn-icon del-row-btn" data-id="${card.id}" title="ลบคำถามข้อนี้" style="width:28px; height:28px; font-size:0.8rem; color:#f87171;">
            🗑️
          </button>
          <span class="list-chevron">▼</span>
        </div>
      </div>
      <div class="list-row-body">
        <div class="list-row-ans">${formatAnswerWithHighlights(card.answer, card.keywords)}</div>
        <div class="list-row-actions">
          <span>👆 คลิกที่แถบเพื่อพับเก็บ</span>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button class="btn-small list-del-btn" data-id="${card.id}" style="color:#f87171; border-color:rgba(239,68,68,0.3); font-size:0.75rem;">
              🗑️ ลบข้อนี้
            </button>
            <button class="btn-small list-tts-btn" data-id="${card.id}" style="font-size:0.78rem;">
              🔊 ฟังเสียงอ่าน
            </button>
          </div>
        </div>
      </div>
    `;

    // Click header to expand/collapse (except clicking star or delete)
    const header = item.querySelector('.list-row-header');
    header.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      item.classList.toggle('is-expanded');
    });

    // Star in list item
    const starBtn = item.querySelector('.star-btn');
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStar(card.id);
      starBtn.classList.toggle('is-starred', starredIds.has(card.id));
      if (activeFilter === 'starred') applyFilterAndSearch();
    });

    // TTS in list item
    const listTtsBtn = item.querySelector('.list-tts-btn');
    listTtsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speakText(card.answer, listTtsBtn);
    });

    // Delete buttons (both row header trash icon and expanded body delete button)
    const delBtns = item.querySelectorAll('.del-row-btn, .list-del-btn');
    delBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCard(card.id);
      });
    });

    return item;
  }

  // Render List View (2-Column Layout matching user sketch)
  function renderListView() {
    listColumnsWrapper.innerHTML = '';

    if (currentCards.length === 0) {
      listViewContainer.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    listViewContainer.style.display = 'flex';
    emptyState.style.display = 'none';

    if (listCountInfo) {
      listCountInfo.textContent = `แสดงทั้งหมด ${currentCards.length} ข้อ`;
    }

    // Two-Column Layout Strategy:
    // If viewing all and not searching: Left = General, Right = Indepth
    if (activeFilter === 'all' && !searchQuery.trim()) {
      const colLeft = document.createElement('div');
      colLeft.className = 'list-column';

      const leftHeader = document.createElement('div');
      leftHeader.className = 'column-header general';
      const generalCards = currentCards.filter(c => c.category === 'general');
      leftHeader.innerHTML = `<span>🌿 หมวดคำถามทั่วไป</span><span class="col-badge">${generalCards.length} ข้อ</span>`;
      colLeft.appendChild(leftHeader);

      generalCards.forEach(card => {
        colLeft.appendChild(createListRowItem(card));
      });

      const colRight = document.createElement('div');
      colRight.className = 'list-column';

      const rightHeader = document.createElement('div');
      rightHeader.className = 'column-header indepth';
      const indepthCards = currentCards.filter(c => c.category === 'indepth');
      rightHeader.innerHTML = `<span>🔬 หมวดคำถามเจาะลึก</span><span class="col-badge">${indepthCards.length} ข้อ</span>`;
      colRight.appendChild(rightHeader);

      indepthCards.forEach(card => {
        colRight.appendChild(createListRowItem(card));
      });

      listColumnsWrapper.appendChild(colLeft);
      listColumnsWrapper.appendChild(colRight);
    } else {
      // Split evenly into 2 columns
      const colLeft = document.createElement('div');
      colLeft.className = 'list-column';
      const colRight = document.createElement('div');
      colRight.className = 'list-column';

      const mid = Math.ceil(currentCards.length / 2);
      const leftItems = currentCards.slice(0, mid);
      const rightItems = currentCards.slice(mid);

      leftItems.forEach(card => {
        colLeft.appendChild(createListRowItem(card));
      });
      rightItems.forEach(card => {
        colRight.appendChild(createListRowItem(card));
      });

      listColumnsWrapper.appendChild(colLeft);
      listColumnsWrapper.appendChild(colRight);
    }
  }

  function renderCurrentView() {
    if (viewMode === 'flashcard') {
      listViewContainer.style.display = 'none';
      renderFlashcard();
    } else {
      flashcardArena.style.display = 'none';
      renderListView();
    }
  }

  function flipCurrentCard() {
    if (currentCards.length === 0) return;
    isFlipped = !isFlipped;
    flashcardEl.classList.toggle('is-flipped', isFlipped);
  }

  function nextCard() {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentCards.length;
    renderFlashcard();
  }

  function prevCard() {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
    renderFlashcard();
  }

  function shuffleCards() {
    for (let i = currentCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
    }
    currentIndex = 0;
    renderCurrentView();
  }

  function resetOrder() {
    applyFilterAndSearch();
  }

  function toggleStar(id) {
    if (starredIds.has(id)) {
      starredIds.delete(id);
    } else {
      starredIds.add(id);
    }
    saveStarred();
    if (viewMode === 'flashcard') {
      const isStarred = starredIds.has(id);
      [frontStarBtn, backStarBtn].forEach(b => {
        if (b) b.classList.toggle('is-starred', isStarred);
      });
      if (activeFilter === 'starred') applyFilterAndSearch();
    }
  }

  function stopTTS() {
    if (synth && synth.speaking) {
      synth.cancel();
    }
    isSpeaking = false;
    if (ttsBtn) ttsBtn.classList.remove('is-speaking');
    document.querySelectorAll('.list-tts-btn').forEach(b => b.classList.remove('is-speaking'));
  }

  function speakText(rawText, triggeringBtn) {
    if (!synth) {
      alert('เบราว์เซอร์นี้ไม่รองรับ Web Speech API');
      return;
    }
    if (synth.speaking) {
      stopTTS();
      return;
    }

    const cleanText = rawText.replace(/[•\-\–]/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = ttsRate;
    if (englishVoice) utterance.voice = englishVoice;

    if (triggeringBtn) triggeringBtn.classList.add('is-speaking');
    isSpeaking = true;

    utterance.onend = () => {
      isSpeaking = false;
      if (triggeringBtn) triggeringBtn.classList.remove('is-speaking');
    };
    utterance.onerror = () => {
      isSpeaking = false;
      if (triggeringBtn) triggeringBtn.classList.remove('is-speaking');
    };

    synth.speak(utterance);
  }

  // --- Event Listeners ---
  cardPerspectiveEl.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    flipCurrentCard();
  });

  flipBtn.addEventListener('click', flipCurrentCard);
  nextBtn.addEventListener('click', nextCard);
  prevBtn.addEventListener('click', prevCard);
  shuffleBtn.addEventListener('click', shuffleCards);
  resetBtn.addEventListener('click', resetOrder);

  // Star buttons in Flashcard
  [frontStarBtn, backStarBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCards.length > 0) {
          toggleStar(currentCards[currentIndex].id);
        }
      });
    }
  });

  // Delete buttons in Flashcard
  [frontDelBtn, backDelBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCards.length > 0) {
          deleteCard(currentCards[currentIndex].id);
        }
      });
    }
  });

  // Flashcard TTS button
  ttsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCards.length > 0) {
      speakText(currentCards[currentIndex].answer, ttsBtn);
    }
  });

  // TTS Speed Selector
  ttsSpeedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ttsSpeedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ttsRate = parseFloat(btn.dataset.speed || '1.0');
    });
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      currentIndex = 0;
      applyFilterAndSearch();
    });
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    searchClearBtn.style.display = searchQuery ? 'block' : 'none';
    currentIndex = 0;
    applyFilterAndSearch();
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    currentIndex = 0;
    applyFilterAndSearch();
  });

  // View Mode Switcher
  modeFlashcardBtn.addEventListener('click', () => {
    viewMode = 'flashcard';
    modeFlashcardBtn.classList.add('active');
    modeListBtn.classList.remove('active');
    renderCurrentView();
  });

  modeListBtn.addEventListener('click', () => {
    viewMode = 'list';
    modeListBtn.classList.add('active');
    modeFlashcardBtn.classList.remove('active');
    renderCurrentView();
  });

  // Expand / Collapse All in List View
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.list-row-item').forEach(item => {
        item.classList.add('is-expanded');
      });
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      document.querySelectorAll('.list-row-item').forEach(item => {
        item.classList.remove('is-expanded');
      });
    });
  }

  // --- Add Question Modal Event Listeners ---
  if (addCardBtn) {
    addCardBtn.addEventListener('click', openAddModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeAddModal);
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', closeAddModal);
  }

  if (addCardModal) {
    addCardModal.addEventListener('click', (e) => {
      if (e.target === addCardModal) closeAddModal();
    });
  }

  if (addCardForm) {
    addCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const catInput = addCardForm.querySelector('input[name="card-category"]:checked');
      const categoryVal = catInput ? catInput.value : 'general';
      const qVal = inputQuestion ? inputQuestion.value.trim() : '';
      const aVal = inputAnswer ? inputAnswer.value.trim() : '';
      const kwsRaw = inputKeywords ? inputKeywords.value.trim() : '';

      if (!qVal || !aVal) {
        alert('กรุณากรอกคำถามและคำตอบให้ครบถ้วน');
        return;
      }

      const kws = kwsRaw ? kwsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      const allKnownIds = [...FLASHCARDS_DATA.map(c => c.id), ...userCards.map(c => c.id)];
      const maxId = allKnownIds.length > 0 ? Math.max(...allKnownIds) : 0;
      const nextId = maxId + 1;

      const newCard = {
        id: nextId,
        category: categoryVal,
        categoryName: categoryVal === 'general' ? 'คำถามทั่วไป' : 'คำถามเจาะลึก',
        question: qVal,
        answer: aVal,
        keywords: kws
      };

      userCards.push(newCard);
      try {
        localStorage.setItem('biozabb_user_cards', JSON.stringify(userCards));
      } catch (err) {}

      allCards = getCombinedCards();
      closeAddModal();
      showToast('✅ เพิ่มคำถามสำเร็จ!');

      updateBadgeCounts();

      // If viewing another category, switch to the added card's category or all
      if (activeFilter !== 'all' && activeFilter !== categoryVal) {
        activeFilter = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      }

      applyFilterAndSearch();

      // Navigate directly to the new card
      if (viewMode === 'flashcard') {
        const newIdx = currentCards.findIndex(c => c.id === nextId);
        if (newIdx !== -1) {
          currentIndex = newIdx;
          renderFlashcard();
        }
      } else {
        setTimeout(() => {
          const itemEl = document.querySelector(`.list-row-item[data-id="${nextId}"]`);
          if (itemEl) {
            itemEl.classList.add('is-expanded');
            itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // If modal is open, Escape closes it
    const modalEl = document.getElementById('add-card-modal');
    if (modalEl && modalEl.style.display === 'flex') {
      if (e.code === 'Escape') {
        e.preventDefault();
        closeAddModal();
      }
      return;
    }

    if (document.activeElement === searchInput) return;

    if (e.code === 'Space') {
      e.preventDefault();
      flipCurrentCard();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      nextCard();
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      prevCard();
    } else if (e.code === 'KeyS') {
      e.preventDefault();
      shuffleCards();
    } else if (e.code === 'KeyB') {
      e.preventDefault();
      if (currentCards.length > 0) {
        toggleStar(currentCards[currentIndex].id);
      }
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      if (currentCards.length > 0) {
        speakText(currentCards[currentIndex].answer, ttsBtn);
      }
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;
  cardPerspectiveEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  cardPerspectiveEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (diff < -50) {
      nextCard();
    } else if (diff > 50) {
      prevCard();
    }
  }, { passive: true });

  // Init
  updateBadgeCounts();
  applyFilterAndSearch();
});
