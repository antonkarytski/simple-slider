import {BUTTON_CLASS, DOT_CLASS, PREVENT_TRANSITION_EFFECT_CLASS, WRAPPER_CLASS} from "../classes";

type MoveEvent = MouseEvent | DragEvent | TouchEvent;
type Actions = {
	onDrag:(slideNumber:number) => void
	onDragToNextSlide:(direction: number) => void
}


export default function dragHandler(slider: HTMLElement, {onDragToNextSlide}: Actions): void{

	const [...slides] = slider.querySelectorAll(`.${WRAPPER_CLASS}`)
	let cursorStartPosition = 0;
	let firstElementStartPosition = 0;
	let offset = 0;

	function dragStart(event:MoveEvent){
		event.preventDefault()
		const firstSlide = slides[0] as HTMLElement
		firstElementStartPosition = firstSlide.offsetLeft
		cursorStartPosition = getCursorPosition(event)
		slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS)
		document.onmousemove = dragAction;
		document.onmouseup = dragEnd;
	}

	function dragAction(event:MoveEvent){
		event.preventDefault()
		offset = cursorStartPosition - getCursorPosition(event)
		slides.forEach((slide:HTMLElement, index) => {
			const position = firstElementStartPosition + slide.offsetWidth * index - offset;
			slide.style.left = position + "px"
		})
	}

	function dragEnd(){
		slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS)
		const firstSlide = slides[0] as HTMLElement
		const lastSlide = slides[slides.length-1] as HTMLElement
		if(slider.offsetWidth/5 < Math.abs(offset)
			&& firstSlide.offsetLeft <= 0
			&& lastSlide.offsetLeft >= 0
		){
			onDragToNextSlide(Math.sign(offset))
		} else {
			slides.forEach((slide:HTMLElement, index) => {
				const position = firstElementStartPosition + slide.offsetWidth * index;
				slide.style.left = position + "px"
			})
		}

		document.onmousemove = null;
		document.onmouseup = null;
	}

	function isNotChildNavigation(target){
		return target instanceof HTMLElement
			&& !target.classList.contains(DOT_CLASS)
			&& !target.classList.contains(BUTTON_CLASS)
	}

	slider.addEventListener("mousedown", (event) => {
		if (isNotChildNavigation(event.target)) dragStart(event)
	})
	slider.addEventListener("touchstart", (event) => {
		if (isNotChildNavigation(event.target)) dragStart(event)
	})
	slider.addEventListener("touchmove", dragAction)
	slider.addEventListener("touchend",dragEnd)
}

function getCursorPosition(event: MoveEvent): number{
	if(event instanceof TouchEvent){
		return event.touches[0].clientX
	}
	return event.clientX
}