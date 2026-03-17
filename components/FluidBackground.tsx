"use client"

import { useEffect, useRef } from "react"

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let WebGLFluid: any;
    
    const initFluid = async () => {
      if (typeof window !== "undefined" && canvasRef.current) {
        // Dynamically import to avoid SSR issues
        const { default: init } = await import("webgl-fluid")
        WebGLFluid = init
        
        WebGLFluid(canvasRef.current, {
          IMMEDIATE: false,             // disabled initial load splash
          TRIGGER: "hover",
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 512,
          CAPTURE_RESOLUTION: 512,
          DENSITY_DISSIPATION: 2.5,     // Moderate fade
          VELOCITY_DISSIPATION: 1.5,
          PRESSURE: 0.2,
          PRESSURE_ITERATIONS: 20,
          CURL: 5,
          SPLAT_RADIUS: 0.25,           // Moderate size
          SPLAT_FORCE: 5000,
          SHADING: true,
          COLORFUL: true,               // Keep the beautiful WebGL colors
          COLOR_UPDATE_SPEED: 10,
          PAUSED: false,
          TRANSPARENT: true,            // Fluid interacts transparently WITH the background
          BLOOM: true,
          BLOOM_ITERATIONS: 8,
          BLOOM_RESOLUTION: 256,
          BLOOM_INTENSITY: 0.8,
          BLOOM_THRESHOLD: 0.5,
          BLOOM_SOFT_KNEE: 0.7,
          SUNRAYS: true,
          SUNRAYS_RESOLUTION: 196,
          SUNRAYS_WEIGHT: 0.3,
        })
      }
    }

    initFluid()

    // Proxy mouse/touch events from window to the canvas seamlessly below
    // We use a custom Event because the WebGL fluid strictly reads `e.offsetX` and `e.offsetY`
    const handleProxyEvent = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const customEvent = new Event(e.type) as any;
      customEvent.offsetX = e.clientX;
      customEvent.offsetY = e.clientY;
      customEvent.clientX = e.clientX;
      customEvent.clientY = e.clientY;
      
      canvasRef.current.dispatchEvent(customEvent);
    }

    const handleTouchProxyEvent = (e: TouchEvent) => {
      if (!canvasRef.current) return;
      
      const customEvent = new Event(e.type) as any;
      customEvent.targetTouches = e.targetTouches;
      customEvent.touches = e.touches;
      customEvent.changedTouches = e.changedTouches;
      
      // Prevent the fluid's preventDefault from breaking page scroll
      customEvent.preventDefault = () => {};
      
      canvasRef.current.dispatchEvent(customEvent);
    }

    window.addEventListener("mousemove", handleProxyEvent)
    window.addEventListener("mousedown", handleProxyEvent)
    window.addEventListener("mouseup", handleProxyEvent)
    
    window.addEventListener("touchmove", handleTouchProxyEvent, { passive: false })
    window.addEventListener("touchstart", handleTouchProxyEvent, { passive: false })
    window.addEventListener("touchend", handleTouchProxyEvent)

    // Intercept spacebar before the webgl-fluid library receives it to prevent random splats 
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener("keydown", handleKeyDown, { capture: true })

    return () => {
      window.removeEventListener("mousemove", handleProxyEvent)
      window.removeEventListener("mousedown", handleProxyEvent)
      window.removeEventListener("mouseup", handleProxyEvent)
      
      window.removeEventListener("touchmove", handleTouchProxyEvent)
      window.removeEventListener("touchstart", handleTouchProxyEvent)
      window.removeEventListener("touchend", handleTouchProxyEvent)
      window.removeEventListener("keydown", handleKeyDown, { capture: true })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: 0.7 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
