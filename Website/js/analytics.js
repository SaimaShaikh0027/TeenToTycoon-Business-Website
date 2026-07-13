// Simple Visitor Counter for Teen 2 Tycoon Website
// This provides immediate visitor tracking while setting up Google Analytics

// Initialize visitor count from localStorage
let visitorCount = localStorage.getItem('t2t-visitor-count');

if (!visitorCount) {
    // First time visitor
    localStorage.setItem('t2t-visitor-count', '1');
    visitorCount = 1;
} else {
    // Returning visitor (new session)
    const lastVisit = localStorage.getItem('t2t-last-visit');
    const now = new Date().getTime();
    
    // If last visit was more than 30 minutes ago, count as new session
    if (!lastVisit || (now - parseInt(lastVisit)) > 1800000) {
        visitorCount = parseInt(visitorCount) + 1;
        localStorage.setItem('t2t-visitor-count', visitorCount.toString());
    }
}

// Update last visit timestamp
localStorage.setItem('t2t-last-visit', new Date().getTime().toString());

// Display visitor count in console for now
console.log(`Teen 2 Tycoon Website - Session #${visitorCount}`);

// Track page views
function trackPageView(pageName) {
    let pageViews = JSON.parse(localStorage.getItem('t2t-page-views') || '{}');
    pageViews[pageName] = (pageViews[pageName] || 0) + 1;
    localStorage.setItem('t2t-page-views', JSON.stringify(pageViews));
    
    console.log(`Page: ${pageName} - Views: ${pageViews[pageName]}`);
}

// Get current page name from URL
const pageName = window.location.pathname.split('/').pop() || 'index.html';
trackPageView(pageName);

// Enhanced analytics functions
const T2TAnalytics = {
    // Track button clicks
    trackButtonClick: function(buttonName) {
        let clicks = JSON.parse(localStorage.getItem('t2t-button-clicks') || '{}');
        clicks[buttonName] = (clicks[buttonName] || 0) + 1;
        localStorage.setItem('t2t-button-clicks', JSON.stringify(clicks));
        console.log(`Button clicked: ${buttonName} - Total clicks: ${clicks[buttonName]}`);
    },
    
    // Track contact form submissions
    trackFormSubmission: function(formName) {
        let submissions = JSON.parse(localStorage.getItem('t2t-form-submissions') || '{}');
        submissions[formName] = (submissions[formName] || 0) + 1;
        localStorage.setItem('t2t-form-submissions', JSON.stringify(submissions));
        console.log(`Form submitted: ${formName} - Total submissions: ${submissions[formName]}`);
    },
    
    // Get analytics summary
    getStats: function() {
        return {
            totalSessions: localStorage.getItem('t2t-visitor-count'),
            pageViews: JSON.parse(localStorage.getItem('t2t-page-views') || '{}'),
            buttonClicks: JSON.parse(localStorage.getItem('t2t-button-clicks') || '{}'),
            formSubmissions: JSON.parse(localStorage.getItem('t2t-form-submissions') || '{}'),
            timeSpent: JSON.parse(localStorage.getItem('t2t-time-spent') || '{}')
        };
    },
    
    // Clear all analytics data
    clearStats: function() {
        localStorage.removeItem('t2t-visitor-count');
        localStorage.removeItem('t2t-last-visit');
        localStorage.removeItem('t2t-page-views');
        localStorage.removeItem('t2t-button-clicks');
        localStorage.removeItem('t2t-form-submissions');
        localStorage.removeItem('t2t-time-spent');
        console.log('Analytics data cleared');
    },

    // Show analytics popup on current page (mobile-friendly)
    showStatsPopup: function() {
        const stats = this.getStats();
        const totalViews = Object.values(stats.pageViews).reduce((sum, views) => sum + views, 0);
        const totalClicks = Object.values(stats.buttonClicks).reduce((sum, clicks) => sum + clicks, 0);
        
        // Create popup HTML
        const popupHtml = `
            <div id="t2t-analytics-popup" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 90vw;
                font-family: Arial, sans-serif;
                text-align: center;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 1.5rem;">📊 Website Stats</h3>
                    <span onclick="document.getElementById('t2t-analytics-popup').remove()" 
                          style="cursor: pointer; font-size: 24px; font-weight: bold;">×</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 1.8rem; font-weight: bold;">${stats.totalSessions || 0}</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Sessions</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 1.8rem; font-weight: bold;">${totalViews}</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Page Views</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 1.8rem; font-weight: bold;">${totalClicks}</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Clicks</div>
                    </div>
                </div>

                <div style="text-align: left; font-size: 0.9rem; margin-bottom: 15px;">
                    <strong>Most Popular Pages:</strong><br>
                    ${Object.entries(stats.pageViews)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([page, views]) => 
                            `• ${page.replace('.html', '').replace('index', 'Home')}: ${views} views`
                        ).join('<br>') || '• No data yet'}
                </div>

                <div style="margin-top: 20px;">
                    <button onclick="window.open('t2t-analytics.html', '_blank')" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-right: 10px;
                        font-size: 0.9rem;
                    ">📱 Full Dashboard</button>
                    
                    <button onclick="document.getElementById('t2t-analytics-popup').remove()" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">Close</button>
                </div>

                <div style="margin-top: 15px; font-size: 0.8rem; opacity: 0.8;">
                    Updated: ${new Date().toLocaleString()}
                </div>
            </div>
            
            <div id="t2t-popup-backdrop" onclick="document.getElementById('t2t-analytics-popup').remove()" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            "></div>
        `;

        // Remove existing popup if any
        const existingPopup = document.getElementById('t2t-analytics-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Add popup to page
        document.body.insertAdjacentHTML('beforeend', popupHtml);
    },

    // Show floating analytics button
    showFloatingButton: function() {
        const buttonHtml = `
            <button id="t2t-floating-stats" onclick="T2TAnalytics.showStatsPopup()" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                cursor: pointer;
                z-index: 1000;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                📊
            </button>
        `;

        // Remove existing button if any
        const existingButton = document.getElementById('t2t-floating-stats');
        if (existingButton) {
            existingButton.remove();
        }

        document.body.insertAdjacentHTML('beforeend', buttonHtml);
    }
};

// Make analytics available globally
window.T2TAnalytics = T2TAnalytics;

// Track time spent on page
let startTime = new Date().getTime();

window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((new Date().getTime() - startTime) / 1000);
    let timeData = JSON.parse(localStorage.getItem('t2t-time-spent') || '{}');
    timeData[pageName] = (timeData[pageName] || 0) + timeSpent;
    localStorage.setItem('t2t-time-spent', JSON.stringify(timeData));
});

