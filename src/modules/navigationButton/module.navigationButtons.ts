import { SliderModule } from "../../_interfaces";
import navigationButton from "./component.navigationButton";
import cx from "../../helpers/classNameHelper";
import { BUTTON_LEFT_CLASS, BUTTON_RIGHT_CLASS } from "../../classes";
import { SimpleSlider } from "../../index";

export default function navigationButtonsModule({
  goToNextSlide,
}: SimpleSlider): SliderModule {
  return {
    elementExists: false,
    create: function ({
      leftButtonClass = "",
      rightButtonClass = "",
      buttonClasses = "",
    }) {
      if (this.elementExists) return;
      this.elementExists = true;
      const buttons = [
        {
          onClick: () => {
            goToNextSlide(-1);
          },
          className: cx(leftButtonClass, BUTTON_LEFT_CLASS),
        },
        {
          onClick: () => {
            goToNextSlide(1);
          },
          className: cx(rightButtonClass, BUTTON_RIGHT_CLASS),
        },
      ];

      const buttonsElement = buttons.map(({ onClick, className }) => {
        const { element } = navigationButton({
          onClick,
          className: cx(className, buttonClasses),
        }) as { element: HTMLElement };
        return element;
      });

      return { element: buttonsElement };
    },
  };
}
