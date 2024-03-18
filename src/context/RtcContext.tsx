import React, { createContext, useEffect, useState, useReducer } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

import { PeerState, peerReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

interface IRtcContext {
  socket: Socket | null;
  me: Peer | undefined;
  stream: MediaStream | undefined;
  peers: PeerState | undefined;
}
export const RtcContext = createContext<IRtcContext>({
  socket: null,
  me: undefined,
  stream: undefined,
  peers: undefined,
});

const URL = "http://localhost:3000";
const socket = io(URL, { transports: ["websocket"] });

interface IRtcProvider {
  children: React.ReactNode;
}

interface IGetUsers {
  participants: string[];
  roomId: string;
}

export const RtcProvider: React.FC<IRtcProvider> = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`room created ${roomId}`);
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants, roomId }: IGetUsers) => {
    console.log(roomId, participants);
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    console.log(peer);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    socket.on("room-created", enterRoom);
    socket.on("get-users", getUsers);
    socket.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    socket.on("user-joined", ({ peerId }: { peerId: string }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on("call", (call: MediaConnection) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log({ peers });

  return (
    <RtcContext.Provider value={{ socket, me, stream, peers }}>
      {children}
    </RtcContext.Provider>
  );
};
