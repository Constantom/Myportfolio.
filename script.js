// Dark/Light mode toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }
});

// Clickable work cards
document.querySelectorAll(".work-card").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = "work.html";
  });
});

// Reveal sections on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  for (const element of reveals) {
    const top = element.getBoundingClientRect().top;
    const height = window.innerHeight * 0.85;
    if (top < height) {
      element.classList.add("active");
    }
  }
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Hero stats counter animation
const stats = document.querySelectorAll(".hero-stats h3");
stats.forEach(stat => {
  let value = parseInt(stat.textContent);
  stat.textContent = "0";
  let count = 0;
  const increment = Math.ceil(value / 100);
  function update() {
    count += increment;
    if (count > value) count = value;
    stat.textContent = count;
    if (count < value) requestAnimationFrame(update);
  }
  update();
});

// Image Lightbox
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");
const images = document.querySelectorAll(".snapshot-grid img");

images.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
