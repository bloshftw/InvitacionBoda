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

    // Variables del carrusel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    // Variables del reproductor
    let isPlaying = false;

    // Inicializar aplicación
    init();

    function init() {
        setupNavigation();
        setupCarousel();
        setupAnimations();
        setupForm();
        setupModal();
        setupScrollEffects();
        setupMusicPlayer();
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

    // Configurar formulario
    function setupForm() {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            if (validateForm()) {
                // Simular envío
                setTimeout(() => {
                    showSuccessModal();
                    rsvpForm.reset();
                }, 1000);
            }
        });

        // Validación dinámica del tipo de entrada y número de invitados
        const ticketType = document.getElementById('ticketType');
        const guests = document.getElementById('guests');

        ticketType.addEventListener('change', function() {
            updateGuestOptions();
        });

        function updateGuestOptions() {
            const selectedType = ticketType.value;
            guests.innerHTML = '<option value="">Selecciona...</option>';

            if (selectedType === 'individual') {
                guests.innerHTML += '<option value="1">1 persona</option>';
            } else if (selectedType === 'family') {
                for (let i = 2; i <= 4; i++) {
                    guests.innerHTML += `<option value="${i}">${i} personas</option>`;
                }
            }
        }
    }

    function validateForm() {
        const requiredFields = rsvpForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim() && field.type !== 'radio') {
                showFieldError(field, 'Este campo es obligatorio');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        // Validar radio buttons
        const attendanceRadios = rsvpForm.querySelectorAll('input[name="attendance"]');
        const paymentRadios = rsvpForm.querySelectorAll('input[name="paymentStatus"]');

        if (!Array.from(attendanceRadios).some(radio => radio.checked)) {
            showFieldError(attendanceRadios[0].closest('.form-group'), 'Debes seleccionar si asistirás');
            isValid = false;
        }

        if (!Array.from(paymentRadios).some(radio => radio.checked)) {
            showFieldError(paymentRadios[0].closest('.form-group'), 'Debes seleccionar el estado del pago');
            isValid = false;
        }
        
        // Validar email
        const email = rsvpForm.querySelector('#email');
        if (email.value && !isValidEmail(email.value)) {
            showFieldError(email, 'Por favor ingresa un email válido');
            isValid = false;
        }

        // Validar coherencia entre tipo de entrada y número de invitados
        const ticketType = document.getElementById('ticketType');
        const guests = document.getElementById('guests');

        if (ticketType.value === 'individual' && guests.value !== '1') {
            showFieldError(guests, 'Para entrada individual solo se permite 1 persona');
            isValid = false;
        }

        if (ticketType.value === 'family' && (guests.value === '1' || guests.value === '')) {
            showFieldError(guests, 'Para grupo familiar se requieren mínimo 2 personas');
            isValid = false;
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.classList.add('field-error');
        errorElement.textContent = message;
        errorElement.style.color = '#DC2626';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        
        const container = field.closest ? field.closest('.form-group') : field.parentNode;
        container.appendChild(errorElement);
        
        if (field.style) {
            field.style.borderColor = '#DC2626';
        }
    }

    function clearFieldError(field) {
        const container = field.closest ? field.closest('.form-group') : field.parentNode;
        const errorElement = container.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        if (field.style) {
            field.style.borderColor = '';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    // Animación del contador (si se necesita)
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(function() {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
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

    // Lazy loading para imágenes
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Smooth scroll para navegadores que no lo soportan
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }

    // Inicializar lazy loading si hay imágenes lazy
    if (document.querySelectorAll('img[data-src]').length > 0) {
        setupLazyLoading();
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