import React, { useState, useEffect, useRef } from "react";
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
  const streamRef = useRef<HTMLDivElement>(null);

  const streamUrl = "http://10.12.73.154:8081";

  useEffect(() => {
    testConnection();
  }, []);

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

  const testConnection = async () => {
    try {
      setErrorMessage("Testing connection...");

      // Test with a simple fetch
      const response = await fetch(streamUrl, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (response.ok) {
        setHasError(false);
        setErrorMessage("");
        setIsStreaming(true);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setHasError(true);
      // Fix the TypeScript error by checking error type
      if (error instanceof Error) {
        setErrorMessage(`Connection failed: ${error.message}`);
      } else {
        setErrorMessage(`Connection failed: Unknown error`);
      }
      setIsStreaming(false);
      console.error("Connection test failed:", error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setErrorMessage("Image failed to load - connection timeout");
    setIsStreaming(false);
  };

  const handleImageLoad = () => {
    setHasError(false);
    setErrorMessage("");
    console.log("Camera stream loaded successfully");
  };

  const startStream = () => {
    setHasError(false);
    setErrorMessage("");
    setCurrentUrl(`${streamUrl}?t=${Date.now()}`);
    setIsStreaming(true);
  };

  const stopStream = () => {
    setIsStreaming(false);
  };

  return (
    <div
      ref={streamRef}
      className={`w-full h-full flex flex-col relative ${isFullscreen ? 'bg-black' : 'bg-gray-50'
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
          {currentUrl && <div>Current: {currentUrl}</div>}
          <div>Status: {isStreaming ? 'Streaming' : 'Stopped'}</div>
          <div>Fullscreen: {isFullscreen ? 'Yes' : 'No'}</div>
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
                <li>Check Motion is running: <code>ps aux | grep motion</code></li>
                <li>Test direct URL in browser tab</li>
                <li>Check if devices are on same network</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={testConnection}
                variant="destructive"
                size="sm"
              >
                Test Connection
              </Button>
              <Button
                onClick={startStream}
                size="sm"
              >
                Try Stream Anyway
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Stream Area */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        {isStreaming ? (
          <div className="w-full h-full relative">
            <img
              src={currentUrl || `${streamUrl}?t=${Date.now()}`}
              alt="Live Camera Stream"
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={`w-full h-full object-contain ${isFullscreen ? 'rounded-none' : 'rounded-lg'
                }`}
            />

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
                  onClick={startStream}
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
              onClick={startStream}
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