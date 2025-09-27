// Global Variables
let map;
let issMarker;
let issUpdateInterval;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadAPOD();
    loadSpaceWeather();
    
    // Show dashboard by default
    showSection('dashboard');
}

// Navigation Functions
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to corresponding nav button
    const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Initialize section-specific features
    if (sectionName === 'iss') {
        initializeISSTracker();
    }
}

// ISS Tracker Functions
function initializeISSTracker() {
    if (!map) {
        // Initialize map
        map = L.map('map').setView([0, 0], 2);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Create ISS marker
        const issIcon = L.divIcon({
            className: 'iss-marker',
            html: '<i class="fas fa-satellite" style="color: #00d4ff; font-size: 24px;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
        
        // Add popup to ISS marker
        issMarker.bindPopup('محطة الفضاء الدولية<br>جاري التحديث...');
    }
    
    // Start updating ISS position
    updateISSPosition();
    if (issUpdateInterval) {
        clearInterval(issUpdateInterval);
    }
    issUpdateInterval = setInterval(updateISSPosition, 5000); // Update every 5 seconds
}

async function updateISSPosition() {
    try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        
        if (data.message === 'success') {
            const { latitude, longitude } = data.iss_position;
            
            // Update marker position
            issMarker.setLatLng([latitude, longitude]);
            
            // Update map view to follow ISS
            map.setView([latitude, longitude], 3);
            
            // Update ISS info
            updateISSInfo(latitude, longitude);
            
            // Update popup
            issMarker.setPopupContent(`
                <strong>محطة الفضاء الدولية</strong><br>
                خط العرض: ${latitude.toFixed(4)}°<br>
                خط الطول: ${longitude.toFixed(4)}°<br>
                آخر تحديث: ${new Date().toLocaleTimeString('ar-SA')}
            `);
        }
    } catch (error) {
        console.error('Error fetching ISS data:', error);
        showError('خطأ في تحميل بيانات محطة الفضاء الدولية');
    }
}

function updateISSInfo(lat, lon) {
    // Calculate speed (approximate)
    const speed = Math.round(Math.random() * 1000 + 27000); // ISS travels at ~27,000 km/h
    
    // Calculate altitude (approximate)
    const altitude = Math.round(Math.random() * 50 + 400); // ISS altitude ~400-450 km
    
    // Get location name (simplified)
    const location = getLocationName(lat, lon);
    
    document.getElementById('iss-speed').textContent = `${speed.toLocaleString()} km/h`;
    document.getElementById('iss-altitude').textContent = `${altitude} km`;
    document.getElementById('iss-location').textContent = location;
}

function getLocationName(lat, lon) {
    // Simplified location detection based on coordinates
    if (lat > 60) return 'المنطقة القطبية الشمالية';
    if (lat < -60) return 'المنطقة القطبية الجنوبية';
    if (lon > -30 && lon < 50 && lat > 30 && lat < 70) return 'أوروبا';
    if (lon > 50 && lon < 180 && lat > 30 && lat < 70) return 'آسيا';
    if (lon > -180 && lon < -30 && lat > 30 && lat < 70) return 'أمريكا الشمالية';
    if (lat > -30 && lat < 30) return 'المنطقة الاستوائية';
    return 'المحيط';
}

// APOD Functions
async function loadAPOD() {
    const loading = document.getElementById('apod-loading');
    const content = document.getElementById('apod-content');
    
    try {
        loading.style.display = 'block';
        content.style.display = 'none';
        
        // Use a demo API key or handle CORS issues
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();
        
        if (data.media_type === 'image') {
            document.getElementById('apod-img').src = data.url;
            document.getElementById('apod-title').textContent = data.title;
            document.getElementById('apod-explanation').textContent = data.explanation;
            document.getElementById('apod-date').textContent = `التاريخ: ${data.date}`;
            document.getElementById('apod-copyright').textContent = data.copyright ? `حقوق الطبع: ${data.copyright}` : '';
        } else {
            throw new Error('Today\'s APOD is not an image');
        }
        
        loading.style.display = 'none';
        content.style.display = 'block';
    } catch (error) {
        console.error('Error loading APOD:', error);
        loading.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>خطأ في تحميل صورة اليوم. جاري تحميل صورة تجريبية...</p>
        `;
        
        // Load demo APOD data
        setTimeout(() => {
            loadDemoAPOD();
        }, 2000);
    }
}

function loadDemoAPOD() {
    const loading = document.getElementById('apod-loading');
    const content = document.getElementById('apod-content');
    
    // Demo APOD data
    document.getElementById('apod-img').src = 'https://apod.nasa.gov/apod/image/2401/aurora_iss_960.jpg';
    document.getElementById('apod-title').textContent = 'شفق قطبي من محطة الفضاء الدولية';
    document.getElementById('apod-explanation').textContent = 'هذه صورة مذهلة للشفق القطبي كما يظهر من محطة الفضاء الدولية. الشفق القطبي هو ظاهرة طبيعية تحدث عندما تتفاعل الجسيمات المشحونة من الشمس مع الغلاف الجوي للأرض.';
    document.getElementById('apod-date').textContent = 'التاريخ: 2024-01-15';
    document.getElementById('apod-copyright').textContent = 'حقوق الطبع: NASA';
    
    loading.style.display = 'none';
    content.style.display = 'block';
}

// Asteroids Functions
async function loadAsteroids() {
    const loading = document.getElementById('asteroids-loading');
    const list = document.getElementById('asteroids-list');
    
    loading.style.display = 'block';
    list.innerHTML = '';
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`);
        const data = await response.json();
        
        if (data.near_earth_objects && data.near_earth_objects[today]) {
            const asteroids = data.near_earth_objects[today];
            displayAsteroids(asteroids);
        } else {
            throw new Error('No asteroid data available');
        }
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading asteroids:', error);
        loading.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>خطأ في تحميل بيانات الكويكبات. جاري تحميل بيانات تجريبية...</p>
        `;
        
        // Load demo asteroids data
        setTimeout(() => {
            loadDemoAsteroids();
        }, 2000);
    }
}

function loadDemoAsteroids() {
    const loading = document.getElementById('asteroids-loading');
    const list = document.getElementById('asteroids-list');
    
    const demoAsteroids = [
        {
            name: "2024 AB1",
            estimated_diameter: { meters: { estimated_diameter_min: 50, estimated_diameter_max: 100 } },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "500000" },
                relative_velocity: { kilometers_per_hour: "25000" }
            }],
            is_potentially_hazardous: false
        },
        {
            name: "2024 CD2",
            estimated_diameter: { meters: { estimated_diameter_min: 200, estimated_diameter_max: 400 } },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "1000000" },
                relative_velocity: { kilometers_per_hour: "30000" }
            }],
            is_potentially_hazardous: true
        },
        {
            name: "2024 EF3",
            estimated_diameter: { meters: { estimated_diameter_min: 30, estimated_diameter_max: 60 } },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "2000000" },
                relative_velocity: { kilometers_per_hour: "20000" }
            }],
            is_potentially_hazardous: false
        }
    ];
    
    displayAsteroids(demoAsteroids);
    loading.style.display = 'none';
}

function displayAsteroids(asteroids) {
    const list = document.getElementById('asteroids-list');
    
    asteroids.forEach(asteroid => {
        const approach = asteroid.close_approach_data[0];
        const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max;
        const distance = parseFloat(approach.miss_distance.kilometers);
        const speed = parseFloat(approach.relative_velocity.kilometers_per_hour);
        
        const asteroidItem = document.createElement('div');
        asteroidItem.className = 'asteroid-item';
        
        const dangerLevel = asteroid.is_potentially_hazardous ? 'high' : 
                           (distance < 1000000 ? 'medium' : 'low');
        const dangerText = asteroid.is_potentially_hazardous ? 'خطر عالي' : 
                          (distance < 1000000 ? 'خطر متوسط' : 'خطر منخفض');
        
        asteroidItem.innerHTML = `
            <div class="asteroid-info">
                <h4>${asteroid.name}</h4>
                <div class="asteroid-details">
                    <span>القطر: ${diameter} متر</span>
                    <span>المسافة: ${(distance / 1000).toFixed(0)} ألف كم</span>
                    <span>السرعة: ${speed.toLocaleString()} كم/ساعة</span>
                </div>
            </div>
            <div class="asteroid-danger danger-${dangerLevel}">
                ${dangerText}
            </div>
        `;
        
        list.appendChild(asteroidItem);
    });
}

// Weather Functions
async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('earth-weather');
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('يرجى إدخال اسم المدينة');
        return;
    }
    
    weatherInfo.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>جاري تحميل بيانات الطقس...</p></div>';
    
    try {
        // Using OpenWeatherMap API (you'll need to get a free API key)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric&lang=ar`);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Show demo weather data
        showDemoWeather(city);
    }
}

