import React, { Component } from 'react';
import KeyResultItem from './Key-result-item.js';
import KeyResultAdd from './key-result-add.jsx';
import sweetalert from 'sweetalert';

import { isEmpty } from '../../../../../backend/utils/ValidateService';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from "../../../../actions/okrManagingActions.js";

class KeyResults extends Component {
	constructor(props) {
		super(props);

		this.textHandleShow = this.textHandleShow.bind(this);
		this.setShowKeyResultElement = this.setShowKeyResultElement.bind(this);
		this.showAddKeyResultInput = this.showAddKeyResultInput.bind(this);
		this.hideAddKeyResultInput = this.hideAddKeyResultInput.bind(this);
		this.saveEditedKeyResult = this.saveEditedKeyResult.bind(this);
		this.isNotDuplicate = this.isNotDuplicate.bind(this);
		this.addKeyResult = this.addKeyResult.bind(this);
	}

	showAddKeyResultInput() {
		this.props.cancelEdit();
		
		let keyResultAddBtn = this.refs.newKeyResultButton;
		let keyResultAddElement = this.refs.newKeyResultButton.nextElementSibling;

		if (keyResultAddElement.classList.contains('undisplay')) {
			keyResultAddElement.classList.remove('undisplay');
			keyResultAddElement.classList.add('display');
		}

		if (keyResultAddBtn.classList.contains('display')) {
			keyResultAddBtn.classList.remove('display');
			keyResultAddBtn.classList.add('undisplay');
		}
	}

	hideAddKeyResultInput() {
		let keyResultAddBtn = this.refs.newKeyResultButton;
		let keyResultAddElement = this.refs.newKeyResultButton.nextElementSibling;

		if (keyResultAddElement.classList.contains('display')) {
			keyResultAddElement.classList.remove('display');
			keyResultAddElement.classList.add('undisplay');
		}

		if (keyResultAddBtn.classList.contains('undisplay')) {
			keyResultAddBtn.classList.remove('undisplay');
			keyResultAddBtn.classList.add('display');
		}
	}

	setShowKeyResultElement(keyResultElement) {
		this.props.cancelEdit();

		if (keyResultElement.classList.contains('undisplay')) {
			keyResultElement.classList.remove('undisplay');
			keyResultElement.classList.add('display');
		}
		else {
			keyResultElement.classList.remove('display');
			keyResultElement.classList.add('undisplay');
		}
	}

	textHandleShow(e) {
		var keyResultElement = e.target.nextElementSibling;
		this.setShowKeyResultElement(keyResultElement);
	}

	isNotDuplicate(id, title) {
		let keyResultIndex = this.props.data.findIndex((keyResult) => {
			return keyResult.title === title;
		});

		if(keyResultIndex === -1 || (!isEmpty(id) && this.props.data[keyResultIndex]._id === id)) {
			sweetalert.close();
			return true;
		} else {
			sweetalert({
				title: 'Error!',
				text: 'Key result with such title for that objective already exists',
				type: 'error',
			});

			return false;
		}
	}

	addKeyResult(title, difficulty) {
		if(this.isNotDuplicate(null, title)) {
			let reqBody = {
				title: title,
				difficulty: difficulty,
				objectiveId: this.props.objective._id,
			};
			
			this.props.addKeyResult(reqBody);
		}
	}

	saveEditedKeyResult(id, title, difficulty) {
		if(this.isNotDuplicate(id, title)) {
			let reqBody = {
				title: title,
				difficulty: difficulty
			}
			
			this.props.editKeyResult(id, reqBody);
		}
	}

	setDefaultKeyResult(objectiveId) {
		return (...args) => {
			this.props.setDefaultKeyResult.call(null, objectiveId, ...args);
		}
	}

	render() {
		// console.log('state', this.props);

		let item = this.props.data.map((item, index) => {
			return <KeyResultItem index = { index } 
														objective = { this.props.objective } 
														key = { index } 
														item = { item }
														hideAddKeyResultInput = { this.hideAddKeyResultInput }
														saveChanges = { this.saveEditedKeyResult }
														editingKeyResult = { this.props.okrManaging.editingKeyResult }
														activeKeyResult = { this.props.okrManaging.activeKeyResult }
														setActiveKeyResult = { this.props.setActiveKeyResult }
														setDefaultKeyResult = { this.setDefaultKeyResult(this.props.objective._id) }
														cancelEdit = { this.props.cancelEdit }
														deleteKeyResult = { this.props.deleteKeyResult }
							/>
		});
		
		return (
			<div className='key-results'>
				<button className="btn btn-blue-hover change" onClick={this.textHandleShow}>Key results
				</button>
				<div className='key-result-details undisplay'>
					<ul>
						{item}
					</ul>
					<div id="new-obj-keyresults">
						<a ref="newKeyResultButton" className='add-new-keyresult-btn display' onClick={ this.showAddKeyResultInput }>
							+Add new key result</a>
						<KeyResultAdd 
							objectiveId={ this.props.objective._id } 
							hideAddKeyResultInput={ this.hideAddKeyResultInput }
							addKeyResult={ this.addKeyResult }
						/>
					</div>
				</div>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		okrManaging: state.okrManaging,
	};
}

const KeyResultsConnected = connect(mapStateToProps, mapDispatchToProps)(KeyResults);

export default KeyResultsConnected;