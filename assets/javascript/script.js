$(document).ready(function () {
	var config = {
		apiKey: "AIzaSyAdaj-eidUQPCcKYrVK24WpG3IC224ShY8",
		authDomain: "timeclockapp-affa7.firebaseapp.com",
		databaseURL: "https://timeclockapp-affa7.firebaseio.com",
		projectId: "timeclockapp-affa7",
		storageBucket: "",
		messagingSenderId: "766938401677"
	};

	firebase.initializeApp(config);

	var database = firebase.database();
	//CONVERT TRAIN TIME================================================
	//var currentTime = moment();
	//console.log("Current Time: " + currentTime);
	//FUNCTIONS=========================================================

	// CAPTURE BUTTON CLICK
	$("#addTrainBtn").on("click", function () {

		//VALUES FOR EACH VARIABLE IN HTML
		var name = $('#trainNameInput').val().trim();
		var line = $('#lineInput').val().trim();
		var dest = $('#destinationInput').val().trim();
		var time = $('#trainTimeInput').val().trim();
		var freq = $('#frequencyInput').val().trim();

		// PUSH NEW ENTRY TO FIREBASE
		database.ref().push({
			name: name,
			dest: dest,
			time: time,
			freq: freq,
			timeAdded: firebase.database.ServerValue.TIMESTAMP
		});
		$("input").val('');
		return false;
	});

	database.ref().on("child_added", function (childSnapshot) {
			// console.log(childSnapshot.val());
			var name = childSnapshot.val().name;
			var dest = childSnapshot.val().dest;
			var time = childSnapshot.val().time;
			var freq = childSnapshot.val().freq;

			console.log("Name: " + name);
			console.log("Destination: " + dest);
			console.log("Time: " + time);
			console.log("Frequency: " + freq);

			var freq = parseInt(freq);
			var currentTime = moment();
			var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');;
			var trainTime = moment(dConverted).format('HH:mm');
			var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
			var tDifference = moment().diff(moment(tConverted), 'minutes');
			var tRemainder = tDifference % freq;
			var minsAway = freq - tRemainder;
			var nextTrain = moment().add(minsAway, 'minutes');
			$('#trainTable').append(
				"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
				"</td><td id='destDisplay'>" + childSnapshot.val().dest +
				"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
				"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
				"</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
		},
		function (errorObject) {
			console.log("Read failed: " + errorObject.code)
		});
$("nameDisplay").hide();
$("destDisplay").hide();
$("freqDisplay").hide();
$("nextDisplay").hide();
$("awayDisplay").hide();


});