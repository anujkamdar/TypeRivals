  import {initializeApp} from "firebase/app"
  import {getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth"
  import {getDatabase ,set , ref , get , push} from "firebase/database"

  const firebaseConfig = {
    apiKey: "AIzaSyDsTHcC-JXEP_D7filkBMc-WWChXvfZmIg",
    authDomain: "typerivals-f78e6.firebaseapp.com",
    projectId: "typerivals-f78e6",
    storageBucket: "typerivals-f78e6.firebasestorage.app",
    messagingSenderId: "579460545509",
    appId: "1:579460545509:web:02084e0b7dccc072160d0c"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  if(document.querySelector(".signin") && document.querySelector(".signup")){
      // ye dikkat de rha h user data save hone me will see later this problem
      // onAuthStateChanged(auth,(user) => {
      //   if(user){
      //     window.location.href = "dashboard.html"
      //   }
      // })
      const body = document.querySelector("body");
      const openSignInBtn = document.querySelector(".signin");
      const openRegisterBtn = document.querySelector(".signup");
      const signUpModal = document.querySelector(".sign-up-modal");
      const signInModal = document.querySelector(".sign-in-modal");
      const signInCloseBtn = document.querySelector(".sign-in-modal .close");
      const signUpCloseBtn = document.querySelector(".sign-up-modal .close"); 
      const signInForm = document.querySelector(".sign-in-modal form");
      const signUpForm = document.querySelector(".sign-up-modal form");
      const signinBtn = document.querySelector(".sign-in-modal button");
      const registerBtn = document.querySelector(".sign-up-modal button");


      openSignInBtn.addEventListener("click", () => {
        signInModal.style.display = "flex";
        body.style.overflow = "hidden"; 
      });


      signInCloseBtn.addEventListener("click", () => {
        signInModal.style.display = "none";
        body.style.overflow = "";
      });

      openRegisterBtn.addEventListener("click", () => {
        signUpModal.style.display = "flex";
        body.style.overflow = "hidden";
      });

      signUpCloseBtn.addEventListener("click", () => {
        signUpModal.style.display = "none";
        body.style.overflow = "";
      });

      
      
      const fileInput = document.querySelector('#profile-picture');
      const preview = document.querySelector('.image-preview');
      let profilePicture;

      // Display Image Preview
      // learn this aache se abhi toh saw a video
      fileInput.addEventListener('change', () => {
        profilePicture = fileInput.files[0];
        console.log(profilePicture)

        if (profilePicture) {
          const reader = new FileReader();
          reader.readAsDataURL(profilePicture);
          reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
          };
        }
      });

      

      registerBtn.addEventListener("click", async (e) =>  {
        e.preventDefault()
        const username = signUpForm.username.value
        const email = signUpForm.email.value
        const password = signUpForm.password.value
        const city = signUpForm.city.value

        
        try {
          let imageUrl = await uploadToCloudinary(profilePicture);
          console.log(imageUrl);
          const cred = await createUserWithEmailAndPassword(auth,email,password);
          signUpForm.reset();
          const uid = cred["user"]["uid"];
          await saveDataofNewUser(username,email,uid,city,imageUrl)
          window.location.href = "dashboard.html";
        }
        catch(error) {
          console.log(error.message);
          alert(error.message);
        }
      })


      signinBtn.addEventListener("click" , async (e) => {
        e.preventDefault();
        const email = signInForm.email.value;
        const password = signInForm.password.value;
        try{
          const cred = await signInWithEmailAndPassword(auth,email,password);
          const uid = cred["user"]["uid"]
          window.location.href = "dashboard.html";
        }
        catch (error) {
          console.log(error.message);
          alert(error.message);
        }
      })

      // ye to local function global kuch use nhi kiya isme 
      const saveDataofNewUser = async (username,email,uid,city,imageUrl) => {
        try{
          const userRef = ref(db,`users/${uid}`);
          await set(userRef , {
            username: username,
            email: email,
            // i think so iski jaruart nhi h will see later
            contests: "",
            totalTestsTaken: 0,
            bestWPM: 0,
            city: city,
            imageUrl: imageUrl
          })
        }catch (error){
          console.log(error.message)
        }
      }

      // if time allows  see deeper in docs abhi toh just by the official video

      const uploadToCloudinary = async(file) => {
        const formData = new FormData()
        formData.append('file',file)
        formData.append('upload_preset', 'ml_default');

        const responce = await fetch("https://api.cloudinary.com/v1_1/djxunz1zm/image/upload",
          {method: "post", body: formData}
        )
        const data = await responce.json();
        return data.secure_url;
      }
  }

  










  // DASHBOARD JS STARTED
  if(document.querySelector(".header") && document.querySelector(".welcome")){
      const logOutBtn = document.querySelector(".logout")
      const publicProfileBtn = document.querySelector(".public-profile")
      const temporaryContestBtn = document.querySelector(".welcome #temporary")
      const difficultySelectionElements = document.querySelectorAll(".difficulty-selection-card")
      const timeSelectionCards = document.querySelectorAll('.time-selection-card')
      const timeSelectionElements = document.querySelectorAll(".start-test")
      const goToHistory = document.querySelector("#history");
      const goToLeaderboard = document.querySelector("#leaderboard")

      const boxHeadingForDifficulty = {
        'easy': 'Perferct For Beginners',
        'medium': 'Challenge Yourself',
        'hard': 'Test Your Limits'
      }

      let difficulty = "easy"; //default ye aayegi on page reload
      let contestTime = 15; // default on page reload
      console.log(difficulty,contestTime);
      localStorage.setItem('difficulty',difficulty); 
      localStorage.setItem('contestTime',contestTime)



    for(let i = 0; i < difficultySelectionElements.length ; i++){
      difficultySelectionElements[i].addEventListener("click" , () => {
        for(let j = 0; j < difficultySelectionElements.length ; j++){
          difficultySelectionElements[j].classList.remove('selected');
        }
        difficulty = difficultySelectionElements[i].id
        console.log(difficulty)
        localStorage.setItem('difficulty',difficulty);
        difficultySelectionElements[i].classList.add('selected')
        for(let timeSelectionCard of timeSelectionCards){
          timeSelectionCard.querySelector('p').innerText = boxHeadingForDifficulty[difficulty];
        }

      })
    }

    // readable to h but isme deselct kaise karunga pehle wala so wrote the above will see if a better way to handle this if time allows 
    // abhi to dimag me upar wala method aaya

      // for(let difficultyElement of difficultySelectionElements){
      //   difficultyElement.addEventListener("click", ()=> {
      //     difficulty = difficultyElement.id
      //     console.log(difficulty)
      //     localStorage.setItem('difficulty',difficulty);
      //     difficultyElement.classList.add('selected')
      //   })
      // }


      for(let timeSelectionElement of timeSelectionElements){
        timeSelectionElement.addEventListener("click" , () => {
          contestTime = timeSelectionElement.id
          console.log(contestTime);
          localStorage.setItem('contestTime',contestTime)
          window.location.href = "contestpage.html"
        })
      }

      
      // behind the scenes firebase apne aap user me data daal dega as the user
      onAuthStateChanged(auth, async (user) => {
        if(user)
        {  
        const uid = user.uid;
        let snapshot = await get(ref(db,`users/${uid}`));
        let userData = snapshot.val();
        const username = userData['username']
        document.querySelector('.welcome .heading span').textContent = username
        document.querySelector('.welcome p span').textContent = userData['bestWPM'];
        // yha semicolon miss ho jata to error aata
        (document.querySelector('.header .public-profile')).innerHTML = 
        `
        <img src="${userData.imageUrl}">
        <p>${username}</p>
        `
        
        }
        // varna back karke able to access
        else {
           window.location.href = "index.html";
        }
      })

      temporaryContestBtn.addEventListener("click", (e) => {
        window.location.href = "contestpage.html"
      })

      goToHistory.addEventListener("click", () => {
        window.location.href = "historypage.html"
      })

      goToLeaderboard.addEventListener("click", () => {
        window.location.href = "leaderboard.html"
      })

      publicProfileBtn.addEventListener("click", (e) => {
        console.log(e)
        window.location.href = "publicprofile.html"
      })

      logOutBtn.addEventListener("click" , async (e) => {
        try{
          await signOut(auth)
          window.location.href = "index.html"
        } 
        catch{
          console.log(error.message)
        }
      })
  }










  // Contest Page start
  if(document.querySelector('.typing-container')){
    let uid;
    let username; 

    onAuthStateChanged(auth, async(user) => {
      if(user){

        // yaha to promise chain hi use karni padegi varna contest will load after data retrieve but uski jarurat nhi h user data ki pehle
        // aab iss cheej ki jarurat nhi as moved the code out of this block
        uid = user.uid;
        get(ref(db,`users/${uid}`)).then( (snapshot) => {
          let userData = snapshot.val();
          username = userData['username'];
          (document.querySelector('.header .public-profile')).innerHTML = 
          `
          <img src="${userData.imageUrl}">
          <p>${username}</p>
          `
        })
      }
      else{
        window.location.href = 'index.html'
      }
    })

    // i think ki if(user) is taking time kyoki iss code ko jab if block ke aandar daal rha hu to lagging to pehle hi uid ko declare usme then value store 
    
    let contestTime = localStorage.getItem('contestTime');
    let difficulty = localStorage.getItem('difficulty');
    // agar gemini se text nhi aaya to ispe fallback in future and abhi yehi text
    const storedText = {
      'easy': `The little puppy loved to play fetch. He would chase the ball with such enthusiasm, his tail wagging furiously. He would bark joyfully when he brought the ball back to his owner, eager for another throw. The puppy's playful energy was infectious, bringing smiles to everyone around him.`,
      'medium': `In the heart of a bustling city, amidst the towering skyscrapers and the ceaseless hum of traffic, a small park offered a tranquil escape. Children laughed as they played on the swings, while elderly gentlemen strolled along the winding paths, enjoying the shade of the ancient trees. A gentle breeze rustled through the leaves, carrying the sweet scent of blooming flowers. It was a peaceful oasis in the midst of urban chaos, a reminder of the beauty that can be found even in the most unexpected places.`,
      'hard': `"The human experience is a complex and multifaceted journey, a tapestry woven with threads of joy and sorrow, triumph and despair. We navigate a labyrinth of emotions, constantly evolving and adapting to the ever-shifting currents of life. Love, loss, and the pursuit of meaning are universal themes that resonate deeply within the human condition. Through empathy and compassion, we build bridges of understanding and forge meaningful connections with others, creating a richer and more fulfilling existence. However, the path to self-discovery is often fraught with challenges, demanding resilience, introspection, and a willingness to embrace vulnerability. Fear of failure, self-doubt, and the weight of expectations can hinder our progress and stifle our growth. Cultivating self-awareness and developing coping mechanisms are crucial for navigating these obstacles and embracing the inevitable setbacks that life presents. Ultimately, the journey of self-discovery is a lifelong pursuit, one that requires continuous growth, a commitment to living authentically, and a willingness to embrace the unknown."`
    }

    const targetText = storedText[difficulty];
    const targetWords = targetText.split(" ");
    const targetTextElement = document.querySelector('.target-text');
    const inputArea = document.querySelector('.input-area');
    const timerElement = document.querySelector('.timer span')
    const realTimeWPMElement = document.querySelector('.realtime-WPM div')
    const realTimeAccuracy = document.querySelector('.realtime-accuracy div')
    let timePassed = 0;
    let timeRemaining = contestTime;
    let noOfIncorrectCharacters = 0;
    let noOfcorrectCharacters = 0;
    let interval = null;
    timerElement.textContent = contestTime;
    targetTextElement.textContent = targetText;
    let userInput;
    let netWpmData = [];
    let grossWpmData = [];
    let contestId;

    inputArea.addEventListener('input', () => {
      if(!interval){
        interval = setInterval( async () => {
          timePassed++;
          timeRemaining--;
          noOfcorrectCharacters = (document.querySelectorAll(".correct")).length;
          noOfIncorrectCharacters = (document.querySelectorAll(".incorrect")).length;
          let grossWPM = Math.round((noOfIncorrectCharacters+noOfcorrectCharacters)/(5*timePassed/60))
          let netWPM = Math.round(noOfcorrectCharacters/(5*(timePassed/60)))
          let accuracy = Math.round(noOfcorrectCharacters*100/(noOfIncorrectCharacters+noOfcorrectCharacters))
          realTimeWPMElement.textContent = netWPM;
          realTimeAccuracy.textContent = `${accuracy}%`;
          netWpmData.push(netWPM);
          grossWpmData.push(grossWPM);
          timerElement.textContent = timeRemaining;
          if(timeRemaining === 0){
            inputArea.disabled = true;
            userInput = inputArea.value;
            let userWords = userInput.split(" ");
            userWords = userWords.filter(item => item !== "");
            console.log(userWords); 
            console.log(targetWords);
            console.log(netWpmData);
            console.log(grossWpmData)
            clearInterval(interval);
            await saveContestData(netWPM,accuracy,difficulty,contestTime,targetText,targetWords,userWords,netWpmData,grossWpmData,grossWPM);
            await saveContestDataGlobal(uid,username,netWPM,accuracy,difficulty,contestTime,targetText);
            await increaseTestCountandChangeBestScore(netWPM);
            localStorage.setItem('contestId',contestId);
            window.location.href = "contestanalysis.html"
            console.log(contestId);
          } 
        },1000)
      }

      const increaseTestCountandChangeBestScore = async (netWPM)=> {
        // increasing the test count
        // pta nhi feeling that there could be a better way
        let snapshot = await get(ref(db,`users/${uid}`))
        let data = snapshot.val()
        let currentCount = data['totalTestsTaken'];
        let currentBest = data['bestWPM'];
        console.log(currentCount)
        set(ref(db,`users/${uid}/totalTestsTaken`),currentCount+1)
        if(netWPM > currentBest){
          set(ref(db,`users/${uid}/bestWPM`),netWPM);
        }
      }


      const saveContestData = async (netWPM,accuracy,difficulty,contestTime,targetText,targetWords,userWords,netWpmData,grossWpmData,grossWPM) => {
        // push takes refrence aur then value jo uske child me dale with a unique id
          contestId = await push(ref(db,`users/${uid}/contests`),{
          netWPM: netWPM,
          accuracy: accuracy,
          difficulty: difficulty,
          contestTime: contestTime,
          text: targetText,
          targetWords: targetWords,
          userWords: userWords,
          netWpmData: netWpmData,
          grossWpmData: grossWpmData,
          grossWPM: grossWPM
        })
        contestId = contestId.key;
      }


      const saveContestDataGlobal = async (uid,username,netWPM,accuracy,difficulty,contestTime,targetText) => {
        await push(ref(db,`contests`),{
          useruid: uid,
          username: username,
          netWPM: netWPM,
          accuracy: accuracy,
          difficulty: difficulty,
          contestTime: contestTime,
          text: targetText,
        })
      }



      userInput = inputArea.value;

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
}

// contest analyis page start

if(document.querySelector('.header') && document.querySelector('.contest-analysis')){
  const contestanalysisDiv = document.querySelector(".contest-analysis")
  onAuthStateChanged(auth, async (user) => {
    if(user)
      {  
      const uid = user.uid;
      let snapshot = await get(ref(db,`users/${uid}`));
      let userData = snapshot.val();
      const username = userData['username'];
      (document.querySelector('.header .public-profile')).innerHTML = 
      `
      <img src="${userData.imageUrl}">
      <p>${username}</p>
      `;
      const contestId = localStorage.getItem('contestId');
      let contestData = userData["contests"][contestId];
      contestanalysisDiv.innerHTML = 
      `
      <div class="heading">
          <img src="icons/analysis-left-svgrepo-com.svg" alt="">
          <div>
              <h2>Performance Analysis</h2>
              <p>Comprehensive breakdown of your typing performace</p>
          </div>
      </div>
        <div class="analysis-stat-cards">
            <div class="analysis-stat-card">
                <div>
                    <!-- change this icon -->
                    <img src="icons/brain-illustration-1-svgrepo-com.svg" alt="">
                    <p>Level</p>
                </div>
                <h2>${contestData.difficulty}</h2>
            </div>
            <div class="analysis-stat-card">
                <div>
                    <img src="icons/keyboard-regular (1).svg" alt="">
                    <p>Net WPM</p>
                </div>
                <h2>${contestData.netWPM}</h2>
            </div>
            <div class="analysis-stat-card">
                <div>
                    <img src="icons/bullseye-solid (1).svg" alt="">
                    <p>Accuracy</p>
                </div>
                <h2>${contestData.accuracy}%</h2>
            </div>
            <div class="analysis-stat-card">
                <div>
                    <img src="icons/clock-regular (1).svg" alt="">
                    <p>Duration</p>
                </div>
                <h2>${contestData.contestTime}</h2>
            </div>
        </div>
        <canvas class="WPM-with-time"></canvas>
        <div class="mistakes"><h3>Mistakes</h3></div>
        
      `

      let netWpmData = contestData.netWpmData;
      let grossWpmData = contestData.grossWpmData;
      let timeIntervalForLabel = (contestData.contestTime)/15
      let timeLabels = [];
      let adjustedNetWpmData = []
      let adjustedGrossWpmData = []

      for(let i = timeIntervalForLabel ; i <= contestData.contestTime ; i+=timeIntervalForLabel){
        timeLabels.push(i)
        adjustedNetWpmData.push(netWpmData[i-1])
        adjustedGrossWpmData.push(grossWpmData[i-1])

      }
      console.log(timeLabels)
      console.log(adjustedGrossWpmData)
      console.log(adjustedNetWpmData)


      const ctx = document.querySelector('.WPM-with-time').getContext('2d');
      const analysisChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'WPM',
            data: adjustedNetWpmData,
            borderColor: 'gold',
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.2
          },
        {
          label: 'Raw',
          data: adjustedGrossWpmData,
          borderColor: 'gray',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.2

        }]
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Time (seconds)' } },
            y: { title: { display: true, text: 'Words per Minute' }, beginAtZero: true }
          }
        }
      });

      let userWords = contestData.userWords;
      let targetWords = contestData.targetWords;
      const misktakesDiv = document.querySelector(".mistakes")

      for(let i = 0 ; i < userWords.length; i++){
        if(userWords[i] !== targetWords[i]){
          let listElement = document.createElement('div')
          listElement.classList.add("list")
          listElement.innerHTML = 
          `
          <img src="icons/cross-circle-svgrepo-com (1).svg">
          <p class="incorrect">${userWords[i]}</p>
          <p class="correct">${targetWords[i]}</p>
          `
          misktakesDiv.appendChild(listElement);
        }
      }

      

      }
      // varna back karke able to access
      else {
         window.location.href = "index.html";
      }

  
  })
} 


