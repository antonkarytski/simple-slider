import "./style.scss"
import "./dist-style.scss"
import {
	ACTIVE_CLASS,
	BASIC_CLASSNAME,
	BUTTON_LEFT_CLASS,
	BUTTON_RIGHT_CLASS,
	EFFECT_MOVE,
	ROOT_COMPONENT_CLASS, WRAPPER_LOOP_CLASS,
	WRAPPER_CLASS, PREVENT_TRANSITION_EFFECT_CLASS
} from "./classes";
import cx from "./helpers/classNameHelper"
import slideWrapper from "./components/slideWrapper";
import navigationButton from "./components/navigationButton";
import {EffectHandlerInterface, EffectsHandler, EffectsList, effectsList} from "./handlers/handler.effect";
import createDragHandler from "./handlers/handler.drag";
import createDotsBlock from "./components/dotsBlock";


declare global {
	interface Window {
		SimpleSlider: any;
	}
}

type SliderOptions = {
	startSlide: number,
	innerComponentClass?: string,
	buttonClasses?: string,
	leftButtonClass?: string,
	rightButtonClass?: string,
	effect?: keyof EffectsList,
	isShowDots: boolean,
	isShowNavigationButtons: boolean,
	isDraggable: boolean,
	isLooped: boolean
}


const defaultOptions: SliderOptions = {
	startSlide: 1,
	effect: EFFECT_MOVE,
	isShowDots: true,
	isShowNavigationButtons: true,
	isDraggable: true,
	isLooped: true,
}

class SimpleSlider {

	slider: HTMLElement;
	currentSlideIndex: number;
	slidesCount: number;
	selector: string;
	effect: string;
	isLooped: boolean;
	effectHandler: EffectHandlerInterface;
	onSlideChangeListeners: Array<(activeIndex?: number) => void> = []

	constructor(selector = BASIC_CLASSNAME, options: SliderOptions = defaultOptions) {
		const {
			innerComponentClass,
			startSlide,
			buttonClasses,
			rightButtonClass,
			leftButtonClass,
			effect,
			isShowNavigationButtons,
			isShowDots,
			isDraggable,
			isLooped
		} = {...defaultOptions, ...options}

		this.slider = document.querySelector(selector);
		this.slider.className = cx(this.slider.className, ROOT_COMPONENT_CLASS);
		this.currentSlideIndex = startSlide;
		this.selector = selector;
		this.effect = Object.keys(effectsList).includes(effect) ? effect : defaultOptions.effect;
		console.log(effectsList[this.effect])
		const {handler: getEffectHandler} = effectsList[this.effect] as {handler: EffectsHandler}

		this.effectHandler = getEffectHandler(this.slider, {
			afterTransition: this.afterTransitionHandler.bind(this)
		});
		console.log(this.effectHandler)
		this.isLooped = isLooped;

		const slides = [...this.slider.children];
		this.slidesCount = slides.length;

		slides.forEach((slide: HTMLElement, index) => {
			const wrapperClasses = cx({
				[innerComponentClass]: !!innerComponentClass,
				[ACTIVE_CLASS]: index + 1 === startSlide
			})
			const slideWrap = slideWrapper(slide, wrapperClasses);
			this.slider.append(slideWrap);
		})

		if(isLooped){
			const firstElement = this.slider.children[0].cloneNode(true) as HTMLElement
			if(firstElement.classList.contains(ACTIVE_CLASS)) firstElement.classList.remove(ACTIVE_CLASS)
			firstElement.classList.add(WRAPPER_LOOP_CLASS)
			const lastElement = this.slider.children[this.slider.children.length - 1].cloneNode(true) as HTMLElement
			if(lastElement.classList.contains(ACTIVE_CLASS)) lastElement.classList.remove(ACTIVE_CLASS)
			lastElement.classList.add(WRAPPER_LOOP_CLASS)
			this.slider.insertBefore(lastElement, this.slider.childNodes[0])
			this.slider.appendChild(firstElement)
		}

		this.effectHandler.prepare(startSlide + Number(isLooped))
		this.onSlideChangeListeners.push(this.effectHandler.update)

		if (isDraggable) {
			createDragHandler(
				this.slider,
				{
					onDrag:this.setCurrentSlide.bind(this),
					onDragToNextSlide: this.goToNextSlide.bind(this)
				})
		}

		if (isShowNavigationButtons) {
			this.slider.append(navigationButton({
				onClick: () => this.goToNextSlide(-1),
				classes: cx(
					BUTTON_LEFT_CLASS,
					{
						[buttonClasses]: !!buttonClasses,
						[leftButtonClass]: !!leftButtonClass
					},
				)
			}))

			this.slider.append(navigationButton({
				onClick: () => this.goToNextSlide(1),
				classes: cx(
					BUTTON_RIGHT_CLASS,
					{
						[buttonClasses]: !!buttonClasses,
						[rightButtonClass]: !!rightButtonClass
					},
				)
			}))
		}

		if (isShowDots) {
			const dotsBlock = createDotsBlock({
				onClick: ({target}) => {
					if (target instanceof HTMLElement) {
						this.setCurrentSlide(Number(target.dataset.slide))
					}
				},
				dotCount: this.slidesCount,
				initialActiveDot: this.currentSlideIndex
			})
			this.slider.append(dotsBlock.element)
			this.onSlideChangeListeners.push(dotsBlock.update)
		}
	}

	setCurrentSlide(slideNumber:number): void {
		if(slideNumber === this.currentSlideIndex) return
		if(slideNumber < 1 - Number(this.isLooped) || slideNumber > this.slidesCount + Number(this.isLooped)) return
		this.currentSlideIndex = slideNumber

		const slides = this.slider.querySelectorAll(`.${WRAPPER_CLASS}`)
		slides.forEach((slide, index) => {
			if (slide.classList.contains(ACTIVE_CLASS)) slide.classList.remove(ACTIVE_CLASS)
			if (index + 1 === this.currentSlideIndex + Number(this.isLooped)) slide.classList.add(ACTIVE_CLASS)
		})
		this.onSlideChangeListeners.forEach(listener => listener(this.getNextSlideIndex()))
	}

	goToNextSlide(direction: number): void {
		const nextIndex = this.currentSlideIndex + direction
		if(!this.isLooped && (nextIndex < 1 || nextIndex > this.slidesCount)) return
		this.setCurrentSlide(nextIndex);
	}

	afterTransitionHandler({target}){
		if(target.classList.contains(WRAPPER_CLASS) && target.classList.contains(ACTIVE_CLASS)){
			if(this.currentSlideIndex < 1 || this.currentSlideIndex > this.slidesCount){
				this.slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS)
				this.setCurrentSlide(this.getNextSlideIndex())
				setTimeout(() => this.slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS))
			}
		}
	}

	getNextSlideIndex(){
		if(this.currentSlideIndex >= 1 && this.currentSlideIndex <= this.slidesCount) return this.currentSlideIndex
		if(this.isLooped){
			if(this.currentSlideIndex < 1) return this.slidesCount
			return 1
		}
		if(this.currentSlideIndex < 1) return 1
		return this.slidesCount
	}

}


window.SimpleSlider = SimpleSlider