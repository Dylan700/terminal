import { useState } from "react";
import Startup from "../components/Startup"
import Terminal from "../components/Terminal"
import DateTime from "../components/DateTime";

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div>
      <DateTime />
      {isLoading && <Startup onComplete={() => { setIsLoading(false) }} />}
      {!isLoading && <Terminal useAudio={true} />}
    </div>
  )
}

export default App