// contest history page start
if(document.querySelector(".header") && document.querySelector(".verify-history-page")){
  const goToDashboard = document.querySelector("#dashboard");
  const contestHistoryDiv = document.querySelector(".contest-history"); 
  const usercontestIds = [];
  onAuthStateChanged(auth, async (user) => {
    if(user)
    {  
    const uid = user.uid;
    let snapshot = await get(ref(db,`users/${uid}`));
    let userData = snapshot.val();
    const username = userData['username']
    const userContests = userData['contests'];
    // console.log(userContests);
    (document.querySelector('.header .public-profile')).innerHTML = 
    `
    <img src="${userData.imageUrl}">
    <p>${username}</p>
    `;
    

    // I want ki latest upar aaye thats why firstly storing in array varna to jarurat nhi thi aab array reverse maar dunga ka ulta iterate kar dunga
    for(let userContestId in userContests){
      usercontestIds.push(userContestId);
    }

    contestHistoryDiv.innerHTML = `
                    <div class="cover-image-container">
                    <img id= "cover-image" src="icons/keyboards-mod-musings-01.jpg" alt="">
                    <div class="your-contest-history">
                        <img src="icons/history-svgrepo-com (1).svg" alt="">
                        <h2>Your Contest History</h2>
                    </div>
                </div>
                <div class="contest-history-cards"></div>`
    console.log(usercontestIds.length)

    for(let i = usercontestIds.length - 1 ; i >= 0 ; i--){
      let userContest = userContests[usercontestIds[i]];
      const contestHistoryCards = document.querySelector('.contest-history-cards')
      const contestHistoryCard = document.createElement("div")
      contestHistoryCard.id = usercontestIds[i];
      contestHistoryCard.classList.add('contest-history-card');
      const difficultyIcons = {
        easy: 'icons/star-rings-svgrepo-com.svg',
        medium: 'icons/sword-svgrepo-com.svg',
        hard: 'icons/sword-material-svgrepo-com.svg'
      }
      contestHistoryCard.innerHTML = 
                        `<div class="contest-stat">
                            <img src="icons/trophy-solid.svg">
                            <h2>${userContest['netWPM']}</h2>
                            <p>WPM</p>
                        </div>
                        <div class="contest-stat">
                            <img src="icons/bullseye-solid (1).svg">
                            <h2>${userContest['accuracy']}%</h2>
                            <p>Accuracy</p>
                        </div>
                        <div class="contest-stat">
                            <img src="icons/clock-regular (1).svg">
                            <h2>${userContest['contestTime']}</h2>
                            <p>Seconds</p>
                        </div>
                        <div class="contest-stat-difficulty">
                            <img src = ${difficultyIcons[userContest['difficulty']]} alt="">
                            <p>${userContest['difficulty']}</p>
                        </div>`;
      contestHistoryCards.appendChild(contestHistoryCard);
      contestHistoryCard.addEventListener("click", () => {
        localStorage.setItem('contestId',contestHistoryCard.id)
        window.location.href = "contestanalysis.html"
      })
    }
  }
    // varna back karke able to access
    else {
       window.location.href = "index.html";
    }
  })


  goToDashboard.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })
}


