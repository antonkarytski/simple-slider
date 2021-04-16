import {BUTTON_CLASS} from "../classes";
import cx from "../helpers/classNameHelper"

type buttonProps = {
 onClick: () => unknown,
 classes:string
}

export default function navigationButton({classes = "", onClick}:buttonProps): HTMLElement {
 const button = document.createElement("div")
 button.className = cx(BUTTON_CLASS, classes)
 button.addEventListener("click", () => onClick())
 return button
}