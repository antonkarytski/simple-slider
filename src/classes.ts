const prefix = (className: TemplateStringsArray):string => `_simple-slider-${className}`

export const BASIC_CLASSNAME = "simple-slider"
export const ACTIVE_CLASS = prefix`active`
export const ROOT_COMPONENT_CLASS = prefix`root`
export const PREVENT_TRANSITION_EFFECT_CLASS = prefix`currently-drag`
export const WRAPPER_CLASS = prefix`inner-component`
export const WRAPPER_LOOP_CLASS = prefix`inner-loop-component`
export const BUTTON_CLASS = prefix`navigation-button`
export const BUTTON_RIGHT_CLASS = "right"
export const BUTTON_LEFT_CLASS = "left"
export const DOT_CLASS = "dot"
export const DOT_BLOCK_CLASS = prefix`dot-block`

export const EFFECT_MOVE = "move"
export const EFFECT_MOVE_ROOT_CLASS = prefix`effect-move-root`
