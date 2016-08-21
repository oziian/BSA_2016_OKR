import axios from 'axios';

export function search(value) {
	const action = {
		type: 'SEARCH_OBJECTS',
		searchValue: value
	};
	return action;
}

export function showFilters(show) {
	const action = {
		type: 'SHOW_FILTERS',
		showHistoryFilters: show
	};
	return action;
}

export function setFilterDateFrom(value) {
	const action = {
		type: 'SET_HISTORY_FILTER_DATE_FROM',
		setHistoryFilterDateFrom: value
	};
	return action;
}

export function setFilterDateTo(value) {
	const action = {
		type: 'SET_HISTORY_FILTER_DATE_TO',
		setHistoryFilterDateTo: value
	};
	return action;
}

export function setNameFilter (nameFilter) {
	const action = {
		type: 'SET_NAME_FILTER',
		nameFilter
	} 
	return action;
}

export function setTypeFilter (typeFilter) {
	console.log(typeFilter);
	const action = {
		type: 'SET_TYPE_FILTER',
		typeFilter
	} 
	return action;
}

// export function getSortedItems(sort) {
// 	return(dispatch, getStore) => {
	
// 		dispatch({
// 	 		type: 'GET_SORTED_ITEMS',
// 		});

// 	 	return axios.put('/api/history/', {
// 	 		sort
// 	 	})
// 			.then( (response) => dispatch(receivedFilteredItems(response.data)))
// 			.catch( (response) => dispatch(historyItemsError(response.data)));
// 	};
// }

// export  function receivedSortedItems (historyItems) {
// 	 return {
// 		type: 'RECEIVED_SORTED_ITEMS',
// 		historyItems
// 	} 
// }

export function setSort (sortField) {
	// const action = {
	// 	type: "SET_SORT",
	// 	sort: {sortField}
	// };

	// return action;
	return (dispatch, getStore) => {
		let store = getStore().history;
		console.log(sortField);
		dispatch({
			type: 'SET_SORT',
			sort: {
				sortField,
				up: !store.sort.up
			}
		})
	}
}

export function resetFilters () {
	 const action = {
	 	type: 'RESET_FILTERS'
	 }

	 return action;
}

export function getFilteredItems () {
	return(dispatch, getStore) => {
		let store = getStore().history;

		dispatch({
	 		type: 'GET_FILTERED_ITEMS',
		});


		console.log(getStore());
	 	return axios.put('/api/history/', { 
	 		sort: store.sort,
	 		filters: {
	 			type: store.typeFilter,
	 			name: store.nameFilter,
	 			date: {
	 				from: store.setHistoryFilterDateFrom,
	 				to: store.setHistoryFilterDateTo
	 			}
	 		}
	 	})
			.then( (response) => dispatch(receivedFilteredItems(response.data)))
			.catch( (response) => dispatch(historyItemsError(response.data)));
	};
}

export function receivedFilteredItems (historyItems) {
	 return {
		type: 'RECEIVED_FILTERED_ITEMS',
		historyItems
	} 
}

export function getHistoryItems(filter, sprt){
	return(dispatch, getStore) => {
			
		dispatch({
			type: 'GET_HISTORY_ITEMS',
		});

		return axios.get('/api/history/')
			.then( (response) => dispatch(receivedHistoryItems(response.data)))
			.catch( (response) => dispatch(historyItemsError(response.data)));
	};
}

export function receivedHistoryItems(historyItems){
	return {
		type: 'RECEIVED_HISTORY_ITEMS',
		historyItems
	}
}

export function historyItemsError(data){
	return {
		type: 'HISTORY_ITEMS_ERROR',
		data
	}
}