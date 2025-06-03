import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useNavigate, useLocation } from "react-router";

const VideoRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const { roomId: roomID } = useParams();

  useEffect(() => {
    if (!user) {
      console.log("Navigating due to missing user data");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const userID = user?.id?.toString();
  const userName = `${user?.firstname} ${user?.lastname}`;

  const meetingContainerRef = useRef(null);
  const zpInstance = useRef(null); // Store instance for cleanup

  useEffect(() => {
    if (!user) return;

    if (meetingContainerRef.current) {
      const appID = 469540022;
      const serverSecret = "d5487de96cfc24b73bae4b0f6ea2f77c";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpInstance.current = zp; // Store the instance
      zp.joinRoom({
        container: meetingContainerRef.current,
        audio: true,
        video: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    }

    return () => {
      if (zpInstance.current) {
        zpInstance.current.destroy(); // Proper cleanup
      }
    };
  }, [user, roomID]);

  return (
    <div
      className="myCallContainer w-screen h-screen max-w-[100vw] max-h-[100vh] overflow-hidden"
      ref={meetingContainerRef}
    ></div>
  );
};

export default VideoRoom;
