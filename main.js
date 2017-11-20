
function setCheckBox(id, check){
  if(check){
    $(id).checkbox('check');
  }
  else {
    $(id).checkbox('uncheck');
  }
}

function isCheckboxChecked(id){
  return $(id).checkbox('is checked');
}

function getDateFromTimeStr(timeStr){
  var d = new Date();
  res = timeStr.split(":");
  if(res.length === 2){
    d.setHours(res[0]);
    d.setMinutes(res[1]);
  }

  return d;
}

function getTimeStrFromDate(date){
  return date.getHours() + ":" + date.getMinutes();
}

function loadSettings() {
  //initialize with default values, if no value is present
  chrome.storage.local.get({
    beginTime: '00:00',
    endTime: '23:59',
    frequency: 15,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
    lastShownTimestamp: -1
  }, function(items) {
    setCheckBox("#mondayCheckbox", items.monday);
    setCheckBox("#tuesdayCheckbox", items.tuesday);
    setCheckBox("#wednesdayCheckbox", items.wednesday);
    setCheckBox("#thursdayCheckbox", items.thursday);
    setCheckBox("#fridayCheckbox", items.friday);
    setCheckBox("#saturdayCheckbox", items.saturday);
    setCheckBox("#sundayCheckbox", items.sunday);
    $('#frequency').val(items.frequency);

    $("#beginTime").calendar("set date", getDateFromTimeStr(items.beginTime));
    $("#endTime").calendar("set date", getDateFromTimeStr(items.endTime));

    showMeSomething(items.frequency, items.lastShownTimestamp);

  });
}

function saveSettings(){
  chrome.storage.local.set({monday: isCheckboxChecked('#mondayCheckbox')});
  chrome.storage.local.set({tuesday: isCheckboxChecked('#tuesdayCheckbox')});
  chrome.storage.local.set({wednesday: isCheckboxChecked('#wednesdayCheckbox')});
  chrome.storage.local.set({thursday: isCheckboxChecked('#thursdayCheckbox')});
  chrome.storage.local.set({friday: isCheckboxChecked('#fridayCheckbox')});
  chrome.storage.local.set({saturday: isCheckboxChecked('#saturdayCheckbox')});
  chrome.storage.local.set({sunday: isCheckboxChecked('#sundayCheckbox')});
  chrome.storage.local.set({frequency: $("#frequency").val()});
  chrome.storage.local.set({beginTime: getTimeStrFromDate($("#beginTime").calendar("get date"))});
  chrome.storage.local.set({endTime: getTimeStrFromDate($("#endTime").calendar("get date"))});

  //reset last shown timestamp, in order to show image when new tab gets opened the next time
  chrome.storage.local.set({lastShownTimestamp: -1});
} 

function saveLastShownTimestamp(lastShownTimestamp){
  chrome.storage.local.set({lastShownTimestamp: lastShownTimestamp});
}

function isEnabledForWeekday(weekday){
  switch(weekday){
    case 0:
      if(isCheckboxChecked('#sundayCheckbox')) return true;
      return false;
      break;

    case 1:
      if(isCheckboxChecked('#mondayCheckbox')) return true;
      return false;
      break;

    case 2:
      if(isCheckboxChecked('#tuesdayCheckbox')) return true;
      return false;
      break;

    case 3:
      if(isCheckboxChecked('#wednesdayCheckbox')) return true;
      return false;
      break;

    case 4:
      if(isCheckboxChecked('#thursdayCheckbox')) return true;
      return false;
      break;

    case 5:
      if(isCheckboxChecked('#fridayCheckbox')) return true;
      return false;
      break;

    case 6:
      if(isCheckboxChecked('#saturdayCheckbox')) return true;
      return false;
      break;

    default:
      break;
  }
  return false;
}

function showNext(frequency, lastShownTimestamp){
  if(lastShownTimestamp !== -1){
    var currentTime = new Date();
    var nextShownTime = new Date();
    nextShownTime.setTime(((lastShownTimestamp + (frequency * 60)) * 1000));
  }

  if((currentTime > nextShownTime) || (lastShownTimestamp === -1))
    return true;
  return false;
}

function showMeSomething(frequency, lastShownTimestamp){
  var date = new Date();
  var isEnabled = isEnabledForWeekday(date.getDay());
  if(isEnabled){
    if(showNext(frequency, lastShownTimestamp)){
      $("#container").attr("src", "https://imagemonkey.io/verify?show_header=false&show_footer=false");
      saveLastShownTimestamp((date.getTime()/1000));
    }
  }
}


$(document).ready(function(){
  $("#timeValidationError").hide();
  $("#frequencyValidationError").hide();
  loadSettings();

	$('#beginTime').calendar({
	  type: 'time',
	  popupOptions: {
	  	position: 'bottom left',
        observeChanges: false
      }
	});

	$('#endTime').calendar({
	  type: 'time',
	  popupOptions: {
	  	position: 'bottom left',
        observeChanges: false
      }
	});

	$("#settingsButton").click(function(e) {
		$('#settingsDlg').modal('setting', { detachable:false }).modal('show');
	});

  $("#saveSettingsButton").click(function(e) {
    e.preventDefault();
    var frequency = $("#frequency").val();
    if($.isNumeric(frequency)){
      var frequencyInt = parseInt(frequency, 10);
      if(frequencyInt < 0){
        $("#frequencyValidationError").show(200).delay(1500).hide(200);
        return;
      }
    } 
    else {
      $("#frequencyValidationError").show(200).delay(1500).hide(200);
      return;
    }

    var endTime = $("#endTime").calendar("get date"); 
    var beginTime = $("#beginTime").calendar("get date");
    if(beginTime > endTime){
      $("#timeValidationError").show(200).delay(1500).hide(200);
      return;
    }
    else{
      saveSettings();
      $('#settingsDlg').modal('setting', { detachable:false }).modal('hide');
    }
  });

  $("#cancelSettingsButton").click(function(e) {
    $('#settingsDlg').modal('setting', { detachable:false }).modal('hide');
  });
});
