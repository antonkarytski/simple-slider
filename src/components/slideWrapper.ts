import cx from "../helpers/classNameHelper";
import {WRAPPER_CLASS} from "../classes";
import {Component, Props} from "../_interfaces";

export interface SlideWrapperProps extends Props{
	content: HTMLElement
}

 const slideWrapper: Component = ({content, className}: SlideWrapperProps) => {
 const wrapper = document.createElement("div")
 wrapper.className = cx(
	 WRAPPER_CLASS,
	 {[className]: !!className,}
 )
 wrapper.append(content)
 return {element: wrapper}
}

export default slideWrapper