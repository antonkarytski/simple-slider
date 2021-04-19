import { ACTIVE_CLASS, DOT_BLOCK_CLASS, DOT_CLASS } from "../../classes";
import createDot, {DotProps} from "./component.dot";
import cx from "../../helpers/classNameHelper";
import {Component, Props} from "../../_interfaces";
import {insertElements} from "../../helpers/componentsHelper";

export interface DotsBlockProps extends Props {
  dotCount: number;
  initialActiveDot: number;
}

const dotsBlock:Component = ({
  onClick,
  dotCount,
  className,
  initialActiveDot,
}: DotsBlockProps) => {
  const element = document.createElement("div");
  element.className = cx(DOT_BLOCK_CLASS, className);
  element.addEventListener("click", (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains(DOT_CLASS)
    ) {
      const activeDot = element.querySelector(`.${DOT_CLASS}.${ACTIVE_CLASS}`);
      activeDot.classList.remove(ACTIVE_CLASS);
      event.target.classList.add(ACTIVE_CLASS);
      onClick(event);
    }
  });
  for (let index = 0; index < dotCount; index++) {
    const {element:dot} = createDot({
      index,
      className: cx({ [ACTIVE_CLASS]: initialActiveDot === index }),
    } as DotProps)
    insertElements(element, dot)
  }

  return {
    element,
    update(activeIndex) {
      const dots = element.querySelectorAll(`.${DOT_CLASS}`);
      dots.forEach((dot: HTMLElement) => {
        if (
          dot.classList.contains(ACTIVE_CLASS) &&
          Number(dot.dataset.slide) !== activeIndex
        ) {
          dot.classList.remove(ACTIVE_CLASS);
        }
        if (
          Number(dot.dataset.slide) === activeIndex &&
          !dot.classList.contains(ACTIVE_CLASS)
        ) {
          dot.classList.add(ACTIVE_CLASS);
        }
      });
    },
  };
}


export default dotsBlock