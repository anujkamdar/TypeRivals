  import {initializeApp} from "firebase/app"
  import {getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth"
  import {getDatabase ,set , ref , get} from "firebase/database"

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

      registerBtn.addEventListener("click", async (e) =>  {
        e.preventDefault()
        const username = signUpForm.username.value
        const email = signUpForm.email.value
        const password = signUpForm.password.value
        try {
          const cred = await createUserWithEmailAndPassword(auth,email,password);
          signUpForm.reset();
          const uid = cred["user"]["uid"];
          await saveDataofNewUser(username,email,uid)
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
      const saveDataofNewUser = async (username,email,uid) => {
        try{
          const userRef = ref(db,`users/${uid}`);
          await set(userRef , {
            username: username,
            email: email,
          })
        }catch (error){
          console.log(error.message)
        }
      }
  }


  

  // DASHBOARD JS STARTED
  if(document.querySelector(".header") && document.querySelector(".welcome")){
      const logOutBtn = document.querySelector(".logout")
      const publicProfileBtn = document.querySelector(".public-profile")
      const temporaryContestBtn = document.querySelector(".welcome #temporary")
      // behind the scenes firebase apne aap user me data daal dega as the user
      onAuthStateChanged(auth, async (user) => {
        if(user)
        {  
        const uid = user.uid;
        let snapshot = await get(ref(db,`users/${uid}`));
        let userData = snapshot.val();
        const username = userData['username']
        document.querySelector('.welcome .heading span').textContent = username
        document.querySelector('.header p').textContent = username
        
        }
        // varna back karke able to access
        else {
           window.location.href = "index.html";
        }
      })

      temporaryContestBtn.addEventListener("click", (e) => {
        window.location.href = "contestpage.html"
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


