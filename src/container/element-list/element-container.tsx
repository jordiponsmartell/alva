import * as AlvaUtil from '../../alva-util';
import * as Components from '../../components';
import { ElementContentContainer } from './element-content-container';
import * as MobxReact from 'mobx-react';
import * as Model from '../../model';
import * as React from 'react';
import { ViewStore } from '../../store';

export interface ElementContainerProps {
	element: Model.Element;
}

@MobxReact.observer
export class ElementContainer extends React.Component<ElementContainerProps> {
	public render(): JSX.Element | null {
		const store = ViewStore.getInstance();
		const { props } = this;
		const open =
			props.element.getOpen() || props.element.getForcedOpen();

		// Ensure mobx registers
		props.element.getSelected();
		props.element.isNameEditable();
		props.element.getHighlighted();
		props.element.acceptsChildren();

		return (
			<Components.Element
				draggable={true}
				dragging={store.getDragging()}
				id={props.element.getId()}
				mayOpen={props.element.acceptsChildren()}
				open={open}
				onChange={AlvaUtil.noop}
				placeholderHighlighted={props.element.getPlaceholderHighlighted()}
				state={getState(props.element)}
				title={props.element.getName()}
			>
				{open
					? props.element
							.getContents()
							.map(content => (
								<ElementContentContainer key={content.getId()} content={content} />
							))
					: []}
			</Components.Element>
		);
	}
}

const getState = (element: Model.Element): Components.ElementState => {
	const store = ViewStore.getInstance();

	if (element.getSelected() && element.isNameEditable()) {
		return Components.ElementState.Editable;
	}

	if (element.getSelected()) {
		return Components.ElementState.Active;
	}

	if (store.getDragging() && !element.acceptsChildren()) {
		return Components.ElementState.Disabled;
	}

	if (element.getHighlighted()) {
		return Components.ElementState.Highlighted;
	}

	return Components.ElementState.Default;
};