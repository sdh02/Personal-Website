const WELCOME_TEXT = "Welcome to my technical portfolio!";
const GREETING_TEXT="Hello, I'm Sam!";
const welcomeMat = document.getElementById("welcomeMat");
const bioMat = document.getElementById("bioMat");

function showBio() {
  welcomeMat.classList.add("welcome-hidden");
  bioMat.classList.remove("bio-hidden");
  document.getElementById('bioMat').classList.remove('bio-hidden');

}

function startSite() {
  bioMat.classList.add("bio-hidden");
  document.body.classList.remove("lock-scroll");
}

function resetExperience() {
  document.body.classList.add("lock-scroll");
  welcomeMat.classList.remove("welcome-hidden");
  bioMat.classList.add("bio-hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function typeWriter(text, elementId, speed = 50) {
  const element = document.getElementById(elementId);
  let index = 0;
  console.log(elementId, text)
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  element.textContent = '';
  type();
}

function createObserver(text, id) {
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(`${id} section is now visible`);
            typeWriter(text, id);
            obs.unobserve(entry.target); 
        }
    });
    }, {
        threshold: 0.5
    });
    const target = document.getElementById(id);
    if (target) observer.observe(target);
}

function showMat(targetId) {
  console.log(`Showing modal: ${targetId}`);
  const modal = document.getElementById(targetId);
  modal.classList.remove("d-none"); 
  document.body.classList.add("lock-scroll");

  // Close when clicking outside modal
  document.addEventListener("click", function handler(event) {
    if (event.target === modal) {
      console.log(`Hiding modal: ${targetId}`);
      modal.classList.add("d-none"); 
      document.body.classList.remove("lock-scroll");
      document.removeEventListener("click", handler); // remove listener after closing
    }
  });
}

function changeSlide(containerId){

    const slides = containerId.querySelectorAll('.slide-page');
    const currentSlide = containerId.querySelector('.slide-page.active');
    let nextSlideIndex = Array.from(slides).indexOf(currentSlide) + 1
    if (nextSlideIndex >= slides.length) {
        nextSlideIndex = 0; // Loop back to the first slide
    }
    console.log(`Changing slide to index: ${nextSlideIndex}`);
    currentSlide.classList.remove('active');
    slides[nextSlideIndex].classList.add('active');
}

 let currentSlide = 0;
  const slideContainer = document.querySelector('.slide-container');

  function updateSlide() {
    slideContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function nextSlide() {
    if (currentSlide < 3) {
      currentSlide++;
      updateSlide();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlide();
    }
  }

createObserver(WELCOME_TEXT, "displayWelcome");
createObserver(GREETING_TEXT, "displayGreeting");



