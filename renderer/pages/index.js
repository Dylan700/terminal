import { useEffect, useState } from "react";
import useTheme from "../contexts/theme";
import useSettings from "../contexts/settings";
import Startup from "../components/Startup"
import Settings from "../components/Settings";
import Layout from "../components/Layout";
import AnimatedText from "../components/AnimatedText";


const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [toggleFullScreen, setToggleFullScreen] = useState(false)
  const {currentTheme} = useTheme()
  const {currentSettings, setSettings} = useSettings()

  useEffect(() => {

    window.electron.touchbar.onFullScreen((event, bool) => {
      setToggleFullScreen(bool)
    })

    const handleKeyDown = (e) => {
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
          <AnimatedText className={"text-tiny"} style={{ position: "absolute", bottom: 0, margin: "3px" }}>{!toggleFullScreen ? currentTheme.name: ""}</AnimatedText>
        </div>
        <Settings />
      </div>
    )
  }
}

export default App
