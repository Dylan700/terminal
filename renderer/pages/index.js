import { useEffect, useState } from "react";
import useTheme from "../contexts/theme";
import useSettings from "../contexts/settings";
import Startup from "../components/Startup"
import Settings from "../components/Settings";
import Layout from "../components/Layout";


const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [toggleFullScreen, setToggleFullScreen] = useState(false)
  const {setTheme} = useTheme()
  const {currentSettings, setSettings} = useSettings()

  useEffect(() => {

    window.electron.touchbar.onFullScreen((event, bool) => {
      setToggleFullScreen(bool)
    })

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
        setToggleFullScreen(prev => {
          window.electron.touchbar.sendFullScreen(!prev);
          return !prev
        })
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
        <Startup onComplete={() => { setIsLoading(false) }} useAudio={currentSettings.enableAudio} />
     </div>
    )
  }else{
    return (
      <div>
        <div className="bg-image"></div>
        <div className="bg-color"></div>
        <div className="row fullHeight">
          <Layout isFullscreen={!toggleFullScreen} />
        </div>
        <Settings />
      </div>
    )
  }
}

export default App
