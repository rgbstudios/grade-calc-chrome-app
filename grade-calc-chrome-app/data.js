function saveData() {
	let data = [];

	$('.gradeItem').each(function(idx, val) {
		let elm = $(val);
		data[idx] = {};
		data[idx].score = elm.find('.score').val();
		data[idx].total = elm.find('.total').val();
		data[idx].weight = elm.find('.weight').val();
		data[idx].name = elm.find('.name').val();
	});

	chrome.storage.sync.set({'data': data});

	chrome.storage.sync.set({'student': $('#studentName').val()});
	chrome.storage.sync.set({'console': $('#console').val()});
}

function loadData() {
	chrome.storage.sync.get({data:[], student:'', console:''}, function(items) {

		for(let i=0; i<items.data.length; i++) {
			makeNewDiv('gradeItem'+i);
			let tmp = $('#gradeItem'+i);
			tmp.find('.score').val(items.data[i].score);
			tmp.find('.total').val(items.data[i].total);
			tmp.find('.weight').val(items.data[i].weight);
			tmp.find('.name').val(items.data[i].name);
		}
		if(items.data.length==0) {
			makeNewDiv();
			makeNewDiv();
			makeNewDiv();
		} else {
			$('#calc').click();
		}

		$('#studentName').val(items.student);
		$('#console').val(items.console);
	});
}
