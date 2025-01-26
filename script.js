document.addEventListener("DOMContentLoaded", function () {
  let questions = [];
  let currentQuestionIndex = 0;
  let selectedAnswers = {};
  let timerExpired = false; // Флаг окончания времени
  const timerElement = document.getElementById('timer');
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const errorMessageElement = document.getElementById('errorMessage');
  const resultsElement = document.getElementById('results');
  const nextButton = document.getElementById('nextButton');

  async function loadQuestions() {
    try {
      const response = await fetch('https://files.salebot.pro/uploads/file_item/file/549911/question.json');
      if (!response.ok) {
        throw new Error('Не удалось загрузить вопросы');
      }
      const allQuestions = await response.json();
      questions = allQuestions.slice(0, 40).sort(() => 0.5 - Math.random()).slice(0, 10);
      displayQuestion();
    } catch (error) {
      console.error('Ошибка при загрузке вопросов:', error);
    }
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    optionsElement.innerHTML = '';
    errorMessageElement.style.display = 'none'; // Скрыть сообщение об ошибке при переключении вопросов

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
    const buttons = optionsElement.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      checkAnswersBeforeFinish();
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  }

  function checkAnswersBeforeFinish() {
    if (Object.keys(selectedAnswers).length === questions.length) {
      showResults();
    } else {
      errorMessageElement.style.display = 'block';
      errorMessageElement.textContent = 'Пожалуйста, ответьте на все вопросы!';
    }
  }

  function showResults() {
    const correctAnswers = questions.map((question, index) => {
      return question.correctAnswerIndex === selectedAnswers[index];
    });

    resultsElement.innerHTML = '<h2>Результаты теста</h2>';
    correctAnswers.forEach((isCorrect, index) => {
      const questionResult = document.createElement('p');
      questionResult.textContent = `Вопрос ${index + 1}: ${isCorrect ? 'Правильно' : 'Неправильно'}`;
      resultsElement.appendChild(questionResult);
    });
    resultsElement.style.display = 'block';
  }

  let timer;
  function startTimer(seconds) {
    let timeLeft = seconds;
    timer = setInterval(() => {
      if (timerExpired) return; // Если таймер истек, не обновляем время
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(timer);
        timerExpired = true;
        showResults(); // Таймер истек, показываем результаты
      }
    }, 1000);
  }

  loadQuestions();
  startTimer(10 * 60); // Таймер на 10 минут
});
