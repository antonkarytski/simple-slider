import cx from "../helpers/classNameHelper";
import {Component, Props} from "./_interfaces";
import {DOT_CLASS} from "../classes";

export interface DotProps extends Props{
	index: number
}

const dot:Component = ({className, index}:DotProps) => {
	const dot = document.createElement("div")
	dot.className = cx(DOT_CLASS,className)
	dot.dataset.slide = index+""
	return {element: dot}
}

export default dot