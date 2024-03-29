RocketBoots.loadComponents([
	"StateMachine",
	"Loop",
	"Incrementer",
	"Tabs"
])
/* .loadCustomComponents([
	"Node"
])*/.ready(function(rb){


////===== Game, Loop, States

	window.g = new RocketBoots.Game({
		name: "Arcane Incrementalist",
		instantiateComponents: [
			//{"state": "StateMachine"},
			{"loop": "Loop"},
			{"incrementer": "Incrementer"},
			{"tabs": "Tabs"}
		]
	});

	g.$insaneElts = $('#game').add('#cultist');
	g.$monster = $('#monster');
	g.monsterCycle = 0;
	g.MAX_MONSTER_CYCLE = 5;

	g.loop.set(function(){
		g.incrementer.incrementByElapsedTime(undefined, true);
		//g.world.draw();
		g.incrementer.calculate();
	}, 200).addModulusAction(1, function(){
		g.lists.update();
		if (g.incrementer.currencies.sanity.val <= 0) {
			g.$insaneElts.addClass("insane");
		} else {
			g.$insaneElts.removeClass("insane");
		}
		g.monsterCycle++;
		if (g.monsterCycle > g.MAX_MONSTER_CYCLE) {
			g.monsterCycle = 0;
		}
		g.$monster.attr('data-cycle', g.monsterCycle);

	});

	g.state.addStates({
		"start": {

		},
		"game": {
			viewName: "game",
			start: function(){
				g.loop.start();
			},
			end: function(){
				g.loop.stop();
			}
		},
		"pause": {

		}
	});

////===== Currencies

	var BASE_FK_MAX = 100;

	g.incrementer.addCurrencies([
		{
			name: "forbiddenKnowledge",
			displayName: "Forbidden Knowledge",
			tip: "",
			calcRate: function(c){
				if (c.sanity.val === 0) {
					return g.getSummonedMonster().sanityRate;
				//} else if (c.forbiddenKnowledge.val >= c.forbiddenKnowledge.max) {
				//	return 0;
				} else if (g.hasSummonedMonster()) {
					return g.getSummonedMonster().forbiddenKnowledgeRate;
				} else {
					return 0;
				}
			},
			calcMax: function(c){
				var max = BASE_FK_MAX;
				_.forEach(g.grimoireNames, function(value, i){
					var book = g.getGrimoire(i);
					max += (book.forbiddenKnowledgeMax * book.count);
				});
				return max;
			}
		},{
			name: "sanity",
			displayName: "Sanity",
			val: 100,
			min: 0,
			tip: "",
			calcRate: function(c){
				if (g.hasSummonedMonster()) {
					var sanityRate = 0;
					if (c.forbiddenKnowledge.val >= c.forbiddenKnowledge.max 
						&& c.forbiddenKnowledge.rate > 0) {
						sanityRate = g.getSummonedMonster().sanityRate;
						//sanityRate -= Math.round(c.forbiddenKnowledge.rate / 2);
					}
					return sanityRate;
				} else {
					return c.sanityRecovery.val;
				}
			},
			calcMax: function(c){
				var max = 90;
				max += (10 * _.reduce(g.data.monsters, function(sum, n){ return sum + n; }));
				_.forEach(g.extraNames, function(value, i){
					var extra = g.getExtra(i);
					max += (extra.sanityMax * extra.count);
				});
				return max;
			}
		},{
			name: "sanityRecovery",
			displayName: "Sanity Recovery Rate",
			tip: "",
			calcVal: function(c){
				return 3;
			}
		}
	]);

////===== Game Data

	g.data = {
		summonedMonsterIndex: -1,
		monsters: [],
		grimoires: [],
		extras: []
	};

	g.setupListData = function() {
		g.data.monsters = [];
		g.data.grimoires = [];
		g.data.extras = [];
		_.forEach(g.monsterNames, function(){
			g.data.monsters.push(0);
		});
		g.data.monsters[0] = 1;
		_.forEach(g.grimoireNames, function(){
			g.data.grimoires.push(0);
		});
		_.forEach(g.extraNames, function(){
			g.data.extras.push(0);
		});
	};

////===== Monsters, Books, Extras

	g.getList = function (listName) {
		switch (listName) {
			case "monsters": return g.getMonsters(); break;
			case "grimoires": return g.getGrimoires(); break;
			case "extras": return g.getExtras(); break;
		}
	};
	g.getThing = function (listName, index) {
		switch (listName) {
			case "monsters": return g.getMonster(index); break;
			case "grimoires": return g.getGrimoire(index); break;
			case "extras": return g.getExtra(index); break;
		}		
	};

	// MONSTERS

	g.monsterNames = [
		"Infernal Chaos Toad",
		"Chimaeric Spirit",
		"Phantom Lord",
		"Moloch",
		"The Gray Guardian",
		"Trum'pleth'inskin",
		"Ba'al Zebub",
		"Cthulhu"
	];

	g.getMonster = function (index) {
		var fkRate = ( Math.pow((index), 2) * 10 ) + ((index === 0) ? 2 : 0);
		var count = g.data.monsters[index];
		var cost = Math.round( Math.pow(fkRate, 1.25) / 10 ) * 100;
		var canAfford = (g.incrementer.currencies.forbiddenKnowledge.val >= cost);
		var risk = index * 10;
		var monster = {
			index: 					index,
			displayName: 			g.monsterNames[index],
			forbiddenKnowledgeRate: fkRate,
			sanityRate: 			(-1 * (index + 1)),
			risk: 					risk,
			cost: 					cost,
			isConjured: 			((index === g.data.summonedMonsterIndex) ? true : false),
			count: 					count,
			isLocked: 				(!canAfford && g.data.monsters[index] == 0),
			canAfford: 				canAfford
		};
		if (monster.count > 0) {
			monster.cost = null;
		}
		return monster;
	};

	g.getMonsters = function(){
		var m = [];
		_.forEach(g.monsterNames, function(value, i){
			m.push(g.getMonster(i));
		});
		return m;
	};

	g.hasSummonedMonster = function(){
		if (g.data.summonedMonsterIndex < 0) {
			return false;
		} else {
			return true;
		}
	};

	g.getSummonedMonster = function(){
		return g.getMonster(g.data.summonedMonsterIndex);
	};


	// GRIMOIRES

	g.grimoireNames = [
		"Cunning Evocation for Dummies", // fake
		"Beginner's Black Book", // fake
		"Grimoire for the Apprentice Wizard",
		"The Secret Grimoire of Turiel",
		"The Grand Oracle of Heaven", 
		"The Philisophical Merlin", 
		"The Astrologer of the Nineteenth Century",
		"Book of Shadows",
		"Grimorum Arcanorum",
		"Incantus",
		"The Tome of Doom",
		"Collected Works of Ostanes",
		"Liber Razielis Archangeli",
		"Sworn Book of Honorius",
		"Picatrix",
		"Clavicula Salomonis",
		"Three Books of Occult Philosphy",
		"Celestial Intelligencer",
		"Little Key of the Whole Art of Hygromancy",
		"Book of Simon the Magician",
		"Sixth and Seventh Books of Moses",
		"Black Pullet",
		"A New and Complete Illustration of the Celestial Science of Astrology",
		"Grimoirium Verum",
		"Corpus hermeticum",
		"Of the Supreme Mysteries of Nature",
		"The Fourth Book of Occult Philosophy",
		"Magia naturalis",
		"The Magus",
		"Grand Grimoire",
		"Necronomicon",
		"Arcanus Incrementum" // fake
	];

	g.getGrimoire = function (index) {
		var fkMax = Math.round( Math.pow((index + 1), 2) ) * 10;
		var count = g.data.grimoires[index];
		var cost = Math.round((
			(Math.pow((index + 1), 2.1) * 10)
			+ (index * 1.5) 
			+ Math.pow(count, 2)
		)/10) * 20;
		var canAfford = (g.incrementer.currencies.forbiddenKnowledge.val >= cost);
		var book = {
			index: 					index,
			displayName: 			g.grimoireNames[index],
			learningThreshold: 		(fkMax / 2),
			forbiddenKnowledgeMax: 	fkMax,
			cost: 					cost,
			count: 					count,
			isLocked: 				(count == 0),
			canAfford: 				(canAfford)
		};
		return book;
	};

	g.getGrimoires = function(){
		var books = [];
		_.forEach(g.grimoireNames, function(value, i){
			books.push(g.getGrimoire(i));
		});
		return books;
	};

	// EXTRAS

	g.extraNames = [
		"Candles",
		"Mandrake", 
		"Calming Incense",
		"Ritual Dagger",
		"Wand",
		"Staff",
		"Hand of Glory",
		"Crystal Ball"
	];

	g.getExtra = function (index) {
		var power = Math.round( (index + 1) * 20 );
		var count = g.data.extras[index];
		var cost = Math.round(( 
			(100 * (index + 1))
			+ Math.pow((count + 1), 3)
		)/10) * 10;
		var canAfford = (g.incrementer.currencies.forbiddenKnowledge.val >= cost);
		var extra = {
			index: 					index,
			displayName: 			g.extraNames[index],
			cost: 					cost,
			count: 					g.data.extras[index],
			isLocked: 				(count == 0),
			canAfford: 				canAfford,
			sanityMax: 				power
		};
		return extra;
	};

	g.getExtras = function(){
		var x = [];
		_.forEach(g.extraNames, function(value, i){
			x.push(g.getExtra(i));
		});
		return x;		
	};

////===== ACTIONS

	g.buy = function (listName, index) {
		console.log(listName, index);
		var fk = g.incrementer.currencies.forbiddenKnowledge;
		var cost = g.getThing(listName, index).cost;
		if (fk.val >= cost) {
			fk.subtract(cost);
			g.data[listName][index] += 1;
		} else {
			g.alert("Cannot afford this. You need more forbidden knowledge.");
		}
		g.lists.update();
	};

	g.summon = function (index) {
		var $monster = $('#monster');
		if (g.data.monsters[index] >= 1) {
			g.data.summonedMonsterIndex = index;

			$monster.fadeOut(function(){
				$monster.css('background-image', 'url("images/monster_' + index + '.png")');
				$monster.fadeIn(1000);
			});
		} else {
			g.alert("Cannot summon until purchased.");
		}
		g.lists.update();
	};

	g.banish = function(){
		g.data.summonedMonsterIndex = -1;
		$('#monster').fadeOut();
		g.lists.update();
	};

	g.bargain = function(){

		// TODO

		g.lists.update();
	};

////===== User Interface - feedback

	g.alert = function(msg) {
		window.alert(msg);
	};

////===== User Interface - lists

	g.lists = {
		names: ["monsters", "grimoires", "extras"]
	};

	g.lists.setup = function(){
		g.lists.write().setupEvents();
	};

	g.lists.setupEvents = function(){
		_.forEach(this.names, function(listName){
			var $list = $('.' + listName + ' ol');
			$list.on("click", "button.buy", function(e){
				var $thisButton = $(this);
				var $listItem = $thisButton.closest('li');
				g.buy(listName, $listItem.data('index'));
				e.stopPropagation();
			}).on("click", "li", function(e){
				var $li = $(this);
				$list.find('li').not($li).removeClass("expanded");
				$li.toggleClass("expanded");
			}).on("click", "button.summon", function(e){
				var $thisButton = $(this);
				var $listItem = $thisButton.closest('li');
				g.summon($listItem.data('index'));
				e.stopPropagation();
			}).on("click", "button.banish", function(e){
				var $thisButton = $(this);
				var $listItem = $thisButton.closest('li');
				g.banish($listItem.data('index'));
				e.stopPropagation();
			});
			$('#monster').click(function(){
				g.bargain();
			});

			$('#circle').click(function(){
				g.tabs.open().select('monsters');
			});
			$('#cultist').click(function(){
				g.tabs.open().select('grimoires');
			});
		});
		return this;
	};

	g.lists.write = function(){
		_.forEach(this.names, function(listName){
			var html = '';
			var template = $('#' + listName + 'Template').html();
			var list = g.getList(listName);
			_.forEach(list, function(item){
				item.lockedClass = ((item.isLocked) ? "locked" : "unlocked");
				item.affordClass = ((item.canAfford) ? "afford" : "cannotAfford");
				html += Mustache.render(template, item);
			});
			$('.' + listName + ' ol').html(html);
		});
		return this;
	};

	g.lists.update = function(){
		this.write();
	};


////===== Start it up

	//g.state.transition("start");
	g.state.transition("game");
	g.setupListData();
	g.lists.setup();
	g.tabs.setup({containerSelector: '.controls'}); // .close();

	// INTRO

	//g.tabs.select("monsters");
	$('.wall').show();
	$('#cultist').fadeIn();
	$('#circle').fadeIn(1000);
	$('#room .stats').fadeIn(2000);
});
