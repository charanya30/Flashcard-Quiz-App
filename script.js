const STORAGE_KEY = 'flashcards.quiz.app';
const defaultCards = [
  { question: 'What is a flashcard?', answer: 'A small card used for studying one fact at a time.' },
  { question: 'How do you move between cards?', answer: 'Use the Next and Previous buttons to navigate.' },
];

const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const showAnswerBtn = document.getElementById('show-answer-btn');
const progressLabel = document.getElementById('progress');
const form = document.getElementById('flashcard-form');
const questionInput = document.getElementById('question-input');
const answerInput = document.getElementById('answer-input');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const deleteArea = document.getElementById('delete-area');
const deleteBtn = document.getElementById('delete-btn');

let flashcards = [];
let activeIndex = 0;
let editIndex = null;
let answerVisible = false;

function loadFlashcards() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      flashcards = JSON.parse(saved);
    } catch (error) {
      flashcards = defaultCards;
    }
  } else {
    flashcards = defaultCards;
  }
}

function saveFlashcards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
}

function updateCardDisplay() {
  if (!flashcards.length) {
    questionText.textContent = 'No flashcards found. Add one in the form.';
    answerText.textContent = '';
    progressLabel.textContent = '0 of 0 cards';
    showAnswerBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    cardBack.classList.add('hidden');
    cardFront.classList.remove('hidden');
    return;
  }

  showAnswerBtn.disabled = false;
  prevBtn.disabled = flashcards.length === 1;
  nextBtn.disabled = flashcards.length === 1;

  const activeCard = flashcards[activeIndex];
  questionText.textContent = activeCard.question;
  answerText.textContent = activeCard.answer;
  progressLabel.textContent = `${activeIndex + 1} of ${flashcards.length} cards`;
  cardBack.classList.toggle('hidden', !answerVisible);
  cardFront.classList.toggle('hidden', answerVisible);
  showAnswerBtn.textContent = answerVisible ? 'Hide Answer' : 'Show Answer';
}

function setIndex(index) {
  if (!flashcards.length) {
    activeIndex = 0;
    return;
  }

  if (index < 0) {
    activeIndex = flashcards.length - 1;
  } else if (index >= flashcards.length) {
    activeIndex = 0;
  } else {
    activeIndex = index;
  }

  answerVisible = false;
  updateCardDisplay();
}

function resetForm() {
  form.reset();
  editIndex = null;
  saveBtn.textContent = 'Add Flashcard';
  deleteArea.classList.add('hidden');
}

function startEditCard(index) {
  const card = flashcards[index];
  questionInput.value = card.question;
  answerInput.value = card.answer;
  editIndex = index;
  saveBtn.textContent = 'Update Flashcard';
  deleteArea.classList.remove('hidden');
}

function addOrUpdateCard(event) {
  event.preventDefault();
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (!question || !answer) return;

  if (editIndex === null) {
    flashcards.push({ question, answer });
    activeIndex = flashcards.length - 1;
  } else {
    flashcards[editIndex] = { question, answer };
    activeIndex = editIndex;
  }

  saveFlashcards();
  updateCardDisplay();
  resetForm();
}

function removeCard() {
  if (editIndex === null) return;
  flashcards.splice(editIndex, 1);
  if (activeIndex >= flashcards.length) {
    activeIndex = Math.max(0, flashcards.length - 1);
  }
  saveFlashcards();
  updateCardDisplay();
  resetForm();
}

function bindEvents() {
  prevBtn.addEventListener('click', () => setIndex(activeIndex - 1));
  nextBtn.addEventListener('click', () => setIndex(activeIndex + 1));
  showAnswerBtn.addEventListener('click', () => {
    answerVisible = !answerVisible;
    updateCardDisplay();
  });
  form.addEventListener('submit', addOrUpdateCard);
  clearBtn.addEventListener('click', resetForm);
  deleteBtn.addEventListener('click', removeCard);
  questionText.addEventListener('dblclick', () => startEditCard(activeIndex));
  answerText.addEventListener('dblclick', () => startEditCard(activeIndex));
}

function init() {
  loadFlashcards();
  bindEvents();
  updateCardDisplay();
}

init();
