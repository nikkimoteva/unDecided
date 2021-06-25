import GraphRank from "./GraphRank";
import GraphAccuracy from "./GraphAccuracy";
import GraphFirst from "./GraphFirst";

export default function chooseGraph(props) {
  let type = props.data;
  if (type==="rank") {
    return(<GraphRank />);
  } else if (type === "accuracy") {
      return(<GraphAccuracy />);
  } else {
    return(<GraphFirst />);
  }
}
