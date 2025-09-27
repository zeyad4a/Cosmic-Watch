// Demo Data for Cosmic Watch
// This file contains sample data for demonstration purposes

const demoData = {
    // Demo APOD data
    apod: {
        title: "الشفق القطبي من محطة الفضاء الدولية",
        explanation: "هذه صورة مذهلة للشفق القطبي كما يظهر من محطة الفضاء الدولية. الشفق القطبي هو ظاهرة طبيعية تحدث عندما تتفاعل الجسيمات المشحونة من الشمس مع الغلاف الجوي للأرض، مكونة ألواناً ساحرة في السماء.",
        url: "https://apod.nasa.gov/apod/image/2401/aurora_iss_960.jpg",
        date: "2024-01-15",
        copyright: "NASA"
    },
    
    // Demo asteroids data
    asteroids: [
        {
            name: "2024 AB1",
            estimated_diameter: { 
                meters: { 
                    estimated_diameter_min: 50, 
                    estimated_diameter_max: 100 
                } 
            },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "500000" },
                relative_velocity: { kilometers_per_hour: "25000" }
            }],
            is_potentially_hazardous: false
        },
        {
            name: "2024 CD2",
            estimated_diameter: { 
                meters: { 
                    estimated_diameter_min: 200, 
                    estimated_diameter_max: 400 
                } 
            },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "1000000" },
                relative_velocity: { kilometers_per_hour: "30000" }
            }],
            is_potentially_hazardous: true
        },
        {
            name: "2024 EF3",
            estimated_diameter: { 
                meters: { 
                    estimated_diameter_min: 30, 
                    estimated_diameter_max: 60 
                } 
            },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "2000000" },
                relative_velocity: { kilometers_per_hour: "20000" }
            }],
            is_potentially_hazardous: false
        },
        {
            name: "2024 GH4",
            estimated_diameter: { 
                meters: { 
                    estimated_diameter_min: 150, 
                    estimated_diameter_max: 300 
                } 
            },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "800000" },
                relative_velocity: { kilometers_per_hour: "28000" }
            }],
            is_potentially_hazardous: true
        },
        {
            name: "2024 IJ5",
            estimated_diameter: { 
                meters: { 
                    estimated_diameter_min: 80, 
                    estimated_diameter_max: 150 
                } 
            },
            close_approach_data: [{
                close_approach_date: "2024-01-15",
                miss_distance: { kilometers: "1500000" },
                relative_velocity: { kilometers_per_hour: "22000" }
            }],
            is_potentially_hazardous: false
        }
    ],
    
    // Demo weather data for different cities
    weather: {
        cairo: {
            name: "القاهرة",
            main: {
                temp: 22,
                humidity: 45,
                pressure: 1013
            },
            weather: [{
                description: "مشمس",
                icon: "01d"
            }],
            wind: {
                speed: 12
            }
        },
        dubai: {
            name: "دبي",
            main: {
                temp: 28,
                humidity: 60,
                pressure: 1010
            },
            weather: [{
                description: "مشمس جزئياً",
                icon: "02d"
            }],
            wind: {
                speed: 8
            }
        },
        riyadh: {
            name: "الرياض",
            main: {
                temp: 25,
                humidity: 35,
                pressure: 1015
            },
            weather: [{
                description: "صافٍ",
                icon: "01d"
            }],
            wind: {
                speed: 15
            }
        },
        london: {
            name: "لندن",
            main: {
                temp: 8,
                humidity: 80,
                pressure: 1005
            },
            weather: [{
                description: "غائم",
                icon: "04d"
            }],
            wind: {
                speed: 18
            }
        },
        newyork: {
            name: "نيويورك",
            main: {
                temp: 5,
                humidity: 70,
                pressure: 1020
            },
            weather: [{
                description: "ثلج خفيف",
                icon: "13d"
            }],
            wind: {
                speed: 20
            }
        }
    },
    
    // Demo space weather data
    spaceWeather: {
        kpIndex: 3,
        solarWindSpeed: 400,
        solarWindDensity: 5,
        solarActivity: "منخفض",
        auroraActivity: "ضعيف",
        geomagneticStorm: "هادئ"
    },
    
    // Demo ISS data
    iss: {
        latitude: 51.5074,
        longitude: -0.1278,
        altitude: 420,
        velocity: 27600,
        location: "فوق أوروبا"
    }
};

// Function to get random demo weather for any city
function getRandomWeather(cityName) {
    const baseWeather = demoData.weather.cairo; // Default to Cairo
    return {
        ...baseWeather,
        name: cityName,
        main: {
            temp: Math.round(Math.random() * 30 + 5),
            humidity: Math.round(Math.random() * 40 + 30),
            pressure: Math.round(Math.random() * 50 + 1000)
        },
        weather: [{
            description: getRandomWeatherDescription(),
            icon: getRandomWeatherIcon()
        }],
        wind: {
            speed: Math.round(Math.random() * 20 + 5)
        }
    };
}

function getRandomWeatherDescription() {
    const descriptions = [
        "مشمس",
        "مشمس جزئياً", 
        "غائم",
        "غائم جزئياً",
        "ممطر",
        "ثلج خفيف",
        "ضباب",
        "صافٍ"
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomWeatherIcon() {
    const icons = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d"];
    return icons[Math.floor(Math.random() * icons.length)];
}

// Function to get random ISS position
function getRandomISSPosition() {
    return {
        latitude: (Math.random() - 0.5) * 180,
        longitude: (Math.random() - 0.5) * 360,
        altitude: Math.round(Math.random() * 50 + 400),
        velocity: Math.round(Math.random() * 1000 + 27000)
    };
}

// Function to get random space weather
function getRandomSpaceWeather() {
    return {
        kpIndex: Math.floor(Math.random() * 9),
        solarWindSpeed: Math.round(Math.random() * 200 + 300),
        solarWindDensity: Math.round(Math.random() * 10 + 1),
        solarActivity: ["منخفض", "متوسط", "عالي"][Math.floor(Math.random() * 3)],
        auroraActivity: ["ضعيف", "متوسط", "قوي"][Math.floor(Math.random() * 3)],
        geomagneticStorm: ["هادئ", "غير مستقر", "عاصف"][Math.floor(Math.random() * 3)]
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { demoData, getRandomWeather, getRandomISSPosition, getRandomSpaceWeather };
}