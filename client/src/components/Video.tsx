import { useRef, useEffect, useState } from "react";

const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const ScreenShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const sendMessage = (message: any) => {
    if (ws.current) {
      ws.current.send(JSON.stringify(message));
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(peerConnectionConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: "candidate", data: event.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state changed: ${pc.iceConnectionState}`);
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log("Remote track received and attached to video element.");
        remoteVideoRef.current.play();
      }
    };

    return pc;
  };

  const handleSignalingMessage = async (message: any) => {
    if (!peerConnection.current) {
      if (message.type === "offer" || message.type === "candidate") {
        peerConnection.current = createPeerConnection();
      } else {
        console.warn(
          `PeerConnection not initialized. Ignoring ${message.type}.`
        );
        return;
      }
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
        console.log(peerConnection.current.signalingState);
        if (peerConnection.current.signalingState === "have-local-offer") {
          console.log("Setting remote answer. State is 'have-local-offer'.");
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(message.data)
          );
        } else {
          console.warn(
            `Ignoring 'answer' received. Current state: ${peerConnection.current.signalingState}. Expected 'have-local-offer'.`
          );
        }
        break;

      case "candidate":
        if (message.data) {
          try {
            if (peerConnection.current.remoteDescription) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(message.data)
              );
            } else {
              console.log(
                "Candidate received before remote description is set. Waiting..."
              );
            }
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        }
        break;
    }
  };

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
    peerConnection.current?.close();
    peerConnection.current = null;
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
    setIsSharing(false);
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000/video");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      handleSignalingMessage(message);
    };

    ws.current.onopen = () => console.log("WebSocket connected!");
    ws.current.onclose = () => console.log("WebSocket disconnected.");

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebRTC Screen Sharing (No Rooms)</h1>
      <div style={{ marginBottom: "10px" }}>
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
          <h2>My Screen (Presenter View)</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "400px", border: "1px solid black" }}
          />
        </div>
        <div>
          <h2>Remote Screen (Viewer View)</h2>
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
