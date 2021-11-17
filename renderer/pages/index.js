import { useEffect, useState } from "react";
import Startup from "../components/Startup"
import Terminal from "../components/AnimatedTerminal"
import DateTime from "../components/DateTime";
import Hardware from "../components/Hardware";
import Network from "../components/Network";
import useTheme from "../contexts/theme";
import Docker from "../components/Docker";


const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [toggleFullScreen, setToggleFullScreen] = useState(false)
  const {setTheme} = useTheme()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 49 && e.metaKey) {
        setTheme("matrix")
      }else if(e.keyCode === 50 && e.metaKey){
        setTheme("interstellar")
      }else if(e.keyCode === 51 && e.metaKey){
        setTheme("dark")
      }else if(e.keyCode === 52 && e.metaKey){
        setTheme("mud")
      }else if(e.keyCode === 53 && e.metaKey){
        setTheme("power")
      }else if(e.keyCode === 54 && e.metaKey){
        setTheme("pure")
      }else if(e.keyCode === 55 && e.metaKey){
        setTheme("sunset")
      }else if(e.keyCode === 56 && e.metaKey){
        setTheme("tron")
      }else if(e.keyCode === 57 && e.metaKey){
        setTheme("vader")
      }

      if (e.keyCode === 220 && e.metaKey) {
        setToggleFullScreen(prev => !prev)
      }

    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if(isLoading) {
    return (
      <div>
        <div className="bg-image"></div>
        <div className="bg-color"></div>
        <Startup onComplete={() => { setIsLoading(false) }} />
     </div>
    )
  }else{
    return (
      <div>
        <div className="bg-image"></div>
        <div className="bg-color"></div>
        <div className="row fullHeight">
          <div className="col" style={{ flex: 1 }}>
            <DateTime isActive={!toggleFullScreen} delay={500} />
            <Hardware isActive={!toggleFullScreen} delay={1000} />
            <Docker isActive={!toggleFullScreen} delay={1500} />
          </div>
          <div className="col" style={{ flex: 2 }}>
            <Terminal isActive={true} useAudio={true} delay={2000} />
          </div>
          <div className="col" style={{ flex: 1 }}>
            <Network isActive={!toggleFullScreen} delay={700} />
          </div>
        </div>
      </div>
    )
  }
}

export default App
