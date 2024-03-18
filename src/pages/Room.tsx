import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { RtcContext } from "../context/RtcContext";
import { PeerState } from "../context/peerReducer";
import { ShareScreenButton, VideoPlayer } from "../components";

export default function Room() {
  const { id } = useParams();

  const { me, socket, stream, peers } = useContext(RtcContext);

  useEffect(() => {
    console.log(me?.id);
    if (me) socket?.emit("join-room", { roomId: id, peerId: me?.id });
  }, [id, me?.id]);

  return (
    <>
      <div>
        <div>Room id {id}</div>
        <VideoPlayer stream={stream!} />
        {Object.values(peers as PeerState).map((peer, index) => (
          <VideoPlayer key={index} stream={peer.stream} />
        ))}
      </div>
      <div>
        <ShareScreenButton />
      </div>
    </>
  );
}