// user public profile page start 
if (document.querySelector(".header") && document.querySelector(".verify-user-pp-page")){
  const contestHistoryDiv = document.querySelector(".contest-history"); 
  const usercontestIds = [];
  onAuthStateChanged(auth, async (user) => {
    if(user)
    {  
    const uid = user.uid;
    let snapshot = await get(ref(db,`users/${uid}`));
    let userData = snapshot.val();
    const username = userData['username']
    const userContests = userData['contests']
    const totalTestsTaken = userData['totalTestsTaken']
    const bestWPM = userData['bestWPM'];
    console.log(totalTestsTaken);
    (document.querySelector('.header .public-profile')).innerHTML = 
    `
    <img src="${userData.imageUrl}">
    <p>${username}</p>
    `;

    document.querySelector('.pp-img-container').innerHTML = 
    `
    <img src="${userData.imageUrl}"> 
    `;
    document.querySelector('.info-wrapper h2').innerText = username;
    document.querySelector('#email p').innerText = userData['email'];
    document.querySelector('#bestWpm h1').innerText = bestWPM;
    document.querySelector('#totalTestsTaken h1').innerText = totalTestsTaken;
    // I want ki latest upar aaye thats why firstly storing in array varna to jarurat nhi thi aab array reverse maar dunga ka ulta iterate kar dunga
    for(let userContestId in userContests){
      usercontestIds.push(userContestId);
    }





    contestHistoryDiv.innerHTML = `
                    <div class="cover-image-container">
                    <img id= "cover-image" src="icons/keyboards-mod-musings-01.jpg" alt="">
                    <div class="your-contest-history">
                        <img src="icons/history-svgrepo-com (1).svg" alt="">
                        <h2>Your Contest History</h2>
                    </div>
                </div>
                <div class="contest-history-cards"></div>`
    // console.log(usercontestIds.length)

    for(let i = usercontestIds.length - 1 ; i >= 0 ; i--){
      let userContest = userContests[usercontestIds[i]];
      if(i == usercontestIds.length - 1){
        document.querySelector('#LastAccuracy h1').innerText = `${userContest['accuracy']}%`;
        document.querySelector('#LastWpm h1').innerText = userContest['netWPM'];
      }
      const contestHistoryCards = document.querySelector('.contest-history-cards')
      const contestHistoryCard = document.createElement("div")
      contestHistoryCard.classList.add('contest-history-card');
      const difficultyIcons = {
        easy: 'icons/star-rings-svgrepo-com.svg',
        medium: 'icons/sword-svgrepo-com.svg',
        hard: 'icons/sword-material-svgrepo-com.svg'
      }
      contestHistoryCard.innerHTML = 
                        `<div class="contest-stat">
                            <img src="icons/trophy-solid.svg">
                            <h2>${userContest['netWPM']}</h2>
                            <p>WPM</p>
                        </div>
                        <div class="contest-stat">
                            <img src="icons/bullseye-solid (1).svg">
                            <h2>${userContest['accuracy']}%</h2>
                            <p>Accuracy</p>
                        </div>
                        <div class="contest-stat">
                            <img src="icons/clock-regular (1).svg">
                            <h2>${userContest['contestTime']}</h2>
                            <p>Seconds</p>
                        </div>
                        <div class="contest-stat-difficulty">
                            <img src = ${difficultyIcons[userContest['difficulty']]} alt="">
                            <p>${userContest['difficulty']}</p>
                        </div>`;
      contestHistoryCards.appendChild(contestHistoryCard);
    }
  }
    // varna back karke able to access
    else {
       window.location.href = "index.html";
    }
  })

}


