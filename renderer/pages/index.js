import { useState } from "react";
import Startup from "../components/Startup"
import Terminal from "../components/Terminal"
import DateTime from "../components/DateTime";
import Hardware from "../components/Hardware";

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div>
      <div className="bg-image"></div>
      <DateTime />
      <Hardware />
      {isLoading && <Startup onComplete={() => { setIsLoading(false) }} />}
      {!isLoading && <Terminal useAudio={true} />}
    </div>
  )
}

export default App
