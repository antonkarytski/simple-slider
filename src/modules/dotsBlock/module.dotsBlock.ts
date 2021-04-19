import { SliderModule } from "../../_interfaces";
import createDotsBlock, { DotsBlockProps } from "./component.dotsBlock";
import {SimpleSlider} from "../../index";
import {insertElements} from "../../helpers/componentsHelper";

export default function dotsBlockModule({
  setCurrentSlide,
  slidesCount,
  currentSlideIndex,
  slider,
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
      insertElements(slider, element)
      this.elementExists = true;
      return { element, update };
    },
  };
}
