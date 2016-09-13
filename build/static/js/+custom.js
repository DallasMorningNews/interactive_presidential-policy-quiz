$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var d = new Date();
	var year = d.getFullYear();

	$('.copyright').text(year);


	var questionGroup;
	var points = ["one point", "two points", "three points"];

	var totalPoints = 0;

	var clintonCount = 0;
	var trumpCount = 0;

	var clintonScore = 0;
	var trumpScore = 0;

	var uniqueID;

	var candidateSelected = false;

	$.getJSON("js/data.json", function(data) {
		questionGroup = data;
	});

	var quiz = {
		"candidate": "",
		"q1": 0,
		"q2": 0,
		"q3": 0,
		"q4": 0,
		"total": 0
	};

	////////////////////////////////////////////////////////////////////////////
	///// SELECTING A CANDIDATE ////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	$(".candidate-mug").bind("click", function() {

		// setting the candidate value on the quiz object to the candidate selected
		quiz.candidate = $(this).attr("alt");

		//reveal the questions section
		$("#questions").slideDown(500);

		// post that a candidate has been selected to the database. We do this here,
		// even though no questions have been answered yet, because we want to get the
		// id of the record so we can update numbers as questions get answered
		$.post("http://apps.dallasnews.com/livewire/presidential-policy-quiz", quiz, function() {
				console.log("Success!");
			}).fail(function() {
				console.log("Whoops, something bad happened!");
			}).done(function(data) {
				console.log(data);
				uniqueID = data.id;
			});

		// unbind the click element on the candidate mugs. Choose wisely, as there's no going back
		$(".candidate-mug").unbind("click");
	});



	////////////////////////////////////////////////////////////////////////////
	///// SELECTING A POINT VALUE FOR A QUESTION ///////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	$(".point-values li").click(function() {

		// hiding the point value selection list
		$(this).parent("ul").addClass("no-show");

		// grabbing the index of the li selected. This index value will correspond
		// to which question gets displayed
		var pointsIndex = $(this).index();

		// grabbing the category of the point value selected
		var category = $(this).closest(".question-block").attr("id");

		// generate a question based on the point value selected in a given category
		generateQuestion(pointsIndex, category);
	});


	////////////////////////////////////////////////////////////////////////////
	///// GENERATING THE QUESTION //////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	function generateQuestion(i, category) {

		// iterate over each category in the question group and find the category
		// that matches the one handed off to this function
		$.each(questionGroup, function(k,v) {

			if (category === v.cat) {

				// setting a category index ("c") to the key for the matching cateogry
				// in the questionGroup json
				var c = k;

				// display the amount of points the question is for and the question selected
				$("#" + category).find("h4").text("For " + points[i] + ": " + v.questions[i].question);

				// shuffle the answers for that question for randomness in repeated questions
				// basically, we don't want the correct answer to be in the same position each time
				var answers = _.shuffle(v.questions[i].answer_group);

				// iterate over the array of answers and append them to the answer-block
				$.each(answers, function(key, value) {
					$("#" + category).find(".answer-block").append("<li>" + answers[key] + "</li>");
				});

				// then bind the click function to each of those answer lis
				// when the user clicks, it'll hand off that answer to the checkAnswers
				$("#" + category).find(".answer-block li").bind("click", function() {

					// grabbing the text of the answer. we'll check this text against
					// the text for the correct answer for that question below
					var answerSelected = $(this).text();

					// mark that answer as the selected one
					$(this).addClass("selected");

					// we'll unbind the click function from the question after it's clicked
					// you only get one guess, kids, so make it count
					$("#" + category).find(".answer-block li").unbind("click");

					// hand off the category index, question index and selected answer
					// to the checkAnswers function
					checkAnswers(c, i, answerSelected);
				});
			}
		});

	}


	////////////////////////////////////////////////////////////////////////////
	///// CHECKING THE ANSWER AND DISPLAYING FEEDBACK //////////////////////////
	////////////////////////////////////////////////////////////////////////////

	function checkAnswers(c, i, answerSelected) {
		console.log(c, i, answerSelected);

		var category = questionGroup[c].cat;

		// checking if the answer is correct
		if (answerSelected === questionGroup[c].questions[i].correct_answer) {

			// if it is correct, we're going to append a response that says how many
			// points were awarded to a given candidate
			$("<p><span class='right-wrong'>Right. </span>" + _.capitalize(points[i]) + " to your candidate.</p>").insertBefore($("#" + category + " .read-more"));

			// update the appropriate quiz question's point value in the quiz object
			// we use i + i because i is an index value of the li element and is 0 indexed
			quiz["q" + (c+1)] = (i+1);

			// update the quiz's total value
			quiz.total += (i+1);

			// update the user's quiz record on the livewire database, then update
			// the overall numbers with the data sent back
			$.post("http://apps.dallasnews.com/livewire/presidential-policy-quiz/update/" + uniqueID, quiz, function() {
					console.log("Success!");
				}).fail(function() {
					console.log("Whoops, something bad happened!");
				}).done(function(data) {
					updateNumbers(data);
				});

		} else {
			// if the answer is wrong, append a reponse that alerts the user as such
			// and supplies the correct answer
			$("<p><span class='right-wrong'>That’s incorrect. </span> The right answer is: " + questionGroup[c].questions[i].correct_answer + "</p>").insertBefore($("#" + category + " .read-more"));

		}

		// and then we're going to reveal the link to the stories about x category
		$("#" + category).find(".read-more").removeClass("no-show");


	}

	function updateNumbers(data) {

			// 0 out the totals
			clintonCount = 0;
			trumpCount = 0;
			clintonScore= 0;
			trumpScore = 0;

			// iterate over the data returned from the database and total up the
			// individual counts
			$.each(data, function(key, value) {
				if (value.candidate === "Hillary Clinton") {
					clintonCount++;
					clintonScore += value.total;
				} else if (value.candidate === "Donald Trump") {
					trumpCount ++;
					trumpScore += value.total;
				}
			});

			console.log(clintonCount, clintonScore, trumpCount, trumpScore);

	}





});
