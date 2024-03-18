import { useContext } from "react";

import { ButtonCreate } from "./styled";
import { RtcContext } from "../../context/RtcContext";

export default function CreateRoomButton() {
  const context = useContext(RtcContext);

  const createRoom = () => {
    context.socket?.emit("create-room");
  };

  return <ButtonCreate onClick={createRoom}>Create a room</ButtonCreate>;
}
