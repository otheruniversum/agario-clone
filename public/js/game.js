
let public_URL = "http://localhost:8000/";
let HS_URL = public_URL + "highscores";
let NEW_URL = public_URL + "newscore";


let gameConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: "thegame"
	},
	dom: {
		createContainer: true
	},
	pixelArt: true,
	physics: {
		default: "arcade"
	}
}
var circle;
var graphics;
var text;
var background;
var foods = [];
var foods_circles = [];
var cam;
var player = {
	id: 1,
	x: -1,
	y: -1,
	radius: 50,
	color: "",
	username: ""
};
var players = [];
var players_circles = [];
var food_graphics;
var leaderboard_graphics;
var other_players_graphics;
var leaderboard_text_1;
var leaderboard_text_2;
var leaderboard_text_3;
var leaderboard_text_4;
var leaderboard_text_5;
var leaderboard_text_0;
var w;
var h;
var startX;
var startY;
var TOTAL_FOODS = 300;
var NPC_RESET_RADIUS = 200;
let generate_starting_foods = function() {
	for (let i = 0; i < TOTAL_FOODS; i++) {
		let food = {
			color: Math.floor(Math.random() * 16777215).toString(16),
			x: Math.random() * 3985,
			y: Math.random() * 3985,
			radius: 15
		}
		foods.push(food)
	}
}
let replace_NPC = function(npc) {
	//remove circle object and NPC object from array
	delete_other_circle(npc);
	players.splice(players.indexOf(npc), 1);
	let npc_id = npc["id"];
	let npc_username = npc["username"];
	let NPC = {
		id: npc_id,
		username: npc_username,
		radius: Math.random() * 5 + 50,
		color: Math.floor(Math.random() * 16777215).toString(16),
		x: Math.random() * 3800,
		y: Math.random() * 3800,
		x_change: 0,
		y_change: 0
	};
	NPC["updateDirection"] = function() {
		let f = function() {
			let {
				x,
				y
			} = calculateNewDirection(NPC["x_change"], NPC["y_change"]);
			NPC["x_change"] = x;
			NPC["y_change"] = y;
		}
		setInterval(f, 1000);
	}
	NPC[text] = npc[text];
	NPC[text].x = (NPC.x) - NPC.username.length * 6;
	NPC[text].y = (NPC.y) - 15, NPC.username;
	players.push(NPC);
	NPC["updateDirection"](NPC);
	create_other_circles(NPC);
}
let initialize_food_graphics = function() {
	food_graphics.clear();
	for (let i = 0; i < foods.length; i++) {
		let f = foods[i];
		contains = false;
		foods_circles.forEach(function(e) {
			if (e.x == f.x) contains = e;
		});
		if (contains != false) {
			food_graphics.fillStyle(parseInt(f.color, 16), 1.0);
			food_graphics.fillCircleShape(contains);
		} else {
			let c = new Phaser.Geom.Circle(f.x, f.y, f.radius);
			foods_circles.push(c);
			food_graphics.fillStyle(parseInt(f.color, 16), 1.0);
			food_graphics.fillCircleShape(c);
		}
	}
}
let refresh_all_graphics = function() {
	text.destroy();
	players_circles.splice(players_circles.indexOf(circle), 1);
	let diffX = player.x - startX;
	let diffY = player.y - startY;
	diffX = 0;
	diffY = 0;
	text = game_scene.add.text((player.x) - player.username.length * 6, (player.y) - 15, player.username, {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	circle = new Phaser.Geom.Circle(player.x - diffX, player.y - diffY, player.radius);
	graphics.destroy();
	graphics = game_scene.add.graphics();
	graphics.lineStyle(5, parseInt(player.color, 16), 1);
	c = graphics.strokeCircleShape(circle);
	players_circles.push(circle);
	cam.startFollow(c);
	cam.setFollowOffset(-player.x, -player.y);
	initialize_food_graphics();
}
let initialize_leaderboard_text = function() {
	players.sort((a, b) => (a.radius < b.radius) ? 1 : -1);
	leaderboard_text_0 = game_scene.add.text(820, 20, "Leaderboard", {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_1 = game_scene.add.text(820, 50, players[0].username + " - " + Math.round(players[0].radius * 100), {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_2 = game_scene.add.text(820, 80, players[1].username + " - " + Math.round(players[1].radius * 100), {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_3 = game_scene.add.text(820, 110, players[2].username + " - " + Math.round(players[2].radius * 100), {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_4 = game_scene.add.text(820, 140, players[3].username + " - " + Math.round(players[3].radius * 100), {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_5 = game_scene.add.text(820, 170, players[4].username + " - " + Math.round(players[4].radius * 100), {
		fontFamily: 'Arial',
		fontSize: 25,
		color: player.color
	});
	leaderboard_text_0.setScrollFactor(0);
	leaderboard_text_1.setScrollFactor(0);
	leaderboard_text_2.setScrollFactor(0);
	leaderboard_text_3.setScrollFactor(0);
	leaderboard_text_4.setScrollFactor(0);
	leaderboard_text_5.setScrollFactor(0);
}
let player_eats_food = function(player_, food) {
	if (player_ == undefined || food == undefined) return;
	foods_circles.splice(foods_circles.indexOf(food), 1);
	foods.forEach(function(f) {
		if (Math.round(f.x) == Math.round(food.x)) {
			foods.splice(foods.indexOf(f), 1);
			let food = {
				color: Math.floor(Math.random() * 16777215).toString(16),
				x: Math.random() * 3985,
				y: Math.random() * 3985,
				radius: 15
			};
			foods.push(food);
		}
	});
	if (player == player_) player_.radius += (Math.random() * 5 + 40) / player_.radius;
	if (player_ != player) {
		delete_other_circle(player_);
		player_.radius += (Math.random() * 5 + 40) / player_.radius;
		create_other_circles(player_);
	}
	refresh_all_graphics();
}
let add_other_players_texts = function() {
	for (let i = 0; i < players.length; i++) {
		if (players[i] == player) continue;
		let NPC = players[i];
		let t = game_scene.add.text((NPC.x) - NPC.username.length * 6, (NPC.y) - 15, NPC.username, {
			fontFamily: 'Arial',
			fontSize: 25,
			color: NPC.color
		});
		NPC[text] = t;
	}
}
let check_for_NPC_reset = function() {
	for (let i = 0; i < players.length; i++) {
		if (players[i].radius > NPC_RESET_RADIUS && players[i].id < 0) {
			replace_NPC(players[i]);
		}
	}
}
let check_for_collisions = function() {
	players_circles.forEach(function(pc) {
		players_circles.forEach(function(pc_) {
			if (pc_ == pc) return;
			if (Phaser.Geom.Intersects.CircleToCircle(pc_, pc)) {
				let collision_winner;
				let collision_loser;
				let collision_winner_object;
				let collision_loser_object;
				if (pc.radius > pc_.radius) {
					collision_loser = pc_;
					collision_winner = pc;
				} else {
					collision_loser = pc;
					collision_winner = pc_;
				}
				//convert collision winner and losers to corresponding data points (from circles)
				for (let i = 0; i < players.length; i++) {
					if (Math.round(players[i].radius) == Math.round(collision_winner.radius) && Math.round(players[i].x) == Math.round(collision_winner.x) && Math.round(players[i].y) == Math.round(collision_winner.y)) {
						collision_winner_object = players[i];
					} else if (Math.round(players[i].radius) == Math.round(collision_loser.radius) && Math.round(players[i].x) == Math.round(collision_loser.x) && Math.round(players[i].y) == Math.round(collision_loser.y)) {
						collision_loser_object = players[i];
					}
				}
				if (collision_loser_object == player) 
				{
					$.post(NEW_URL,
                        {
                          username: player.username,
                          score: (player.radius*100)
                        });
					game_scene.scene.start("Menu");
				}
				if (collision_winner_object == undefined || collision_loser_object == undefined) return;
				//create new circle of winner
				if (collision_winner_object != player) {
					delete_other_circle(collision_winner_object);
					collision_winner_object.radius += ((collision_loser_object.radius)) / 5;
					create_other_circles(collision_winner_object);
				}
				else
					collision_winner_object.radius += ((collision_loser_object.radius)) / 5;
				//if loser is NPC, replace
				if (collision_loser_object.id < 0) {
					replace_NPC(collision_loser_object);
				} //else, manually do shorthand what is done in replace_NPC
				else {
					delete_other_circle(collision_loser_object);
					players.splice(players.indexOf(collision_loser_object), 1);
				}
				refresh_all_graphics();
			}
		});
	});
}
let create_NPCs = function() {
	for (let i = 1; i < 7; i++) {
		let NPC = {
			id: -i,
			username: "NPC " + i,
			radius: Math.random() * 5 + 50,
			color: Math.floor(Math.random() * 16777215).toString(16),
			x: Math.random() * 3800,
			y: Math.random() * 3800,
			x_change: 0,
			y_change: 0
		};
		NPC["updateDirection"] = function() {
			let f = function() {
				let {
					x,
					y
				} = calculateNewDirection(NPC["x_change"], NPC["y_change"]);
				NPC["x_change"] = x;
				NPC["y_change"] = y;
			};
			setInterval(f, 1000);
		}
		players.push(NPC);
		NPC["updateDirection"]();
		create_other_circles(NPC);
	}
	add_other_players_texts();
}
let create_other_circles = function(other_player) {
	let n = new Phaser.Geom.Circle(other_player.x, other_player.y, other_player.radius);
	players_circles.push(n);
}
let delete_other_circle = function(other_player) {
	if (other_player == undefined) {
		return;
	}
	for (let i = 0; i < players_circles.length; i++) {
		if (Math.round(players_circles[i].radius) == Math.round(other_player.radius) && Math.round(players_circles[i].x) == Math.round(other_player.x) && Math.round(players_circles[i].y) == Math.round(other_player.y)) {
			players_circles.splice(i, 1);
		}
	}
}
let valid_spawn_point = function(circle) {
	let valid = true;
	for (let i = 0; i < foods_circles.length; i++) {
		if (Phaser.Geom.Intersects.CircleToCircle(foods_circles[i], circle)) valid = false;
	}
	for (let i = 0; i < players_circles.length; i++) {
		if (Phaser.Geom.Intersects.CircleToCircle(players_circles[i], circle)) valid = false;
	}
	return valid;
}
let draw_other_players = function() {
	other_players_graphics.clear();
	players_circles.forEach(function(e) {
		if (e == circle) return;
		other_players_graphics.lineStyle(5, parseInt(e.color, 16), 1);
		other_players_graphics.strokeCircleShape(e);
	})
}
let calculateNewDirection = function(x, y) {
	let width = w;
	let height = h;
	let x_change;
	let y_change;
	if (x == 0 && y == 0) {
		let randomX_input = Math.random() * 1000;
		let randomY_input = Math.random() * 1000;
		let distance_from_center = (Math.sqrt((randomX_input - width / 2) * (randomX_input - width / 2) + (randomY_input - height / 2) * (randomY_input - height / 2))) / 2;
		x_change = 3 * (randomX_input - width / 2) / distance_from_center;
		y_change = 3 * (randomY_input - height / 2) / distance_from_center;
	} else {
		let x_diff = (Math.random() * 2);
		let decide = Math.random() * 2;
		if (decide < 1) x_change = x + x_diff < 6 ? x + x_diff : x - x_diff;
		else x_change = x - x_diff > -6 ? x - x_diff : x + x_diff;
		y_change = y > 0 ? Math.sqrt(36 - (x_change * x_change)) : -Math.sqrt(36 - (x_change * x_change));
		decide = Math.random() * 2;
		let y_diff = (Math.random() * 2);
		if (decide < 1) y_change = y_change + y_diff < 6 ? y_change + y_diff : y_change - y_diff;
		else y_change = y_change - y_diff > -6 ? y_change - y_diff : y_change + y_diff;
		x_change = y > 0 ? Math.sqrt(36 - (y_change * y_change)) : -Math.sqrt(36 - (y_change * y_change));
		let decide_2 = Math.random() * 12;
		if (decide_2 > 0 && decide_2 < 1) x_change = -x_change;
		else if (decide_2 > 1 && decide_2 < 2) y_change = -y_change;
		else if (decide_2 > 2 && decide_2 < 4) {
			x_change = -x_change;
			y_change = -y_change;
		}
	}
	return {
		x: x_change,
		y: y_change
	};
}
let move_NPCs = function() {
	let width = w;
	let height = h;
	let circle_radii = []
	let player_radii = []
	for (let i = 0; i < players_circles.length; i++) circle_radii.push(players_circles[i].radius)
	for (let i = 0; i < players.length; i++) player_radii.push(players[i].radius)
	for (let i = 0; i < players.length; i++) {
		//NPC ids < 0
		if (players[i].id < 0) {
			let player_circle;
			for (let z = 0; z < players_circles.length; z++) {
				if (Math.round(players_circles[z].x) == Math.round(players[i].x) && Math.round(players_circles[z].y) == Math.round(players[i].y) && Math.round(players_circles[z].radius) == Math.round(players[i].radius)) {
					player_circle = players_circles[z];
				}
			}
			if (player_circle == undefined) {
				continue;
			}
			let x_change = players[i].x_change;
			let y_change = players[i].y_change;
			let moveY = true;
			let moveX = true;
			if ((player_circle.y - player_circle.radius < 0 && y_change < 0) || (player_circle.y + player_circle.radius > 4000 && y_change > 0)) moveY = false;
			if ((player_circle.x - player_circle.radius < 0 && x_change < 0) || (player_circle.x + player_circle.radius > 4000 && x_change > 0)) moveX = false;
			if (moveY) {
				players[i].y += y_change;
				player_circle.y += y_change;
				players[i][text].y += y_change;
			}
			if (moveX) {
				//move data point
				players[i].x += x_change;
				//move corresponding circle
				player_circle.x += x_change;
				//move corresponding text
				players[i][text].x += x_change;
			}
		}
	}
}
let draw_leaderboard_background = function() {
	leaderboard_graphics = game_scene.add.graphics();
	var rect = new Phaser.Geom.Rectangle(810, 10, 200, 200);
	leaderboard_graphics.fillStyle(parseInt("C0C0C0", 16), 1);
	leaderboard_graphics.fillRectShape(rect);
	leaderboard_graphics.setScrollFactor(0);
}
let update_leaderboard_text = function() {
	players.sort((a, b) => (a.radius < b.radius) ? 1 : -1);
	leaderboard_text_1.setText(players[0].username + " - " + Math.round(players[0].radius * 100));
	leaderboard_text_2.setText(players[1].username + " - " + Math.round(players[1].radius * 100));
	leaderboard_text_3.setText(players[2].username + " - " + Math.round(players[2].radius * 100));
	leaderboard_text_4.setText(players[3].username + " - " + Math.round(players[3].radius * 100));
	leaderboard_text_5.setText(players[4].username + " - " + Math.round(players[4].radius * 100));
}
class Menu extends Phaser.Scene {
	constructor() {
		super("Menu");
	}
	preload() {
		this.load.image('background_grid', 'assets/background_grid.png');
		this.load.html('nameform', 'assets/nameform.html');
		this.load.html('highscoreform', 'assets/highscore_form.html');
	}
	create() {
		//reinitialize values
		foods = [];
		foods_circles = [];
		player = {
			id: 1,
			x: -1,
			y: -1,
			radius: 50,
			color: "",
			username: ""
		};
		players = [];
		players_circles = [];
		TOTAL_FOODS = 500;
		NPC_RESET_RADIUS = 200;
		let {
			width,
			height
		} = this.sys.game.canvas;
		this.add.dom(width / 3, height / 2).createFromCache('highscoreform');
		$.ajax({url: HS_URL, success: function(result){
			var paragraph = document.getElementById("highscores");
        	let HS = JSON.parse(result);
			HS.sort((a,b)=>b.score-a.score);
			for(let i = 0; i< (HS.length > 3  ? 4 : HS.length); i++)
			{
				paragraph.innerHTML += (i+1).toString()  + ". "+HS[i].username + " - " + (parseInt(HS[i].score)) + "<br>";
			}
		}});

		background = this.add.image(0, 0, 'background_grid').setOrigin(0, 0);;
		this.add.dom((width / 3) * 2, height / 2).createFromCache('nameform');
		let btn = document.getElementById("play");
		let scene = this;
		btn.addEventListener('click', function() {
			var inputText = document.getElementById("nameField");
			player.username = inputText.value;
			if (player.username == "" || player.username.length > 10 || player.username.toLowerCase().includes("npc")) return;
			scene.scene.start('Playgame');
		}, false);
	}
	update() {}
}
class Playgame extends Phaser.Scene {
	constructor() {
		super("Playgame");
	}
	preload() {
		this.load.image('background_grid', 'assets/background_grid.png');
	}
	create() {
		
		game_scene = this;
		startX = Math.random() * 3900;
		startY = Math.random() * 3900;
		player.y = startY;
		player.x = startX;
		background = this.add.image(0, 0, 'background_grid').setOrigin(0, 0);;
		player.color = Math.floor(Math.random() * 16777215).toString(16);
		text = this.add.text((player.x) - player.username.length * 6, (player.y) - 15, player.username, {
			fontFamily: 'Arial',
			fontSize: 25,
			color: player.color
		});
		graphics = this.add.graphics();
		food_graphics = this.add.graphics();
		other_players_graphics = this.add.graphics();
		players.push(player);
		circle = new Phaser.Geom.Circle(player.x, player.y, player.radius);
		graphics.lineStyle(5, parseInt(player.color, 16), 1);
		graphics.strokeCircleShape(circle);
		players_circles.push(circle);
		cam = this.cameras.main;
		generate_starting_foods();
		initialize_food_graphics();
		create_NPCs();
		draw_leaderboard_background();
		initialize_leaderboard_text();
		cam.startFollow(graphics);
		cam.setFollowOffset(-startX, -startY);
	}
	update() {
		let {
			width,
			height
		} = this.sys.game.canvas;
		w = width;
		h = height;
		let distance_from_center = (Math.sqrt((this.input.x - width / 2) * (this.input.x - width / 2) + (this.input.y - height / 2) * (this.input.y - height / 2))) / 2;
		let x_change = 3 * (this.input.x - width / 2) / distance_from_center;
		let y_change = 3 * (this.input.y - height / 2) / distance_from_center;
		let moveY = true;
		let moveX = true;
		if ((circle.y - player.radius < 0 && y_change < 0) || (circle.y + player.radius > 4000 && y_change > 0)) moveY = false;
		if ((circle.x - player.radius < 0 && x_change < 0) || (circle.x + player.radius > 4000 && x_change > 0)) moveX = false;
		let c = graphics;
		if (moveY) {
			player.y += y_change;
			c.y += y_change;
			text.y += y_change;
			circle.y += y_change;
		}
		if (moveX) {
			circle.x += x_change;
			c.x += x_change;
			player.x += x_change;
			text.x += x_change;
		}
		check_collision_player_food();
		check_for_collisions();
		check_collision_other_players_food();
		draw_other_players();
		update_leaderboard_text();
		move_NPCs();
		check_for_NPC_reset();
	}
}
let check_collision_player_food = function() {
	foods_circles.forEach(function(f) {
		let intersects = Phaser.Geom.Intersects.CircleToCircle(f, circle);
		if (intersects) {
			player_eats_food(player, f);
		}
	});
};
let check_collision_other_players_food = function() {
	foods_circles.forEach(function(f) {
		players_circles.forEach(function(player_circle) {
			let intersects = Phaser.Geom.Intersects.CircleToCircle(f, player_circle);
			if (intersects) {
				let p;
				players.forEach(function(z) {
					if (Math.round(z.radius) == Math.round(player_circle.radius) && Math.round(z.x) == Math.round(player_circle.x) && Math.round(z.y) == Math.round(player_circle.y)) {
						p = z;
					}
				})
				player_eats_food(p, f);
			}
		});
	});
};
let check_collision_player_and_other_players = function() {
	foods_circles.forEach(function(f) {
		let intersects = Phaser.Geom.Intersects.CircleToCircle(f, circle);
		if (intersects) {
			player_ets_food(player, f);
		}
	});
};
let game = new Phaser.Game(gameConfig);
let menu_scene = game.scene.add("Menu", Menu, true);
let game_scene = game.scene.add("Playgame", Playgame, false);