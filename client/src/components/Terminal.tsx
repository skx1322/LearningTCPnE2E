import { useState, useRef, useEffect } from "react";
import type { Line } from "../types/types";
import { summaryAPI } from "../api/summaryAPI";

const Terminal = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const terminalRef = useRef<HTMLDivElement>(null);

  const connectWebSocket = () => {
    if (ws) return;
    const socket = new WebSocket(summaryAPI.chatSocket.url);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
      setLines((prev) => [
        ...prev,
        { text: "Connected to server.", isInput: false },
      ]);

      if (username) {
        socket.send(
          JSON.stringify({ command: "SET-USERNAME", payload: username })
        );
      }
    };

    socket.onmessage = (event: { data: string }) => {
      try {
        const data = JSON.parse(event.data);
        if (data.user && data.message) {
          const output = `[${data.user}]: ${data.message}`;
          setLines((prev) => [...prev, { text: output, isInput: false }]);
        } else {
          setLines((prev) => [...prev, { text: event.data, isInput: false }]);
        }
      } catch (error) {
        setLines((prev) => [
          ...prev,
          { text: `[SERVER]: ${event.data}`, isInput: false },
        ]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setUsername(null);
      setLines((prev) => [
        ...prev,
        { text: "Disconnected from server.", isInput: false },
      ]);
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLines((prev) => [
        ...prev,
        { text: "WebSocket connection error.", isInput: false },
      ]);
      setUsername(null);
    };

    setWs(socket);
  };

  useEffect(() => {
    setLines(() => [{ text: "Type 'HELP' to see command.", isInput: false }]);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const command = input.trim();
      const lowerCaseCommand = command.toLocaleLowerCase();

      if (command) {
        setLines((prevLines) => [
          ...prevLines,
          { text: `> ${command}`, isInput: true },
        ]);

        if (lowerCaseCommand === "help") {
          setLines((prev) => [
            ...prev,
            {
              text: "JOIN-CHAT AS <your_username> to join chat.",
              isInput: false,
            },
            {
              text: "LEAVE-CHAT to leave chat.",
              isInput: false,
            },
          ]);
        } else if (
          lowerCaseCommand.startsWith("join-chat as ") &&
          !isConnected
        ) {
          const name = command.substring("join-chat as ".length).trim();
          if (name) {
            setUsername(name);
            setLines((prev) => [
              ...prev,
              { text: `Joining chat as ${name}...`, isInput: false },
            ]);
            connectWebSocket();
          } else {
            setLines((prev) => [
              ...prev,
              {
                text: "Invalid username. Please provide a name after 'JOIN-CHAT AS'.",
                isInput: false,
              },
            ]);
          }
        } else if (lowerCaseCommand === "leave-chat" && isConnected) {
          if (ws) {
            setUsername(null);
            ws.close();
          }
        } else if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              command: "MESSAGE",
              payload: command,
              username: username,
            })
          );
        } else if (!isConnected && lowerCaseCommand !== "help") {
          setLines((prev) => [
            ...prev,
            {
              text: "Not connected to server. Type 'JOIN-CHAT AS <your_username>' to connect.",
              isInput: false,
            },
          ]);
        }
        setInput("");
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="bg-gray-950 text-blue-400 p-4 font-mono w-full h-full flex flex-col rounded-lg border border-blue-900">
      <div className="flex-1 overflow-y-auto mb-2" ref={terminalRef}>
        {lines.map((line, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap break-words ${line.isInput ? "text-green-400" : "text-sky-300"}`}
          >
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-blue-800 pt-2">
        <span
          className={`mr-2 text-left whitespace-nowrap ${
            isConnected ? "text-green-400" : "text-amber-300"
          }`}
        >
          {username ? `PS C:\\Users>${username}` : `PS C:\\Users>`}
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
