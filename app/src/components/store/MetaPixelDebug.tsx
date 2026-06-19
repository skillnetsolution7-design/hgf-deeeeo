"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1710517860088102";

export function MetaPixelDebug() {
  const [pixelStatus, setPixelStatus] = useState<{
    loaded: boolean;
    events: Array<{ eventName: string; timestamp: string; url: string }>;
    currentPixelId: string;
  }>({
    loaded: false,
    events: [],
    currentPixelId: META_PIXEL_ID,
  });

  useEffect(() => {
    // Check if fbq is loaded
    const checkPixelLoaded = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        setPixelStatus((prev) => ({ ...prev, loaded: true }));
        
        // Intercept fbq calls to track events
        const originalFbq = (window as any).fbq;
        (window as any).fbq = function(...args: any[]) {
          const eventName = args[1];
          if (eventName === 'PageView') {
            setPixelStatus((prev) => ({
              ...prev,
              events: [
                ...prev.events,
                {
                  eventName,
                  timestamp: new Date().toISOString(),
                  url: window.location.href,
                },
              ].slice(-10), // Keep last 10 events
            }));
          }
          return originalFbq.apply(this, args);
        };
      }
    };

    // Check immediately and then periodically
    checkPixelLoaded();
    const interval = setInterval(checkPixelLoaded, 1000);

    // Track page navigation
    const handleRouteChange = () => {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }
    };

    // Listen for Next.js route changes
    if (typeof window !== "undefined") {
      window.addEventListener('popstate', handleRouteChange);
      // For Next.js App Router, we need to use a different approach
      // This will be handled by the page components
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener('popstate', handleRouteChange);
      }
    };
  }, []);

  return (
    <>
      <Script id="meta-pixel-debug" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      
      {/* Debug Panel - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-2xl z-[9999] max-w-sm max-h-96 overflow-auto font-mono text-xs">
          <div className="font-bold text-gold mb-2">Meta Pixel Debug Panel</div>
          <div className="mb-2">
            <strong>Pixel ID:</strong> {pixelStatus.currentPixelId}
          </div>
          <div className="mb-2">
            <strong>Status:</strong> {pixelStatus.loaded ? '✅ Loaded' : '⏳ Loading...'}
          </div>
          <div className="mb-2">
            <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
          </div>
          <div>
            <strong>Recent PageView Events:</strong>
            {pixelStatus.events.length === 0 ? (
              <div className="text-gray-400 mt-1">No events tracked yet</div>
            ) : (
              <ul className="mt-1 space-y-1">
                {pixelStatus.events.map((event, index) => (
                  <li key={index} className="text-green-400">
                    {event.timestamp.split('T')[1].split('.')[0]} - {event.url}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && (window as any).fbq) {
                (window as any).fbq('track', 'PageView');
                setPixelStatus((prev) => ({
                  ...prev,
                  events: [
                    ...prev.events,
                    {
                      eventName: 'PageView',
                      timestamp: new Date().toISOString(),
                      url: window.location.href,
                    },
                  ].slice(-10),
                }));
              }
            }}
            className="mt-2 px-2 py-1 bg-gold text-black rounded text-xs hover:bg-yellow-500"
          >
            Test PageView Event
          </button>
        </div>
      )}
    </>
  );
}