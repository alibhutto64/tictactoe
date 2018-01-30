$(function(){
	//variables declarations
	let user_symbol, game_type, comp_symbol;
	let turn = Math.floor((Math.random() * 2) + 1);
	let winCombinations = [
	  ['1','2','3'],['1','4','7'],
	  ['4','5','6'],['2','5','8'],
	  ['7','8','9'],['3','6','9'],
	  ['1','5','9'],['3','5','7']
	];
	let userTicked = [];
	let compTicked = [];
	$('#userWon span').html(sessionStorage.fw);
	$('#compWon span').html(sessionStorage.sw);

	$(".type, .sym").change(function(){
		sessionStorage.fw = 0;
		sessionStorage.sw = 0;
		location.reload();
	});
	$('#start').click(function(){
		user_symbol = $('.sym:checked').val();
		game_type = $('.type:checked').val();
		comp_symbol = (user_symbol == 'X' ? "O" : "X");
		$('#turn').html(turn == 1 ? "Player1 Turn" : "Computer / Player2 Turn");
		
		if (turn == 2 && game_type == 'sp') compAi();
	});
	
	let extract = function(num, arr, other , name){
		
		winCombinations.forEach((element, index) => {
			if(element.indexOf(num) >= 0 && arr.indexOf(element) == -1 && element.length == 3){
				arr.push(element);
			}
			if(element.indexOf(num) >= 0) {
				if (other.indexOf(element) >= 0) other.splice(other.indexOf(element),1);
				element.splice(element.indexOf(num), 1);
			}
		});
		if (arr.find((ele) => {return ele.length == 0}) != undefined) {
			$('#turn').html(name + " Won!!!");
			if (name == "User") dataStorage("fw");
			else {dataStorage("sw");}
			setTimeout(function(){ location.reload(); },2000);
		}
		else if(arr.length == 0 && other.length == 0){
			$('#turn').html("Game Tied");
			location.reload();
		} 
	}

	$(".game_rows div").click(function(){
		if ($("p", this).text() == ""){
			var div_id = $(this).attr("id");
			if (turn == 1){
				$("p", this).html(user_symbol);
				extract(div_id, userTicked, compTicked, "User");
				turn = 2;
				$('#turn').html("Player2 Turn");
				if (game_type == "sp") compAi();
			}
			else if (turn == 2 && game_type == "tp"){
				$("p", this).html(comp_symbol);
				extract(div_id, compTicked, userTicked, "Computer");
				turn = 1;
				$('#turn').html("Player1 Turn");
			}
		}
		
	});

	function compAi() {
		let choice = compTicked.find((ele) => {return ele.length == 1});
		label_1: {
			if (choice != undefined) {
				choice = choice[0];
				break label_1;
			};
			choice = winCombinations.find((ele) => {return ele.length == 3});
			if (choice != undefined) choice = choice[0];
			for(var i = 0; i <= userTicked.length - 1; i++){
				if (userTicked[i].length == 1) { 
					choice = userTicked[i][0];
					break;
				}
				else if (compTicked.length != 0 && i == userTicked.length - 1){
					for (var k = 0; k < compTicked.length; k++) {
						if (compTicked[k].length == 1) { 
							choice = compTicked[k][0];
							break;
						}
						choice = compTicked[0][0];
					}
				}
			}
		}
		if (choice == undefined) choice = winCombinations.find((ele) => {return ele.length > 0});
		$('#turn').html("Player1 Turn");
		extract(choice, compTicked, userTicked, "Computer");
		$(`[id = ${choice}] p`).html(comp_symbol);
		turn = 1;
	}

	function dataStorage(key) {
		if(key == "fw"){
			if(sessionStorage.fw) sessionStorage.fw = Number(sessionStorage.fw) + 1;
			else {sessionStorage.fw = 1};
			
		}
		else {
			if(sessionStorage.sw) sessionStorage.sw = Number(sessionStorage.sw) + 1;
			else {sessionStorage.sw = 1};
			
		}
	}
})