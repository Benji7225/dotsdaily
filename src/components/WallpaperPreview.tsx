import { useState, useEffect } from 'react';
import { Flashlight, Camera } from 'lucide-react';
import { ModelSpecs } from '../utils/iPhoneModels';

interface WallpaperPreviewProps {
  url: string;
  modelSpecs: ModelSpecs | null;
  theme: 'dark' | 'light';
}

export default function WallpaperPreview({ url, modelSpecs, theme }: WallpaperPreviewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!modelSpecs) {
    return (
      <div className="text-center text-slate-500 py-12">
        Modèle non disponible
      </div>
    );
  }

  const aspectRatio = (modelSpecs.height / modelSpecs.width) * 100;
  const hasDynamicIsland = modelSpecs.safeArea.top >= 100;
  const hasNotch = modelSpecs.safeArea.top >= 140 && !hasDynamicIsland;
  const hasHomeButton = modelSpecs.safeArea.top < 100;

  const displayWidth = Math.round((modelSpecs.width / 430) * 280);

  const scaleFactor = displayWidth / 280;
  const dynamicIslandWidth = Math.round(90 * scaleFactor);
  const dynamicIslandHeight = Math.round(28 * scaleFactor);
  const notchWidth = Math.round(150 * scaleFactor);
  const notchHeight = Math.round(26 * scaleFactor);

  const textColor = theme === 'dark' ? 'white' : '#1e293b';
  const iconColor = theme === 'dark' ? 'white' : '#334155';

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return currentTime.toLocaleDateString('fr-FR', options);
  };

  return (
    <div>
      <div className="relative mx-auto" style={{ maxWidth: `${displayWidth}px` }}>
          <div className="relative" style={{ paddingBottom: `${aspectRatio}%` }}>
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <div
                  className="absolute inset-0 rounded-[2.5rem] overflow-hidden"
                  style={{
                    boxShadow: '0 0 0 2px #2d2d2d, 0 0 0 3px #3a3a3a, 0 15px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className={`relative w-full h-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                    {url ? (
                      <img
                        src={url.startsWith('blob:') ? url : `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`}
                        alt="Aperçu du fond d'écran"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Chargement...
                      </div>
                    )}

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="relative w-full h-full">
                        <div
                          className="absolute top-0 left-0 right-0 px-6 flex items-center justify-between z-20"
                          style={{
                            paddingTop: hasDynamicIsland ? '14px' : hasNotch ? '12px' : '10px',
                            fontSize: '15px',
                            fontWeight: '600',
                            textShadow: theme === 'dark' ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(255,255,255,0.8)',
                            color: textColor
                          }}
                        >
                          <div> DotsDaily </div>
                          <div className="flex items-center gap-1.5">
                            <svg width="17" height="12" viewBox="0 0 17 12" fill="none" className="drop-shadow-md">
                              <path d="M15.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V10.5C0.5 11.0523 0.947715 11.5 1.5 11.5H15.5C16.0523 11.5 16.5 11.0523 16.5 10.5V1.5C16.5 0.947715 16.0523 0.5 15.5 0.5Z" fill={iconColor}/>
                              <path d="M0.5 3.5H16.5" stroke={iconColor} strokeWidth="0.5"/>
                              <path d="M0.5 5.5H16.5" stroke={iconColor} strokeWidth="0.5"/>
                              <path d="M0.5 7.5H16.5" stroke={iconColor} strokeWidth="0.5"/>
                            </svg>
                            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="drop-shadow-md">
                              <rect x="0.5" y="0.5" width="18" height="11" rx="2" stroke={iconColor} strokeWidth="1" fill="none"/>
                              <rect x="2" y="2" width="14" height="8" rx="1" fill={iconColor}/>
                              <rect x="19" y="4" width="2" height="4" rx="1" fill={iconColor}/>
                            </svg>
                          </div>
                        </div>

                        <div
                          className="absolute left-0 right-0 text-center"
                          style={{
                            top: hasDynamicIsland ? '80px' : hasNotch ? '70px' : '55px',
                            textShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 8px rgba(255,255,255,0.8)',
                            color: textColor
                          }}
                        >
                          <div
                            style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              letterSpacing: '0.2px',
                              marginBottom: '2px',
                              opacity: 0.9
                            }}
                          >
                            {formatDate()}
                          </div>
                          <div
                            style={{
                              fontSize: '64px',
                              fontWeight: '700',
                              letterSpacing: '-2px',
                              lineHeight: '1',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {formatTime()}
                          </div>
                        </div>

                        <div
                          className="absolute left-0 right-0 flex justify-between items-center px-8"
                          style={{ bottom: hasHomeButton ? '45px' : '40px' }}
                        >
                          <button
                            className="rounded-full backdrop-blur-xl flex items-center justify-center"
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <Flashlight className="w-4 h-4" style={{ color: iconColor }} strokeWidth={2} />
                          </button>
                          <button
                            className="rounded-full backdrop-blur-xl flex items-center justify-center"
                            style={{
                              width: '42px',
                              height: '42px',
                              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <Camera className="w-4 h-4" style={{ color: iconColor }} strokeWidth={2} />
                          </button>
                        </div>

                        {!hasHomeButton && (
                          <div
                            className="absolute left-1/2 transform -translate-x-1/2"
                            style={{ bottom: '8px' }}
                          >
                            <div
                              className="rounded-full"
                              style={{
                                width: '140px',
                                height: '5px',
                                opacity: 0.9,
                                backgroundColor: theme === 'dark' ? 'white' : '#1e293b'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {hasDynamicIsland && (
                      <div className="absolute top-[1.8%] left-1/2 transform -translate-x-1/2 z-30">
                        <div
                          className="bg-black rounded-full"
                          style={{
                            width: `${dynamicIslandWidth}px`,
                            height: `${dynamicIslandHeight}px`,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.8)',
                          }}
                        />
                      </div>
                    )}

                    {hasNotch && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
                        <div
                          className="bg-black"
                          style={{
                            width: `${notchWidth}px`,
                            height: `${notchHeight}px`,
                            borderBottomLeftRadius: `${Math.round(16 * scaleFactor)}px`,
                            borderBottomRightRadius: `${Math.round(16 * scaleFactor)}px`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute -left-[2px] top-[15%] w-[3px] h-7 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l-md shadow-lg" />
                <div className="absolute -left-[2px] top-[23%] w-[3px] h-11 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l-md shadow-lg" />
                <div className="absolute -left-[2px] top-[33%] w-[3px] h-11 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l-md shadow-lg" />

                <div className="absolute -right-[2px] top-[20%] w-[3px] h-14 bg-gradient-to-l from-slate-700 to-slate-800 rounded-r-md shadow-lg" />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
