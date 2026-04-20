// ========== ЖАС ДЕҢГЕЙІ ==========
let userAgeLevel = localStorage.getItem('userAgeLevel') || null;
let userName = localStorage.getItem('userName') || null;

function showRegistration() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) registerModal.style.display = 'flex';
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const ageLevel = document.querySelector('input[name="ageLevel"]:checked').value;
        
        if (name) {
            userName = name;
            userAgeLevel = ageLevel;
            localStorage.setItem('userName', userName);
            localStorage.setItem('userAgeLevel', userAgeLevel);
            localStorage.setItem('isRegistered', 'true');
            
            document.body.classList.remove('age-3-4', 'age-5-6', 'age-7-8');
            document.body.classList.add(`age-${ageLevel.replace('-', '-')}`);
            
            updateProfileDisplay();
            document.getElementById('registerModal').style.display = 'none';
            
            let ageText = ageLevel === '3-4' ? '🐣 3-4 жас (Кішкентай)' : 
                         (ageLevel === '5-6' ? '🐥 5-6 жас (Орташа)' : '🦊 7-8 жас (Үлкен)');
            alert(`🎉 Қош келдің, ${name}! ${ageText} деңгейі таңдалды. Ойындар сенің жасыңа сай!`);
        }
    });
}

function checkRegistration() {
    const isRegistered = localStorage.getItem('isRegistered');
    if (!isRegistered) showRegistration();
}

const showRegisterBtn = document.getElementById('showRegisterBtn');
if (showRegisterBtn) showRegisterBtn.addEventListener('click', showRegistration);

function getDifficultyLevel() {
    switch(userAgeLevel) {
        case '3-4': return 'easy';
        case '5-6': return 'medium';
        case '7-8': return 'hard';
        default: return 'easy';
    }
}

// ========== ДЫБЫС ==========
let soundEnabled = true;
function playSound(type) {
    if (!soundEnabled) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        if (type === 'click') {
            oscillator.frequency.value = 523.25;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'win') {
            oscillator.frequency.value = 659.25;
            gainNode.gain.value = 0.15;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    } catch(e) { console.log('Дыбыс қатесі:', e); }
}

const soundBtn = document.createElement('button');
soundBtn.className = 'sound-toggle';
soundBtn.innerHTML = '🔊';
soundBtn.onclick = () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
    playSound('click');
};
document.body.appendChild(soundBtn);

// ========== ҰПАЙЛАР ==========
let userScore = parseInt(localStorage.getItem('userScore') || '0');
let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');

function updateScore(points) {
    userScore += points;
    gamesPlayed++;
    localStorage.setItem('userScore', userScore);
    localStorage.setItem('gamesPlayed', gamesPlayed);
    updateProfileDisplay();
    updateProgressBar();
    playSound('win');
}

function updateProfileDisplay() {
    const scoreSpan = document.getElementById('profileScore');
    const gamesSpan = document.getElementById('gamesPlayed');
    const totalScoreSpan = document.getElementById('totalScore');
    const userNameSpan = document.getElementById('userNameDisplay');
    const userAgeSpan = document.getElementById('userAgeDisplay');
    const welcomeMsg = document.getElementById('welcomeMessage');
    
    if (scoreSpan) scoreSpan.innerText = userScore;
    if (gamesSpan) gamesSpan.innerText = gamesPlayed;
    if (totalScoreSpan) totalScoreSpan.innerText = userScore;
    if (userNameSpan) userNameSpan.innerText = userName || 'Қонақ';
    
    if (userAgeSpan) {
        let ageText = userAgeLevel === '3-4' ? '🐣 3-4 жас' : 
                     (userAgeLevel === '5-6' ? '🐥 5-6 жас' : 
                     (userAgeLevel === '7-8' ? '🦊 7-8 жас' : 'Тіркелмеген'));
        userAgeSpan.innerText = ageText;
    }
    
    if (welcomeMsg && userName) {
        let ageText = userAgeLevel === '3-4' ? 'кішкентай' : 
                     (userAgeLevel === '5-6' ? 'орташа' : 'үлкен');
        welcomeMsg.innerHTML = `Сәлем, ${userName}! 🎉 Сенің деңгейің - ${ageText}. Ойындар саған сай!`;
    }
}

function updateProgressBar() {
    const maxScore = 500;
    let percent = Math.min((userScore / maxScore) * 100, 100);
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = percent + '%';
}

