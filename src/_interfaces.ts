export type IndexSubscriber = (activeIndex: number, previousIndex?: number) => unknown

export interface IndexListener {
	update?: IndexSubscriber;
	beforeUpdate?:IndexSubscriber;
}

export interface ElementListener extends IndexListener {
	element: HTMLElement | HTMLElement[];
}

export interface Props{
	className?: string,
	onClick?: (event?: MouseEvent) => unknown,
}

export type Component = (props:Props) => ElementListener;

export type SliderModule = {
	elementExists?: boolean;
	create: (props?: unknown) => ElementListener;
};

