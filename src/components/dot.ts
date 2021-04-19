import cx from "../helpers/classNameHelper";
import {DOT_CLASS} from "../classes";

export default function dot(index: number, classes = "" ):HTMLElement{
	const dot = document.createElement("div")
	dot.className = cx(DOT_CLASS,classes)
	dot.dataset.slide = index+""
	return dot
}