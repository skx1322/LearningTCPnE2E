import { useState, useRef, useEffect } from "react";
import type { Line } from "../types/types";

interface ServerMessage {
  command: string;
  message?: string;
  data?: any;
}

const Terminal = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000/ws`);
    ws.current = socket;
    
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
      setLines((prev) => [...prev, { text: "✅ Connected to server.", isInput: false }]);
    };

    socket.onmessage = (event) => {
      const response: ServerMessage = JSON.parse(event.data);
      let output = `[SERVER]: ${response.command}`;
      setLines((prev) => [...prev, { text: output, isInput: false }]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setLines((prev) => [...prev, { text: "❌ Disconnected from server.", isInput: false }]);
    };

    return () => {
      socket.close();
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const command = input.trim();
      if (command) {
        setLines((prevLines) => [...prevLines, { text: `> ${command}`, isInput: true }]);
        
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ command: "TERMINAL_INPUT", payload: command }));
        } else {
          setLines((prev) => [...prev, { text: "Not connected to server.", isInput: false }]);
        }

        setInput("");
      }
    }
  };

  return (
    <div className="bg-gray-950 text-blue-400 p-4 font-mono w-full h-full flex flex-col rounded-lg border border-blue-900">
      <div className="flex-1 overflow-y-auto mb-2" ref={terminalRef}>
        {lines.map((line, index) => (
          <div
            key={index}
            className={line.isInput ? "text-green-400" : "text-blue-400"}
          >
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-blue-800 pt-2">
        <span className={`mr-2 text-left whitespace-nowrap ${isConnected ? 'text-green-400' : 'text-red-500'}`}>
          {`PS C:\\Users\\NERDANTA>`}
        </span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-blue-400 outline-none w-full resize-none h-auto overflow-hidden leading-snug"
          rows={1}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;