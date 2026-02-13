// Menu mobile
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const expertiseToggle = document.getElementById('expertiseToggle');
        const expertiseDropdown = document.getElementById('expertiseDropdown');
        
        // Toggle du menu principal
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Gestion du dropdown sur mobile
        expertiseToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                expertiseDropdown.classList.toggle('active');
                expertiseToggle.classList.toggle('active');
                
                // Empêcher la fermeture du dropdown si on clique dedans
                expertiseDropdown.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
        
        // Fermer le menu mobile quand on clique sur un lien (sauf sur Expertise en version mobile)
        document.querySelectorAll('.nav-links a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
        
        // Fermer le dropdown Expertise quand on clique en dehors (version desktop uniquement)
        document.addEventListener('click', (e) => {
             if (window.innerWidth > 768) {
                if (!e.target.closest('.dropdown')) {
                    expertiseDropdown.classList.remove('active');
                }
            }
        });
        
        // Ajustement pour les redimensionnements d'écran
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                expertiseDropdown.classList.remove('active');
                expertiseToggle.classList.remove('active');
            }
        });
        
        // FAQ fonctionnelle avec JavaScript
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Fermer toutes les autres FAQ
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Ouvrir celle-ci si elle n'était pas déjà active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        }); 


   // js/contact.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI2pIhh4Zwz8GLGfVlw2Dom1Nq3LS0gu_VZvRQSotutlFLnODF5UNQblgwfklOZXqF/exec';
    
    if (!form) return;
    
    // Validation téléphone 
    function validatePhone(phone) {
        if (!phone) return "Le téléphone est requis";
        
        // Nettoyer
        const cleaned = phone.replace(/[\s\-\.]/g, '');
        
        // Vérifier chiffres 
        if (!/^\d+$/.test(cleaned)) {
            return "Uniquement des chiffres";
        }
        
        // Vérifier longueur 9-10 chiffres
        if (cleaned.length < 9 || cleaned.length > 10) {
            return "Doit contenir 9 ou 10 chiffres";
        }
        
        return null; // Pas d'erreur
    }
    
    // Validation email
    function validateEmail(email) {
        if (!email) return "Email requis";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) ? null : "Email invalide";
    }
    
    // Validation nom
    function validateName(name) {
        if (name.length < 2) return "Minimum 2 caractères";
        if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) return "Caractères invalides";
        return null;
    }
    
    // Afficher erreur
    function showError(input, message) {
        const parent = input.parentElement;
        const error = parent.querySelector('.error') || document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        error.style.cssText = 'color: #dc3545; font-size: 14px; margin-top: 5px;';
        
        if (!parent.querySelector('.error')) {
            parent.appendChild(error);
        }
        
        input.style.borderColor = '#dc3545';
    }
    
    // Effacer erreur
    function clearError(input) {
        const parent = input.parentElement;
        const error = parent.querySelector('.error');
        if (error) error.remove();
        input.style.borderColor = '';
    }
    
    // Validation en temps réel
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', function() {
            let error = null;
            
            switch(this.id) {
                case 'fullName':
                    error = validateName(this.value.trim());
                    break;
                case 'email':
                    error = validateEmail(this.value.trim());
                    break;
                case 'phone':
                    error = validatePhone(this.value.trim());
                    break;
                case 'message':
                    if (this.value.trim().length < 10) {
                        error = "Minimum 10 caractères";
                    }
                    break;
                case 'service':
                    if (!this.value) {
                        error = "Sélectionnez un service";
                    }
                    break;
            }
            
            if (error) {
                showError(this, error);
            } else {
                clearError(this);
            }
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Formatage téléphone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/[^\d]/g,'');
            
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            // Formater XX XX XX XX XX
            if (value.length > 0) {
                const groups = [];
                if (value.length > 2) {
                    groups.push(value.substring(0, 2));
                    value = value.substring(2);
                }
                while (value.length > 0) {
                    groups.push(value.substring(0, 2));
                    value = value.substring(2);
                }
                this.value = groups.join(' ');
            }
        });
    }
    
    // Soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collecter données
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Validation finale
        let isValid = true;
        
        // Valider chaque champ
        const validations = [
            { id: 'fullName', validator: validateName },
            { id: 'email', validator: validateEmail },
            { id: 'phone', validator: validatePhone },
            { id: 'message', validator: (val) => val.length < 10 ? "Minimum 10 caractères" : null },
            { id: 'service', validator: (val) => !val ? "Sélectionnez un service" : null }
        ];
        
        validations.forEach(v => {
            const input = document.getElementById(v.id);
            const value = input.value.trim();
            const error = v.validator(value);
            
            if (error) {
                showError(input, error);
                isValid = false;
            } else {
                clearError(input);
            }
        });
        
        if (!isValid) {
            alert("Veuillez corriger les erreurs dans le formulaire.");
            return;
        }
        
        // Désactiver bouton et afficher loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Envoyer les données
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                mode: 'no-cors' // 
            });
            
            // Avec mode no-cors, on ne peut pas lire la réponse
            
            // Réinitialiser formulaire
            form.reset();
            
            // Afficher message de succès dans la page
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.cssText = `
                background: #d4edda;
                color: #154257;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                border: 1px solid #c3e6cb;
                text-align: center;
            `;
            successDiv.innerHTML = `
                <h3 style="margin-top: 0;">Message envoyé !</h3>
                <p>Merci pour votre message. Nous vous contacterons très rapidement.</p>
            `;
            
            form.parentNode.insertBefore(successDiv, form);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Erreur:', error);
            
            // Fallback
            alert("📤 Votre message est en cours d'envoi. Merci pour votre patience !");
            form.reset();
            
        } finally {
            // Réactiver bouton
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});