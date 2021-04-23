import {
  BUTTON_CLASS,
  DOT_CLASS,
} from "../classes";

type MoveEvent = MouseEvent | TouchEvent;
type Actions = {
  onDragStart?: () => void;
  onDrag?: (offset: number) => void;
  onDragEnd?: () => void;
  onDragSuccess?: (direction: number) => void;
  onDragReject?: () => void;
};

export default function dragHandler(
  slider: HTMLElement,
  {
	  onDragStart = null,
    onDrag = null,
    onDragSuccess = null,
	  onDragEnd = null,
    onDragReject = null,
  }: Actions
): void {


  let cursorStartPosition = 0;
  let offset = 0;
  let isDragStart = false;

  function dragStart(event: MoveEvent) {
	  if(event.path.includes(slider)){
		  if(event.type === "mousemove") event.preventDefault();
		  isDragStart = true
		  cursorStartPosition = getCursorPosition(event);
		  if (onDragStart) onDragStart();
	  }
  }

  function dragAction(event: MoveEvent) {
	  if(!isDragStart) return
	  if(event.type === "mousemove") event.preventDefault();
    offset = cursorStartPosition - getCursorPosition(event);
    if (onDrag) onDrag(offset);
  }

  function dragEnd() {
  	if(!isDragStart) return
	  isDragStart = false
  	if(onDragEnd) onDragEnd()
    if (slider.offsetWidth / 5 < Math.abs(offset)) {
      if(onDragSuccess) onDragSuccess(Math.sign(offset))
    } else {
	    if(onDragReject) onDragReject()
    }
	  offset = 0
  }

  function isNotChildNavigation(target) {
    return (
      target instanceof HTMLElement &&
      !target.classList.contains(DOT_CLASS) &&
      !target.classList.contains(BUTTON_CLASS)
    );
  }

  window.addEventListener("touchstart", (event) => {
    if (isNotChildNavigation(event.target)) dragStart(event);
  });
	window.addEventListener("touchmove", dragAction);
	window.addEventListener("touchend", dragEnd);

	window.addEventListener("mousedown", (event) => {
		if (isNotChildNavigation(event.target)) dragStart(event);
	});
	window.addEventListener("mousemove", dragAction);
	window.addEventListener("mouseup", dragEnd);
}

function getCursorPosition(event: MoveEvent): number {
  if (event instanceof TouchEvent) {
    return event.touches[0].clientX;
  }
  return event.clientX;
}
