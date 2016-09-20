import React, { Component } from 'react'
import moment from 'moment';
import sweetalert from 'sweetalert';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../../../actions/categoriesActions.js";

class RecycleBinItem extends Component {

	render() {

		let dateStr = moment(this.props.item.deletedDate).format('D MMMM YYYY, h:mm a');
		
		return (
			<tr key={this.props.item.id} className="bin-item-row">
				<td data-th="Title" className="width-20perc">{ this.props.item.title }</td>
				<td data-th="Description" className="width-30perc">{ this.props.item.description }</td>
				<td data-th="Type" className="item-title">{ this.props.item.type }</td>
				<td data-th="Category"> <span className="item-category">{ this.props.item.category }</span></td>
				<td data-th="Deleted By" className="item-deleted-by">{ this.props.item.deletedBy}</td>
				<td data-th="Date" className="width-15perc">{ dateStr }</td>
				<td data-th="Action" className="width-5perc">
					<button className="btn btn-blue-hover"  title="Restore" onClick={this.restore.bind(this)}><i className="fi flaticon-repeat-1"></i></button>
				</td>
			</tr>
		);
	}

	restore() {		
		let categoryIndex = this.props.categories.list.findIndex((category) => {
			return (!category.isDeleted && this.props.item.category == category.title);
		});

		if(categoryIndex !== -1 || this.props.item.category == 'categories'){
			this.props.restoreItem(this.props.item);
		} else {
			sweetalert({
				title: 'Cannot restore object', 
				text: "Please, restore it's category.", 
				type: 'error'
			});
		}
	}
}



function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		recycleBin: state.recycleBin,
		categories: state.categories
	};
}

const RecycleBinItemConnected = connect(mapStateToProps, mapDispatchToProps)(RecycleBinItem);
export default RecycleBinItemConnected
