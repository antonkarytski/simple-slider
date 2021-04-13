import "./style.scss"

declare global {
 interface Window {
	SimpleSlider: any;
 }
}


class SimpleSlider {
 private sliders: NodeListOf<any>;

 static f = 15;
 constructor(selector) {
	document.addEventListener("DOMContentLoaded", event => {
	 this.sliders = document.querySelectorAll(selector)
	 this.sliders.forEach(slider => {
		slider.innerHTML = "22222222222222"
	 })
	})
 }
}

window.SimpleSlider = SimpleSlider
