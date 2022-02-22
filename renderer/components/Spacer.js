import { useEffect, useState } from "react";

const Spacer = (props) => {

  const [variation, setVariation] = useState(props.variation);

  useEffect(() => {
	  if (props.type === 'vertical') {
		  setVariation({ paddingTop: 5, paddingBottom: 5, width: "100%" });
	  } else if(props.type === 'bottom'){
		  setVariation({ paddingTop: 0, paddingBottom: 5, width: "100%" });
	  }else {
		  setVariation({ paddingTop: 5, paddingBottom: 0, width: "100%" });
	  }
  }, [])

	return (
		<div className="spacer-outer" style={variation}>
			<div className="spacer-inner"></div>
		</div>
	)
}

export default Spacer;