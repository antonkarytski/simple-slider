import { Props, SliderModule } from "../../_interfaces";
import navigationButton from "./component.navigationButton";
import cx from "../../helpers/classNameHelper";
import { BUTTON_LEFT_CLASS, BUTTON_RIGHT_CLASS } from "../../classes";
import { insertElements } from "../../helpers/componentsHelper";
import { SimpleSlider } from "../../index";

function addButtons(
  parent: HTMLElement,
  buttons: Props[],
  generalClassName: string
): void {
  buttons.forEach(({ onClick, className }) => {
    const { element } = navigationButton({
      onClick,
      className: cx(className, generalClassName),
    });
    insertElements(parent, element);
  });
}

export default function navigationButtonsModule({
  goToNextSlide,
  slider,
}: SimpleSlider ): SliderModule {
  return {
    elementExists: false,
    create: function({leftButtonClass = "", rightButtonClass = "", buttonClasses = ""}){
      if (this.elementExists) return;
      const buttons = [
        {
          onClick: () => goToNextSlide(-1),
          className: cx(leftButtonClass, BUTTON_LEFT_CLASS),
        },
        {
          onClick: () => goToNextSlide(1),
          className: cx(rightButtonClass, BUTTON_RIGHT_CLASS),
        },
      ];
      addButtons(slider, buttons, buttonClasses);
      this.elementExists = true;
      return { element: slider };
    },
  };
}
