const APIs = {
    user: 'https://randomuser.me/api/',
    weather: 'https://api.open-meteo.com/v1/forecast?latitude=10.8231&longitude=106.6297&current_weather=true',
    activity: 'https://www.boredapi.com/api/activity'
};

async function fetchResilient(url, retries = 3, delay = 1000) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        if (retries > 0) {
            console.warn(`Retrying ${url}... Attempts left: ${retries}`);
            await new Promise(res => setTimeout(res, delay));
            return fetchResilient(url, retries - 1, delay * 2);
        }
        throw err;
    }
}

function renderCardContent(key, data, container) {
    container.replaceChildren();

    if (key === 'user') {
        const user = data.results[0];
        const info = [
            `Name: ${user.name.first} ${user.name.last}`,
            `Email: ${user.email}`,
            `Location: ${user.location.city}, ${user.location.country}`
        ];

        info.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            container.appendChild(p);
        });
    } 
    else if (key === 'weather') {
        const tempP = document.createElement('p');
        tempP.textContent = `${data.current_weather.temperature}°C`;
        tempP.style.fontSize = '2rem';
        tempP.style.fontWeight = 'bold';
        tempP.style.color = '#2563eb';

        const windP = document.createElement('p');
        windP.textContent = `Wind speed: ${data.current_weather.windspeed} km/h`;

        container.append(tempP, windP);
    } 
    else {
        const activityP = document.createElement('p');
        activityP.textContent = `"${data.activity}"`;
        activityP.style.fontStyle = 'italic';
        container.appendChild(activityP);
    }
}

async function initDashboard() {
    const keys = Object.keys(APIs);
    keys.forEach(k => document.getElementById(`${k}-card`).classList.add('loading'));

    const requests = keys.map(key => 
        fetchResilient(APIs[key]).then(data => ({ key, data }))
    );

    const results = await Promise.allSettled(requests);

    results.forEach((result, index) => {
        const key = keys[index];
        const card = document.getElementById(`${key}-card`);
        const container = card.querySelector('.content');
        
        card.classList.remove('loading');

        if (result.status === 'fulfilled') {
            renderCardContent(result.value.key, result.value.data, container);
        } else {
            const errorP = document.createElement('p');
            errorP.className = 'error-msg';
            errorP.textContent = `⚠️ Failed to load ${key} data.`;
            container.appendChild(errorP);
        }
    });
}

document.getElementById('refresh-btn').onclick = initDashboard;
initDashboard();