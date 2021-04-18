import {
  ACTIVE_CLASS,
  EFFECT_MOVE,
  PREVENT_TRANSITION_EFFECT_CLASS,
  WRAPPER_CLASS,
} from "../classes";

type Actions = {
  afterTransition: () => void;
};
type MoveAction = (activeIndex: number) => void;

export type EffectHandlerInterface = {
  prepare: MoveAction;
  update: MoveAction;
};

export type EffectsHandler = (
	slider: HTMLElement,
	actions: Actions
) => EffectHandlerInterface;

export type EffectsList = {
  [EFFECT_MOVE]: { handler: EffectsHandler };
};

function moveEffectHandler(
  slider: HTMLElement,
  { afterTransition }: Actions
): EffectHandlerInterface {
  const moveSlide: MoveAction = () => {
    const [...slides] = slider.querySelectorAll(`.${WRAPPER_CLASS}`);
    const activeSlideIndex = slides.findIndex((slide: HTMLElement) => {
      return slide.classList.contains(ACTIVE_CLASS);
    });
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide: HTMLElement, index) => {
      slide.style.left = (index - activeSlideIndex) * slideWidth + "px";
    });
  };

  return {
    update: moveSlide,
    prepare(activeIndex) {
      window.addEventListener("resize", () => moveSlide);

      slider.addEventListener("transitionend", afterTransition);

      slider.classList.add(PREVENT_TRANSITION_EFFECT_CLASS);
      moveSlide(activeIndex);
      setTimeout(() =>
        slider.classList.remove(PREVENT_TRANSITION_EFFECT_CLASS)
      );
    },
  };
}

export const effectsList: EffectsList = {
  [EFFECT_MOVE]: {
  	handler: moveEffectHandler
  },
};
