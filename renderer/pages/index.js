import { useEffect, useState } from "react";
import Startup from "../components/Startup"
import Terminal from "../components/AnimatedTerminal"
import DateTime from "../components/DateTime";
import Hardware from "../components/Hardware";
import useTheme from "../contexts/theme";

const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const {setTheme} = useTheme()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 49 && e.metaKey) {
        setTheme("matrix")
      }else if(e.keyCode === 50 && e.metaKey){
        setTheme("interstellar")
      }else if(e.keyCode === 51 && e.metaKey){
        setTheme("military")
      }else if(e.keyCode === 52 && e.metaKey){
        setTheme("mud")
      }else if(e.keyCode === 53 && e.metaKey){
        setTheme("power")
      }else if(e.keyCode === 54 && e.metaKey){
        setTheme("professor_zoom")
      }else if(e.keyCode === 55 && e.metaKey){
        setTheme("sunset")
      }else if(e.keyCode === 56 && e.metaKey){
        setTheme("tron")
      }else if(e.keyCode === 57 && e.metaKey){
        setTheme("vader")
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
        <Startup onComplete={() => { setIsLoading(false) }} />)
     </div>
    )
  }else{
    return (
      <div>
        <div className="bg-image"></div>
        <div className="bg-color"></div>
        <DateTime isActive={true} />
        <Hardware isActive={true} />
        <Terminal isActive={true} useAudio={true} />
      </div>
    )
  }
}

export default App