let lastVisit = localStorage.getItem('lastVisit');
if (!lastVisit) {
    lastVisit = new Date().toLocaleDateString();
    localStorage.setItem('lastVisit', lastVisit);
}
const lastVisitSpan = document.getElementById('lastVisit');
if (lastVisitSpan) lastVisitSpan.innerText = lastVisit;

function changeAvatar(src) {
    localStorage.setItem('userAvatar', src);
    document.getElementById('avatarImg').src = src;
    playSound('click');
}

let savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar) document.getElementById('avatarImg').src = savedAvatar;

function resetProfile() {
    if (confirm('Барлық ұпайларды қалпына келтіргің келе ме?')) {
        userScore = 0;
        gamesPlayed = 0;
        localStorage.setItem('userScore', userScore);
        localStorage.setItem('gamesPlayed', gamesPlayed);
        updateProfileDisplay();
        updateProgressBar();
        playSound('click');
        alert('Профиль қалпына келтірілді!');
    }
}

// ========== КҮННІҢ ФАКТІСІ ==========
const facts = [
    "🐘 Пілдер сусыз 4 күнге дейін жүре алады!",
    "🐧 Пингвиндер тізелерімен емес, аяқтарымен жүреді!",
    "🦒 Керіктердің тілі 45 см ұзындықта!",
    "🐬 Дельфиндер ұйықтағанда көздерін жұмбайды!",
    "🦋 Көбелектер аяқтарымен дәм татады!"
];
const factText = document.getElementById('factText');
if (factText) factText.innerText = facts[Math.floor(Math.random() * facts.length)];

// ========== SPA НАВИГАЦИЯ ==========
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active-page');
        if (page.id === pageId) page.classList.add('active-page');
    });
    window.location.hash = pageId;
    localStorage.setItem('currentPage', pageId);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        showPage(pageId);
        closeMobileMenu();
        playSound('click');
    });
});

let startPage = localStorage.getItem('currentPage') || 'home';
if (window.location.hash) {
    let hash = window.location.hash.substring(1);
    if ([...pages].some(p => p.id === hash)) startPage = hash;
}
showPage(startPage);

// ========== МОБИЛЬДІ МӘЗІР ==========
const burgerToggle = document.getElementById('burger-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    if (burgerToggle) burgerToggle.checked = false;
}

if (burgerToggle) {
    burgerToggle.addEventListener('change', () => {
        if (burgerToggle.checked) {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
        } else {
            closeMobileMenu();
        }
    });
    if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);
}

// ========== СЛАЙДЕР ==========
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.slider-dots');
const autoCheckbox = document.getElementById('autoSlideCheckbox');

let currentSlide = 0;
let slideInterval;
const totalSlides = slides.length;

function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    updateDots();
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        if (i === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    if (slider) slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
}

function nextSlide() { goToSlide(currentSlide + 1); resetAutoSlide(); }
function prevSlide() { goToSlide(currentSlide - 1); resetAutoSlide(); }

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => nextSlide(), 3000);
}
function stopAutoSlide() { if (slideInterval) clearInterval(slideInterval); }
function resetAutoSlide() { if (autoCheckbox?.checked) { stopAutoSlide(); startAutoSlide(); } }

autoCheckbox?.addEventListener('change', (e) => {
    if (e.target.checked) startAutoSlide();
    else stopAutoSlide();
});

nextBtn?.addEventListener('click', () => { nextSlide(); playSound('click'); });
prevBtn?.addEventListener('click', () => { prevSlide(); playSound('click'); });
if (slider && slides.length > 0) {
    createDots();
    goToSlide(0);
}

// ========== ТҮНГІ РЕЖИМ ==========
const darkToggle = document.getElementById('darkModeToggle');
const mobileDarkBtn = document.getElementById('mobileDarkBtn');

function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
        if (darkToggle) darkToggle.innerHTML = '☀️';
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
        if (darkToggle) darkToggle.innerHTML = '🌙';
    }
}

function toggleDark() {
    setDarkMode(!document.body.classList.contains('dark'));
    playSound('click');
}

if (localStorage.getItem('darkMode') === 'enabled') setDarkMode(true);
darkToggle?.addEventListener('click', toggleDark);
mobileDarkBtn?.addEventListener('click', toggleDark);

// ========== ОЙЫНДАР ==========
const gameArea = document.getElementById('gameArea');

