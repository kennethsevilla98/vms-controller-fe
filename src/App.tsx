import { DialogContent } from "@radix-ui/react-dialog";
import { EPSON_LOGO_WHITE, VERIFYI } from "./assets/images";
import { Dialog } from "./components/ui/dialog";
import { useRealTimeClock } from "./hooks/useRealTimeClock";

function App() {
  const philippinesTime = useRealTimeClock("Asia/Manila");
  const today = new Date();
  const todate = `${today.toLocaleString("default", {
    month: "long",
  })} ${today.getDate()}, ${today.getFullYear()}`;

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
        <Dialog>
          <DialogContent className="bg-accent p-10 w-2/3 h-1/3 rounded-2xl border-green-700 border-4">
            <p className="text-4xl font-bold">Welcome to sample</p>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default App;
