import {ACTIVE_CLASS, DOT_BLOCK_CLASS, DOT_CLASS} from "../classes";
import dot from "./dot";
import cx from "../helpers/classNameHelper"

type dotsProps = {
	onClick: (event: MouseEvent) => unknown,
	dotCount: number
	initialActiveDot: number
	classes?:string
}

type ElementListener = {
	update:(activeIndex: number) => void,
	element: HTMLElement
}

export default function dotsBlock({onClick, dotCount, classes, initialActiveDot}:dotsProps): ElementListener{

	const element = document.createElement("div")
	element.className = cx(DOT_BLOCK_CLASS, classes)
	element.addEventListener("click", (event) => {
		if(event.target instanceof HTMLElement && event.target.classList.contains(DOT_CLASS)) {
			const activeDot = element.querySelector(`.${DOT_CLASS}.${ACTIVE_CLASS}`)
			activeDot.classList.remove(ACTIVE_CLASS)
			event.target.classList.add(ACTIVE_CLASS)
			onClick(event)
		}
	})
	for(let i = 0; i<dotCount; i++){
		element.append(dot(i, cx({[ACTIVE_CLASS]:initialActiveDot === i + 1})))
	}


	return {
		element,
		update(activeIndex){
			const dots = element.querySelectorAll(`.${DOT_CLASS}`)
			dots.forEach((dot: HTMLElement) => {
				if(dot.classList.contains(ACTIVE_CLASS) && Number(dot.dataset.slide) !== activeIndex){
					dot.classList.remove(ACTIVE_CLASS)
				}
				if(Number(dot.dataset.slide) === activeIndex && !dot.classList.contains(ACTIVE_CLASS)){
					dot.classList.add(ACTIVE_CLASS)
				}
			})
		}
	}
}



