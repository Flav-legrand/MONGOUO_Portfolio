// Menu mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navigation active au scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animation des barres de progression
const skillSection = document.querySelector('.skills');
const progressBars = document.querySelectorAll('.progress');

let animated = false;

function animateProgressBars() {
    if (animated) return;
    
    const sectionPos = skillSection?.getBoundingClientRect().top;
    const screenPos = window.innerHeight;
    
    if (sectionPos && sectionPos < screenPos) {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        animated = true;
    }
}

window.addEventListener('scroll', animateProgressBars);
window.addEventListener('load', animateProgressBars);

// Animation des cartes au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.skill-category, .contact-card, .experience-card, .cert-card, .loisir-card, .projet-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Animation des projets
const projetCards = document.querySelectorAll('.projet-card');
const projetObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

projetCards.forEach(card => {
    projetObserver.observe(card);
});

// Filtres des projets
const filtreBtns = document.querySelectorAll('.filtre-btn');
const projetsFiltrables = document.querySelectorAll('[data-categories]');

filtreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filtre = btn.dataset.filtre;
        filtreBtns.forEach(b => b.classList.toggle('active', b === btn));
        projetsFiltrables.forEach(projet => {
            const categories = projet.dataset.categories.split(' ');
            projet.classList.toggle('projet-cache', filtre !== 'tous' && !categories.includes(filtre));
        });
    });
});

// Visionneuse des captures
const lightbox = document.getElementById('lightbox');

if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxLegende = lightbox.querySelector('.lightbox-legende');
    const btnPrecedent = lightbox.querySelector('.lightbox-precedent');
    const btnSuivant = lightbox.querySelector('.lightbox-suivant');
    // Galerie en cours : toutes les captures du projet cliqué, y compris celles masquées dans la carte
    let galerie = [];
    let position = 0;

    const afficherCapture = () => {
        const img = galerie[position];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        const compteur = galerie.length > 1 ? ` (${position + 1} / ${galerie.length})` : '';
        lightboxLegende.textContent = img.alt + compteur;
        btnPrecedent.hidden = btnSuivant.hidden = galerie.length < 2;
    };

    const deplacer = pas => {
        position = (position + pas + galerie.length) % galerie.length;
        afficherCapture();
    };

    const fermerLightbox = () => {
        lightbox.classList.remove('ouverte');
        lightbox.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('img[data-lightbox]').forEach(img => {
        img.addEventListener('click', () => {
            const projet = img.closest('.projet-card, .projet-vedette');
            galerie = projet ? [...projet.querySelectorAll('img[data-lightbox]')] : [img];
            position = galerie.indexOf(img);
            afficherCapture();
            lightbox.classList.add('ouverte');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    btnPrecedent.addEventListener('click', e => { e.stopPropagation(); deplacer(-1); });
    btnSuivant.addEventListener('click', e => { e.stopPropagation(); deplacer(1); });

    lightbox.addEventListener('click', e => {
        if (e.target !== lightboxImg) fermerLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('ouverte')) return;
        if (e.key === 'Escape') fermerLightbox();
        if (e.key === 'ArrowLeft') deplacer(-1);
        if (e.key === 'ArrowRight') deplacer(1);
    });

    // Glissement du doigt sur mobile
    let departX = null;
    lightbox.addEventListener('touchstart', e => { departX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
        if (departX === null) return;
        const ecart = e.changedTouches[0].clientX - departX;
        if (Math.abs(ecart) > 50) deplacer(ecart < 0 ? 1 : -1);
        departX = null;
    });
}

// Formulaire de contact
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            if (result.success) {
                alert('✅ Message envoyé avec succès ! Je vous répondrai rapidement.');
                contactForm.reset();
            } else {
                alert('❌ Erreur: ' + (result.message || 'Une erreur est survenue.'));
            }
        } catch (error) {
            alert('❌ Erreur de connexion. Veuillez réessayer.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Téléchargement CV
const downloadBtn = document.getElementById('downloadCV');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        console.log('Téléchargement du CV en cours...');
    });
}

// Mettre à jour l'année dans le footer
const footerYear = document.querySelector('.footer p');
if (footerYear) {
    footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Mongouo Elyse Flav-Legrand - Tous droits réservés`;
}

// Animation des timelines
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.6s ease';
    timelineObserver.observe(item);
});