// Check URL parameters for analytics display
const urlParams = new URLSearchParams(window.location.search);

// Show analytics if ?stats=show is in URL
if (urlParams.get('stats') === 'show') {
    document.addEventListener('DOMContentLoaded', function() {
        T2TAnalytics.showStatsPopup();
    });
}

// Show floating button if ?analytics=button is in URL  
if (urlParams.get('analytics') === 'button') {
    document.addEventListener('DOMContentLoaded', function() {
        T2TAnalytics.showFloatingButton();
    });
}

// Auto-track common button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Track navigation clicks
    const navLinks = document.querySelectorAll('nav a, .nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim() || this.href.split('/').pop();
            T2TAnalytics.trackButtonClick(`Nav: ${linkText}`);
        });
    });

    // Track CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn, .btn, button[type="submit"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim() || this.classList[0] || 'Button';
            T2TAnalytics.trackButtonClick(`CTA: ${buttonText}`);
        });
    });

    // Track contact links
    const contactLinks = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const type = this.href.startsWith('mailto:') ? 'Email' : 'Phone';
            T2TAnalytics.trackButtonClick(`Contact: ${type}`);
        });
    });

    // Track social media links
    const socialLinks = document.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.href.includes('facebook') ? 'Facebook' : 
                            this.href.includes('instagram') ? 'Instagram' :
                            this.href.includes('twitter') ? 'Twitter' : 'LinkedIn';
            T2TAnalytics.trackButtonClick(`Social: ${platform}`);
        });
    });
});

// Display analytics in console (for testing)
if (localStorage.getItem('t2t-debug')) {
    console.log('=== Teen 2 Tycoon Analytics Debug ===');
    console.log(T2TAnalytics.getStats());
}