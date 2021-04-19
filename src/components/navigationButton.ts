import {BUTTON_CLASS} from "../classes";
import {Props, Component} from "./_interfaces";
import cx from "../helpers/classNameHelper"

const navigationButton:Component = ({className = "", onClick}:Props) => {
 const button = document.createElement("div")
 button.className = cx(BUTTON_CLASS, className)
 button.addEventListener("click", onClick)
 return {element: button}
}

export default navigationButton