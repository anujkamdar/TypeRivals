const targetText = 'The majestic Himalayas, with their snow-kissed peaks reaching towards the heavens, have captivated the hearts of travelers for centuries. This awe-inspiring mountain range offers a diverse tapestry of experiences, from exhilarating treks that challenge both mind and body to serene meditation retreats that nourish the soul. The regions rich cultural heritage, ancient monasteries steeped in history, and the warm hospitality of the local people further enhance the allure of this breathtaking landscape. As one journeys through this magnificent terrain, they are greeted by a kaleidoscope of vibrant colors, from the lush green valleys to the crystal-clear lakes that mirror the sky. The air is crisp and clean, invigorating the senses and calming the mind. The Himalayan mountains are not just a geographical feature; they are a spiritual haven, a place where one can connect with nature, culture, and oneself.';
const targetTextElement = document.querySelector('.target-text');
const inputArea = document.querySelector('.input-area');
const timerElement = document.querySelector('.timer span')
const realTimeWPMElement = document.querySelector('.realtime-WPM div')
const realTimeAccuracy = document.querySelector('.realtime-accuracy div')
const contestTime = 30;
let timePassed = 0;
let timeRemaining = contestTime;
let noOfIncorrectCharacters = 0;
let noOfcorrectCharacters = 0;
let interval = null;
timerElement.textContent = contestTime;



targetTextElement.textContent = targetText;

inputArea.addEventListener('input', () => {
  if(!interval){
    interval = setInterval( () => {
      timePassed++;
      timeRemaining--;
      noOfcorrectCharacters = (document.querySelectorAll(".correct")).length;
      noOfIncorrectCharacters = (document.querySelectorAll(".incorrect")).length;
      let netWPM = Math.round(noOfcorrectCharacters/(5*(timePassed/60)))
      let accuracy = Math.round(noOfcorrectCharacters*100/(noOfIncorrectCharacters+noOfcorrectCharacters))
      realTimeWPMElement.textContent = netWPM;
      realTimeAccuracy.textContent = `${accuracy}%`;
      timerElement.textContent = timeRemaining;
      if(timeRemaining === 0){
        inputArea.disabled = true;
        clearInterval(interval);
      }
    },1000)
  }
  const userInput = inputArea.value;

  let formattedText = '';
  for (let i = 0; i < targetText.length; i++) {
    const userChar = userInput[i]; 
    const targetChar = targetText[i];

    if (userChar === targetChar) {
      formattedText = formattedText + `<span class="correct">${targetChar}</span>`;
    } else if (userChar) {
      formattedText = formattedText + `<span class="incorrect">${targetChar}</span>`;
    } else {
      formattedText = formattedText + `<span class= "untyped">${targetChar}</span>`;
    }
  }
  targetTextElement.innerHTML = formattedText;
});




