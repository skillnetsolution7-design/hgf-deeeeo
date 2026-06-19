/**
 * Meta Pixel Browser Console Test Script
 * 
 * Copy and paste this script into your browser's developer console
 * while running your application to test the Meta Pixel integration.
 */

// ==========================================
// META PIXEL VERIFICATION SCRIPT
// ==========================================

console.log("🔍 Starting Meta Pixel Verification...");

// Function to check if fbq is loaded
function checkPixelLoaded() {
    if (typeof fbq !== 'undefined') {
        console.log("✅ Meta Pixel is loaded and available");
        return true;
    } else {
        console.log("❌ Meta Pixel is NOT loaded");
        return false;
    }
}

// Function to get current Pixel ID
function getPixelId() {
    if (typeof fbq !== 'undefined') {
        console.log("📋 Current Pixel ID: fbq.pixelId");
        console.log("   To view: fbq.pixelId");
    } else {
        console.log("❌ Cannot get Pixel ID - fbq is not loaded");
    }
}

// Function to test PageView event
function testPageView() {
    if (typeof fbq !== 'undefined') {
        console.log("🎯 Testing PageView event...");
        fbq('track', 'PageView');
        console.log("✅ PageView event fired successfully");
        console.log("📍 Current URL:", window.location.href);
    } else {
        console.log("❌ Cannot test PageView - fbq is not loaded");
    }
}

// Function to test custom event
function testCustomEvent(eventName = "TestEvent") {
    if (typeof fbq !== 'undefined') {
        console.log(`🎯 Testing custom event: ${eventName}...`);
        fbq('track', eventName);
        console.log(`✅ Custom event "${eventName}" fired successfully`);
    } else {
        console.log("❌ Cannot test custom event - fbq is not loaded");
    }
}

// Function to monitor events (advanced)
function monitorEvents(duration = 10000) {
    console.log(`🔍 Monitoring events for ${duration}ms...`);
    
    const events = [];
    const originalFbq = fbq;
    
    fbq = function(...args) {
        if (args[1] === 'PageView' || args[0] === 'track') {
            events.push({
                event: args[1] || args[0],
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            console.log(`📊 Event tracked: ${args[1] || args[0]}`);
        }
        return originalFbq.apply(this, args);
    };
    
    setTimeout(() => {
        fbq = originalFbq;
        console.log(`🔍 Monitoring stopped. Total events captured: ${events.length}`);
        console.table(events);
    }, duration);
}

// Function to check environment variable
function checkEnvVariable() {
    console.log("🔍 Checking environment variable...");
    // This won't work in browser console, but shows what to check
    console.log("⚠️ Environment variables are server-side only");
    console.log("📝 Check your .env.local file contains:");
    console.log("   NEXT_PUBLIC_META_PIXEL_ID=1710517860088102");
}

// Function to run all tests
function runAllTests() {
    console.log("🚀 Running all Meta Pixel tests...");
    console.log("=====================================");
    
    checkPixelLoaded();
    
    if (typeof fbq !== 'undefined') {
        getPixelId();
        testPageView();
        testCustomEvent("ConsoleTestEvent");
        
        console.log("=====================================");
        console.log("✅ All tests completed successfully!");
        console.log("📊 Check Facebook Events Manager to verify events are received");
    } else {
        console.log("=====================================");
        console.log("❌ Tests failed - Pixel not loaded");
        console.log("💡 Try refreshing the page and check for errors");
    }
}

// Navigation test function
function testNavigation() {
    console.log("🧭 Navigation Test - Visit different pages to test PageView tracking");
    console.log("📍 Current URL:", window.location.href);
    
    if (typeof fbq !== 'undefined') {
        console.log("✅ Pixel loaded - navigate to different pages to test route tracking");
        console.log("💡 Try visiting: /products/[slug], /contact, /search, /admin");
    } else {
        console.log("❌ Pixel not loaded - navigation won't be tracked");
    }
}

// ==========================================
// AUTOMATIC VERIFICATION
// ==========================================

// Run basic checks on load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log("🔍 Auto-verifying Meta Pixel...");
        checkPixelLoaded();
        if (typeof fbq !== 'undefined') {
            getPixelId();
            console.log("✅ Meta Pixel is ready for testing");
        }
    }, 2000);
});

// ==========================================
// USAGE INSTRUCTIONS
// ==========================================

console.log("📘 Available commands:");
console.log("   checkPixelLoaded()      - Check if pixel is loaded");
console.log("   getPixelId()             - Get current Pixel ID");
console.log("   testPageView()           - Test PageView event");
console.log("   testCustomEvent('name')  - Test custom event");
console.log("   monitorEvents(10000)     - Monitor events for 10 seconds");
console.log("   runAllTests()            - Run all tests");
console.log("   testNavigation()         - Test navigation tracking");
console.log("=====================================");
console.log("💡 Tip: Use Meta Pixel Helper browser extension for visual debugging");