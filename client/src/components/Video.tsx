import { useRef, useEffect, useState } from "react";

// A basic configuration for the STUN server (helps clients find each other)
const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const ScreenShare = () => {
  const [room, setRoom] = useState("my-screen-share-room");
  const ws = useRef<WebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/signaling");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      handleSignalingMessage(message);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(peerConnectionConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: "candidate", data: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const handleSignalingMessage = async (message: any) => {
    if (!peerConnection.current) {
      peerConnection.current = createPeerConnection();
    }

    switch (message.type) {
      case "offer":
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(message.data)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        sendMessage({ type: "answer", data: answer });
        break;

      case "answer":
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(message.data)
        );
        break;

      case "candidate":
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(message.data)
        );
        break;
    }
  };

  const sendMessage = (message: any) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ ...message, room }));
    }
  };

  const handleJoinRoom = () => {
    sendMessage({ type: "join" });
    console.log(`Joined room: ${room}`);
  };

  const handleStartSharing = async () => {
    // --- 2. Get the user's screen stream ---
    const localStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;

    }

    peerConnection.current = createPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConnection.current!.addTrack(track, localStream);
    });

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    sendMessage({ type: "offer", data: offer });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebRTC Screen Sharing</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={handleJoinRoom}>Join Room</button>
        <button onClick={handleStartSharing}>Start Sharing</button>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h2>My Screen</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "400px", border: "1px solid black" }}
          />
        </div>
        <div>
          <h2>Remote Screen</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "400px", border: "1px solid black" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;
