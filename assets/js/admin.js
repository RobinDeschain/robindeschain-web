document.addEventListener('DOMContentLoaded', function() {
    // Simulación de datos de estadísticas
    const statsData = {
        visits: generateRandomData(30, 100, 200),
        clicks: generateRandomData(30, 50, 150),
        pageViews: {
            'Inicio': Math.floor(Math.random() * 1000) + 500,
            'Portfolio': Math.floor(Math.random() * 800) + 400,
            'Servicios': Math.floor(Math.random() * 600) + 300,
            'Contacto': Math.floor(Math.random() * 400) + 200,
            'Acerca de': Math.floor(Math.random() * 300) + 150
        },
        trafficSources: {
            'Orgánico': 45,
            'Directo': 25,
            'Redes Sociales': 20,
            'Referencias': 10
        },
        devices: {
            'Desktop': 60,
            'Mobile': 35,
            'Tablet': 5
        },
        clicksData: [
            { element: 'Ver Portfolio', page: 'Inicio', clicks: 245, conversion: 12.3, trend: 'positive' },
            { element: 'Contactar', page: 'Inicio', clicks: 189, conversion: 8.7, trend: 'positive' },
            { element: 'Ver Proyecto', page: 'Portfolio', clicks: 156, conversion: 15.2, trend: 'negative' },
            { element: 'Solicitar Presupuesto', page: 'Servicios', clicks: 134, conversion: 9.8, trend: 'positive' },
            { element: 'Ver Sesión', page: 'Portfolio', clicks: 98, conversion: 6.4, trend: 'positive' }
        ]
    };

    // Verificar si el usuario está logueado
    checkAuth();

    function checkAuth() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn === 'true') {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }

    function showDashboard() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        initializeDashboard();
    }

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Credenciales simples (en producción, usar sistema seguro)
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            document.getElementById('loginError').textContent = 'Credenciales incorrectas';
        }
    });

    function logout() {
        localStorage.removeItem('adminLoggedIn');
        showLogin();
    }

    function initializeDashboard() {
        updateMetrics();
        createCharts();
        populateClicksTable();
        startRealTimeUpdates();
    }

    function generateRandomData(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    function updateMetrics() {
        document.getElementById('totalVisits').textContent = statsData.visits.reduce((a, b) => a + b, 0).toLocaleString();
        document.getElementById('totalClicks').textContent = statsData.clicks.reduce((a, b) => a + b, 0).toLocaleString();
        document.getElementById('uniqueUsers').textContent = Math.floor(Math.random() * 1000 + 500).toLocaleString();
        document.getElementById('avgTime').textContent = Math.floor(Math.random() * 180 + 60) + 's';
    }

    function createCharts() {
        // Visits Over Time Chart
        const visitsCtx = document.getElementById('visitsChart').getContext('2d');
        new Chart(visitsCtx, {
            type: 'line',
            data: {
                labels: generateDateLabels(30),
                datasets: [{
                    label: 'Visitas',
                    data: statsData.visits,
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Pages Chart
        const pagesCtx = document.getElementById('pagesChart').getContext('2d');
        new Chart(pagesCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(statsData.pageViews),
                datasets: [{
                    label: 'Vistas',
                    data: Object.values(statsData.pageViews),
                    backgroundColor: '#000000'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Traffic Sources Chart
        const trafficCtx = document.getElementById('trafficChart').getContext('2d');
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statsData.trafficSources),
                datasets: [{
                    data: Object.values(statsData.trafficSources),
                    backgroundColor: ['#000000', '#333333', '#666666', '#999999']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Devices Chart
        const devicesCtx = document.getElementById('devicesChart').getContext('2d');
        new Chart(devicesCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(statsData.devices),
                datasets: [{
                    data: Object.values(statsData.devices),
                    backgroundColor: ['#000000', '#333333', '#666666']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Clicks Distribution Chart
        const clicksCtx = document.getElementById('clicksDistributionChart').getContext('2d');
        new Chart(clicksCtx, {
            type: 'horizontalBar',
            data: {
                labels: statsData.clicksData.map(item => item.element),
                datasets: [{
                    label: 'Clicks',
                    data: statsData.clicksData.map(item => item.clicks),
                    backgroundColor: '#000000'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Real-time Chart
        const realtimeCtx = document.getElementById('realtimeChart').getContext('2d');
        const realtimeChart = new Chart(realtimeCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Actividad',
                    data: [],
                    borderColor: '#000000',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Update real-time chart
        setInterval(() => {
            const now = new Date();
            const timeLabel = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            
            realtimeChart.data.labels.push(timeLabel);
            realtimeChart.data.datasets[0].data.push(Math.floor(Math.random() * 100));
            
            // Keep only last 20 data points
            if (realtimeChart.data.labels.length > 20) {
                realtimeChart.data.labels.shift();
                realtimeChart.data.datasets[0].data.shift();
            }
            
            realtimeChart.update();
        }, 5000);
    }

    function populateClicksTable() {
        const tbody = document.getElementById('clicksTableBody');
        tbody.innerHTML = '';
        
        statsData.clicksData.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.element}</td>
                <td>${item.page}</td>
                <td>${item.clicks}</td>
                <td>${item.conversion}%</td>
                <td><span class="trend ${item.trend}">${item.trend === 'positive' ? '↑' : '↓'}</span></td>
            `;
        });
    }

    function startRealTimeUpdates() {
        setInterval(() => {
            // Update real-time metrics
            document.getElementById('activeUsers').textContent = Math.floor(Math.random() * 50 + 10);
            document.getElementById('pageViews').textContent = Math.floor(Math.random() * 100 + 20);
            document.getElementById('events').textContent = Math.floor(Math.random() * 30 + 5);
        }, 3000);
    }

    function generateDateLabels(days) {
        const labels = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
        }
        
        return labels;
    }

    function updateStats() {
        // This function would normally fetch real data from an API
        // For demo purposes, we'll use the simulated data
        updateMetrics();
    }

    function exportData() {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Elemento,Página,Clicks,Tasa de Conversión,Tendencia\n";
        
        statsData.clicksData.forEach(item => {
            csvContent += `${item.element},${item.page},${item.clicks},${item.conversion}%,${item.trend}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_clicks.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Set default dates
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
});

function updateStats() {
    // This function can be called from the date filter
    location.reload();
}