import { useState } from "react";
import Startup from "../components/Startup"
import Terminal from "../components/AnimatedTerminal"
import DateTime from "../components/DateTime";
import Hardware from "../components/Hardware";

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  if(isLoading) {
    return (
      <div>
        <div className="bg-image"></div>
        <Startup onComplete={() => { setIsLoading(false) }} />)
     </div>
    )
  }else{
    return (
      <div>
        <div className="bg-image"></div>
        <DateTime isActive={true} />
        <Hardware isActive={true} />
        <Terminal isActive={true} useAudio={true} />
      </div>
    )
  }
}

export default App