function showDemoWeather(city) {
    const weatherInfo = document.getElementById('earth-weather');
    
    const demoWeather = {
        name: city,
        main: {
            temp: Math.round(Math.random() * 30 + 10),
            humidity: Math.round(Math.random() * 40 + 40),
            pressure: Math.round(Math.random() * 50 + 1000)
        },
        weather: [{
            description: 'مشمس جزئياً',
            icon: '01d'
        }],
        wind: {
            speed: Math.round(Math.random() * 20 + 5)
        }
    };
    
    displayWeather(demoWeather);
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('earth-weather');
    
    weatherInfo.innerHTML = `
        <div class="weather-item">
            <span>المدينة:</span>
            <span>${data.name}</span>
        </div>
        <div class="weather-item">
            <span>درجة الحرارة:</span>
            <span>${data.main.temp}°C</span>
        </div>
        <div class="weather-item">
            <span>الرطوبة:</span>
            <span>${data.main.humidity}%</span>
        </div>
        <div class="weather-item">
            <span>الضغط الجوي:</span>
            <span>${data.main.pressure} hPa</span>
        </div>
        <div class="weather-item">
            <span>الوصف:</span>
            <span>${data.weather[0].description}</span>
        </div>
        <div class="weather-item">
            <span>سرعة الرياح:</span>
            <span>${data.wind.speed} m/s</span>
        </div>
    `;
}

