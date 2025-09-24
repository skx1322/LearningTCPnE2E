import { useRef, useEffect, useState } from "react";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const ScreenShare = () => {
  const [room, setRoom] = useState("my-screen-share-room");
  const [isSharing, setIsSharing] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const handleStartSharing = async () => {
    setIsSharing(true);

    try {
      const localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      if (peerConnection.current) {
        peerConnection.current.close();
      }

      peerConnection.current = createPeerConnection();

      localStream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, localStream);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      sendMessage({ type: "offer", data: offer });
    } catch (error) {
      console.error("Error starting screen share:", error);
      setIsSharing(false);
    }
  };

    const handleStopSharing = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    setIsSharing(false);
  };

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
        console.log(remoteVideoRef.current.srcObject);
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

        console.log(answer);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebRTC Screen Sharing</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          disabled={isSharing} // ✨ Disable input while sharing
        />
        <button onClick={handleJoinRoom} disabled={isSharing}>
          Join Room
        </button>

        {/* ✨ 3. Use the state to control the buttons */}
        {!isSharing ? (
          <button onClick={handleStartSharing}>Start Sharing</button>
        ) : (
          <button
            onClick={handleStopSharing}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Stop Sharing
          </button>
        )}
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
