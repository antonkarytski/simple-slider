import "./style.scss";
import "./dist-style.scss";
import {
  ACTIVE_CLASS,
  BASIC_CLASSNAME,
  BUTTON_LEFT_CLASS,
  BUTTON_RIGHT_CLASS,
  EFFECT_MOVE,
  ROOT_COMPONENT_CLASS,
  WRAPPER_CLASS,
  PREVENT_TRANSITION_EFFECT_CLASS,
} from "./classes";
import cx from "./helpers/classNameHelper";
import {
  EffectHandlerInterface,
  EffectsList,
  Effect,
  effectsList,
} from "./handlers/handler.effect";
import createDragHandler from "./handlers/handler.drag";
import createDotsBlock, { DotsBlockProps } from "./components/dotsBlock";
import {
  addButtons,
  setActiveElement,
  wrapChildComponents,
} from "./helpers/componentsHelper";

declare global {
  interface Window {
    SimpleSlider: any;
  }
}

type SliderOptions = {
  startSlide: number;
  innerComponentClass?: string;
  buttonClasses?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
  effect?: keyof EffectsList;
  isShowDots: boolean;
  isShowNavigationButtons: boolean;
  isDraggable: boolean;
  isLooped: boolean;
};

const defaultOptions: SliderOptions = {
  startSlide: 0,
  effect: EFFECT_MOVE,
  isShowDots: true,
  isShowNavigationButtons: true,
  isDraggable: true,
  isLooped: true,
};

class SimpleSlider {
  slider: HTMLElement;
  currentSlideIndex: number;
  slidesCount: number;
  selector: string;
  effect: string;
  isLooped: boolean;
  effectHandler: EffectHandlerInterface;
  onSlideChangeListeners: Array<(activeIndex?: number) => void> = [];

  constructor(
    selector = BASIC_CLASSNAME,
    options: SliderOptions = defaultOptions
  ) {
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
      isLooped,
    } = { ...defaultOptions, ...options };

    this.slider = document.querySelector(selector);
    const slides = [...this.slider.children];

    this.effect = Object.keys(effectsList).includes(effect)
      ? effect
      : defaultOptions.effect;

    this.isLooped = isLooped;
    this.selector = selector;
    this.slidesCount = slides.length;
    this.currentSlideIndex = startSlide;

    const {
      handler: getEffectHandler,
      rootClass: effectRootClass,
    } = effectsList[this.effect] as Effect;

    this.effectHandler = getEffectHandler(
      this.slider,
      {
        afterTransition: this.afterTransitionHandler.bind(this),
      },
      { isLooped: this.isLooped, isDraggable }
    );

    this.slider.className = cx(
      this.slider.className,
      ROOT_COMPONENT_CLASS,
      effectRootClass
    );

    wrapChildComponents(this.slider, (index) => {
      return cx(innerComponentClass, {
        [ACTIVE_CLASS]: index === this.currentSlideIndex,
      });
    });

    this.effectHandler.prepare(startSlide);
    this.onSlideChangeListeners.push(this.effectHandler.update);

    if (isDraggable) {
      createDragHandler(this.slider, {
        onDragSuccess: this.goToNextSlide.bind(this),
      });
    }

    if (isShowNavigationButtons) {
      const buttons = [
        {
          onClick: () => this.goToNextSlide(-1),
          className: cx(leftButtonClass, BUTTON_LEFT_CLASS),
        },
        {
          onClick: () => this.goToNextSlide(1),
          className: cx(rightButtonClass, BUTTON_RIGHT_CLASS),
        },
      ];
      addButtons(this.slider, buttons, buttonClasses);
    }

    if (isShowDots) {
      const { element, update } = createDotsBlock({
        onClick: ({ target }) => {
          if (target instanceof HTMLElement) {
            this.setCurrentSlide(Number(target.dataset.slide));
          }
        },
        dotCount: this.slidesCount,
        initialActiveDot: this.currentSlideIndex,
      } as DotsBlockProps);
      this.slider.append(element);
      this.onSlideChangeListeners.push(update);
    }
  }

  setCurrentSlide(slideNumber: number): void {
    if (slideNumber === this.currentSlideIndex) return;
    if (slideNumber < 0 || slideNumber > this.slidesCount - 1) return;
    this.currentSlideIndex = slideNumber;

    const slides = this.slider.querySelectorAll(`.${WRAPPER_CLASS}`);
    setActiveElement(slides, this.currentSlideIndex, ACTIVE_CLASS);
    this.onSlideChangeListeners.forEach((listener) =>
      listener(this.getNextSlideIndex())
    );
  }

  goToNextSlide(direction: number): void {
    const nextIndex = this.currentSlideIndex + direction;
    if (nextIndex < 0 || nextIndex > this.slidesCount - 1) return;
    this.setCurrentSlide(nextIndex);
  }

  afterTransitionHandler({ target: { classList } }): void {
    if (!classList.contains(WRAPPER_CLASS) || !classList.contains(ACTIVE_CLASS))
      return;
    if (
      this.currentSlideIndex < 0 ||
      this.currentSlideIndex > this.slidesCount - 1
    ) {
      this.slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
      this.setCurrentSlide(this.getNextSlideIndex());
      setTimeout(() =>
        this.slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS)
      );
    }
  }

  getNextSlideIndex() {
    const { currentSlideIndex: currentIndex, slidesCount } = this;
    if (currentIndex >= 0 && currentIndex <= slidesCount - 1) {
      return currentIndex;
    }
    if (currentIndex < 0) return 0;
    return slidesCount - 1;
  }
}

window.SimpleSlider = SimpleSlider;
