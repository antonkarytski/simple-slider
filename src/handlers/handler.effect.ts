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

type Actions = {
  afterTransition?: () => void;
};
type MoveAction = (activeIndex?: number) => void;

export type Options = {
  isLooped?: boolean;
  isDraggable?: boolean;
};

export type EffectHandlerInterface = {
  prepare: MoveAction;
  update: MoveAction;
};

export type EffectsHandler = (
  slider: HTMLElement,
  actions: Actions,
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
  { afterTransition },
  { isLooped, isDraggable } = {}
): EffectHandlerInterface => {
  const getCurrentActiveSlide = (slides): number => {
    return slides.findIndex((slide: HTMLElement) => {
      return slide.classList.contains(ACTIVE_CLASS);
    });
  };

  const moveSlide: MoveAction = (): void => {
    const [...slides] = slider.querySelectorAll(`.${WRAPPER_CLASS}`);
    const firstSlide = slides[0] as HTMLElement;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const activeSlideIndex = getCurrentActiveSlide(slides);
    firstSlide.style.marginLeft = `-${
      slideWidth * (activeSlideIndex + Number(isLooped))
    }px`;
  };

  if (isDraggable) {
    let activeSlideIndex;
    let firstSlide;
    let slideWidth;
    let slides;
    createDragHandler(slider, {
      onDragStart: () => {
        [...slides] = slider.querySelectorAll(`.${WRAPPER_CLASS}`);
        firstSlide = slides[0] as HTMLElement;
        slideWidth = firstSlide.getBoundingClientRect().width;
        activeSlideIndex = getCurrentActiveSlide(slides);
        slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
      },
      onDrag: (offset) => {
        firstSlide.style.marginLeft = `-${
          (activeSlideIndex + Number(isLooped)) * slideWidth + offset
        }px`;
      },
      onDragEnd: () => {
        slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS);
      },
      onDragReject: () => {
        const firstSlide = slides[0] as HTMLElement;
        const slideWidth = firstSlide.getBoundingClientRect().width;
        firstSlide.style.marginLeft = `-${(activeSlideIndex + Number(isLooped)) * slideWidth}px`;
      },
    });
  }

  return {
    update: moveSlide,
    prepare(activeIndex) {
      const createLoopElement = (baseElement: Element): HTMLElement => {
        return cloneElement(
          baseElement as HTMLElement,
          WRAPPER_LOOP_CLASS,
          ACTIVE_CLASS
        );
      };

      if (isLooped) {
        const firstElement = createLoopElement(slider.children[0]);
        const lastElement = createLoopElement(
          slider.children[slider.children.length - 1]
        );
        slider.insertBefore(lastElement, slider.childNodes[0]);
        slider.appendChild(firstElement);
      }
      window.addEventListener("resize", () => moveSlide);

      slider.addEventListener("transitionend", afterTransition);

      slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
      moveSlide(activeIndex + Number(isLooped));
      setTimeout(() =>
        slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS)
      );
    },
  };
};

export const effectsList: EffectsList = {
  [EFFECT_MOVE]: {
    handler: moveEffectHandler,
    rootClass: EFFECT_MOVE_ROOT_CLASS,
  },
};
