export interface Props{
	className?: string,
	onClick?: (event?: MouseEvent) => unknown,
}

export type ElementListener = {
	update?: (activeIndex: number) => void;
	element: HTMLElement;
};

export type Component = (props:Props) => ElementListener;