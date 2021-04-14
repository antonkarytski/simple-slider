import cx from "../helpers/classNameHelper";
import {WRAPPER_CLASS} from "../classes";

export default function slideWrapper(content: HTMLElement, additionalClassName: string) :HTMLElement{
 const wrapper = document.createElement("div")
 wrapper.className = cx(
	 WRAPPER_CLASS,
	 {[additionalClassName]: !!additionalClassName,}
 )
 wrapper.append(content)
 return wrapper
}