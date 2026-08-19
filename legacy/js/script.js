// Gestion du menu hamburger pour l'affichage mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Animation du header au scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '10px 40px';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '20px 40px';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Animation douce du défilement pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Animation des compétences lors du défilement
const skillsSection = document.querySelector('.skills');
const skillBars = document.querySelectorAll('.skill-progress');

window.addEventListener('scroll', () => {
    if (isElementInViewport(skillsSection)) {
        skillBars.forEach(bar => {
            bar.style.width = bar.parentElement.getAttribute('data-progress') + '%';
        });
    }
});

// Animation des projets lors du défilement
const projectCards = document.querySelectorAll('.project-card');

window.addEventListener('scroll', () => {
    projectCards.forEach(card => {
        if (isElementInViewport(card)) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Fonction pour vérifier si un élément est visible dans le viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validation simple
        if (name && email && subject && message) {
            // Simuler l'envoi du formulaire
            alert('Merci de m\'avoir contacté! Je vous répondrai dès que possible.');
            contactForm.reset();
        } else {
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });
}

