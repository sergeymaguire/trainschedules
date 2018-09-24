$(document).ready(function () {
	var config = {
		apiKey: "AIzaSyDFQW_V3WcIBd7G7Z-wxskJo7j5ohGOfnQ",
		authDomain: "train-71ca1.firebaseapp.com",
		databaseURL: "https://train-71ca1.firebaseio.com",
		projectId: "train-71ca1",
		storageBucket: "train-71ca1.appspot.com",
		messagingSenderId: "170958867906"
	  };

	firebase.initializeApp(config);

	var database = firebase.database();

	$("#addTrainBtn").on("click", function () {
		var name = $('#trainNameInput').val().trim();
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
            var line = childSnapshot.val().line;
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
				"<tr><td id='train'>" + childSnapshot.val().name +
				"</td><td id='destination'>" + childSnapshot.val().dest +
				"</td><td id='frequency'>" + childSnapshot.val().freq +
				"</td><td id='nextarrival'>" + moment(nextTrain).format("HH:mm") +
				"</td><td id='minutesaway'>" + minsAway + ' minutes until arrival' + "</td></tr>");
		});
	
	


});