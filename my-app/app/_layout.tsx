import { Slot } from "expo-router"; // or 'Stack' if you want a header
import { StreamProvider } from "./context/StartStreaming";

export default function RootLayout() {
  return (
    <StreamProvider>
      {/* Slot is where your 'Index' and other pages will render */}
      <Slot />
    </StreamProvider>
  )
}