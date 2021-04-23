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
  insertElements,
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
  effect?: keyof EffectsList;
  isShowDots: boolean;
  isShowNavigationButtons: boolean;
  isDraggable: boolean;
  isLooped: boolean;
  buttonClasses?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
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
  effect: keyof EffectsList;
  isLooped: boolean;
  isDraggable: boolean;
  effectHandler: EffectHandlerInterface;
  onSlideChangeListeners: IndexSubscriber[] = [];
  onSlideBeforeChangeListeners: IndexSubscriber[] = [];
  navigationButtonsModule: SliderModule;
  dotsBlockModule: SliderModule;

  isOnOverload = false;

  constructor(
    selector = BASIC_CLASSNAME,
    options: SliderOptions = defaultOptions
  ) {
    const {
      innerComponentClass,
      startSlide,
      effect,
      isShowNavigationButtons,
      isShowDots,
      isDraggable,
      isLooped,
      ...navigationButtonClasses
    } = { ...defaultOptions, ...options };

    this.slider = document.querySelector(selector);
    this.isLooped = isLooped;
    this.isDraggable = isDraggable;
    this.selector = selector;
    this.slidesCount = this.slider.children.length;
    this.currentSlideIndex = startSlide;
    this.effect = effect;
    this.effect = Object.keys(effectsList).includes(effect)
      ? effect
      : defaultOptions.effect;

    const {
      handler: getEffectHandler,
      rootClass: effectRootClass,
    } = effectsList[this.effect] as Effect;

    this.effectHandler = getEffectHandler(this.slider, {
      isLooped: this.isLooped,
      isDraggable,
      beforeOverloadTransition: () => {
        this.isOnOverload = true;
      },
      afterOverloadTransition: () => {
        this.isOnOverload = false;
      },
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
    if (isShowNavigationButtons) {
      const { element } = this.navigationButtonsModule.create(
        navigationButtonClasses
      );
      insertElements(this.slider, element);
    }

    this.dotsBlockModule = createDotsBlockModule(this);
    if (isShowDots) {
      const { element, update } = this.dotsBlockModule.create();
      insertElements(this.slider, element);
      this.onSlideChangeListeners.push(update);
    }

    if (this.isDraggable) {
      createDragHandler(this.slider, {
        onDragSuccess: this.goToNextSlide,
      });
    }
  }

  setCurrentSlide = (slideNumber: number): void => {
    const {
      currentSlideIndex: previousIndex,
      slidesCount,
      slider,
      onSlideChangeListeners,
    } = this;
    if (slideNumber === previousIndex) return;
    if (slideNumber < 0 || slideNumber > slidesCount - 1) return;
    this.currentSlideIndex = slideNumber;
    const slides = slider.querySelectorAll(
      `.${WRAPPER_CLASS}:not(.${WRAPPER_LOOP_CLASS})`
    );
    setActiveElement(slides, this.currentSlideIndex, ACTIVE_CLASS);
    onSlideChangeListeners.forEach((listener) =>
      listener(this.currentSlideIndex, previousIndex)
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
