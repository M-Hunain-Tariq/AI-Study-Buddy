/**
 * StudyBuddy - Pure Vanilla JavaScript
 * Complete interactive features: Typewriter, Steps, Goals, Modals, Mascot speech
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Step Selection (How It Works)
  const stepCards = document.querySelectorAll('.step-card');
  const dashBannerTitle = document.querySelector('.dash-banner-title');
  const dashBannerSub = document.querySelector('.dash-banner-sub');

  const stepDetails = {
    1: {
      title: "Goal Selected: Ace Biology Final 🎯",
      subtitle: "Personalized syllabus generated • 4 Modules assigned"
    },
    2: {
      title: "AI Study Mode: Active Tutoring 🤖",
      subtitle: "Smart flashcards & quiz checkpoints ready"
    },
    3: {
      title: "Progress Tracked: 94% Mastery 🚀",
      subtitle: "Study streak: 7 Days • Harvard Prep on track!"
    }
  };

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const stepNum = card.getAttribute('data-step');
      if (stepDetails[stepNum] && dashBannerTitle && dashBannerSub) {
        dashBannerTitle.textContent = stepDetails[stepNum].title;
        dashBannerSub.textContent = stepDetails[stepNum].subtitle;
      }
    });
  });

  // 2. Interactive Goals Checklist
  const goalItems = document.querySelectorAll('.goal-item');
  const goalCounter = document.getElementById('goal-counter');

  function updateGoalCounter() {
    const total = goalItems.length;
    const completed = document.querySelectorAll('.goal-item.done').length;
    if (goalCounter) {
      goalCounter.textContent = `${completed}/${total} completed`;
    }
  }

  goalItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');
      const checkIcon = item.querySelector('.goal-check-icon');
      if (item.classList.contains('done')) {
        item.style.textDecoration = 'line-through';
        item.style.opacity = '0.6';
        if (checkIcon) checkIcon.style.display = 'block';
      } else {
        item.style.textDecoration = 'none';
        item.style.opacity = '1';
        if (checkIcon) checkIcon.style.display = 'none';
      }
      updateGoalCounter();
    });
  });

  // 3. Typewriter Animation & AI Q&A Workspace
  const topicAnswers = {
    "Explain the difference between HTML and CSS?": "HTML is used to structure the content of a webpage, while CSS is used to style and design it. HTML tells the browser what to show, and CSS tells it how to show it.",
    "How does Photosynthesis work?": "Photosynthesis is the process where green plants convert sunlight, water, and carbon dioxide into oxygen and energy-rich glucose sugar.",
    "What is the Pythagorean Theorem?": "In a right triangle, the square of the hypotenuse (c) is equal to the sum of the squares of the other two sides (a and b): a² + b² = c²."
  };

  const aiTextOutput = document.getElementById('ai-text-output');
  const userQueryBubble = document.getElementById('user-query-bubble');
  const topicChips = document.querySelectorAll('.topic-chip');
  const chatInput = document.getElementById('chat-input');
  const chatForm = document.getElementById('chat-form');
  const replayBtn = document.getElementById('replay-ai-btn');
  const copyBtn = document.getElementById('copy-ai-btn');

  let currentQuery = "Explain the difference between HTML and CSS?";
  let typingTimer = null;

  function typeText(text) {
    if (!aiTextOutput) return;
    clearInterval(typingTimer);
    aiTextOutput.textContent = '';
    let index = 0;
    typingTimer = setInterval(() => {
      if (index < text.length) {
        aiTextOutput.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(typingTimer);
      }
    }, 18);
  }

  function handleQueryChange(query) {
    currentQuery = query;
    if (userQueryBubble) userQueryBubble.textContent = query;
    const answer = topicAnswers[query] || `Here is a personalized AI study breakdown for "${query}". Step-by-step concepts, key formulas, and practice flashcards are ready!`;
    typeText(answer);
  }

  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const query = chip.getAttribute('data-query');
      handleQueryChange(query);
    });
  });

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      handleQueryChange(val);
      chatInput.value = '';
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const answer = topicAnswers[currentQuery] || "Here is your personalized AI explanation!";
      typeText(answer);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!aiTextOutput) return;
      navigator.clipboard.writeText(aiTextOutput.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span style="color:#38bdf8;font-size:0.75rem;">Copied! ✓</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  // Initial Typewriter Run
  handleQueryChange(currentQuery);

  // 4. Mascot Speech Interactive Toasts
  const mascotBubble = document.getElementById('mascot-speech-bubble');
  const peekingRobot = document.getElementById('peeking-robot');

  const mascotPhrases = [
    "Ready to master your next exam? Let's go! 🚀",
    "Did you know? Consistent 20-min daily study boosts retention by 80%! 💡",
    "Cell Biology quiz scheduled for today at 4 PM! ⏰",
    "You are doing awesome! 7-day study streak! 🔥"
  ];

  function showMascotMessage(targetElement) {
    const randomPhrase = mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)];
    if (targetElement) {
      targetElement.textContent = randomPhrase;
      targetElement.style.transform = "scale(1.08)";
      setTimeout(() => {
        targetElement.style.transform = "scale(1)";
      }, 300);
    }
  }

  if (mascotBubble) {
    mascotBubble.addEventListener('click', () => showMascotMessage(mascotBubble));
  }
  if (peekingRobot) {
    const peekingBubble = peekingRobot.querySelector('.peeking-bubble');
    peekingRobot.addEventListener('click', () => showMascotMessage(peekingBubble));
  }

  // 5. Auth Modal (Sign In / Start Free)
  const authModal = document.getElementById('auth-modal');
  const openAuthBtns = document.querySelectorAll('.open-auth-btn');
  const closeAuthBtn = document.getElementById('close-auth-modal');
  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  const authSubmitBtn = document.getElementById('auth-submit-btn');

  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (authModal) authModal.classList.add('open');
    });
  });

  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => {
      if (authModal) authModal.classList.remove('open');
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('open');
    });
  }

  authTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-tab');
      if (authSubmitBtn) {
        authSubmitBtn.textContent = mode === 'signup' ? 'Create Free Account' : 'Sign In';
      }
    });
  });

  // 6. 3-File Source Code Viewer Modal
  const codeModal = document.getElementById('code-modal');
  const openCodeBtn = document.getElementById('open-code-modal');
  const closeCodeBtn = document.getElementById('close-code-modal');
  const codeTabBtns = document.querySelectorAll('.code-tab-btn');
  const codePre = document.getElementById('code-display-pre');
  const copyActiveCodeBtn = document.getElementById('copy-active-code-btn');

  let activeCodeTab = 'html';
  let cachedFiles = {
    html: 'Loading index.html...',
    css: 'Loading style.css...',
    js: 'Loading script.js...'
  };

  // Preload file contents for viewer. Note: fetch() only works when these
  // files are served over http(s) (e.g. `npx serve`) — opening index.html
  // directly via file:// blocks these requests, so we fall back gracefully.
  const fileFetchFailedMsg = "Preview unavailable: this viewer needs the files served over http(s).\nRun a local server (e.g. `npx serve .`) and open this page from that URL to see the source here.";

  function loadFile(name, key) {
    fetch(name)
      .then(r => r.text())
      .then(t => { cachedFiles[key] = t; })
      .catch(() => { cachedFiles[key] = fileFetchFailedMsg; })
      .finally(() => {
        if (activeCodeTab === key) updateCodeDisplay();
      });
  }

  loadFile('index.html', 'html');
  loadFile('style.css', 'css');
  loadFile('script.js', 'js');

  function updateCodeDisplay() {
    if (codePre) {
      codePre.textContent = cachedFiles[activeCodeTab] || 'Code unavailable';
    }
  }

  if (openCodeBtn) {
    openCodeBtn.addEventListener('click', () => {
      if (codeModal) codeModal.classList.add('open');
      updateCodeDisplay();
    });
  }

  if (closeCodeBtn) {
    closeCodeBtn.addEventListener('click', () => {
      if (codeModal) codeModal.classList.remove('open');
    });
  }

  if (codeModal) {
    codeModal.addEventListener('click', (e) => {
      if (e.target === codeModal) codeModal.classList.remove('open');
    });
  }

  codeTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCodeTab = tab.getAttribute('data-file');
      updateCodeDisplay();
    });
  });

  if (copyActiveCodeBtn) {
    copyActiveCodeBtn.addEventListener('click', () => {
      if (!codePre) return;
      navigator.clipboard.writeText(codePre.textContent).then(() => {
        copyActiveCodeBtn.textContent = 'Copied to Clipboard! ✓';
        setTimeout(() => {
          copyActiveCodeBtn.textContent = 'Copy Current File';
        }, 2000);
      });
    });
  }
});