// 1. ВИКТОРИНА
function startQuiz() {
    let questions = [];
    const level = getDifficultyLevel();
    
    if (level === 'easy') {
        questions = [
            { q: "🐶 Ит қалай үреді?", a: "Ар-ар", options: ["Мияу", "Ар-ар", "И-и", "Ко-ко"] },
            { q: "🐱 Мысық қалай дауыстайды?", a: "Мияу", options: ["Ар-ар", "Мияу", "Му-му", "Бе-бе"] },
            { q: "🐮 Сиыр қалай дауыстайды?", a: "Му-му", options: ["Мияу", "Ар-ар", "Му-му", "Пи-пи"] }
        ];
    } else if (level === 'medium') {
        questions = [
            { q: "Қай жануардың мойны ең ұзын?", a: "Керік", options: ["Піл", "Керік", "Арыстан"] },
            { q: "Панда не жейді?", a: "Бамбук", options: ["Балық", "Бамбук", "Шөп"] },
            { q: "Қай жануар орман патшасы?", a: "Арыстан", options: ["Жолбарыс", "Арыстан", "Қасқыр"] }
        ];
    } else {
        questions = [
            { q: "Қай жануардың жасырынған кезде түсі өзгереді?", a: "Хамелеон", options: ["Кесіртке", "Хамелеон", "Жылан"] },
            { q: "Қай жануар ең ұзақ ұйықтайды?", a: "Коала", options: ["Арыстан", "Піл", "Коала"] },
            { q: "Қай жануардың 3 жүрегі бар?", a: "Сегізаяқ", options: ["Акула", "Сегізаяқ", "Кит"] }
        ];
    }
    
    let score = 0;
    let qIndex = 0;
    const quizDiv = document.getElementById('quizInner');
    
    function showQuestion() {
        if (qIndex >= questions.length) {
            let totalScore = score * 10;
            updateScore(totalScore);
            quizDiv.innerHTML = `<h2>🎉 Викторина аяқталды!</h2><p>Сен ${score}/${questions.length} дұрыс жауап бердің!</p><p>+${totalScore} ұпай!</p><button class="btn-fun" onclick="document.getElementById('quizModal').style.display='none'">Жабу</button>`;
            return;
        }
        let q = questions[qIndex];
        let html = `<h3>${q.q}</h3>`;
        q.options.forEach(opt => {
            html += `<button class="quiz-option" onclick="checkAnswer('${opt}')">${opt}</button>`;
        });
        quizDiv.innerHTML = html;
    }
    
    window.checkAnswer = (answer) => {
        if (answer === questions[qIndex].a) {
            score++;
            playSound('win');
            alert("✅ Дұрыс! Жарайсың!");
        } else {
            playSound('click');
            alert(`❌ Дұрыс емес. Дұрыс жауап: ${questions[qIndex].a}`);
        }
        qIndex++;
        showQuestion();
    };
    
    const quizModal = document.getElementById('quizModal');
    quizModal.style.display = 'flex';
    document.querySelector('.close-quiz').onclick = () => quizModal.style.display = 'none';
    showQuestion();
}

// 2. ЖҰП ТАП
function startMemory() {
    let emojis;
    const level = getDifficultyLevel();
    
    if (level === 'easy') emojis = ['🐶', '🐱', '🐭'];
    else if (level === 'medium') emojis = ['🐶', '🐱', '🐭', '🐹', '🐰'];
    else emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻'];
    
    let cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);
    let opened = [], matched = [];
    let moves = 0;
    let canFlip = true;
    
    function renderMemory() {
        let html = '<h3>🐾 Жұп тап ойыны 🐾</h3><div style="display:flex;flex-wrap:wrap;justify-content:center;max-width:500px;margin:0 auto;">';
        cards.forEach((card, i) => {
            if (matched.includes(i)) {
                html += `<div class="memory-card" style="background:#4ade80;">✅</div>`;
            } else if (opened.includes(i)) {
                html += `<div class="memory-card" style="background:#f59e0b;">${card}</div>`;
            } else {
                html += `<div class="memory-card" onclick="flipCard(${i})">❓</div>`;
            }
        });
        html += '</div><p>Қадамдар: ' + moves + '</p><button class="game-btn" onclick="startMemory()">🔄 Қайта бастау</button>';
        if (gameArea) gameArea.innerHTML = html;
    }
    
    window.flipCard = (idx) => {
        if (!canFlip) return;
        if (opened.length === 2 || opened.includes(idx) || matched.includes(idx)) return;
        playSound('click');
        opened.push(idx);
        if (opened.length === 2) {
            canFlip = false;
            moves++;
            let [i1, i2] = opened;
            if (cards[i1] === cards[i2]) {
                matched.push(i1, i2);
                opened = [];
                canFlip = true;
                renderMemory();
                if (matched.length === cards.length) {
                    let points = Math.max(50 - moves * 2, 10);
                    updateScore(points);
                    alert(`🎉 Жеңіс! +${points} ұпай!`);
                }
            } else {
                setTimeout(() => {
                    opened = [];
                    canFlip = true;
                    renderMemory();
                }, 700);
                renderMemory();
            }
        } else {
            renderMemory();
        }
    };
    renderMemory();
}

