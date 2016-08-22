import React, { Component } from 'react';
import ObjectiveItem from './objective.jsx';
import Quarter from './quarter.jsx';
import ObjectivesList from './objective-list.jsx';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../../actions/myObjectivesActions";

class Objectives extends Component {
	constructor(props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
		this.changeYear = this.changeYear.bind(this);
		this.handleAddingNewQuarter = this.handleAddingNewQuarter.bind(this);
	}

	changeTab(num) {
		this.props.setChangeTab(num);
	}
	changeYear(year){
		this.props.setChangeYear(year);
	}
	handleAddingNewQuarter(new_quarter){
		let confirmation = confirm("Do you really want to create new quarter?");

		if(confirmation){

			// call action
			this.props.createQuarter(new_quarter);
		}
	}

	componentWillMount() {
		console.log(this.props);
		this.props.getAllCategories();
		this.props.getMe();
	}

	render() {
		const data = this.props.stateFromReducer.myState;
		const { me, currentYear, currentTab, existedQuarters } = data;
		var ObjectiveItems = [];

		if (me.quarters != undefined) {
			let quarter = me.quarters.find((quarter) => {
				console.log(currentYear, currentTab)
				return (quarter.year == currentYear) && (quarter.index == currentTab)
			});

			ObjectiveItems = quarter.userObjectives.map((item, index) => {
					console.log('item -> ' + item.templateId.category.title);

					return <ObjectiveItem index={ index } key={ item._id } category={ item.templateId.category.title } item={ item } />
			});
		}

		return (
			<div id="home-page-wrapper">
				<Quarter changeTab={ this.changeTab } changeYear={this.changeYear}
						currentTab={ currentTab } existedQuarters={ existedQuarters } addNewQuarter={ this.handleAddingNewQuarter } />
				<div id='objectives'>
					<ObjectivesList objectives={ ObjectiveItems } />
				</div>
			</div>
		)
	}
}
Objectives.defaultProps = { today: new Date() };

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		stateFromReducer: state
	};
}

const ObjectivesConnected = connect(mapStateToProps, mapDispatchToProps)(Objectives);

export default ObjectivesConnected
