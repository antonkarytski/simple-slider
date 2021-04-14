const prefix = (className: TemplateStringsArray):string => `_simple-slider-${className}`

export const BASIC_CLASSNAME = "simple-slider"
export const ROOT_COMPONENT_CLASS = prefix`root`
export const WRAPPER_CLASS = prefix`inner-component`
export const WRAPPER_ACTIVE_CLASS = "active"
export const BUTTON_CLASS = prefix`navigation-button`
export const BUTTON_RIGHT_CLASS = "right"
export const BUTTON_LEFT_CLASS = "left"