// 3. ТҮСТЕР ОЙЫНЫ
function startColorGame() {
    let colors, colorCodes;
    const level = getDifficultyLevel();
    
    if (level === 'easy') {
        colors = ['Қызыл', 'Көк', 'Жасыл'];
        colorCodes = { 'Қызыл': '#ff4444', 'Көк': '#4444ff', 'Жасыл': '#44ff44' };
    } else if (level === 'medium') {
        colors = ['Қызыл', 'Көк', 'Жасыл', 'Сары'];
        colorCodes = { 'Қызыл': '#ff4444', 'Көк': '#4444ff', 'Жасыл': '#44ff44', 'Сары': '#ffff44' };
    } else {
        colors = ['Қызыл', 'Көк', 'Жасыл', 'Сары', 'Қызғылт', 'Күлгін'];
        colorCodes = { 'Қызыл': '#ff4444', 'Көк': '#4444ff', 'Жасыл': '#44ff44', 'Сары': '#ffff44', 'Қызғылт': '#ff88ff', 'Күлгін': '#aa44ff' };
    }
    
    let remainingColors = [...colors];
    for (let i = remainingColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingColors[i], remainingColors[j]] = [remainingColors[j], remainingColors[i]];
    }
    
    let currentColorIndex = 0;
    let currentColor = remainingColors[currentColorIndex];
    let score = 0;
    let questionCount = 0;
    let targetQuestions = remainingColors.length;
    const isHardLevel = (level === 'hard');
    
    function renderColorGame() {
        let html = `<h3>🎨 Қай түс дұрыс? 🎨</h3>`;
        html += `<div style="width:200px;height:200px;background:${colorCodes[currentColor]};margin:1rem auto;border-radius:20px;box-shadow:0 4px 15px rgba(0,0,0,0.2);border:3px solid white;"></div>`;
        html += `<p style="font-size:1.2rem; margin-bottom:1rem;">👆 Жоғарыдағы түс қалай аталады?</p>`;
        html += `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:15px; margin-bottom:20px;">`;
        
        if (isHardLevel) {
            colors.forEach(c => {
                html += `<button class="color-name-btn-hard" onclick="checkColor('${c}')">${c}</button>`;
            });
        } else {
            colors.forEach(c => {
                html += `<button class="color-name-btn" onclick="checkColor('${c}')" style="background:${colorCodes[c]}; color:white; padding:12px 20px; border:none; border-radius:50px; font-size:1.2rem; font-weight:bold; cursor:pointer;">${c}</button>`;
            });
        }
        
        html += `</div>`;
        html += `<p>🏆 Ұпай: ${score}</p>`;
        html += `<p>📊 Сұрақ: ${questionCount+1}/${targetQuestions}</p>`;
        html += `<p>✨ Қалған түстер: ${targetQuestions - questionCount}</p>`;
        html += `<button class="game-btn" onclick="startColorGame()">🔄 Жаңа ойын</button>`;
        if (gameArea) gameArea.innerHTML = html;
    }
    
    window.checkColor = (selected) => {
        if (selected === currentColor) {
            score += 10;
            questionCount++;
            playSound('win');
            alert(`✅ Дұрыс! +10 ұпай! (${questionCount}/${targetQuestions})`);
            
            if (questionCount >= targetQuestions) {
                updateScore(score);
                alert(`🎉 Ойын аяқталды! Барлық түстерді таптың! Жалпы ұпай: ${score}`);
                startColorGame();
            } else {
                currentColorIndex++;
                currentColor = remainingColors[currentColorIndex];
                renderColorGame();
            }
        } else {
            playSound('click');
            alert(`❌ Қате! Бұл ${selected} емес. Қайтадан көріп көр!`);
        }
    };
    renderColorGame();
}