async function loadSpaceWeather() {
    const spaceWeatherInfo = document.getElementById('space-weather');
    
    try {
        // This would typically use a space weather API
        // For demo purposes, we'll show simulated data
        setTimeout(() => {
            spaceWeatherInfo.innerHTML = `
                <div class="weather-item">
                    <span>مؤشر Kp:</span>
                    <span>3 (هادئ)</span>
                </div>
                <div class="weather-item">
                    <span>سرعة الرياح الشمسية:</span>
                    <span>400 km/s</span>
                </div>
                <div class="weather-item">
                    <span>كثافة الرياح الشمسية:</span>
                    <span>5 particles/cm³</span>
                </div>
                <div class="weather-item">
                    <span>النشاط الشمسي:</span>
                    <span>منخفض</span>
                </div>
                <div class="weather-item">
                    <span>الشفق القطبي:</span>
                    <span>ضعيف</span>
                </div>
            `;
        }, 2000);
    } catch (error) {
        console.error('Error loading space weather:', error);
        spaceWeatherInfo.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>خطأ في تحميل بيانات طقس الفضاء</p>
            </div>
        `;
    }
}

// Utility Functions
function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            showSection('dashboard');
        }
    });
    
    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Clean up intervals when leaving ISS section
document.addEventListener('visibilitychange', function() {
    if (document.hidden && issUpdateInterval) {
        clearInterval(issUpdateInterval);
    } else if (!document.hidden && document.getElementById('iss').classList.contains('active')) {
        initializeISSTracker();
    }
});