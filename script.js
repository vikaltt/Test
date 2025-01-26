let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = {};
let timerExpired = false;
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const errorMessageElement = document.getElementById('errorMessage');
const resultsElement = document.getElementById('results');
const nextButton = document.getElementById('nextButton');

// Загрузка вопросов
async function loadQuestions() {
  const response = await fetch('files/question.json'); // Путь к файлу JSON
  const allQuestions = await response.json();
  questions = allQuestions.slice(0, 40).sort(() => 0.5 - Math.random()).slice(0, 10);
  displayQuestion();
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
  optionsElement.innerHTML = '';
  errorMessageElement.style.display = 'none';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    if (selectedAnswers[currentQuestionIndex] === index) {
      button.classList.add('selected');
    }
    button.onclick = () => selectAnswer(currentQuestionIndex, index, button);
    optionsElement.appendChild(button);
  });

  nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Завершить тест' : 'Далее';
}

function selectAnswer(questionIndex, optionIndex, button) {
  selectedAnswers[questionIndex] = optionIndex;
  const buttons = optionsElement.querySelectorAll('.option');
  buttons.forEach(b => b.classList.remove('selected'));
  button.classList.add('selected');
}

function nextQuestion() {
  if (currentQuestionIndex === questions.length - 1) {
    showResults();
  } else {
    currentQuestionIndex++;
    displayQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function showResults() {
  resultsElement.innerHTML = '';
  let score = 0;
  questions.forEach((question, index) => {
    const resultItem = document.createElement('p');
    const isCorrect = selectedAnswers[index] === question.correctAnswerIndex;
    resultItem.textContent = `${index + 1}. ${question.question} - ${isCorrect ? 'Правильно' : 'Неправильно'}`;
    resultsElement.appendChild(resultItem);
    if (isCorrect) score++;
  });

  resultsElement.innerHTML += `<h2>Ваш результат: ${score} из ${questions.length}</h2>`;
  resultsElement.innerHTML += `<a href="test-selection.html" class="back-button">Вернуться к выбору теста</a>`;
  resultsElement.style.display = 'block';
}

function startTimer() {
  let timeRemaining = 600;
  const interval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(interval);
      timerExpired = true;
      showResults();
    } else {
      timeRemaining--;
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

loadQuestions();
startTimer();