// 4. DRAG & DROP
function startDragDrop() {
    let animals;
    const level = getDifficultyLevel();
    
    if (level === 'easy') {
        animals = [
            { name: 'Ит', emoji: '🐶', animalImg: 'images/it.jpg', homeName: 'Иттің үйі', homeImg: 'images/it_home.jpg' },
            { name: 'Мысық', emoji: '🐱', animalImg: 'images/mysyk.jpg', homeName: 'Мысықтың үйі', homeImg: 'images/mysyk_home.jpg' }
        ];
    } else if (level === 'medium') {
        animals = [
            { name: 'Пингвин', emoji: '🐧', animalImg: 'https://cdn.pixabay.com/photo/2013/07/18/20/26/dolphin-164875_640.jpg', homeName: 'Мұзды аймақ', homeImg: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/antarctica-1850000_640.jpg' },
            { name: 'Піл', emoji: '🐘', animalImg: 'https://cdn.pixabay.com/photo/2016/03/04/19/36/elephant-1236426_640.jpg', homeName: 'Саванна', homeImg: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/giraffe-2083514_640.jpg' }
        ];
    } else {
        animals = [
            { name: 'Пингвин', emoji: '🐧', animalImg: 'https://cdn.pixabay.com/photo/2013/07/18/20/26/dolphin-164875_640.jpg', homeName: '❄️ Мұзды аймақ', homeImg: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/antarctica-1850000_640.jpg' },
            { name: 'Піл', emoji: '🐘', animalImg: 'https://cdn.pixabay.com/photo/2016/03/04/19/36/elephant-1236426_640.jpg', homeName: '🌿 Саванна', homeImg: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/giraffe-2083514_640.jpg' },
            { name: 'Дельфин', emoji: '🐬', animalImg: 'https://cdn.pixabay.com/photo/2013/07/18/20/26/dolphin-164875_640.jpg', homeName: '🌊 Мұхит', homeImg: 'https://cdn.pixabay.com/photo/2016/01/09/18/27/ocean-1131650_640.jpg' }
        ];
    }
    
    let placedCount = 0;
    const totalAnimals = animals.length;
    let gameCompleted = false;
    
    let html = '<h3>🐾 Жануарларды үйіне апар 🐾</h3>';
    html += '<p style="font-size:0.9rem; margin-bottom:1rem;">👇 Жануарды тінтуірмен басып тұрып, өз үйіне апарыңыз!</p>';
    html += '<div class="drag-container"><div class="drag-items">';
    
    animals.forEach(animal => {
        html += `<div class="drag-item" draggable="true" data-animal-name="${animal.name}" data-home-name="${animal.homeName}" style="background:#f59e0b; border-radius:15px; padding:10px; text-align:center; width:120px; cursor:grab;">`;
        html += `<img src="${animal.animalImg}" alt="${animal.name}" style="width:80px; height:80px; object-fit:cover; border-radius:15px;" onerror="this.src='https://cdn.pixabay.com/photo/2015/07/09/19/32/dog-838281_640.jpg'"><br>`;
        html += `<span style="font-size:0.9rem; font-weight:bold;">${animal.emoji} ${animal.name}</span>`;
        html += `</div>`;
    });
    
    html += '</div><div class="drop-zones" style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; margin-top:1rem;">';
    
    animals.forEach(animal => {
        html += `<div class="drop-zone" data-home-name="${animal.homeName}" data-expected-name="${animal.name}" style="background:rgba(255,255,255,0.3); border:3px dashed #f59e0b; border-radius:20px; width:140px; padding:10px; text-align:center; transition:0.2s;">`;
        html += `<img src="${animal.homeImg}" alt="${animal.homeName}" style="width:80px; height:80px; object-fit:cover; border-radius:15px;" onerror="this.src='https://cdn.pixabay.com/photo/2019/08/19/07/45/corgi-4415649_640.jpg'"><br>`;
        html += `<span style="font-size:0.8rem;">🏠 ${animal.homeName}</span>`;
        html += `</div>`;
    });
    
    html += '</div></div>';
    html += '<button class="game-btn" onclick="startDragDrop()" style="margin-top:1rem;">🔄 Қайта бастау</button>';
    if (gameArea) gameArea.innerHTML = html;
    
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                animalName: item.getAttribute('data-animal-name'),
                homeName: item.getAttribute('data-home-name')
            }));
            item.style.opacity = '0.5';
        });
        item.addEventListener('dragend', (e) => {
            item.style.opacity = '1';
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(245, 158, 11, 0.5)';
            zone.style.transform = 'scale(1.05)';
        });
        zone.addEventListener('dragleave', () => {
            zone.style.background = 'rgba(255, 255, 255, 0.3)';
            zone.style.transform = 'scale(1)';
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.background = 'rgba(255, 255, 255, 0.3)';
            zone.style.transform = 'scale(1)';
            
            if (gameCompleted) {
                alert('🎉 Ойын аяқталды! Қайта бастау үшін "Қайта бастау" батырмасын басыңыз!');
                return;
            }
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const expectedAnimalName = zone.getAttribute('data-expected-name');
            const expectedHomeName = zone.getAttribute('data-home-name');
            
            if (zone.classList.contains('correct')) {
                playSound('click');
                alert(`⚠️ Бұл үйге ${data.animalName} уже орналасқан!`);
                return;
            }
            
            if (data.animalName === expectedAnimalName && data.homeName === expectedHomeName) {
                const dragItem = document.querySelector(`.drag-item[data-animal-name="${data.animalName}"]`);
                if (dragItem) dragItem.style.display = 'none';
                
                zone.classList.add('correct');
                zone.style.background = '#4ade80';
                zone.style.border = '3px solid #22c55e';
                placedCount++;
                playSound('win');
                alert(`✅ Дұрыс! ${data.animalName} өз үйіне келді! (${placedCount}/${totalAnimals})`);
                
                if (placedCount === totalAnimals) {
                    gameCompleted = true;
                    let points = level === 'easy' ? 30 : (level === 'medium' ? 40 : 50);
                    updateScore(points);
                    alert(`🎉 Тамаша! Барлық жануарлар үйінде! +${points} ұпай!`);
                    const gameAreaDiv = document.getElementById('gameArea');
                    if (gameAreaDiv) {
                        let finishMsg = document.createElement('p');
                        finishMsg.style.cssText = 'color: green; margin-top: 1rem; font-size: 1.2rem; font-weight: bold;';
                        finishMsg.innerHTML = '🎉 Ойын аяқталды! 🎉';
                        gameAreaDiv.appendChild(finishMsg);
                    }
                }
            } else {
                playSound('click');
                alert(`❌ Қате! ${data.animalName} бұл жерде тұрмайды. Дұрыс үйін тап!`);
            }
        });
    });
}

