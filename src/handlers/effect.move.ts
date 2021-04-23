import {
  ACTIVE_CLASS,
  EFFECT_MOVE,
  EFFECT_MOVE_ROOT_CLASS,
  PREVENT_TRANSITION_EFFECT_CLASS,
  WRAPPER_CLASS,
  WRAPPER_LOOP_CLASS,
} from "../classes";
import { cloneElement } from "../helpers/componentsHelper";
import createDragHandler from "./handler.drag";
import { IndexListener, IndexSubscriber } from "../_interfaces";

export type Options = {
  isLooped?: boolean;
  isDraggable?: boolean;
  beforeOverloadTransition?: () => unknown;
  afterOverloadTransition?: () => unknown;
};

export interface EffectHandlerInterface extends IndexListener {
  prepare: IndexSubscriber;
}

export type EffectsHandler = (
  slider: HTMLElement,
  options: Options
) => EffectHandlerInterface;

export type Effect = {
  handler: EffectsHandler;
  rootClass: string;
};

export type EffectsList = {
  [EFFECT_MOVE]: Effect;
};

const moveEffectHandler: EffectsHandler = (
  slider,
  {
    isLooped,
    isDraggable,
    beforeOverloadTransition,
    afterOverloadTransition,
  } = {}
): EffectHandlerInterface => {
  let activeSlideIndex;
  let isInOverload = false;

  const getSlides = (slider): HTMLElement[] => {
    return slider.querySelectorAll(`.${WRAPPER_CLASS}`);
  };

  const moveSlide: IndexSubscriber = (activeIndex) => {
    const [...slides] = getSlides(slider);
    const firstSlide = slides[0] as HTMLElement;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    firstSlide.style.marginLeft = `-${slideWidth * activeIndex}px`;
  };

  if (isDraggable) {
    let firstSlide;
    let slideWidth;
    let slides;
    createDragHandler(slider, {
      onDragStart: () => {
        if (isInOverload) return;
        [...slides] = getSlides(slider);
        firstSlide = slides[0] as HTMLElement;
        slideWidth = firstSlide.getBoundingClientRect().width;
        slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
      },
      onDrag: (offset) => {
        firstSlide.style.marginLeft = `-${
          activeSlideIndex * slideWidth + offset
        }px`;
      },
      onDragEnd: () => {
        slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS);
      },
      onDragReject: () => {
        const firstSlide = slides[0] as HTMLElement;
        const slideWidth = firstSlide.getBoundingClientRect().width;
        firstSlide.style.marginLeft = `-${activeSlideIndex * slideWidth}px`;
      },
    });
  }

  function moveSlideWithoutEffect(activeIndex: number) {
    slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
    moveSlide(activeIndex);
    setTimeout(() => slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS));
  }

  function afterTransitionHandler(event): void {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains(ACTIVE_CLASS)
    ) {
      isInOverload = false;
      moveSlideWithoutEffect(activeSlideIndex);
      if(afterOverloadTransition) afterOverloadTransition()
      slider.removeEventListener("transitionend", afterTransitionHandler);
    }
  }

  return {
    update: (activeIndex, previousIndex) => {
      activeSlideIndex = activeIndex + Number(isLooped);
      if (isLooped) {
        const overloadIndicate = (() => {
          const realSlidesLength = getSlides(slider).length - 3;
          if (activeIndex !== 0 && activeIndex !== realSlidesLength) return;
          if (previousIndex === realSlidesLength) return previousIndex + 2;
          if (previousIndex === 0) return 0;
          return;
        })();
        if (overloadIndicate !== undefined) {
          isInOverload = true;
          moveSlide(overloadIndicate);
          if(beforeOverloadTransition) beforeOverloadTransition()
          slider.addEventListener("transitionend", afterTransitionHandler);
          return;
        }
      }
      moveSlide(activeSlideIndex, previousIndex);
    },

    prepare(activeIndex) {
      activeSlideIndex = activeIndex + Number(isLooped);
      if (isLooped) {
        const createLoopElement = (baseElement: Element): HTMLElement => {
          return cloneElement(
            baseElement as HTMLElement,
            WRAPPER_LOOP_CLASS,
            ACTIVE_CLASS
          );
        };
        const firstElement = createLoopElement(slider.children[0]);
        const lastElement = createLoopElement(
          slider.children[slider.children.length - 1]
        );
        slider.insertBefore(lastElement, slider.childNodes[0]);
        slider.appendChild(firstElement);
      }

      window.addEventListener("resize", () => moveSlide(activeSlideIndex));
      moveSlideWithoutEffect(activeSlideIndex);
    },
  };
};

export const effectsList: EffectsList = {
  [EFFECT_MOVE]: {
    handler: moveEffectHandler,
    rootClass: EFFECT_MOVE_ROOT_CLASS,
  },
};
