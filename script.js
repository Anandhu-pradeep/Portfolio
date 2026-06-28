/* ============================================
   Particle Canvas Background
   ============================================ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.5 ? 252 : 185; // purple or cyan
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 140) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 140)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawLines();
  animFrameId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ============================================
   Cursor Glow Effect
   ============================================ */
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.left = mouseX + 'px';
  cursorGlow.style.top = mouseY + 'px';
});

/* ============================================
   Navigation
   ============================================ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// Mobile toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   Typing Effect
   ============================================ */
const typingElement = document.getElementById('typing-text');
const titles = [
  'Aspiring Software Developer',
  'Problem Solver',
  'Web Development Enthusiast',
  'MCA Student',
  'Quick Learner'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentTitle = titles[titleIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentTitle.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

/* ============================================
   Counter Animation
   ============================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

/* ============================================
   Scroll Reveal Animations
   ============================================ */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.animationDelay || '0s';
      const delayMs = parseFloat(delay) * 1000;
      
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delayMs);

      // Trigger counters when hero stats are visible
      if (entry.target.classList.contains('hero-stats')) {
        animateCounters();
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================
   Skill Bar Animation
   ============================================ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-bar-fill');
      fills.forEach((fill, i) => {
        setTimeout(() => {
          const width = fill.dataset.width;
          fill.style.width = width + '%';
          fill.classList.add('animated');
        }, i * 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => {
  skillObserver.observe(cat);
});

/* ============================================
   Contact Form
   ============================================ */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const btn = document.getElementById('submit-btn');
  const originalContent = btn.innerHTML;
  
  btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #28ca42, #00f0ff)';
    
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 2500);
  }, 1500);
});

/* ============================================
   Smooth Scroll for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================
   Parallax on Hero Visual (subtle)
   ============================================ */
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}

/* ============================================
   Tilt effect on project cards
   ============================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
  });
});

/* ============================================
   Page Load Animation
   ============================================ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
