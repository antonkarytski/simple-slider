import createSlideWrapper, {
  SlideWrapperProps,
} from "../components/slideWrapper";
import navigationButton from "../components/navigationButton";
import cx from "./classNameHelper";
import { Props } from "../components/_interfaces";

export function cloneElement(
  element: HTMLElement,
  classes = "",
  classesToRemove = ""
): HTMLElement {
  const clonedElement = element.cloneNode(true) as HTMLElement;
  if (classesToRemove && clonedElement.classList.contains(classesToRemove)) {
    clonedElement.classList.remove(classesToRemove);
  }
  if (classes) clonedElement.classList.add(classes);
  return clonedElement;
}

export function setActiveElement(
  elements: NodeListOf<Element>,
  activeIndex: number,
  activeStyle: string
): void {
  elements.forEach((slide, index) => {
    if (slide.classList.contains(activeStyle))
      slide.classList.remove(activeStyle);
    if (index === activeIndex) slide.classList.add(activeStyle);
  });
}

export function wrapChildComponents(
  parent: HTMLElement,
  className: string | ((index: number) => string)
): void {
  [...parent.children].forEach((slide, index) => {
    const { element: slideWrap } = createSlideWrapper({
      content: slide,
      className: typeof className === "string" ? className : className(index),
    } as SlideWrapperProps);
    parent.append(slideWrap);
  });
}

export function addButtons(
  parent: HTMLElement,
  buttons: Props[],
  generalClassName: string
): void {
  buttons.forEach(({ onClick, className }) => {
    const { element } = navigationButton({
      onClick,
      className: cx(className, generalClassName),
    });
    parent.append(element);
  });
}
