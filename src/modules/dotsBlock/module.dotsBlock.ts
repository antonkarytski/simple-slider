import { SliderModule } from "../../_interfaces";
import createDotsBlock, { DotsBlockProps } from "./component.dotsBlock";
import {SimpleSlider} from "../../index";

export default function dotsBlockModule({
  setCurrentSlide,
  slidesCount,
  currentSlideIndex,
}: SimpleSlider): SliderModule {
  return {
    elementExists: false,

    create: function () {
      if (this.elementExists) return;
      const { element, update } = createDotsBlock({
        onClick: ({ target }) => {
          if (target instanceof HTMLElement) {
            setCurrentSlide(Number(target.dataset.slide));
          }
        },
        dotCount: slidesCount,
        initialActiveDot: currentSlideIndex,
      } as DotsBlockProps);
      this.elementExists = true;
      return { element, update };
    },
  };
}
