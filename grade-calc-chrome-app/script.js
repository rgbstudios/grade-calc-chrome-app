let invalid;

$(function() {

	$('#resetButton').click(function() { // start new
		chrome.storage.sync.clear(function() {
			chrome.runtime.reload();
		});
	}); // end new

	$('#nightButton').click(function() {
		$('#nightTheme').attr('href', $('#nightTheme').attr('href')?'':'css/night.css');

		chrome.storage.sync.set({'night': $('#nightTheme').attr('href')}); // new
	});

	chrome.storage.sync.get({night:false}, function(items) { // start new
		if(items.night)
			$('#nightButton').click();
	}); // end new


	// for(let i=0; i<3; i++) {
	// 	makeNewDiv();
	// }

	loadData(); // new

	$('#add').click(makeNewDiv);

	$('#clear').click(function() {
		$('.score').val(0);
		$('#studentName').val('');
	});

	$('#calc').click(doCalc);
	$('#fullscreen').click(toggleFullscreen);

	$('#same').click(function() {
		let weightInputs = $('.weight');
		for(let i=0; i<weightInputs.length; i++)
			weightInputs[i].value = 100/weightInputs.length;
	});

	$('#copy').click(function() {
		if(!invalid) {
			document.oncopy = function(evt) {
				evt.clipboardData.setData('Text', $('#grade').html() + ' ' + $('#letter').html() );
				evt.preventDefault();
			};
			document.execCommand('copy');
			document.oncopy = undefined;
			//todo: notificaiton it was copied
		}
	});

	$('#clearConsole').click(function() {
		$('#console').val('').focus();
	});
	

	$('#downloadConsole').click(function() {		
		let data = [(document.getElementById("console").value.replace(/\r?\n/g, '\r\n'))];		
		properties = {type: 'plain/text'};
		try {
			file = new File(data, "grades.txt", properties);
		} catch(e) {
			file = new Blob(data, properties);
		}
		$('#downloadLink').prop('download', 'grade console ' + getFormattedDate() + '.txt');
		$('#downloadLink').prop('href', URL.createObjectURL(file) );
	});

});

function makeNewDiv(id = '') { // new
	$('#gradeItems').append('<div id="' + id + '" class="gradeItem">' + //new
		'<p class="gradeLabel">Score: &nbsp;</p>' +
		'<input type="number" min="0" class="score form-control input-sm" value="0" title="Score">' +
		'<p>&nbsp;/&nbsp;</p>' +
		'<input type="number" min="0" value="100" class="total form-control input-sm" tabIndex="-1" title="Total">' +
		'<p class="breakP">&nbsp;|&nbsp;</p>' +
		'<p class="gradeLabel">Weight: &nbsp;</p>' +
		'<input type="number" min="0" class="weight form-control input-sm" tabIndex="-1" title="Weight (should add to 100%)">' +
		'<p>%</p>' +
		'<p class="breakP">&nbsp;|&nbsp;</p>' +
		'<p class="gradeLabel">Name: &nbsp;</p>' +
		'<input type="text" class="name form-control input-sm" tabIndex="-1" title="Assignment Name (optional)" placeholder="Assignment (optional)">' +
		'<button class="btn btn-light deleteButton" title="Delete Item" tabIndex="-1" onclick="this.parentNode.parentNode.removeChild(this.parentNode);">' +
		'<i class="fas fa-times"></i></button>' +
		'<p class="gradeInfo"></p>' +
		'</div>');
}

function doCalc() {
	if($('.gradeItem').length==0) {
		invalid = true;
		$('#grade').html('Please add an item with the "New Item" button');
		return;
	}

	let weightTotal = 0;
	$('.weight').each(function(idx, val){
		weightTotal += parseFloat($(val).val() );
	});
	let grade = 0;
	invalid = false;	
	let message = '';
	$('.gradeItem').each(function(idx, val) {
		let item = getAssignmentGrade($(val), weightTotal);
		if(item.invalid) {
			invalid = true;
			message = item.message;
		 } else {
			grade += item.grade;		 	
		}
	});
	if(invalid) {
		$('#letter').html('');
		$('#grade').html(message);
		$('.gradeInfo').html('');
	} else {
		grade = Math.round(grade*100)/100;
		$('#letter').html(getGradeLetter(grade) );
		$('#console').val($('#studentName').val() + ' ' + grade + '% ' + getGradeLetter(grade) + '\n' + $('#console').val() );
		$('#grade').html(grade + '%');
	}

	saveData(); // new

}

// returns array of isValid, grade if valid, message otherwise
function getAssignmentGrade(elm, weightTotal) {
	let scoreInput = elm.find('.score');
	let totalInput = elm.find('.total');
	let weightInput = elm.find('.weight');
	let gradeInfo = elm.find('.gradeInfo');

	if(scoreInput.val() == '' || totalInput.val() == '' || weightInput.val() == '')
		return {invalid: true, message:'Please enter all numerical inputs and delete empty items'};

	let newVal = scoreInput.val() / totalInput.val() * weightInput.val() / weightTotal * 100;
	gradeInfo.html('&nbsp; Points: ' + Math.round(newVal*100)/100 + '% Grade: ' + Math.round(scoreInput.val()/totalInput.val()*10000)/100 + '%');
	return {invalid: false, grade: newVal};
}

function getGradeLetter(grade) {
	if(grade >= 100)
		return 'A+';

	let letter;
	if(grade >= 90)
		letter = 'A';
	else if(grade >= 80)
		letter = 'B';
	else if(grade >= 70)
		letter = 'C';
	else if(grade >= 60)
		letter = 'D';
	else
		return 'F';
	
	if(grade%10 >= 7)
		letter += '+';
	else if(grade%10 < 3)
		letter += '-';
	
	return letter;
}

function getFormattedDate() {
	let today = new Date();
	let day = today.getDate();
	let mon = today.getMonth()+1; // Jan is 0
	day = day < 10 ? '0' + day : day;
	mon = mon < 10 ? '0' + mon : mon;
	return mon + '/' + day + '/' + today.getFullYear();	
}

function toggleFullscreen() {
	let elem = document.documentElement;
	if (!document.fullscreenElement && !document.mozFullScreenElement &&
		!document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}