// 5. МАТЕМАТИКА
function startMathGame() {
    let score = 0;
    let questionCount = 0;
    const level = getDifficultyLevel();
    let maxNum = level === 'easy' ? 10 : (level === 'medium' ? 20 : 30);
    let targetQuestions = level === 'easy' ? 5 : (level === 'medium' ? 8 : 10);
    
    function generateQuestion() {
        const num1 = Math.floor(Math.random() * maxNum) + 1;
        const num2 = Math.floor(Math.random() * maxNum) + 1;
        let op, answer;
        
        if (level === 'easy') {
            op = '+';
            answer = num1 + num2;
        } else {
            const operators = ['+', '-'];
            op = operators[Math.floor(Math.random() * operators.length)];
            if (op === '+') answer = num1 + num2;
            else answer = num1 - num2;
            if (answer < 0) return generateQuestion();
        }
        return { num1, num2, op, answer };
    }
    
    let currentQ = generateQuestion();
    
    function renderMath() {
        let html = `<h3>🧮 Математикалық шабуыл 🧮</h3>`;
        html += `<div class="math-question">${currentQ.num1} ${currentQ.op} ${currentQ.num2} = ?</div>`;
        html += `<input type="number" id="mathAnswer" class="math-input" placeholder="?">`;
        html += `<button class="game-btn" onclick="checkMath()">✅ Тексеру</button>`;
        html += `<p>🏆 Ұпай: ${score}</p><p>📊 Сұрақ: ${questionCount+1}/${targetQuestions}</p>`;
        html += `<button class="game-btn" onclick="startMathGame()">🔄 Қайта бастау</button>`;
        if (gameArea) gameArea.innerHTML = html;
    }
    
    window.checkMath = () => {
        const userAnswer = parseInt(document.getElementById('mathAnswer')?.value);
        if (userAnswer === currentQ.answer) {
            score += 10;
            questionCount++;
            playSound('win');
            alert('✅ Дұрыс! +10 ұпай!');
            if (questionCount >= targetQuestions) {
                updateScore(score);
                alert(`🎉 Математикалық ойын аяқталды! +${score} ұпай!`);
                startMathGame();
            } else {
                currentQ = generateQuestion();
                renderMath();
            }
        } else {
            playSound('click');
            alert(`❌ Қате! Дұрыс жауап: ${currentQ.answer}`);
        }
    };
    renderMath();
}

