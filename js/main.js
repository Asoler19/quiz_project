//Global Variables
var correctAnswers = 0;
var currentQuestion = 0;
var allQuestions = new Array();
/* VIEW CODE */
var $questionTitle = $("<h2></h2>");
var $question = $("<p></p>");
var $choicesForm = $("<form id='choicesForm'></form>");
var $choicesRadioButtons = $("<input type='radio'>1<br>");

function renderQuestionTemplate(index) {
   $(".content")
  .append("<h2></h2>")
  .find("h2")
  .append(allQuestions[index]['title']);
  
  $(".content")
  .append("<p class='question-wrap'></p>")
  .find("p")
  .append(allQuestions[index]['question']);
  
  $(".content")
  .append("<form id='choicesForm'></form>");
}

function renderForm(index) {
	
	renderQuestionTemplate(index);
	var choices = allQuestions[index]['choices'];
	if (!choices)
		return;
	for (var choice in choices) {
		var x = choices[choice] + '';
		//console.log(choice);
		//console.log(allQuestions[index]['curr_choice']);
		var checked_str = (choice == allQuestions[index]['curr_choice'] ) ? 'checked' : '';
		//console.log(checked_str);
		//if (x.length < 10)
		//	x += '&nbsp;'.repeat(20 - x.length * 2);
		var option_c = parseInt(choice) + 1;
		$("#choicesForm").append("<p>"+option_c+' <input type="radio" name="choice_radio" class="choice_radio" data-choice='+choice+' id="choice' + choice + '" value="' + x + '"' + checked_str + '> ' + "<label for=choice"+choice+">"+ x + '</label>'+'</p>');
		
	}
	if (index == allQuestions.length - 1)
		renderScoreButton();
	else
		renderNextButton();
}

function renderNextButton() {
	$(".next-btn").css('visibility', 'visible');
}
function hideNextButton() {
	$(".next-btn").css('visibility', 'hidden');
}
function renderPrevButton() {
	$(".prev-btn").css('visibility', 'visible');
}
function hidePrevButton() {
	$(".prev-btn").css('visibility', 'hidden');
}

$(document).on('click','.next-btn',function(){
		if ($('.choice_radio').is(":checked")) {
			renderPrevButton();
			$('#displayNotice').hide();
			allQuestions[currentQuestion]['curr_choice'] = $('.choice_radio:checked').attr('data-choice'); 
			if (currentQuestion < allQuestions.length - 1)
			{
				if ($('.choice_radio:checked').attr('data-choice') == allQuestions[currentQuestion]['correctAnswer']) {
					//correctAnswers ++;
					//showOkMove($(this));
				} 
				updateCorrectAnswerCount();
                renderQuestion();
				currentQuestion++;
			}
			if(currentQuestion == 0)
			{
               hidePrevButton();
			}
			if(currentQuestion == allQuestions.length - 1)
			{
			   hideNextButton();
			}

		}
		else
		{
			$('#displayNotice').show();
			return false;
		}
});

$(document).on('click','.prev-btn',function(){

		if (currentQuestion <= allQuestions.length - 1)
		{
			renderPrevButton();
			if ($('.choice_radio:checked').attr('data-choice') == allQuestions[currentQuestion]['correctAnswer']) {
				//correctAnswers ++;
				//showOkMove($(this));
			} 
			else
			{
				
			}
			currentQuestion--;
			renderQuestion();
		}
		if(currentQuestion == 0)
		{
           hidePrevButton();
		}
		if(currentQuestion == allQuestions.length - 1)
		{
		   hideNextButton();
		}
});

function updateCorrectAnswerCount()
{   
	correctAnswers = 0;
    for (var sing_quest in allQuestions)
    {
		//console.log(allQuestions[sing_quest]['correctAnswer']);
		if (allQuestions[sing_quest]['correctAnswer'] == allQuestions[sing_quest]['curr_choice']) {
			correctAnswers ++;
		}
	}
}

