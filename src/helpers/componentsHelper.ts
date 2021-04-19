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
