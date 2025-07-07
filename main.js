// Navegación suave
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.getElementById('indicators');
    const rsvpForm = document.getElementById('rsvpForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    
    // Elementos del reproductor de música
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progress');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');

    // Elementos del sistema de invitados
    const guestSelect = document.getElementById('guestSelect');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextStep1Btn = document.getElementById('nextStep1');
    const backStep1Btn = document.getElementById('backStep1');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const familyMembersList = document.getElementById('familyMembersList');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const attendanceTypeRadios = document.querySelectorAll('input[name="attendanceType"]');
    const paymentGroup = document.getElementById('paymentGroup');
    const attendanceOptionsGroup = document.getElementById('attendanceOptionsGroup');
    const familyMembersGroup = document.getElementById('familyMembersGroup');

    // Variables del carrusel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    // Variables del reproductor
    let isPlaying = false;

    // Variables del sistema de invitados
    let selectedGuest = null;
    let selectedFamilyMembers = [];

    // Inicializar aplicación
    init();

    function init() {
        setupNavigation();
        setupCarousel();
        setupAnimations();
        setupGuestSystem();
        setupModal();
        setupScrollEffects();
        setupMusicPlayer();
    }

    // Configurar sistema de invitados
    function setupGuestSystem() {
        // Llenar el select con los invitados
        populateGuestSelect();
        
        // Eventos
        nextStep1Btn.addEventListener('click', handleNextStep1);
        backStep1Btn.addEventListener('click', handleBackStep1);
        guestSelect.addEventListener('change', handleGuestSelection);
        whatsappBtn.addEventListener('click', handleWhatsAppRedirect);
        
        // Eventos para mostrar/ocultar opciones de pago
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', handleAttendanceChange);
        });

        // Eventos para opciones de asistencia (solo/familia)
        attendanceTypeRadios.forEach(radio => {
            radio.addEventListener('change', handleAttendanceTypeChange);
        });

        // Inicializar estado del botón
        nextStep1Btn.disabled = true;
        nextStep1Btn.style.opacity = '0.5';
    }

    function populateGuestSelect() {
        const guests = getAllGuests();
        guestSelect.innerHTML = '<option value="">Busca tu nombre...</option>';
        
        guests.forEach(guest => {
            const option = document.createElement('option');
            option.value = guest.id;
            option.textContent = guest.name;
            guestSelect.appendChild(option);
        });
    }

    function handleGuestSelection() {
        const guestId = guestSelect.value;
        if (guestId) {
            selectedGuest = getGuestData(guestId);
            nextStep1Btn.disabled = false;
            nextStep1Btn.style.opacity = '1';
        } else {
            selectedGuest = null;
            nextStep1Btn.disabled = true;
            nextStep1Btn.style.opacity = '0.5';
        }
    }

    function handleNextStep1() {
        if (!selectedGuest) return;
        
        // Mostrar información del invitado
        displayGuestInfo();
        
        // Mostrar paso 2
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    }

    function handleBackStep1() {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        
        // Limpiar selecciones
        selectedFamilyMembers = [];
        const checkboxes = familyMembersList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Limpiar radio buttons
        const radios = step2.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
        
        // Ocultar grupos
        paymentGroup.style.display = 'none';
        whatsappBtn.style.display = 'none';
        attendanceOptionsGroup.style.display = 'none';
        familyMembersGroup.style.display = 'none';
    }

    function displayGuestInfo() {
        // Mostrar nombre del invitado
        document.getElementById('selectedGuestName').textContent = selectedGuest.name;
        
        // Mostrar tipo de entrada y precio
        const ticketTypeText = selectedGuest.ticketType === 'individual' ? 'Individual' : 'Grupo Familiar';
        const priceText = selectedGuest.ticketType === 'individual' ? '$10.000' : '$20.000';
        
        document.getElementById('ticketTypeDisplay').textContent = ticketTypeText;
        document.getElementById('priceDisplay').textContent = priceText;
        
        // Mostrar opciones de asistencia solo para grupos familiares
        if (selectedGuest.ticketType === 'family' && selectedGuest.familyMembers.length > 1) {
            attendanceOptionsGroup.style.display = 'block';
            displayFamilyMembers();
        } else {
            attendanceOptionsGroup.style.display = 'none';
            familyMembersGroup.style.display = 'none';
            // Para invitados individuales, solo se incluye a ellos mismos
            selectedFamilyMembers = [selectedGuest.name];
        }
    }

    function handleAttendanceTypeChange(e) {
        if (e.target.value === 'family') {
            familyMembersGroup.style.display = 'block';
            // Seleccionar todos los miembros por defecto
            const checkboxes = familyMembersList.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = true);
            updateSelectedMembers();
        } else if (e.target.value === 'alone') {
            familyMembersGroup.style.display = 'none';
            // Solo incluir al invitado principal
            selectedFamilyMembers = [selectedGuest.name];
        }
    }

    function displayFamilyMembers() {
        familyMembersList.innerHTML = '';
        
        selectedGuest.familyMembers.forEach((member, index) => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'family-member-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `member-${index}`;
            checkbox.value = member;
            checkbox.checked = true; // Por defecto todos están seleccionados
            
            const label = document.createElement('label');
            label.htmlFor = `member-${index}`;
            label.textContent = member;
            
            // Si es el invitado principal, no permitir deselección
            if (index === 0) {
                checkbox.disabled = true;
                memberDiv.classList.add('main-guest');
            }
            
            checkbox.addEventListener('change', updateSelectedMembers);
            
            memberDiv.appendChild(checkbox);
            memberDiv.appendChild(label);
            familyMembersList.appendChild(memberDiv);
        });
        
        // Inicializar lista de miembros seleccionados
        updateSelectedMembers();
    }

    function updateSelectedMembers() {
        const checkboxes = familyMembersList.querySelectorAll('input[type="checkbox"]:checked');
        selectedFamilyMembers = Array.from(checkboxes).map(cb => cb.value);
    }

    function handleAttendanceChange(e) {
        if (e.target.value === 'yes') {
            paymentGroup.style.display = 'block';
            whatsappBtn.style.display = 'inline-flex';
            
            // Hacer requeridos los campos de pago
            const paymentRadios = document.querySelectorAll('input[name="paymentStatus"]');
            paymentRadios.forEach(radio => radio.required = true);
        } else {
            paymentGroup.style.display = 'none';
            whatsappBtn.style.display = 'none';
            
            // Quitar requerimiento de campos de pago
            const paymentRadios = document.querySelectorAll('input[name="paymentStatus"]');
            paymentRadios.forEach(radio => {
                radio.required = false;
                radio.checked = false;
            });
        }
    }

    function handleWhatsAppRedirect() {
        // Validar que se haya seleccionado asistencia
        const attendanceValue = document.querySelector('input[name="attendance"]:checked')?.value;
        if (!attendanceValue) {
            alert('Por favor selecciona si asistirás o no.');
            return;
        }

        if (attendanceValue === 'yes') {
            // Validar que se haya seleccionado estado de pago
            const paymentValue = document.querySelector('input[name="paymentStatus"]:checked')?.value;
            if (!paymentValue) {
                alert('Por favor selecciona el estado del pago.');
                return;
            }

            // Para grupos familiares, validar selección de tipo de asistencia
            if (selectedGuest.ticketType === 'family' && selectedGuest.familyMembers.length > 1) {
                const attendanceTypeValue = document.querySelector('input[name="attendanceType"]:checked')?.value;
                if (!attendanceTypeValue) {
                    alert('Por favor selecciona si asistirás solo o con tu grupo familiar.');
                    return;
                }
            }
        }

        // Generar mensaje personalizado
        const message = generatePersonalizedMessage();
        
        // Generar URL de WhatsApp
        const whatsappURL = generateWhatsAppURL(selectedGuest, message);
        
        // Mostrar modal de confirmación
        showSuccessModal();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            hideModal();
            resetForm();
        }, 2000);
    }

    function generatePersonalizedMessage() {
        const attendanceValue = document.querySelector('input[name="attendance"]:checked')?.value;
        const paymentValue = document.querySelector('input[name="paymentStatus"]:checked')?.value;
        const messageText = document.getElementById('message').value;
        
        let message = `Hola! Soy ${selectedGuest.name} y quiero confirmar mi asistencia a la boda.`;
        
        if (attendanceValue === 'yes') {
            if (selectedGuest.ticketType === 'family' && selectedGuest.familyMembers.length > 1) {
                const attendanceTypeValue = document.querySelector('input[name="attendanceType"]:checked')?.value;
                if (attendanceTypeValue === 'alone') {
                    message += ` Asistiré solo/a.`;
                } else {
                    message += ` Asistiré con mi grupo familiar: ${selectedFamilyMembers.join(', ')}.`;
                }
            } else {
                message += ` Confirmo mi asistencia.`;
            }
            
            if (paymentValue === 'deposit') {
                message += ` Ya pagué la seña del 50%.`;
            } else {
                message += ` Pagaré la seña próximamente.`;
            }
        } else {
            message += ` Lamentablemente no podré asistir.`;
        }
        
        if (messageText.trim()) {
            message += ` Mensaje adicional: ${messageText}`;
        }
        
        return message;
    }

    function resetForm() {
        // Volver al paso 1
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        
        // Limpiar formulario
        rsvpForm.reset();
        selectedGuest = null;
        selectedFamilyMembers = [];
        
        // Resetear botón
        nextStep1Btn.disabled = true;
        nextStep1Btn.style.opacity = '0.5';
        
        // Ocultar elementos del paso 2
        paymentGroup.style.display = 'none';
        whatsappBtn.style.display = 'none';
        attendanceOptionsGroup.style.display = 'none';
        familyMembersGroup.style.display = 'none';
    }

    // Configurar navegación
    function setupNavigation() {
        // Mostrar/ocultar navbar al hacer scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('show');
            } else {
                navbar.classList.remove('show');
            }
            
            lastScrollTop = scrollTop;
        });

        // Toggle menu móvil
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Cerrar menú móvil
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Configurar carrusel
    function setupCarousel() {
        // Crear indicadores
        createIndicators();
        
        // Eventos de navegación
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Auto-play
        setInterval(nextSlide, 5000);
        
        // Navegación con teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }

    function createIndicators() {
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', function() {
                goToSlide(i);
            });
            
            indicators.appendChild(indicator);
        }
    }

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Actualizar indicadores
        const allIndicators = document.querySelectorAll('.indicator');
        allIndicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    // Configurar reproductor de música
    function setupMusicPlayer() {
        // Configurar volumen inicial
        audioPlayer.volume = volumeSlider.value / 100;

        // Evento play/pause
        playPauseBtn.addEventListener('click', togglePlayPause);

        // Evento de progreso
        audioPlayer.addEventListener('timeupdate', updateProgress);

        // Evento cuando se carga la metadata
        audioPlayer.addEventListener('loadedmetadata', function() {
            durationSpan.textContent = formatTime(audioPlayer.duration);
        });

        // Evento cuando termina la canción
        audioPlayer.addEventListener('ended', function() {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.width = '0%';
            currentTimeSpan.textContent = '0:00';
        });

        // Control de volumen
        volumeSlider.addEventListener('input', function() {
            audioPlayer.volume = this.value / 100;
        });

        // Click en barra de progreso
        document.querySelector('.progress-bar').addEventListener('click', function(e) {
            if (audioPlayer.duration) {
                const rect = this.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickTime = (clickX / width) * audioPlayer.duration;
                audioPlayer.currentTime = clickTime;
            }
        });

        // Manejo de errores
        audioPlayer.addEventListener('error', function() {
            console.log('Error al cargar el archivo de audio');
            playPauseBtn.disabled = true;
            playPauseBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        });
    }

    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioPlayer.play().then(() => {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.log('Error al reproducir:', error);
            });
        }
        isPlaying = !isPlaying;
    }

    function updateProgress() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Configurar animaciones
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observar elementos animables
        const animateElements = document.querySelectorAll('.slide-up, .fade-in');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Configurar modal
    function setupModal() {
        closeModal.addEventListener('click', hideModal);
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideModal();
            }
        });
    }

    function showSuccessModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Efectos de scroll
    function setupScrollEffects() {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Utilidades
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
});

// Funciones globales disponibles
window.weddingApp = {
    // Función para agregar más fotos dinámicamente
    addPhoto: function(src, alt) {
        const carousel = document.getElementById('carousel');
        const newSlide = document.createElement('div');
        newSlide.className = 'carousel-slide';
        newSlide.innerHTML = `<img src="${src}" alt="${alt}">`;
        carousel.appendChild(newSlide);
        
        // Actualizar indicadores
        const indicators = document.getElementById('indicators');
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.addEventListener('click', function() {
            goToSlide(carousel.children.length - 1);
        });
        indicators.appendChild(indicator);
    },
    
    // Función para cambiar los datos de la boda
    updateWeddingData: function(data) {
        if (data.names) {
            document.querySelector('.couple-names').textContent = data.names;
        }
        if (data.date) {
            document.querySelector('.date-text').textContent = data.date;
        }
        if (data.subtitle) {
            document.querySelector('.subtitle').textContent = data.subtitle;
        }
    },

    // Función para cambiar la información de la canción
    updateSongInfo: function(title, artist) {
        document.getElementById('songTitle').textContent = title;
        document.getElementById('songArtist').textContent = artist;
    }
};