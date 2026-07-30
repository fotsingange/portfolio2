(function() {
    'use strict';

    // ============================================
    // 1. NAVIGATION MOBILE
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
            });
        });
    }

    // ============================================
    // 2. THÈME CLAIR/SOMBRE
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = localStorage.getItem('theme') === 'dark';

    function applyTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        if (themeToggle) {
            themeToggle.textContent = dark ? 'Mode clair' : 'Mode sombre';
            themeToggle.setAttribute('aria-pressed', !dark);
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }

    if (themeToggle) {
        applyTheme(isDarkMode);
        themeToggle.addEventListener('click', function() {
            isDarkMode = !isDarkMode;
            applyTheme(isDarkMode);
        });
    }

    // ============================================
    // 3. SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // 4. COMPTEUR STATISTIQUES
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        let current = 0;
        const increment = target / 80;
        const duration = 2000;
        const stepTime = duration / 80;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                if (!number.dataset.animated) {
                    number.dataset.animated = 'true';
                    animateCounter(number);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ============================================
    // 5. FILTRE PORTFOLIO
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ============================================
    // 6. TESTIMONIALS CAROUSEL
    // ============================================
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    if (testimonials.length > 0) {
        showTestimonial(0);
        testimonialInterval = setInterval(nextTestimonial, 5000);

        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
            slider.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(nextTestimonial, 5000);
            });
        }
    }

    // ============================================
    // 7. FORMULAIRE DE CONTACT AVEC VALIDATION STRICTE
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // ============================================
    // FONCTION DE VALIDATION POUR LE NOM (LETTRES UNIQUEMENT - PAS DE CHIFFRES)
    // ============================================
    function validateName(name) {
        // Expression régulière STRICTE : UNIQUEMENT des lettres (accentuées incluses), espaces, tirets et apostrophes
        // Pas de chiffres, pas de symboles, pas de caractères spéciaux
        const nameRegex = /^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)*$/;
        
        // Vérification supplémentaire : aucun chiffre n'est autorisé
        const hasDigit = /\d/.test(name);
        
        // Vérification : pas de caractères spéciaux (sauf espace, tiret, apostrophe)
        const hasSpecial = /[^A-Za-zÀ-ÿ\s\-']/.test(name);
        
        return nameRegex.test(name) && !hasDigit && !hasSpecial;
    }

    // ============================================
    // FONCTION SIMPLIFIÉE POUR LA VALIDATION (plus robuste)
    // ============================================
    function isValidName(name) {
        // 1. Supprimer les espaces au début et à la fin
        const trimmed = name.trim();
        
        // 2. Vérifier que le nom n'est pas vide
        if (trimmed === '') return false;
        
        // 3. Vérifier qu'il n'y a PAS de chiffres
        if (/\d/.test(trimmed)) return false;
        
        // 4. Vérifier qu'il n'y a que des lettres, espaces, tirets et apostrophes
        // Pas de chiffres, pas de @, #, $, %, etc.
        if (/[^A-Za-zÀ-ÿ\s\-']/.test(trimmed)) return false;
        
        // 5. Vérifier qu'il y a au moins une lettre
        if (!/[A-Za-zÀ-ÿ]/.test(trimmed)) return false;
        
        return true;
    }

    // ============================================
    // VALIDATION EN TEMPS RÉEL POUR LE CHAMP NOM
    // ============================================
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');

    if (nameInput) {
        // Validation en temps réel (à chaque frappe)
        nameInput.addEventListener('input', function() {
            const value = this.value;
            
            // Vérifier si le nom contient des chiffres
            const hasDigit = /\d/.test(value);
            
            if (value === '') {
                nameError.textContent = 'Le nom est requis';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            } else if (hasDigit) {
                nameError.textContent = '❌ Le nom ne doit PAS contenir de chiffres (0-9)';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            } else if (!isValidName(value)) {
                nameError.textContent = '❌ Utilisez uniquement des lettres, espaces, tirets ou apostrophes';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            } else {
                nameError.textContent = '✅ Nom valide';
                nameError.style.color = 'var(--success, #4caf50)';
                this.style.borderColor = 'var(--success, #4caf50)';
            }
        });

        // Bloquer la saisie des chiffres directement (optionnel mais efficace)
        nameInput.addEventListener('keydown', function(e) {
            // Empêcher la saisie des chiffres
            const key = e.key;
            if (key >= '0' && key <= '9') {
                e.preventDefault();
                // Afficher un message d'erreur rapide
                nameError.textContent = '⚠️ Les chiffres ne sont pas autorisés';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
                setTimeout(() => {
                    if (this.value.trim() === '') {
                        nameError.textContent = 'Le nom est requis';
                    } else {
                        nameError.textContent = '';
                    }
                }, 2000);
            }
        });

        // Nettoyer à la perte de focus
        nameInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value === '') {
                nameError.textContent = 'Le nom est requis';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            } else if (/\d/.test(value)) {
                nameError.textContent = '❌ Le nom ne doit PAS contenir de chiffres';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            } else if (!isValidName(value)) {
                nameError.textContent = '❌ Caractères non autorisés dans le nom';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
            }
        });

        // Empêcher le collage de texte contenant des chiffres
        nameInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            // Filtrer les caractères non autorisés
            const filtered = pastedText.replace(/[^A-Za-zÀ-ÿ\s\-']/g, '');
            if (/\d/.test(filtered)) {
                nameError.textContent = '❌ Les chiffres ne sont pas autorisés';
                nameError.style.color = 'var(--error, #e74c3c)';
                this.style.borderColor = 'var(--error, #e74c3c)';
                setTimeout(() => {
                    nameError.textContent = '';
                }, 2000);
            } else {
                this.value = filtered;
                // Déclencher l'événement input pour la validation
                this.dispatchEvent(new Event('input'));
            }
        });
    }

    // ============================================
    // SOUMISSION DU FORMULAIRE AVEC VALIDATION STRICTE
    // ============================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les champs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Réinitialiser les erreurs
            document.querySelectorAll('.error').forEach(el => {
                el.textContent = '';
                el.style.color = '';
            });
            document.querySelectorAll('input, textarea').forEach(el => {
                el.style.borderColor = '';
            });

            let isValid = true;

            // ============================================
            // VALIDATION STRICTE DU NOM (pas de chiffres)
            // ============================================
            const nameValue = name.value.trim();
            
            // Vérifier la présence de chiffres
            if (/\d/.test(nameValue)) {
                document.getElementById('nameError').textContent = '❌ Le nom ne doit PAS contenir de chiffres (0-9)';
                document.getElementById('nameError').style.color = 'var(--error, #e74c3c)';
                name.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }
            // Vérifier les caractères non autorisés
            else if (/[^A-Za-zÀ-ÿ\s\-']/.test(nameValue)) {
                document.getElementById('nameError').textContent = '❌ Utilisez uniquement des lettres, espaces, tirets ou apostrophes';
                document.getElementById('nameError').style.color = 'var(--error, #e74c3c)';
                name.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }
            // Vérifier que le nom n'est pas vide
            else if (nameValue === '') {
                document.getElementById('nameError').textContent = 'Le nom est requis';
                document.getElementById('nameError').style.color = 'var(--error, #e74c3c)';
                name.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }
            // Vérifier qu'il y a au moins une lettre
            else if (!/[A-Za-zÀ-ÿ]/.test(nameValue)) {
                document.getElementById('nameError').textContent = '❌ Le nom doit contenir au moins une lettre';
                document.getElementById('nameError').style.color = 'var(--error, #e74c3c)';
                name.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }

            // ============================================
            // VALIDATION DE L'EMAIL
            // ============================================
            const emailValue = email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue) {
                document.getElementById('emailError').textContent = 'L\'email est requis';
                document.getElementById('emailError').style.color = 'var(--error, #e74c3c)';
                email.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                document.getElementById('emailError').textContent = 'Veuillez entrer un email valide (ex: nom@domaine.com)';
                document.getElementById('emailError').style.color = 'var(--error, #e74c3c)';
                email.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }

            // ============================================
            // VALIDATION DU SUJET
            // ============================================
            if (!subject.value.trim()) {
                document.getElementById('subjectError').textContent = 'Le sujet est requis';
                document.getElementById('subjectError').style.color = 'var(--error, #e74c3c)';
                subject.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }

            // ============================================
            // VALIDATION DU MESSAGE
            // ============================================
            const messageValue = message.value.trim();
            if (!messageValue) {
                document.getElementById('messageError').textContent = 'Le message est requis';
                document.getElementById('messageError').style.color = 'var(--error, #e74c3c)';
                message.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            } else if (messageValue.length < 10) {
                document.getElementById('messageError').textContent = 'Le message doit contenir au moins 10 caractères';
                document.getElementById('messageError').style.color = 'var(--error, #e74c3c)';
                message.style.borderColor = 'var(--error, #e74c3c)';
                isValid = false;
            }

            // ============================================
            // SI LE FORMULAIRE EST VALIDE
            // ============================================
            if (isValid) {
                formStatus.textContent = '✅ Message envoyé avec succès !';
                formStatus.style.color = 'var(--success, #4caf50)';
                formStatus.style.fontWeight = '600';
                contactForm.reset();
                
                // Réinitialiser les couleurs
                document.querySelectorAll('input, textarea').forEach(el => {
                    el.style.borderColor = '';
                });
                document.querySelectorAll('.error').forEach(el => {
                    el.textContent = '';
                });
                
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            } else {
                formStatus.textContent = '❌ Veuillez corriger les erreurs ci-dessus.';
                formStatus.style.color = 'var(--error, #e74c3c)';
                formStatus.style.fontWeight = '600';
            }
        });
    }

    // ============================================
    // 8. RETOUR EN HAUT
    // ============================================
    const backToTopBtn = document.getElementById('backToTopFloating');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // 9. PARTICULES
    // ============================================
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ============================================
    // 10. NAVIGATION ACTIVE
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // 11. COMPÉTENCES AVEC BARRES DE PROGRESSION
    // ============================================
    document.querySelectorAll('[data-skill]').forEach(item => {
        const skillLevel = parseInt(item.getAttribute('data-skill'));
        item.style.setProperty('--skill-level', skillLevel + '%');
        
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 1s ease';
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '3px';
        progressBar.style.background = 'var(--primary)';
        progressBar.style.borderRadius = '2px';
        item.style.position = 'relative';
        item.style.paddingBottom = '8px';
        item.appendChild(progressBar);

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        skillObserver.observe(item);
    });

    // ============================================
    // 12. GESTION DES ERREURS
    // ============================================
    window.addEventListener('error', function(e) {
        console.error('Erreur globale:', e.message);
    });

    console.log('🚀 Portfolio initialisé avec succès !');
    console.log('✅ Validation STRICTE : aucun chiffre autorisé dans le nom');

})();