// ========== ЖАНУАРЛАРДЫҢ ДЫБЫСТАРЫ (НАҚТЫ ДЫБЫС ФАЙЛДАРЫМЕН) ==========
function playAnimalSound(animal) {
    let soundFile = '';
    let soundText = '';
    let soundEmoji = '';
    
    switch(animal) {
        case 'dog': 
            soundFile = 'sounds/dog.mp3';
            soundText = 'Ар-ар! Ар-ар!';
            soundEmoji = '🐶';
            break;
        case 'cat': 
            soundFile = 'sounds/cat.mp3';
            soundText = 'Мияу! Мияу!';
            soundEmoji = '🐱';
            break;
        case 'cow': 
            soundFile = 'sounds/cow.mp3';
            soundText = 'Му-му! Му-му!';
            soundEmoji = '🐮';
            break;
        case 'duck': 
            soundFile = 'sounds/duck.mp3';
            soundText = 'Бау-бау! Бау-бау!';
            soundEmoji = '🦆';
            break;
        case 'sheep': 
            soundFile = 'sounds/sheep.mp3';
            soundText = 'Ме-ме! Ме-ме!';
            soundEmoji = '🐑';
            break;
        case 'frog': 
            soundFile = 'sounds/frog.mp3';
            soundText = 'Қуа-қуа! Қуа-қуа!';
            soundEmoji = '🐸';
            break;
        default: 
            soundText = '🔊';
            soundEmoji = '🔊';
    }
    
    // Дыбыс файлын ойнату
    if (soundFile) {
        const audio = new Audio(soundFile);
        audio.play().catch(e => {
            console.log('Дыбыс файлы табылмады:', e);
            // Егер дыбыс файлы жоқ болса, мәтін көрсетеміз
            showSoundMessage(soundEmoji, soundText);
        });
    } else {
        showSoundMessage(soundEmoji, soundText);
    }
    
    playSound('click');
}

// Дыбыс мәтінін экранда көрсету
function showSoundMessage(emoji, text) {
    let messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'position:fixed; bottom:30%; left:50%; transform:translateX(-50%); background:#f59e0b; color:white; padding:15px 25px; border-radius:50px; font-size:1.5rem; font-weight:bold; z-index:1000; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,0.2); animation:fadeOutMsg 1.5s ease;';
    messageDiv.innerHTML = `${emoji} ${text} ${emoji}`;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.parentNode.removeChild(messageDiv);
        }, 500);
    }, 1500);
}

// Анимация стилі
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes fadeOutMsg {
        0% { opacity: 1; transform: translateX(-50%) scale(1); }
        70% { opacity: 1; transform: translateX(-50%) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
    }
`;
document.head.appendChild(animStyle);

// ========== БҮГІНГІ ПАЙЫМ ==========
const quotes = [
    "📚 Білім - ең үлкен байлық!",
    "⭐ Күн сайын жаңа нәрсе үйрен!",
    "🤝 Достық - ең қымбат қазына!",
    "💪 Ешқашан бас тартпа, сен оны жеңе аласың!",
    "😊 Күлкі - ең жақсы дәрі!",
    "🌍 Әлемді зерттеуге қорықпа!",
    "🎯 Армандауға ешқашан кеш емес!",
    "🐾 Жануарларға мейірімді бол!",
    "📖 Кітап оқу - саяхат жасау!",
    "🧠 Миыңды жаттықтыр - ойындар ойна!"
];

function changeQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.innerHTML = quotes[randomIndex];
            quoteElement.style.opacity = '1';
        }, 200);
    }
    playSound('click');
}

setInterval(() => {
    changeQuote();
}, 30000);

// Бастапқы профильді жаңарту
updateProfileDisplay();
updateProgressBar();
checkRegistration();