function showOkMove(obj) {
	var delay = 100;
	$(obj).html("Correct!");
	var toggle_width = 10;
		$(obj).animate({
			width: '+=' + toggle_width,
			fontSize:'20px',
		}, 100).animate({
			width: '-=' + toggle_width,
			fontSize:'13px',
		}, 100).animate({
			width: '+=' + toggle_width,
			fontSize:'20px',
		}, 100).animate({
			width: '-=' + toggle_width,
			fontSize:'13px',
		}, 100, function(){
			renderQuestion();
		});
}

function renderScoreButton() {
  $('.score-btn').css('visibility', 'visible');
  $(".score-btn").on("click", function(){
	if ($('.choice_radio').is(":checked")) {
		$('#displayNotice').hide();
		allQuestions[currentQuestion]['curr_choice'] = $('.choice_radio:checked').attr('data-choice'); 
	}
	else
	{
		$('#displayNotice').show();
		return false;
	}
  	hidePrevButton();
	if ($('.choice_radio:checked').attr('data-choice') == allQuestions[currentQuestion]['correctAnswer']) {
		//showOkMove($(this));
		//correctAnswers ++;
		updateCorrectAnswerCount();
	}
	// else
		// showWrongMove();
	$('.content').fadeOut('fast', function(){
		$(".content").children().remove();
		$('.content').show();
		$(".content")
		.append("<h1>Your Score</h1><p class='scorePoint'>"+correctAnswers+"</p>")
		.append("<button class='startOver' type='button'>Start Over</button>");
		$('.score-btn').css('visibility', 'hidden');
	});
	
  });
}

$(document).on("click",'.startOver', function(){
  $('.score-btn').css('visibility', 'hidden');
  $(".content").children().remove();
  for(var sing_quest in allQuestions)
  {
	sing_quest['curr_choice']= "";
  }
  StartQuestion();
});

function StartQuestion() {
	currentQuestion = 0;
    correctAnswers = 0;
	$('#question-box').css('opacity', '0.1');
	$('#question-box').css('width', '10px');
	$('.content').css('height','0px');
    
    if($(window).width() > 768)
    {
    	$('#question-box')
		.animate({
			opacity:1.0,
			width:'600px',
		},'slow', function(){
			renderQuestion();
			$('.btn-wrap').show();
		});
    }
    else
    {
    	$('#question-box')
		.animate({
			opacity:1.0,
			width:'90%',
		},'slow', function(){
			renderQuestion();
			$('.btn-wrap').show();
		});
    }
	
	
}
function renderQuestion() {
	$('.content')
	.animate({
		height : '10px',
	},'slow',function(){
		$(".content").html('');
		renderForm(currentQuestion);
		
	});	
}
function LoadQuestionLists(){
	//get questions
	try {
	$.ajax({
		url: 'http://fvi-grad.com:4004/quiz',
		dataType : 'json',
		success: function (data) {
			data = (typeof(data) == 'string') ? eval(data) : data;
			var count = 0;
			for (var p in data) {
				if (p == '' || p == 'remove')
					continue;
				allQuestions[count] = new Array();
				allQuestions[count]['title'] = "Question " + (count + 1);
				allQuestions[count]['id'] = data[p]['id'];
				allQuestions[count]['question'] = data[p]['questionText'];
				allQuestions[count]['choices'] = data[p]['answers'];
				allQuestions[count]['curr_choice'] = '';
				var ccount = count++;
				
				//get Answer
					$.ajax({
						url: 'http://fvi-grad.com:4004/quiz-get-answer/' + data[p]['id'],
						async:false,
						success: function (res_answer) {
							var correct = res_answer.replace(/"/g, '');
							var choice = allQuestions[ccount]['choices'];
							allQuestions[ccount]['correctAnswer'] = "";
							for (var pc in choice) {
								if (choice[pc] == correct) {
									allQuestions[ccount]['correctAnswer'] = pc;
									break;
								}
							}
							if (ccount == data.length - 1) {
								//StartQuestion();
							}
						}
					});
				
				
			}
			$(".content").html('');
			StartQuestion();
		}
	});
	} catch(e){}
}

$( document ).ready( function () {
	LoadQuestionLists();

});