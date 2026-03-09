import React, { useEffect, useRef } from 'react'

interface GoogleMapProps {
  latitude: number
  longitude: number
  zoom?: number
  height?: string
  width?: string
  hotelName?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

function GoogleMap({ 
  latitude, 
  longitude, 
  zoom = 15, 
  height = '300px', 
  width = '100%',
  hotelName = 'Hotel Location'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Wait for the script to load
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps)
            initializeMap()
          }
        }, 100)
        return
      }

      // Load Google Maps script
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO4_EwWY5TY-7c&libraries=places`
      script.async = true
      script.defer = true
      
      window.initMap = initializeMap
      script.onload = initializeMap
      
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      })

      // Add marker for hotel location
      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: hotelName,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0F4C3A">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #0F4C3A; font-size: 16px; font-weight: bold;">
              ${hotelName}
            </h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
            </p>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      mapInstanceRef.current = map
    }

    loadGoogleMaps()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, zoom, hotelName])

  // Update map center when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      const newCenter = { lat: latitude, lng: longitude }
      mapInstanceRef.current.setCenter(newCenter)
      
      // Clear existing markers and add new one
      mapInstanceRef.current.markers?.forEach((marker: any) => marker.setMap(null))
      
      const marker = new window.google.maps.Marker({
        position: newCenter,
        map: mapInstanceRef.current,
        title: hotelName,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0F4C3A">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      })

      // Store marker reference for cleanup
      if (!mapInstanceRef.current.markers) {
        mapInstanceRef.current.markers = []
      }
      mapInstanceRef.current.markers.push(marker)
    }
  }, [latitude, longitude, hotelName])

  if (!latitude || !longitude) {
    return (
      <div 
        style={{ height, width }} 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📍</div>
          <p className="text-sm">No location coordinates available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width }} 
        className="rounded-lg border border-gray-300 shadow-sm"
      />
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  )
}

export default GoogleMap