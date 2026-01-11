'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import Button from '@/components/ui/button';

type CallStatus = 'idle' | 'connecting' | 'connected' | 'ended' | 'error';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TestAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vapiAssistantId: string;
  assistantName: string;
}

export function TestAgentModal({
  isOpen,
  onClose,
  vapiAssistantId,
  assistantName,
}: TestAgentModalProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Vapi when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setError('Voice testing not configured. Please contact support.');
      return;
    }

    // Dynamic import to avoid SSR issues
    import('@vapi-ai/web').then(({ default: Vapi }) => {
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      // Set up event listeners
      vapi.on('call-start', () => {
        console.log('[TestAgent] Call started');
        setCallStatus('connected');
        setError(null);
      });

      vapi.on('call-end', () => {
        console.log('[TestAgent] Call ended');
        setCallStatus('ended');
      });

      vapi.on('speech-start', () => {
        setIsAssistantSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsAssistantSpeaking(false);
      });

      vapi.on('volume-level', (level: number) => {
        setVolumeLevel(level);
      });

      vapi.on('message', (message: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
        console.log('[TestAgent] Message:', message);

        // Handle transcript messages
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          const role = message.role === 'user' ? 'user' : 'assistant';
          if (message.transcript) {
            setMessages(prev => [...prev, {
              role,
              content: message.transcript!,
              timestamp: new Date(),
            }]);
          }
        }
      });

      vapi.on('error', (err: unknown) => {
        console.error('[TestAgent] Error:', err);
        // Extract meaningful error message from VAPI error object
        let errorMessage = 'An error occurred during the call';
        if (err && typeof err === 'object') {
          const vapiError = err as { message?: string; error?: { message?: string; statusCode?: number }; type?: string };
          if (vapiError.error?.message) {
            errorMessage = vapiError.error.message;
          } else if (vapiError.message) {
            errorMessage = vapiError.message;
          } else if (vapiError.type === 'start-method-error') {
            errorMessage = 'Failed to start call. The assistant may not be configured for web calls.';
          }
        }
        setError(errorMessage);
        setCallStatus('error');
      });
    }).catch((err) => {
      console.error('[TestAgent] Failed to load Vapi SDK:', err);
      setError('Failed to load voice call system. Please try again.');
    });

    return () => {
      // Cleanup on unmount
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [isOpen]);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setError('Voice call system not initialized. Please try again.');
      return;
    }

    if (!vapiAssistantId) {
      setError('No assistant ID configured. Please save your assistant configuration first.');
      return;
    }

    try {
      setCallStatus('connecting');
      setError(null);
      setMessages([]);

      console.log('[TestAgent] Starting call with assistant ID:', vapiAssistantId);
      await vapiRef.current.start(vapiAssistantId);
    } catch (err: unknown) {
      console.error('[TestAgent] Failed to start call:', err);
      // Extract meaningful error message
      let errorMessage = 'Failed to start call. Please check your microphone permissions.';
      if (err && typeof err === 'object') {
        const error = err as { message?: string; error?: { message?: string } };
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      setError(errorMessage);
      setCallStatus('error');
    }
  }, [vapiAssistantId]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setCallStatus('ended');
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  const handleClose = useCallback(() => {
    if (callStatus === 'connected' || callStatus === 'connecting') {
      endCall();
    }
    setCallStatus('idle');
    setError(null);
    setMessages([]);
    onClose();
  }, [callStatus, endCall, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Test Your Assistant</h2>
            <p className="text-sm text-slate-500">Talk to {assistantName} in your browser</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error display */}
          {error && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Call status display */}
          <div className="flex flex-col items-center justify-center py-8">
            {/* Status indicator */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all ${
              callStatus === 'idle' ? 'bg-slate-100' :
              callStatus === 'connecting' ? 'bg-amber-100 animate-pulse' :
              callStatus === 'connected' ? 'bg-emerald-100' :
              callStatus === 'ended' ? 'bg-slate-100' :
              'bg-rose-100'
            }`}>
              {callStatus === 'idle' && <Phone className="w-10 h-10 text-slate-400" />}
              {callStatus === 'connecting' && <Phone className="w-10 h-10 text-amber-500 animate-bounce" />}
              {callStatus === 'connected' && (
                <div className="relative">
                  <Mic className={`w-10 h-10 ${isAssistantSpeaking ? 'text-emerald-500' : 'text-emerald-400'}`} />
                  {/* Volume indicator */}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
                  />
                </div>
              )}
              {callStatus === 'ended' && <PhoneOff className="w-10 h-10 text-slate-400" />}
              {callStatus === 'error' && <PhoneOff className="w-10 h-10 text-rose-500" />}
            </div>

            {/* Status text */}
            <p className="text-sm font-medium text-slate-600 mb-2">
              {callStatus === 'idle' && 'Ready to test'}
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'connected' && (isAssistantSpeaking ? `${assistantName} is speaking...` : 'Listening...')}
              {callStatus === 'ended' && 'Call ended'}
              {callStatus === 'error' && 'Call failed'}
            </p>

            {/* Microphone permission hint */}
            {callStatus === 'idle' && (
              <p className="text-xs text-slate-400 text-center max-w-xs">
                Your browser will ask for microphone access when you start the call
              </p>
            )}
          </div>

          {/* Transcript area */}
          {messages.length > 0 && (
            <div className="mb-6 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transcript</span>
              </div>
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm ${msg.role === 'user' ? 'text-slate-700' : 'text-primary'}`}
                  >
                    <span className="font-medium">{msg.role === 'user' ? 'You' : assistantName}:</span>{' '}
                    {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {callStatus === 'idle' || callStatus === 'ended' || callStatus === 'error' ? (
              <Button
                onClick={startCall}
                className="px-8"
                size="lg"
              >
                <Phone className="w-4 h-4 mr-2" />
                {callStatus === 'idle' ? 'Start Test Call' : 'Try Again'}
              </Button>
            ) : (
              <>
                {/* Mute button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className={isMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : ''}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Mute
                    </>
                  )}
                </Button>

                {/* End call button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={endCall}
                  className="bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Test calls help verify your assistant configuration before receiving real calls
          </p>
        </div>
      </div>
    </div>
  );
}
