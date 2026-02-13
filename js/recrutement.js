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
        
        // Filtrage des offres d'emploi
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Mettre à jour les boutons actifs
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                const jobCards = document.querySelectorAll('.job-card');
                
                jobCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Remplir automatiquement le poste lors du clic sur "Postuler"
        document.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const jobTitle = btn.getAttribute('data-job');
                document.getElementById('jobPosition').value = jobTitle;
                
                // Scroll vers le formulaire
                document.getElementById('jobApplicationForm').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
        
        // Gestion du formulaire de candidature
       
    // recrutement.js - Formulaire de candidature avec fichiers
    document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    // url ici
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwL7czJpqpYxQBTCplVaf3vIjLLwp3jRafe6CzhBi3aQgXiSG4CoGTe4S38r50zX-aFbw/exec';
    
    if (!form) {
        console.error('Formulaire recrutement non trouvé');
        return;
    }
    
    // ================= GESTION FICHIERS =================
    let selectedFile = null;
    
    if (fileInput && fileName && fileUploadArea) {
        // Drag & Drop
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e9ecef';
            this.style.borderColor = '#667eea';
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            this.style.borderColor = '';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                updateFileName();
            }
        });
        
        // Click / touch sur la zone — support desktop + mobile
        fileUploadArea.addEventListener('click', openFilePicker);
        fileUploadArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            openFilePicker();
        }, { passive: false });

        // Changement de fichier
        fileInput.addEventListener('change', updateFileName);

        // Ouvre le file picker ; fallback pour certains mobiles qui bloquent fileInput.click()
        function openFilePicker() {
            // Tentative normale
            try {
                fileInput.click();
                return;
            } catch (err) {
                // continue vers le fallback
            }

            // Fallback : créer un input temporaire, le cliquer, transférer le fichier
            const tmp = document.createElement('input');
            tmp.type = 'file';
            tmp.accept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            tmp.style.position = 'fixed';
            tmp.style.left = '-10000px';
            document.body.appendChild(tmp);

            tmp.addEventListener('change', function() {
                if (tmp.files && tmp.files.length) {
                    try {
                        // Copier les fichiers vers l'input visible si possible
                        fileInput.files = tmp.files;
                    } catch (e) {
                        // Certains navigateurs n'autorisent pas l'affectation directe de FileList
                        // Dans ce cas, on lit le fichier depuis tmp et on met à jour selectedFile via updateFileName()
                    }
                    updateFileName();
                }
                setTimeout(() => tmp.remove(), 50);
            });

            // Déclencher l'ouverture
            tmp.click();
        }
        
        function updateFileName() {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                selectedFile = file;
                
                // Validation taille (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert("Fichier trop volumineux (max 5MB)");
                    fileInput.value = '';
                    fileName.textContent = 'Aucun fichier sélectionné';
                    selectedFile = null;
                    return;
                }

                // Vérifier l'extension
                const fileNameLower = file.name.toLowerCase();
                const allowedExtensions = ['.pdf','.doc', '.docx'];
                const hasValidExtension = allowedExtensions.some(ext => fileNameLower.endsWith(ext));
                
                // Validation type MIME
                const allowedTypes = [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword'
                ];

                // DOUBLE validation : extension ET type MIME
                if (!hasValidExtension || !allowedTypes.includes(file.type)) {
                    alert("Format non accepté, Doit être au format .pdf, .doc ou .docx.");
                    fileInput.value = '';
                    fileName.textContent = 'Aucun fichier sélectionné';
                    selectedFile = null;
                    return;
                }

                fileName.textContent = file.name;
                fileName.style.color = '#28a745';
                
                // Afficher la taille du fichier
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                const sizeInfo = document.createElement('small');
                sizeInfo.textContent = ` (${fileSizeMB} MB)`;
                sizeInfo.style.color = '#6c757d';
                sizeInfo.style.fontSize = '12px';
                sizeInfo.style.marginLeft = '5px';

                // Supprimer l'ancienne info taille
                const oldSizeInfo = fileName.parentNode.querySelector('.file-size');
                if (oldSizeInfo) oldSizeInfo.remove();
                
                sizeInfo.className = 'file-size';
                fileName.parentNode.appendChild(sizeInfo);
                
            } else {
                fileName.textContent = 'Aucun fichier sélectionné';
                fileName.style.color = '';
                selectedFile = null;

                // Supprimer l'info taille
                const oldSizeInfo = fileName.parentNode.querySelector('.file-size');
                if (oldSizeInfo) oldSizeInfo.remove();
            }
        }
    }
    
    // ================= VALIDATION =================
    function validatePhone(phone) {
        if (!phone) return "Le téléphone est requis";
        
        const cleaned = phone.replace(/[\s\-\.]/g, '');
        
        if (!/^\d+$/.test(cleaned)) {
            return "Uniquement des chiffres";
        }
        
        if (cleaned.length < 9 || cleaned.length > 10) {
            return "9 ou 10 chiffres requis";
        }
        
        if (!cleaned.startsWith('0')) {
            return "Doit commencer par 0";
        }
        
        return null;
    }
    
    function validateEmail(email) {
        if (!email) return "Email requis";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) ? null : "Format email invalide";
    }
    
    function validateName(name, field) {
        if (!name) return `${field} requis`;
        if (name.length < 2) return `Minimum 2 caractères`;
        if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) return `Caractères invalides dans le ${field}`;
        return null;
    }
    
    function validatePosition(position) {
        if (!position) return "Poste requis";
        if (position.length < 3) return "Minimum 3 caractères";
        return null;
    }
    
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
    
    function clearError(input) {
        const parent = input.parentElement;
        const error = parent.querySelector('.error');
        if (error) error.remove();
        input.style.borderColor = '';
    }
    
    // Validation en temps réel
    const fields = [
        { id: 'firstName', validator: (val) => validateName(val, 'prénom') },
        { id: 'lastName', validator: (val) => validateName(val, 'nom') },
        { id: 'candidateEmail', validator: validateEmail },
        { id: 'phoneNumber', validator: validatePhone },
        { id: 'jobPosition', validator: validatePosition }
    ];
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('blur', function() {
                const error = field.validator(this.value.trim());
                if (error) {
                    showError(this, error);
                } else {
                    clearError(this);
                }
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        }
    });
    
    // Formatage téléphone
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/[^\d]/g, '');
            if (value.length > 10) value = value.substring(0, 10);
            
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
    
    // ================= FONCTION POUR LIRE FICHIER EN BASE64 =================
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Convertir ArrayBuffer en Base64
                const base64String = e.target.result.split(',')[1];
                resolve(base64String);
            };
            
            reader.onerror = function(error) {
                reject(error);
            };
            
            // Lire le fichier en Data URL
            reader.readAsDataURL(file);
        });
    }
    
    // ================= SOUMISSION =================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collecte données
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('candidateEmail').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            position: document.getElementById('jobPosition').value.trim(),
            coverLetter: document.getElementById('coverLetter').value.trim(),
            fileName: selectedFile ? selectedFile.name : 'Aucun fichier',
            fileType: selectedFile ? selectedFile.type : null
        };
        
        // Validation finale
        let hasError = false;
        
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const error = field.validator(input.value.trim());
            if (error) {
                showError(input, error);
                hasError = true;
            }
        });
        
        if (hasError) {
            alert("Veuillez corriger les erreurs avant d'envoyer.");
            return;
        }
        
        // Loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span style="
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            "></span>
            Envoi en cours...
        `;
        submitBtn.disabled = true;
        
        // Style animation
        if (!document.querySelector('#spin-style')) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }
        
        try {
            // Si un fichier est sélectionné, le convertir en Base64
            if (selectedFile) {
                try {
                    const base64Data = await readFileAsBase64(selectedFile);
                    formData.fileBase64 = base64Data;
                    console.log("Fichier converti en Base64, taille:", base64Data.length);
                } catch (fileError) {
                    console.error("Erreur conversion fichier:", fileError);
                    alert("Erreur lors du traitement du fichier. Veuillez réessayer.");
                    throw fileError;
                }
            }
            
            // Envoi au script recrutement
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                mode: 'no-cors'
            });
            
            
            // Réinitialisation
            form.reset();
            if (fileName) fileName.textContent = 'Aucun fichier sélectionné';
            selectedFile = null;
            
            // Message de succès
            const successDiv = document.createElement('div');
            successDiv.style.cssText = `
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                color: #21a340;
                padding: 25px;
                margin: 25px 0;
                border-radius: 10px;
                border: 2px solid #155724;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            `;
            successDiv.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #25bb25;">
                    <i class="fas fa-check-circle"></i> Candidature transmise !
                </h3>
                <p style="margin: 0 0 10px 0; font-size: 16px;">
                    <strong>${formData.firstName} ${formData.lastName}</strong>
                </p>
                <p style="margin: 0 0 15px 0;">
                    Poste : <strong>${formData.position}</strong>
                </p>
                <p style="margin: 0; font-size: 16px; color: #0c5460;">
                    <i class="fas fa-envelope"></i> Un email de confirmation vous serez envoyé</p>
                ${formData.fileName && formData.fileName !== 'Aucun fichier' ? 
                `<p style="margin: 10px 0 0 0; font-size: 13px; color: #856404;">
                    <i class="fas fa-paperclip"></i> Votre CV a été sauvegardé
                </p>` : ''}
            `;
            
            form.parentNode.insertBefore(successDiv, form);
            
            // Supprimer après 10s
            setTimeout(() => successDiv.remove(), 10000);
            
        } catch (error) {
            console.error('Erreur:', error);
        
            form.reset();
            if (fileName) fileName.textContent = 'Aucun fichier sélectionné';
            selectedFile = null;
            
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});