// leaderboard page start


if(document.querySelector(".header") && document.querySelector(".leaderboard")){
  const goToDashboard = document.querySelector("#dashboard")
  const leaderboardDiv = document.querySelector('.leaderboard')
  let leaderboard = [];
  onAuthStateChanged(auth, async (user) => {
    if(user){
    const uid = user.uid;
    let snapshot = await get(ref(db,`users/${uid}`));
    let userData = snapshot.val();
    const username = userData['username'];
    (document.querySelector('.header .public-profile')).innerHTML = 
    `
    <img src="${userData.imageUrl}">
    <p>${username}</p>
    `;
    let contestSnaphot = await get(ref(db,`contests`))
    let contests = contestSnaphot.val()
    for(let contestKey in contests){
      leaderboard.push(contests[contestKey])
    }

    leaderboard.sort((a,b) => {
      if(b.netWPM == a.netWPM){
        return b.accuracy - a.accuracy;
      }
      return b.netWPM - a.netWPM;
    })
    console.log(leaderboard);
    leaderboardDiv.innerHTML = 
    ` <div class="cover-image-container">
          <img id= "cover-image" src="icons/best-black-desk-setup-accessories1-1536x864.webp">
          <div class="rankings">
              <img src="icons/trophy-svgrepo-com (1).svg" alt="">
              <h2>Leaderboard</h2>
          </div>
      </div>
      <div class="ranking-table">
          <div class="header-row">
              <div>Rank</div>
              <div>Username</div>
              <div>Level</div>
              <div>Duration</div>
              <div>Accuracy</div>
              <div>WPM</div>
          </div>
      </div>`


      const rankingTable = document.querySelector(".ranking-table")
      console.log(rankingTable);
      for(let i = 0; (i <leaderboard.length) && i < 10; i++){
        let contest = leaderboard[i];
        const leaderboardRow = document.createElement("div");
        leaderboardRow.classList.add("leaderboard-row");
        let rank = i+1;

        leaderboardRow.innerHTML = 
        `
        <div class="rank">${rank}</div>
        <div class="username">${contest.username}</div>
        <div class="level"><div id="${contest.difficulty}">${contest.difficulty}</div></div>
        <div class="duration">${contest.contestTime} sec</div>
        <div class="accuracy"><img src="icons/bullseye-solid.svg">${contest.accuracy}%</div>
        <div class="WPM">${contest.netWPM}</div>
        `

        rankingTable.appendChild(leaderboardRow);



      }

    }
    else{
      window.location.href = "index.html"
    }
  })



  goToDashboard.addEventListener("click", () => {
    window.location.href = "dashboard.html"
  })
}