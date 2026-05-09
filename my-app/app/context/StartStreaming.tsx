import React, { createContext, useState, useRef, ReactNode, useContext } from 'react';
import { Buffer } from 'buffer';
interface StreamContextType {
    frameUrl: string;
    connect: () => void;
    disconnect: () => void;
    error: Error | null;
    closed: boolean;
}

export const StreamContext = createContext<StreamContextType>('' as unknown as StreamContextType);

export const StreamProvider = ({ children }: { children: ReactNode }) => {
    const [frameUrl, setFrameUrl] = useState<string>('');
    const socketRef = useRef<WebSocket | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [closed, setClosed] = useState(true);

    const connect = () => {
        if (socketRef.current) return;
        const ws = new WebSocket('ws://192.168.3.5:8888/video?device=ios&id=user123');
        ws.binaryType = 'arraybuffer';
        setClosed(false);
        ws.onopen = () => {
            console.log("WebSocket connected");
        };
        ws.onmessage = (event) => {
            if (typeof event.data === 'string') return;
            const rawData = event.data;
            const base64data = Buffer.from(rawData).toString('base64');
            setFrameUrl(`data:image/jpeg;base64,${base64data}`);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            socketRef.current = null;
            setClosed(true);
        };
        ws.onerror = () => {
            console.error("WebSocket error");
            socketRef.current = null;
        };

        socketRef.current = ws;
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            if (frameUrl) URL.revokeObjectURL(frameUrl);
            setFrameUrl('');
        }
    };

    return (
        <StreamContext.Provider value={{ frameUrl, connect, disconnect, error, closed }}
        >
            {children}
        </StreamContext.Provider>
    );
};
