const BLYNK_TOKEN = "LOVqfFdEpK-k0FHcxCXcwbZJZ0BEHEHh";
const BLYNK_TEMPLATE_ID = "TMPL31JLvvki9";
const BLYNK_TEMPLATE_NAME = "IoT Based";

const BLYNK_API = "https://blr1.blynk.cloud/external/api";

const PLANTS = {
    peace_lily: { pin: "V0", waterRelay: "V1", fertilizerRelay: "V2", name: "Peace Lily" },
    snake_plant: { pin: "V0", waterRelay: "V1", fertilizerRelay: "V2", name: "Snake Plant" },
    pothos: { pin: "V0", waterRelay: "V1", fertilizerRelay: "V2", name: "Golden Pothos" },
};

let currentPlant = null;
let updateInterval = null;
let isConnected = false;

let isWatering = false;

const elements = {
    splash: document.getElementById("splashScreen"),
    plantSelection: document.getElementById("plantSelection"),
    dashboard: document.getElementById("dashboard"),
    title: document.getElementById("dashboardTitle"),
    gauge: document.getElementById("gaugeFill"),
    value: document.getElementById("gaugeValue"),
    lastWatered: document.getElementById("lastWatered"),
    battery: document.getElementById("batteryLevel"),
    waterBtn: document.getElementById("waterBtn"),
    fertBtn: document.getElementById("fertBtn"),
    backBtn: document.getElementById("backBtn"),
    statusDot: document.getElementById("statusDot"),
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initApp, 1000);
    setupEventListeners();
});

// Initialize App
function initApp() {
    elements.splash.style.opacity = "0";
    setTimeout(() => elements.splash.remove(), 500);
    showPlantSelection();
}

function setupEventListeners() {
    document.querySelectorAll('.select-btn').forEach((btn) => {
        btn.addEventListener('click', handlePlantSelect);
        btn.addEventListener('touchstart', handleTouch);
        btn.addEventListener('touchend', removeTouch);
    });

    elements.backBtn.addEventListener("click", showPlantSelection);
    elements.backBtn.addEventListener("touchstart", handleTouch);
    elements.backBtn.addEventListener("touchend", removeTouch);

    elements.waterBtn.addEventListener("click", handleWatering);
    elements.waterBtn.addEventListener("touchstart", handleTouch);
    elements.waterBtn.addEventListener("touchend", removeTouch);

    elements.fertBtn.addEventListener("click", handleFertilizer);
    elements.fertBtn.addEventListener("touchstart", handleTouch);
    elements.fertBtn.addEventListener("touchend", removeTouch);
}

function handleTouch(e) {
    e.currentTarget.classList.add("active");

    setTimeout(() => {
        e.currentTarget.classList.remove("active");

    }, 500);
}

function removeTouch(e) {
    e.currentTarget.classList.remove("active");

}

function handlePlantSelect(e) {
    currentPlant = e.currentTarget.closest('.plant-card').dataset.plant;
    showDashboard();
}

function showPlantSelection() {
    elements.plantSelection.style.display = 'block';
    elements.dashboard.style.display = 'none';
    clearInterval(updateInterval);
}

function showDashboard() {
    elements.plantSelection.style.display = 'none';
    elements.dashboard.style.display = 'block';
    elements.title.textContent = `${PLANTS[currentPlant].name} Dashboard`;

    startUpdates();
}

function startUpdates() {
    clearInterval(updateInterval);
    checkConnection().then((status) => {
        isConnected = status;

        elements.statusDot.classList.toggle("connected", isConnected);
        elements.statusDot.classList.toggle("disconnected", !isConnected);

        if (isConnected) {
            updateData();
            updateInterval = setInterval(updateData, 2000);
        }
    });
}

async function checkConnection() {
    try {
        const response = await fetch(
            `${BLYNK_API}/isHardwareConnected?token=${BLYNK_TOKEN}`
        );
        return (await response.text()) === "true";

    } catch (error) {
        console.error(error);
        return false;

    }
}

async function updateData() {
    try {
        const moisture = await fetchMoisture(PLANTS[currentPlant].pin);
        updateGauge(moisture);
        updateBattery();

        // If soil reaches desirable level while we are watering, then we stop
        if (isWatering && moisture > 40) {
            await stopWatering();
            showNotification("Soil is sufficiently moist. Watering stopped.");
        }

    } catch (error) {
        showNotification("Failed to refresh data.", "error");

    }
}

async function fetchMoisture(pin) {
    try {
        const response = await fetch(
            `${BLYNK_API}/get?token=${BLYNK_TOKEN}&${pin}`
        );
        if (!response.ok) throw new Error("Network Error.");

        return Math.max(0, Math.min(100, parseInt(await response.text())));

    } catch (error) {
        console.error(error);
        return 0;

    }
}

function updateGauge(moisture) {
    elements.gauge.style.setProperty("--moisture", `${moisture}%`);
    elements.value.textContent = `${moisture}%`;
}

function updateBattery() {
    elements.battery.textContent = `100%`;
}

async function handleWatering() {
    if (!isConnected) {
        showNotification("Device disconnected!", "error");

        return;

    }

    if (isWatering) {
        await stopWatering();
        showNotification("Watering stopped.");

    } else {
        isWatering = true;

        try {
            await fetch(
                `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V1=1`
            );
            showNotification("Watering started.");

            elements.lastWatered.textContent = new Date().toLocaleString();

        } catch (error) {
            showNotification("Failed to start.", "error");

        }
    }
}

async function stopWatering() {
    isWatering = false;

    try {
        await fetch(
            `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V1=0`
        );
    } catch (error) {
        console.error(error);
    }
}

async function handleFertilizer() {
    if (!isConnected) {
        showNotification("Device disconnected!", "error");

        return;

    }

    try {
        // Turn ON Fertilizer
        await fetch(
            `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V2=1`
        );
        showNotification("Fertilizer started.");

        setTimeout(async () => {
            await fetch(
                `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V2=0`
            );
            showNotification("Fertilizer stopped.");

        }, 3000);
    } catch (error) {
        showNotification("Failed to fertilizer.", "error");

    }
}

function showNotification(message, type = "info") {
    const existing = document.querySelectorAll('.notification');
    existing.forEach((n) => n.remove());

    const notification = document.createElement("div");

    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

