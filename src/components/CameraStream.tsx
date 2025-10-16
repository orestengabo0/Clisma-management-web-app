import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Maximize2, Minimize2, RotateCcw, Play, Square } from "lucide-react";

const CameraStream: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [streamKey, setStreamKey] = useState(0);
  const streamRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isCleaningUp = useRef(false);

  const streamUrl = "http://172.16.0.174:8082/video_feed";

  // Comprehensive cleanup function
  const cleanupStream = useCallback(() => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    console.log("Cleaning up stream...");

    // Clear image source and remove all event handlers
    if (imgRef.current) {
      try {
        imgRef.current.src = '';
        imgRef.current.srcset = '';
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      } catch (e) {
        console.error("Error during cleanup:", e);
      }
    }

    // Reset all state
    setIsStreaming(false);
    setCurrentUrl("");
    setHasError(false);
    setErrorMessage("");

    isCleaningUp.current = false;
  }, []);

  // Handle page visibility change (switching tabs/windows)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Page hidden - stopping stream");
        cleanupStream();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cleanupStream]);

  // Handle component unmount and page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("Page unloading - stopping stream");
      cleanupStream();
    };

    const handleUnload = () => {
      cleanupStream();
    };

    // Add multiple event listeners to ensure cleanup
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    // Component unmount cleanup
    return () => {
      console.log("Component unmounting - stopping stream");
      cleanupStream();
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [cleanupStream]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!streamRef.current) return;

    if (!isFullscreen) {
      if (streamRef.current.requestFullscreen) {
        streamRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Test connection
  const testConnection = async () => {
    try {
      setErrorMessage("Testing connection...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(streamUrl, {
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setHasError(false);
        setErrorMessage("");
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setHasError(true);
      if (error instanceof Error) {
        setErrorMessage(`Connection failed: ${error.message}`);
      } else {
        setErrorMessage(`Connection failed: Unknown error`);
      }
      console.error("Connection test failed:", error);
      return false;
    }
  };

  // Handle image load error with recovery
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image load error - stream failed");
    setHasError(true);
    setErrorMessage("Stream connection lost");

    // Don't auto-recover, let user manually restart
    // This prevents infinite retry loops
  }, []);

  // Handle successful image load
  const handleImageLoad = useCallback(() => {
    console.log("Stream loaded successfully");
    setHasError(false);
    setErrorMessage("");
  }, []);

  // Start stream
  const startStream = useCallback(() => {
    console.log("Starting stream...");
    
    // Force cleanup first
    cleanupStream();
    
    // Small delay to ensure cleanup completed
    setTimeout(() => {
      setHasError(false);
      setErrorMessage("");
      const newUrl = `${streamUrl}?t=${Date.now()}`;
      setCurrentUrl(newUrl);
      setIsStreaming(true);
      setStreamKey(prev => prev + 1);
      console.log("Stream started with URL:", newUrl);
    }, 100);
  }, [cleanupStream, streamUrl]);

  // Stop stream
  const stopStream = useCallback(() => {
    console.log("Stopping stream...");
    cleanupStream();
    setStreamKey(prev => prev + 1);
  }, [cleanupStream]);

  // Refresh stream
  const refreshStream = useCallback(() => {
    console.log("Refreshing stream...");
    cleanupStream();
    
    setTimeout(() => {
      startStream();
    }, 300);
  }, [cleanupStream, startStream]);

  return (
    <div
      ref={streamRef}
      className={`w-full h-full flex flex-col relative ${
        isFullscreen ? 'bg-black' : 'bg-gray-50'
      }`}
    >
      {/* Control Bar */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          Debug
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>

      {/* Debug Info */}
      {showDebugInfo && (
        <div className="absolute top-12 right-2 z-10 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div>Stream URL: {streamUrl}</div>
          {currentUrl && <div className="truncate">Current: {currentUrl.substring(0, 50)}...</div>}
          <div>Status: {isStreaming ? 'Streaming' : 'Stopped'}</div>
          <div>Has Error: {hasError ? 'Yes' : 'No'}</div>
          <div>Fullscreen: {isFullscreen ? 'Yes' : 'No'}</div>
          <div>Stream Key: {streamKey}</div>
          <div>Page Hidden: {document.hidden ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Error Display */}
      {hasError && !isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="bg-red-50 border-red-200 p-6 max-w-md mx-4">
            <div className="text-red-800 font-semibold mb-2">Connection Failed</div>
            <div className="text-red-600 text-sm mb-4">
              {errorMessage}
            </div>
            <div className="text-red-500 text-xs mb-4">
              Troubleshooting:
              <ul className="list-disc list-inside mt-1">
                <li>Verify Pi is powered on and connected to network</li>
                <li>Check server is running: <code>./manage.sh status</code></li>
                <li>Test direct URL in browser tab</li>
                <li>Check if devices are on same network</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  const connected = await testConnection();
                  if (connected) {
                    setTimeout(() => startStream(), 500);
                  }
                }}
                variant="destructive"
                size="sm"
              >
                Test Connection
              </Button>
              <Button
                onClick={refreshStream}
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Stream Area */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        {isStreaming ? (
          <div className="w-full h-full relative">
            {currentUrl && (
              <img
                key={streamKey}
                ref={imgRef}
                src={currentUrl}
                alt="Live Camera Stream"
                onError={handleImageError}
                onLoad={handleImageLoad}
                className={`w-full h-full object-contain ${
                  isFullscreen ? 'rounded-none' : 'rounded-lg'
                }`}
              />
            )}

            {/* Stream Controls Overlay */}
            {isFullscreen && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  onClick={stopStream}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600/80 hover:bg-red-700/80"
                >
                  <Square size={16} className="mr-1" />
                  Stop
                </Button>
                <Button
                  onClick={refreshStream}
                  variant="secondary"
                  size="sm"
                  className="bg-green-600/80 hover:bg-green-700/80"
                >
                  <RotateCcw size={16} className="mr-1" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-gray-500 mb-6 text-center">
              <div className="text-lg mb-2">Camera Stream Ready</div>
              <div className="text-sm">Click to start live streaming</div>
            </div>
            <Button
              onClick={startStream}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play size={20} className="mr-2" />
              Start Stream
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Controls (only when not fullscreen) */}
      {isStreaming && !isFullscreen && (
        <div className="p-4 bg-white border-t flex justify-center">
          <div className="flex gap-2">
            <Button
              onClick={stopStream}
              variant="destructive"
              size="sm"
            >
              <Square size={16} className="mr-1" />
              Stop Stream
            </Button>
            <Button
              onClick={refreshStream}
              variant="outline"
              size="sm"
            >
              <RotateCcw size={16} className="mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraStream;