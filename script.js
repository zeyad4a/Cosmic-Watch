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
        // Try to fetch real ISS data first
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
            const { latitude, longitude } = data;
            
            // Update marker position
            issMarker.setLatLng([latitude, longitude]);
            
            // Update map view to follow ISS
            map.setView([latitude, longitude], 3);
            
            // Update ISS info
            updateISSInfo(latitude, longitude, data.velocity, data.altitude);
            
            // Update popup
            issMarker.setPopupContent(`
                <strong>محطة الفضاء الدولية</strong><br>
                خط العرض: ${latitude.toFixed(4)}°<br>
                خط الطول: ${longitude.toFixed(4)}°<br>
                السرعة: ${data.velocity ? data.velocity.toFixed(0) : '--'} km/h<br>
                الارتفاع: ${data.altitude ? data.altitude.toFixed(0) : '--'} km<br>
                آخر تحديث: ${new Date().toLocaleTimeString('ar-SA')}
            `);
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching ISS data:', error);
        // Use demo data as fallback
        useDemoISSData();
    }
}

function useDemoISSData() {
    // Generate random ISS position for demo
    const randomPosition = getRandomISSPosition();
    const { latitude, longitude, altitude, velocity } = randomPosition;
    
    // Update marker position
    issMarker.setLatLng([latitude, longitude]);
    
    // Update map view to follow ISS
    map.setView([latitude, longitude], 3);
    
    // Update ISS info
    updateISSInfo(latitude, longitude, velocity, altitude);
    
    // Update popup
    issMarker.setPopupContent(`
        <strong>محطة الفضاء الدولية (بيانات تجريبية)</strong><br>
        خط العرض: ${latitude.toFixed(4)}°<br>
        خط الطول: ${longitude.toFixed(4)}°<br>
        السرعة: ${velocity.toLocaleString()} km/h<br>
        الارتفاع: ${altitude} km<br>
        آخر تحديث: ${new Date().toLocaleTimeString('ar-SA')}
    `);
}

function updateISSInfo(lat, lon, velocity, altitude) {
    // Use provided data or calculate approximate values
    const speed = velocity || Math.round(Math.random() * 1000 + 27000);
    const alt = altitude || Math.round(Math.random() * 50 + 400);
    
    // Get location name (simplified)
    const location = getLocationName(lat, lon);
    
    document.getElementById('iss-speed').textContent = `${speed.toLocaleString()} km/h`;
    document.getElementById('iss-altitude').textContent = `${alt} km`;
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
    
    // Use demo data from demo-data.js
    const demoAPOD = demoData.apod;
    
    document.getElementById('apod-img').src = demoAPOD.url;
    document.getElementById('apod-title').textContent = demoAPOD.title;
    document.getElementById('apod-explanation').textContent = demoAPOD.explanation;
    document.getElementById('apod-date').textContent = `التاريخ: ${demoAPOD.date}`;
    document.getElementById('apod-copyright').textContent = `حقوق الطبع: ${demoAPOD.copyright}`;
    
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
    
    // Use demo data from demo-data.js
    const demoAsteroids = demoData.asteroids;
    
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
    
    // Use demo weather data or generate random data
    let demoWeather;
    
    // Check if we have demo data for this city
    const cityKey = city.toLowerCase();
    if (demoData.weather[cityKey]) {
        demoWeather = demoData.weather[cityKey];
    } else {
        // Generate random weather data
        demoWeather = getRandomWeather(city);
    }
    
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
            // Use demo space weather data
            const spaceWeather = getRandomSpaceWeather();
            
            spaceWeatherInfo.innerHTML = `
                <div class="weather-item">
                    <span>مؤشر Kp:</span>
                    <span>${spaceWeather.kpIndex} (${spaceWeather.geomagneticStorm})</span>
                </div>
                <div class="weather-item">
                    <span>سرعة الرياح الشمسية:</span>
                    <span>${spaceWeather.solarWindSpeed} km/s</span>
                </div>
                <div class="weather-item">
                    <span>كثافة الرياح الشمسية:</span>
                    <span>${spaceWeather.solarWindDensity} particles/cm³</span>
                </div>
                <div class="weather-item">
                    <span>النشاط الشمسي:</span>
                    <span>${spaceWeather.solarActivity}</span>
                </div>
                <div class="weather-item">
                    <span>الشفق القطبي:</span>
                    <span>${spaceWeather.auroraActivity}</span>
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