import "./style.scss"
import {
	BASIC_CLASSNAME,
	BUTTON_LEFT_CLASS,
	BUTTON_RIGHT_CLASS,
	ROOT_COMPONENT_CLASS,
	WRAPPER_ACTIVE_CLASS,
	WRAPPER_CLASS
} from "./classes";
import cx from "./helpers/classNameHelper"
import slideWrapper from "./components/slideWrapper";
import navigationButton from "./components/naviagtionButton";


declare global {
	interface Window {
		SimpleSlider: any;
	}
}

type SliderOptions = {
	innerComponentClass?: string,
	startSlide?: number,
	buttonClasses?: string,
	leftButtonClass?: string,
	rightButtonClass?: string
}

const defaultOptions: SliderOptions = {
	startSlide: 1
}

class SimpleSlider {

	currentSlideIndex: number;
	slidesCount: number;
	selector: string;

	constructor(selector = BASIC_CLASSNAME, options: SliderOptions = defaultOptions) {
		const {
			innerComponentClass,
			startSlide,
			buttonClasses,
			rightButtonClass,
			leftButtonClass
		} = {...defaultOptions, ...options}

		this.currentSlideIndex = startSlide;
		this.selector = selector;

		const slidersSet: NodeListOf<any> = document.querySelectorAll(selector)
		slidersSet.forEach((slider): void => {
			slider.className = ROOT_COMPONENT_CLASS + ` ${slider.className}`
			const slides = [...slider.children]
			this.slidesCount = slides.length
			slides.forEach((slide, index) => {
				const wrapperClasses = cx({
					[innerComponentClass]: !!innerComponentClass,
					[WRAPPER_ACTIVE_CLASS]: index + 1 === startSlide
				})
				const slideWrap = slideWrapper(slide, wrapperClasses)
				slider.append(slideWrap)
			})

			slider.append(navigationButton({
				direction: "<",
				onClick: () => this.goToNextSlide(-1),
				classes: cx(
					BUTTON_LEFT_CLASS,
					{
						[buttonClasses]: !!buttonClasses,
						[leftButtonClass]: !!leftButtonClass
					},
				)
			}))

			slider.append(navigationButton({
				direction: ">",
				onClick: () => this.goToNextSlide(1),
				classes: cx(
					BUTTON_RIGHT_CLASS,
					{
						[buttonClasses]: !!buttonClasses,
						[rightButtonClass]: !!rightButtonClass
					},
				)
			}))
		})
	}

	goToNextSlide(direction: number): void {
		const nextIndex = this.currentSlideIndex + direction
		if(nextIndex < 1 || nextIndex > this.slidesCount) return
		this.currentSlideIndex = nextIndex
		const slides = document.querySelectorAll(`${this.selector} > .${WRAPPER_CLASS}`)
		slides.forEach((slide, index) => {
			if(slide.classList.contains(WRAPPER_ACTIVE_CLASS)) slide.classList.remove(WRAPPER_ACTIVE_CLASS)
			if(index + 1 === nextIndex) slide.classList.add(WRAPPER_ACTIVE_CLASS)
		})
	}
}

window.SimpleSlider = SimpleSlider
