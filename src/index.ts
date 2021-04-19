import "./style.scss";
import "./dist-style.scss";
import {
  ACTIVE_CLASS,
  BASIC_CLASSNAME,
  EFFECT_MOVE,
  ROOT_COMPONENT_CLASS,
  WRAPPER_CLASS,
  WRAPPER_LOOP_CLASS,
} from "./classes";
import cx from "./helpers/classNameHelper";
import {
  EffectHandlerInterface,
  EffectsList,
  Effect,
  effectsList,
} from "./handlers/effect.move";
import createDragHandler from "./handlers/handler.drag";
import {
  setActiveElement,
  wrapChildComponents,
} from "./helpers/componentsHelper";
import { IndexSubscriber, SliderModule } from "./_interfaces";
import createDotsBlockModule from "./modules/dotsBlock/module.dotsBlock";
import createNavigationButtonsModule from "./modules/navigationButton/module.navigationButtons";

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

export class SimpleSlider {
  slider: HTMLElement;
  currentSlideIndex: number;
  slidesCount: number;
  selector: string;
  effect: string;
  isLooped: boolean;
  effectHandler: EffectHandlerInterface;
  onSlideChangeListeners: Array<IndexSubscriber> = [];
  onSlideBeforeChangeListeners: Array<IndexSubscriber> = [];
  navigationButtonsModule: SliderModule
  dotsBlockModule: SliderModule

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

    this.effectHandler = getEffectHandler(this.slider, {
      isLooped: this.isLooped,
      isDraggable,
    });

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

    const { prepare, update, beforeUpdate } = this.effectHandler;
    prepare(startSlide);
    if (update) this.onSlideChangeListeners.push(update);
    if (beforeUpdate) this.onSlideBeforeChangeListeners.push(beforeUpdate);

    this.navigationButtonsModule = createNavigationButtonsModule(this);
    this.dotsBlockModule = createDotsBlockModule(this);

    if (isDraggable) {
      createDragHandler(this.slider, {
        onDragSuccess: this.goToNextSlide,
      });
    }

    if (isShowNavigationButtons) {
      this.navigationButtonsModule.create({
        leftButtonClass,
        rightButtonClass,
        buttonClasses,
      });
    }

    if (isShowDots) {
      const { update } = this.dotsBlockModule.create();
      this.onSlideChangeListeners.push(update);
    }
  }

  setCurrentSlide = (slideNumber: number): void => {
    if (slideNumber === this.currentSlideIndex) return;
    if (slideNumber < 0 || slideNumber > this.slidesCount - 1) return;
    const savedSlideIndex = this.currentSlideIndex;
    this.currentSlideIndex = slideNumber;
    const slides = this.slider.querySelectorAll(
      `.${WRAPPER_CLASS}:not(.${WRAPPER_LOOP_CLASS})`
    );
    setActiveElement(slides, this.currentSlideIndex, ACTIVE_CLASS);
    this.onSlideChangeListeners.forEach((listener) =>
      listener(this.currentSlideIndex, savedSlideIndex)
    );
  };

  goToNextSlide = (direction: number): void => {
    const { currentSlideIndex, slidesCount, isLooped, setCurrentSlide } = this;
    const nextIndex = currentSlideIndex + direction;
    const lastIndex = slidesCount - 1;
    const nextSlideIndex = (() => {
      if (nextIndex < 0) return isLooped ? lastIndex : 0;
      if (nextIndex > lastIndex) return isLooped ? 0 : lastIndex;
      return nextIndex;
    })();
    setCurrentSlide(nextSlideIndex);
  };
}

window.SimpleSlider = SimpleSlider;


