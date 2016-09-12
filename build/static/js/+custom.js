$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var d = new Date();
	var year = d.getFullYear();

	$('.copyright').text(year);


	var questionGroup;
	var points = ["one", "two", "three"];

	var totalPoints = 0;

	$.getJSON("js/data.json", function(data) {
		questionGroup = data;
	});


	$(".point-values li").click(function() {
		$(this).parent("ul").addClass("no-show");

		var pointsIndex = $(this).index();
		var category = $(this).closest(".question-block").attr("id");

		generateQuestion(pointsIndex, category);
	});


	function generateQuestion(i, category) {

		$.each(questionGroup, function(k,v) {
			if (category === v.cat) {
				$("#" + category).find("h4").text("For " + points[i] + " points: " + v.questions[i].question);
				var answers = _.shuffle(v.questions[i].answer_group);

				$.each(answers, function(key, value) {
					$("#" + category).find(".answer-block").append("<li>" + answers[key] + "</li>");
				});

				$("#" + category).find(".answer-block li").bind("click", function() {

					var answerSelected = $(this).text();
					$(this).addClass("selected");

					$("#" + category).find(".answer-block li").unbind("click");
					checkAnswers(category, i, answerSelected);
				});
			}
		});

	}


	function checkAnswers(category, i, answerSelected) {
		console.log(category, i, answerSelected);
	}





});
