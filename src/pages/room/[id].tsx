import dynamic from "next/dynamic";

const RoomPage = dynamic(() => import("../../components/RoomPage"), {
  ssr: false,
});

export default () => {
  return <RoomPage />;
};
