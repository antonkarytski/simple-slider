import {BUTTON_CLASS} from "../classes";
import cx from "../helpers/classNameHelper"

type buttonPropsType = {
 direction:string,
 onClick: (...args:any[]) => unknown,
 classes:string
}

export default function navigationButton(props:buttonPropsType): HTMLElement {
 const {
  classes = "",
   direction,
   onClick
 } = props
 const button = document.createElement("div")
 button.className = cx(BUTTON_CLASS, classes)
 button.innerHTML = direction
 button.addEventListener("click", () => onClick())
 return button
}