import { DialogContent } from "@radix-ui/react-dialog";
import { EPSON_LOGO_WHITE, VERIFYI } from "./assets/images";
import { Dialog, DialogTitle } from "./components/ui/dialog";
import { useRealTimeClock } from "./hooks/useRealTimeClock";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getWebSocketUrl } from "./utils/env";
import { cn } from "./lib/utils";

const socketUrl = getWebSocketUrl();
type messageType =
  | "Invalid Expired Card"
  | "Valid Card"
  | "User Not Found"
  | "";

function App() {
  const philippinesTime = useRealTimeClock("Asia/Manila");
  const today = new Date();
  const todate = `${today.toLocaleString("default", {
    month: "long",
  })} ${today.getDate()}, ${today.getFullYear()}`;

  const [message, setMessage] = useState<messageType>("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit("join", "vms");
    };

    const handleData = (msg: messageType) => {
      console.log("Message from server:", msg);
      setMessage(msg);
      // 🧹 Clear any existing timeout before starting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // ⏰ Set a new timeout to clear message after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setMessage("");
      }, 5000);
    };

    socket.on("connect", handleConnect);
    socket.on("data", handleData);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("data", handleData);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="relative h-screen flex justify-center items-center flex-col bg-[#003F98] overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none select-none">
          <img
            src={EPSON_LOGO_WHITE}
            alt="Epson Logo Watermark"
            className="w-2/3 max-w-[500px] mb-10"
          />
          <img
            src={VERIFYI}
            alt="Verify Watermark"
            className="w-1/2 max-w-[400px]"
          />
        </div>

        {/* Foreground Content */}
        <div className="absolute flex gap-4 justify-between px-10 text-center bottom-10 bg-amber-950/20 w-full p-4">
          <p className="text-white opacity-70 text-4xl font-bold">{todate}</p>
          <p className="text-white opacity-70 text-4xl font-bold">
            {philippinesTime}
          </p>
        </div>
        <Dialog open={Boolean(message)} modal={true}>
          <DialogTitle></DialogTitle>
          <DialogContent
            className={cn(
              "p-32 shadow-2xl rounded-2xl border-4 text-center",

              message === "Valid Card"
                ? "border-green-700 bg-green-100 text-green-700"
                : "border-red-700 bg-red-100 text-red-700"
            )}
          >
            <p className="text-6xl font-bold">{message}</p>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default App;
