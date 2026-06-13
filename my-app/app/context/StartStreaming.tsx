import { Buffer } from 'buffer';
import React, { createContext, ReactNode, useRef, useState } from 'react';
interface StreamContextType {
    frameUrl: string;
    connect: () => void;
    disconnect: () => void;
    error: boolean;
    closed: boolean;
    loading: boolean;
}

export const StreamContext = createContext<StreamContextType>('' as unknown as StreamContextType);

export const StreamProvider = ({ children }: { children: ReactNode }) => {
    const [frameUrl, setFrameUrl] = useState<string>('');
    const socketRef = useRef<WebSocket | null>(null);
    const [error, setError] = useState(false);
    const [closed, setClosed] = useState(true);
    const [loading, setLoading] = useState(true);
    const connect = () => {
        if (socketRef.current) return;


        const ws = new WebSocket('ws://0.0.0.0:8888/video?device=ios&id=user123');
        ws.binaryType = 'arraybuffer';
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setLoading(false);
            setError(false);
            setClosed(false);
        };

        ws.onmessage = (event) => {
            setLoading(false);
            const base64data = Buffer.from(event.data).toString('base64');
            setFrameUrl(`data:image/jpeg;base64,${base64data}`);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            socketRef.current = null;
            setClosed(true);
            setLoading(false);
        };

        ws.onerror = () => {
            console.error("WebSocket error");
            socketRef.current = null;
            setError(true);
            setClosed(true);
            setLoading(false);
        };
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            setFrameUrl('');
        }
    };
    return (
        <StreamContext.Provider value={{ frameUrl, connect, disconnect, error, closed, loading }}
        >
            {children}
        </StreamContext.Provider>
    );
};
