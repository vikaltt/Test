let studentData = {}; // Объект для хранения данных студента
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let timerExpired = false;
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('nextButton');

async function loadQuestions(testId) {
  const response = await fetch('https://raw.githubusercontent.com/vikaltt/Test/main/files/question.json');
  const allQuestions = await response.json();
  questions = allQuestions.slice((testId - 1) * 40, testId * 40).sort(() => Math.random() - 0.5).slice(0, 10);
  displayQuestion();
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
  optionsElement.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => selectAnswer(currentQuestionIndex, index, button);
    optionsElement.appendChild(button);
  });

  nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Завершить тест' : 'Далее';
}

function selectAnswer(questionIndex, optionIndex, button) {
  selectedAnswers[questionIndex] = optionIndex;
  const buttons = optionsElement.querySelectorAll('button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    finishTest();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function finishTest() {
  const correctAnswers = questions.map((q, i) => q.correctOption === selectedAnswers[i]);
  const score = correctAnswers.filter(Boolean).length;

  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = `
    <h2>Результаты теста</h2>
    <p>Студент: ${studentData.name}</p>
    <p>Группа: ${studentData.group}</p>
    <p>Ваш результат: ${score} из ${questions.length}</p>
  `;
  resultsElement.style.display = 'block';
  questionElement.style.display = 'none';
  optionsElement.style.display = 'none';
}

function startTimer(duration) {
  let timer = duration, minutes, seconds;
  const interval = setInterval(() => {
    minutes = Math.floor(timer / 60);
    seconds = timer % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (--timer < 0) {
      clearInterval(interval);
      timerExpired = true;
      finishTest();
    }
  }, 1000);
}

document.getElementById('student-form').addEventListener('submit', function(event) {
  event.preventDefault();
  studentData.name = document.get
