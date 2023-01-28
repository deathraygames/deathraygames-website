
/*
* Gamma World Character Generator
*
* Coded by Luke Nickerson @ http://deathraygames.com/
* Inspired by Joe Fulgham @ http://www.holycow.com/joe/ http://html5.holycow.com/gammaworld/
*
* Creative Commons (Attribution Non-Commercial Sharealike) 2010
*
*/
// ================= Helper Functions =============== \\


function IsElementInArray (myElt, myArray) {
	for (i=0; i < myArray.length; i++) {
		if (myElt == myArray[i]) return true;
	}
	return false;
}

function IsValueInArrayObject (myElt, myArrayObj, myNameOfField) {
	for (i=0; i < myArrayObj.length; i++) {
		if (eval("myElt == myArrayObj[i]."+myNameOfField)) return true;
	}
	return false;
}

function IsValueNameInArrayObject (myElt, myArrayObj) {
	for (i=0; i < myArrayObj.length; i++) {
		if (myElt == myArrayObj[i].name) return true;
	}
	return false;
}

function statBonus (statValue) {
	  // Determines bonus from a given stat, including negatives.
	  statValue = parseInt((statValue-10)/2);
	  return(statValue);
}

function higherStatBonus (statVal1, statVal2) {
	if (statVal1 > statVal2) return statBonus(statVal1);
	else return statBonus(statVal2);
}

function getUrlVars() {
	var map = {};
	var parts = window.location.search.replace(/[?&]+([^=&]+)(=[^&]*)?/gi, function(m,key,value) { map[key] = (value === undefined) ? true : value.substring(1); }); 
	return map; 
}

function getBaseUrl() {
	return document.location.href.split("?")[0].split("#")[0];
}

function dice_roll (dieSides, diceNumber) {
	  // Rolls (diceNumber)d(dieSide) and adds them together
	  // http://www.shawnolson.net/a/789/make-javascript-mathrandom-useful.html
	  var outcome = 0;
	  for (d=0; d < diceNumber; d++) {
	      outcome += Math.floor(Math.random()*dieSides + 1);
	  }
	  return(outcome);
}

// ========= Global Variables ================ \\

var gGearNameArray = [
	"Custom Item",				// array number 0
	"Ancient Junk",				// array number 1
	"Climber's Kit",
	"Canoe",
	"Keelboat",
	"Lantern (8 hours of lamp oil)", 
	"Draft horse (no wagon)", 
	"Riding horse", 
	"Tent", 
	"Wagon", 
	"Binoculars", 
	"Laptop computer", 
	"Duct tape", 
	"Heavy flashlight", 
	"Fuel, 5 gallons", 
	"Generator (8 hours of fuel)", 
	"Night-vision goggles", 
	"Radio cell phone", 
	"Pickup truck", 
	"Water purifier (water not included)", 
	"+2 Rolled Items", 				// array number 20
	"Explorer\'s Kit (Backpack, Bedroll, Canteen, Flint and steel, 10 days Rations (trail), 100 ft Rope.)", 
	"One armor (your choice)", 			// array number 22
	"One melee weapon (your choice)", 
	"One ranged weapon (your choice)",
	
	// Ancient Junk -- array numbers 25-124
	
	"15-inch computer monitor","20-lb. dumbell","Punching bag","Bike helmet","Day-glow vest","Exercise treadmill","Exercise treadmill","Cell phone","Ashtray","Electric blender","Hearing aid","Coloring book","Camera flash cube","Portable table saw","Toy gun","Vacuum cleaner","Remote control","Tin of sardines","Inflatable kiddie pool","Nose-hair clipper","Electric razor","Green plastic soldiers","Board game","Bag of hard candy","Kaleidoscope","Slide projector","Toy dump truck","Corporate logo T-shirt","Jug of maple syrup","Earphones","Mini fridge","Pack of antacide tablets","Taxi mileage meter","Umbrella","Wecam","Wireless keyboard","Bottle of nail polish","Swim goggles","Deck of cards","LED light bullb","Laptop computer","Electric toothbrush","Garage-door opener","Bottle of hand lotion","Butane lighter","Bike lock","Golf club (9 iron or your choice)","Foosball table","Interface cable","Digital thermometer","Pgoo stick","Stapler","Tennis racket","Plastic water bottle","Camera lens","Cordless drill","Cell-phone earpiece","String of holiday lights","Water-bubble level","Croquet set","Sci-fi serial on DVD","Radar detector","Wristwatch","Wireless router","Saxophone","Violin","Glue (white)","DVD player","Box of cake mix","Eyeglasses","Gas grill","Printer/scanner","Skateboard","Socket wrench set","Individually wrapped creme-filled yellow sponge cake","Cellophane tape","Electric blanket","Electric fan","Inflatable life vest","Nail clippers","Baby car seat","Tweezers and nail file","Windshield scraper","Cordless mouse","Digital camera","Clock radio","Subwoofer","Tire-pressure gauge","Exercise bike","Construction hazard light","Digital photo frame","Pack of crayons","Smoke detector","8 GB RAM DISK","air compressor","Camcorder","Car stereo","Ceiling fan","Ammo","Stocking cap","Weed whacker"
	];
var gExplorerKitNumber = 21;
var gAncientJunkNumber = 25;

var gMaxSaveSlots = 6;

var gCharSheetOpen = false;

// =========================== ORIGIN & SKILL DATA in JSON Format ================== \\

var gRules = eval({

	"ability" : [
		{	"name" :	"STR",		"fullname" :	"Strength" },
		{	"name" :	"CON",		"fullname" :	"Constitution" },
		{	"name" :	"DEX",		"fullname" :	"Dexterity" },
		{	"name" :	"INT",		"fullname" :	"Intelligence" },
		{	"name" :	"WIS",		"fullname" :	"Wisdom" },
		{	"name" :	"CHA",		"fullname" :	"Charisma" }
	],
	
	"skill" : [
		{	"name" :	"acrobatics",		"ability" :	"DEX"	},
		{	"name" :	"athletics",		"ability" :	"STR"	},
		{	"name" :	"conspiracy",		"ability" :	"INT"	},
		{	"name" :	"insight",		"ability" :	"WIS"	},
		{	"name" :	"interaction",	"ability" :	"CHA"	},
		{	"name" :	"mechanics",		"ability" :	"INT"	},
		{	"name" :	"nature",		"ability" :	"WIS"	},
		{	"name" :	"perception",		"ability" :	"WIS"	},
		{	"name" :	"science",		"ability" :	"INT"	},
		{	"name" :	"stealth",		"ability" :	"DEX"	}
	],
	
	"defense" : [
		{	"name" : 	"ac",		"abilitybonus" : ["DEX"]		},
		{	"name" :	"fortitude",	"abilitybonus" : ["STR", "CON"]	},
		{	"name" :	"reflex",	"abilitybonus" : ["DEX", "INT"]	},
		{	"name" :	"will",	"abilitybonus" : ["WIS", "CHA"]	}
	],
	
	"origin" : [
		{
			"name" : 		"None",
			"favoredAbility" :	"",
			"overCharge" :	"None",
			"favoredSkills" :	[],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Android",
			"favoredAbility" :	"INT",
			"overCharge" :	"Dark",
			"favoredSkills" :	["science"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	2, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Cockroach",
			"favoredAbility" :	"CON",
			"overCharge" :	"Bio",
			"favoredSkills" :	["mechanics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Doppelganger",
			"favoredAbility" :	"INT",
			"overCharge" :	"Dark",
			"favoredSkills" :	["conspiracy"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Electrokinetic",
			"favoredAbility" :	"WIS",
			"overCharge" :	"Dark",
			"favoredSkills" :	["mechanics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Empath",
			"favoredAbility" :	"CHA",
			"overCharge" :	"Psi",
			"favoredSkills" :	["insight"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Felinoid",
			"favoredAbility" :	"DEX",
			"overCharge" :	"Bio",
			"favoredSkills" :	["stealth"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Giant",
			"favoredAbility" :	"STR",
			"overCharge" :	"Bio",
			"favoredSkills" :	["athletics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	2, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Gravity Controller",
			"favoredAbility" :	"CON",
			"overCharge" :	"Dark",
			"favoredSkills" :	["athletics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Hawkoid",
			"favoredAbility" :	"WIS",
			"overCharge" :	"Bio",
			"favoredSkills" :	["perception"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Hypercognitive",
			"favoredAbility" :	"WIS",
			"overCharge" :	"Psi",
			"favoredSkills" :	["insight"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Mind Breaker",
			"favoredAbility" :	"CHA",
			"overCharge" :	"Psi",
			"favoredSkills" :	["interaction"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		2
		},
		{
			"name" : 		"Mind Coercer",
			"favoredAbility" :	"CHA",
			"overCharge" :	"Psi",
			"favoredSkills" :	["interaction"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		2
		},
		{
			"name" : 		"Plant",
			"favoredAbility" :	"CON",
			"overCharge" :	"Bio",
			"favoredSkills" :	["nature"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	2, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Pyrokinetic",
			"favoredAbility" :	"WIS",
			"overCharge" :	"Psi",
			"favoredSkills" :	["interaction"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Radioactive",
			"favoredAbility" :	"CON",
			"overCharge" :	"Dark",
			"favoredSkills" :	["science"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	2, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Rat Swarm",
			"favoredAbility" :	"DEX",
			"overCharge" :	"Bio",
			"favoredSkills" :	["stealth"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Seismic",
			"favoredAbility" :	"STR",
			"overCharge" :	"Dark",
			"favoredSkills" :	["athletics"],
			"initiativeMod" :	0,	"speedMod" :		-1,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Speedster",
			"favoredAbility" :	"DEX",
			"overCharge" :	"Psi",
			"favoredSkills" :	["acrobatics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Telekinetic",
			"favoredAbility" :	"INT",
			"overCharge" :	"Psi",
			"favoredSkills" :	["mechanics"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		2,	"willMod" :		0
		},
		{
			"name" : 		"Yeti",
			"favoredAbility" :	"STR",
			"overCharge" :	"Bio",
			"favoredSkills" :	["nature"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	0, 	"reflexMod" :		0,	"willMod" :		0
		},
		{
			"name" : 		"Engineered Human",
			"favoredAbility" :	"CHA",
			"overCharge" :	"All",
			"favoredSkills" :	["science", "interaction"],
			"initiativeMod" :	0,	"speedMod" :		0,
			"fortitudeMod" :	1, 	"reflexMod" :		1,	"willMod" :		1
		},
	]

});



// ============= The character object ============== \\


function CharacterObject ()
{
	this.level = 1;
	this.name = "";
	this.primary = 0;
	this.secondary = 0;
	
	this.STR = 0;
	this.CON = 0;
	this.DEX = 0;
	this.INT = 0;
	this.WIS = 0;
	this.CHA = 0;

	// Additional modifiers to various scores; these do not include ability/level/origin modifiers
	this.initiativeMod = 0;
	this.speedMod = 0;
	this.fortitudeMod = 0;
	this.reflexMod = 0;
	this.willMod = 0;
	this.ACMod = 0;
	
	//====== Base skills; these scores do not include ability/level/origin modifiers
	//	Final skill score is calulated in getSkillByName function
	this.acrobatics = 0;
	this.athletics = 0;
	this.conspiracy = 0;
	this.insight = 0;
	this.interaction = 0;
	this.mechanics = 0;
	this.nature = 0;
	this.perception = 0;
	this.science = 0;
	this.stealth = 0;
	
	// Inventory
	this.inventoryIdArray = [];
	this.inventoryCustomNameArray = [];
	

	//====== Ability & Skill functions
	
	this.getAbilityByName = function (aname) {
		return (eval("this."+aname));
	}
	
	this.setAbilityByName = function (aname, score) {
		if (IsValueNameInArrayObject(aname, gRules.ability)) {
			eval("this."+aname+"="+parseInt(score));
		} else doSystemAlert("Error setting ability");
	}

	this.getSkillByName = function (skillname) {
		var skillScore = eval("this."+skillname);
		var associatedAbility = "not found";
		// Look up the ability that's associated with the skill
		for (s=0; s < gRules.skill.length; s++) {
			if (gRules.skill[s].name == skillname) {
				associatedAbility = gRules.skill[s].ability;
				break;
			}
		}
		skillScore += statBonus(this.getAbilityByName(associatedAbility));
		skillScore += this.getSkillPrimaryBonus(skillname);
		skillScore += this.getSkillSecondaryBonus(skillname);
		skillScore += this.level;
		return skillScore;
	}

	this.setSkillByName = function (skillName, skillScore) {
		if (IsValueNameInArrayObject(skillName, gRules.skill)) {
			eval("this."+skillName+"="+parseInt(skillScore));
		} else doSystemAlert("Error setting skill "+skillName);
	}
	
	this.getSkillPrimaryBonus = function (skillname) {
		if (IsElementInArray(skillname, gRules.origin[this.primary].favoredSkills))	return 4;
		else return 0;
	}

	this.getSkillSecondaryBonus = function (skillname) {
		if (IsElementInArray(skillname, gRules.origin[this.secondary].favoredSkills)) return 4;
		else return 0;
	}
	
	this.getSkillModText = function (skillname) {
		for (s=0; s < gRules.skill.length; s++) {
			if (gRules.skill[s].name == skillname) {
				associatedAbility = gRules.skill[s].ability;
				break;
			}
		}
		var t = "("+associatedAbility+") " + eval("this."+skillname);
		t += '+' + this.level;
		t += '+' +	statBonus(this.getAbilityByName(associatedAbility));
		t += '+' + (this.getSkillPrimaryBonus(skillname) + this.getSkillSecondaryBonus(skillname));
		return t;
	}

	//====== Health
	this.getMaxHitPoints = function () {
		return (12 + this.CON);
	}
	
	this.getBloodied = function () {
		return (Math.floor(this.getMaxHitPoints()/2));
	}

	//====== Initiative = level + both origin mods
	this.getInitiative = function () {
		var init = 0 + this.level;
		init += gRules.origin[this.primary].initiativeMod + gRules.origin[this.secondary].initiativeMod;
		return (init);
	}
	
	//====== Speed = 6 + primary origin mod + other mods
	this.getSpeed = function () {	
		return (6 + gRules.origin[this.primary].speedMod + this.speedMod);
	}
	
	//====== Defense = 10 + level + both origin mods + higher stat mod + other
	
	/*
	 * I may be making this too complicated...
	 *
	this.getDefenseByName = function (dname) {
		var d = 10 + this.level;
		if (IsValueNameInArrayObject(dname, gRules.defense)) {
			d += eval("this."+dname+"Mod");				// add char's 'other' mod
			d += eval("gRules.origin[this.primary]."+dname+"Mod");	// add modifier from 1st origin
			d += eval("gRules.origin[this.secondary]."+dname+"Mod");// add modifier from 2nd origin
			d += eval("higherStatBonus(this."+?????+", this."+??????+")");
		} else doSystemAlert("Error getting "+dname);
		return d;
	} */
	
	this.getFortitude = function () {	
		var f = 10 + this.level + this.fortitudeMod;
		f += gRules.origin[this.primary].fortitudeMod + gRules.origin[this.secondary].fortitudeMod;
		f += higherStatBonus(this.STR, this.CON);
		return (f);
	}
	this.getReflex = function () {	
		var r = 10 + this.level + this.reflexMod;
		r += gRules.origin[this.primary].reflexMod + gRules.origin[this.secondary].reflexMod;
		r += higherStatBonus(this.DEX, this.INT);
		return (r);
	}	
	this.getWill = function () {
		var r = 10 + this.level + this.willMod;
		r += gRules.origin[this.primary].willMod + gRules.origin[this.secondary].willMod;
		r += higherStatBonus(this.WIS, this.CHA);
		return (r);
	}

	this.getFortitudeModText = function () {
		var t = '10+'+this.level+'+'+higherStatBonus(this.STR, this.CON)+'+';
		t += gRules.origin[this.primary].fortitudeMod + gRules.origin[this.secondary].fortitudeMod;
		t += '+'+this.fortitudeMod;
		return t;
	}
	this.getReflexModText = function () {
		var t = '10+'+this.level+'+'+higherStatBonus(this.DEX, this.INT)+'+';
		t += gRules.origin[this.primary].reflexMod + gRules.origin[this.secondary].reflexMod;
		t += '+'+this.reflexMod;
		return t;
	}
	this.getWillModText = function () {
		var t = '10+'+this.level+'+'+higherStatBonus(this.WIS, this.CHA)+'+';
		t += gRules.origin[this.primary].willMod + gRules.origin[this.secondary].willMod;
		t += '+'+this.willMod;
		return t;
	}
	
	//====== AC = 10 + level + dex mod (unless heavy armor) + armor mod + other mods
	this.getAC = function () {
		var ac = 10 + this.level;
						// ** add in a way to handle armor
		ac += statBonus(this.DEX);
		ac += this.ACMod;
		return ac;
	}
	
	this.getACModText = function () {
		var t = '10+'+this.level+'+'+statBonus(this.DEX);+'+0+'+this.ACMod;
		return t;
	}
	
	
	//====== Inventory
	this.getInventoryName = function (invSlot) {
		var invId = this.inventoryIdArray[invSlot];
		var invName = gGearNameArray[invId];
		if (invId == 0) {
			invName = this.inventoryCustomNameArray[g];
		}
		return (invName); 
	}
	
	this.clearInventory = function () {
		this.inventoryIdArray = [];
		this.inventoryCustomNameArray = [];
	}
	
	
	//====== Ding! Level up!
	this.levelUp = function () {
		this.setLevel(this.level+1);
	}
	
	this.setLevel = function (newlevel) {
		newlevel = parseInt(newlevel);
		if (newlevel > 10) {
			doSystemAlert("10 is the max level");
		} else if (newlevel < 1) {
			doSystemAlert("1 the lowest level possible");
		} else {
			this.level = newlevel;
			this.updateCharacterSheetFields();
		}
	}
	
	//====== Output/char sheet functions

	this.updateCharacterSheetFields = function () {
		  $('#name-content').html(		this.name);
		  $('#level-content').html(		this.level);
		  $('#origin-content').html(	getOriginsHTML(this));
		  $('#origintraits-content').html(	getOriginTraitsHTML(this));
		  $('#powers-content').html(	'See the Gamma World Rule Book');
		  $('#ability-content').html(	getAbilityHTML(this));
		  $('#skills-content').html(	getSkillsHTML(this));
		  
		  $('#hp-content').html(		this.getMaxHitPoints());
		  $('#bloodied-content').html(	this.getBloodied());
		  $('#speed-content').html(		this.getSpeed());
		  
		  $('#ac-content').html(		this.getAC());
		  $('#ac-mod-content').html(	this.getACModText());
		  $('#fortitude-content').html(	this.getFortitude());
		  $('#fortitude-mod-content').html(this.getFortitudeModText());
		  $('#reflex-content').html(	this.getReflex());
		  $('#reflex-mod-content').html(	this.getReflexModText());
		  $('#will-content').html(		this.getWill());
		  $('#will-mod-content').html(	this.getWillModText());
		  
		  $('#init-content').html(		this.getInitiative());
		  $('#attacks-content').html(	'See the Gamma World Rule Book');
		  $('#gear-content').html(		getGearHTML(this));
	}
	
	// ========== Import / Export
	
	this.getCharacterString = function (stringType) {
	
		var charStr = "";
		var sep = "+";					// + seperator for main sections of data
									// , used for seperating minor data elements
		var nameClean = this.name;
		if (nameClean == "") nameClean = "No Name";	// get default for blank name
		nameClean = nameClean.replace(/\+/,"[plus]");	// get rid of seperator in name
		nameClean = escape(nameClean);			// escape name text http://www.javascripter.net/faq/escape.htm
	
		if (stringType == "link") {
			charStr += getBaseUrl() + "?c=";
		}
		
		charStr += this.level +sep+ nameClean +sep+ this.primary +','+ this.secondary;
		charStr += sep;
		charStr += this.STR +','+ this.CON +','+ this.DEX +',';
		charStr += this.INT +','+ this.WIS +','+ this.CHA;
		charStr += sep;
		charStr += this.initiativeMod +','+ this.speedMod +','+ this.fortitudeMod +',';
		charStr += this.reflexMod +','+ this.willMod +','+ this.ACMod;
		charStr += sep;
		charStr += this.acrobatics +','+ this.athletics +','+ this.conspiracy +',';
		charStr += this.insight +','+ this.interaction +','+ this.mechanics +',';
		charStr += this.nature +','+ this.perception +','+ this.science +','+ this.stealth;
		charStr += sep;
		charStr += this.inventoryIdArray.join(",");

		if (stringType == "full" || stringType == "export" || stringType == "cookie") {
			charStr += sep;
			var countOfCustomItems = 0;
			// Loop through all items and look for custom items (i.e. with Id 0)
			for (i=0; i < this.inventoryIdArray.length; i++)
			{
				if (this.inventoryIdArray[i] == 0) {
					countOfCustomItems++;
					if (countOfCustomItems > 1) charStr += "_";
					var invNameClean = this.inventoryCustomNameArray[i];
					invNameClean = invNameClean.replace(/\+/,"[plus]");
					invNameClean = invNameClean.replace(/_/, " ");
					invNameClean = escape(invNameClean);
					charStr += invNameClean;
				}
			}
		}
		return charStr;
	}
	
	this.importCharacterFromString = function (charStr) {
	
		var charSections = charStr.split("+");
		if (charSections.length < 6)
		{
			doAlert("Import Failed. Not enough sections of data.");
		} else {
			/*for (i=0; i < charSections.length; i++) {
				alert(charSections[i]);
			}*/
		
			var charLevel = charSections[0];
			var charName = unescape(charSections[1]).replace("[plus]", "+");
			var charOrigins = charSections[2].split(",");
			var charAbilityScores = charSections[3].split(",");
			var charMods = charSections[4].split(",");
			var charSkillMods = charSections[5].split(",");
			// inventory may not exist
			var charInvIds = (charSections[6]) ? charSections[6].split(",") : [];	
			// custom inv names often does not exist
			var charInvNames = (charSections[7]) ? charSections[7].split("_") : [];	
			
			var errMsg = "";
			
			// Make sure everything looks legit
			if ( !(charLevel > 0 && charLevel <= 10) ) errMsg = "Bad Level";
			if (charOrigins.length != 2)	errMsg = "Bad number of origins";
			if (charAbilityScores.length != 6)	errMsg = "Bad number of abilities";
			if (charMods.length != 6)		errMsg = "Bad number of modifiers";
			if (charSkillMods.length != 10) 	errMsg = "Bad number of skills";
			
			if (errMsg != "")
			{
				doAlert("Import Failed.\n"+errMsg);
			
			} else {	
			
				this.setLevel(charLevel);
				this.name = charName;
				this.primary = charOrigins[0];
				this.secondary = charOrigins[1]
				
				// set abilities
				for (i=0; i < gRules.ability.length; i++) {
					this.setAbilityByName(gRules.ability[i].name, charAbilityScores[i]);
				}

				this.initiativeMod = parseInt(charMods[0]);
				this.speedMod = 	parseInt(charMods[1]);
				this.fortitudeMod = 	parseInt(charMods[2]);
				this.reflexMod = 	parseInt(charMods[3]);
				this.willMod = 	parseInt(charMods[4]);
				this.ACMod = 		parseInt(charMods[5]);
				
				// Set skills
				// e.g. this.acrobatics = parseInt(charSkillMods[0]);
				for (i=0; i < gRules.skill.length; i++) {
					this.setSkillByName(gRules.skill[i].name, charSkillMods[i]);
				}
				
				// Set inventory
				this.clearInventory();
				var countCustomName = 0;
				for(i=0; i < charInvIds.length; i++) {
					this.inventoryIdArray[i] = parseInt(charInvIds[i]);
					if (this.inventoryIdArray[i]==0) {
						var customGearName = unescape(charInvNames[countCustomName]);
						customGearName = customGearName.replace("[plus]","+");
						this.inventoryCustomNameArray[i] = (customGearName) ? customGearName : "Unknown Custom Gear";
						countCustomName++;
					} else {
						this.inventoryCustomNameArray[i] = "";
					}
				}
				
				
				this.updateCharacterSheetFields();
				
				if (!gCharSheetOpen) {
					OpenCharSheet();
				}
				doAlert("Character successfully imported.");
			}
		}
	
	
	}
}

var gChar = new CharacterObject();


// ============= HTML OUTPUT FUNCTIONS =========== \\

function getGearHTML (c) {
	var gearOut = '<ul>';   
	for (g=0; g < c.inventoryIdArray.length; g++) {
		gearOut += '<li>' + c.getInventoryName(g); + '</li>';
	}
	for (x=0; x < 12-c.inventoryIdArray.length; x++) {
		gearOut += '<li></li>';
	}	
	gearOut += '<li></li></ul>';
	return(gearOut);
}

function getOriginsHTML (c) {
	originsOut = '<ol><li>' + gRules.origin[c.primary].name + '</li><li>' + gRules.origin[c.secondary].name + '</li></ol>';
	return originsOut;
}

function getOriginTraitsHTML(c) {
	traitsOut = '<ul>';
	traitsOut += '<li>+2 to ' + gRules.origin[c.primary].overCharge + ' overcharge</li>';
	traitsOut += '</ul>';
	return traitsOut;
}

function getSkillsHTML (c) {
	var skillOut = '<ul>';
	var skillNum = gRules.skill.length;
	for (z=0; z < skillNum; z++) {
		var skillname = gRules.skill[z].name;
		var skillscore = c.getSkillByName(skillname);
		skillOut += '<li><label>' + skillname + '</label>';
		skillOut += '<span class="score">' + /*((skillscore > 0) ? '+':'') +*/ skillscore + '</span>';
		skillOut += '<span class="mods">' + c.getSkillModText(skillname) + '</span>';
		skillOut += '</li>';
	}
	skillOut += '</ul>';

	return skillOut;
}

function getAbilityHTML (c) {
	var abilityOut = '<ul>';
	for (a=0; a < gRules.ability.length; a++) {
		var AbbrevName = gRules.ability[a].name;
		var score = c.getAbilityByName(AbbrevName);
		abilityOut += '<li><label for="' + AbbrevName + '">' + AbbrevName + '</label>';
		abilityOut += '<span class="score" id="' + AbbrevName + '">' + score + '</span>';
		var mod = statBonus(score);
		abilityOut += '<span class="mods">( ' + ((mod >= 0) ? '+ ':'- ') + Math.abs(mod);
		abilityOut += ' )</span></li>';
	}
	abilityOut += '</ul>';
	return abilityOut;
}

// ============== GENERATE CHARACTER - Randomize Functions ============== \\

function setRandomOrigin (c)
{
	c.primary = dice_roll(20,1);	// Roll Primary Origin 
	c.secondary = dice_roll(20,1);	// Roll Secondary Origin
	
	doAlert("Rolling Origins (d20): " + c.primary + ", " + c.secondary);
	
	if(c.primary==c.secondary) {	// If both origins are the same,
		c.secondary=21;		//  then Secondary is Engineered Human
	}
}

function setAllGearRandomly (c)
{
	// Give character starter gear, then roll for random gear and ancient junk
	c.inventoryIdArray = [22, 23, 24, gExplorerKitNumber];
	c.inventoryCustomNameArray = ["", "", "", ""];
	gearRolls = dice_roll(4,1) + 1;
	doAlert("Rolling for random gear (1d4+1): " + gearRolls);
	setRandomGear(c, c.inventoryIdArray.length, gearRolls);
}

function setRandomGear (c, invLocation, rollsLeft)
{
	// recursive function
	gearIdResult = dice_roll(20,1);		// number 1-20
	if (gearIdResult == 1)			// result of 1 means char gets 2 ancient junk items
	{
		var roll1 = dice_roll(100,1);
		var roll2 = dice_roll(100,1);
		var ancientJunkId1 = gAncientJunkNumber + roll1-1;
		var ancientJunkId2 = gAncientJunkNumber + roll2-1;
	
		doAlert("Gear: 1\nAncient junk rolled: " + roll1 + ", " + roll2);
		
		c.inventoryIdArray[invLocation] = ancientJunkId1;
		c.inventoryCustomNameArray[invLocation] = "";
		c.inventoryIdArray[c.inventoryIdArray.length] = ancientJunkId2;
		c.inventoryCustomNameArray[c.inventoryIdArray.length] = "";
	} else {

		if (gearIdResult==20) {		// result of 20 means char gets +2 rolls
			doAlert("Gear: 20\n+2 Gear rolls");
			rollsLeft += 2;
		} else {
			c.inventoryIdArray[invLocation] = gearIdResult;
			c.inventoryCustomNameArray[invLocation] = "";
		}		
	}
	rollsLeft--;
	if (rollsLeft > 0) setRandomGear(c, c.inventoryIdArray.length, rollsLeft);
}


function setRandomAbilities (c)
{
	// Generate randomly, then adjust for origins
	c.STR = dice_roll(6,3);
	c.CON = dice_roll(6,3);
	c.DEX = dice_roll(6,3);
	c.INT = dice_roll(6,3);
	c.WIS = dice_roll(6,3);
	c.CHA = dice_roll(6,3);
	
	var Ability1 = gRules.origin[c.primary].favoredAbility;
	var Ability2 = gRules.origin[c.secondary].favoredAbility;
	
	doAlert("Rolling Abilities: "+ c.STR +", "+ c.CON +", "+ c.DEX +", "+ c.INT +", "+ c.WIS +", "+ c.CHA);
	doAlert("Adjusting for origin-favored abilities: " + Ability1 + ", "+ Ability2);
	
	if (Ability1 == Ability2 && c.getAbilityByName(Ability1) < 20)
		c.setAbilityByName(Ability1, 20);
	else {
		if (c.getAbilityByName(Ability1) < 18) 
			c.setAbilityByName(Ability1, 18);
		if (c.getAbilityByName(Ability2) < 16)
			c.setAbilityByName(Ability2, 16);
	}
}

function setRandomSkills (c)
{
	// Start all skills at zero
	for (i=0; i < gRules.skill.length; i++)
	{
		c.setSkillByName(gRules.skill[i].name, 0);
	}
	
	// One random skill gets a +4 bonus
	var randomSkill = dice_roll(gRules.skill.length,1)-1;
	c.setSkillByName(gRules.skill[randomSkill].name, 4);
	
	doAlert("Rolling random skill (d10): " + (randomSkill+1) + "\n+4 to " + gRules.skill[randomSkill].name);
}


// ============== GENERATE CHARACTER - Main Function ============== \\
 
function generateChar(charName, charLevel) 
{	  
	gChar.setLevel(charLevel);
	gChar.name = charName;

	setRandomOrigin(gChar);	// Set origins
	  
	setAllGearRandomly(gChar);	// give character random gear / ancient junk
	
	setRandomAbilities(gChar);	// Set character's ability scores

	setRandomSkills(gChar);	// Set random skill
				
	showCharacterSheet(gChar);
}

function showCharacterSheet (c)
{
	// Update the HTML using jquery
	$('#charactersheet').fadeOut("fast").slideUp("fast", function() {
		c.updateCharacterSheetFields();
		OpenCharSheet();
	});
}


// ======================== EDIT CHARACTER FUNCTIONS ==================== \\

function swapOutExplorerKit (c)
{
	var msg = "Kit not found.";
	// Find the explorer kit in the inventory
	for (i=0; i < c.inventoryIdArray.length; i++)
	{
		if (c.inventoryIdArray[i] == gExplorerKitNumber) {
			setRandomGear(c, i, 0);
			msg = "Kit found and swapped for more gear.";
		}
	}
	doAlert(msg);
	if (msg != "Kit not found.") c.updateCharacterSheetFields();
}

function saveCharacter (c)
{
	var NumOfChars = 0;
	var freeSlot = 0;
	for (i=1; i <= gMaxSaveSlots; i++)
	{
		var charCookie = readCookie("GW_Char_"+i);
		if (charCookie != null) NumOfChars++;
		else if (freeSlot == 0) freeSlot = i;
	}
	if (NumOfChars == gMaxSaveSlots || freeSlot == 0)
	{
		alert("Too many saves. You have already used all "+gMaxSaveSlots+"slots.\nPlease delete a character to free up a save slot.");	
	} else {
	
		var days = 4000; 				// store cookies for over 10 years
		NumOfChars++;
		createCookie("GW_Char_"+freeSlot, c.getCharacterString("cookie"), days);
		doAlert("Character \"" + c.name + "\" saved in slot "+freeSlot);
	}
	updateCharSlots();
}

function loadCharacter (c, saveSlotNum)
{
	var charCookie = getSavedCharacter(saveSlotNum);
	if (charCookie == null) {
		alert("Character not found in save slot "+saveSlotNum);
	} else {
		c.importCharacterFromString(charCookie);
	}
}

function deleteSavedCharacter (saveSlotNum)
{
	eraseCookie("GW_Char_"+saveSlotNum);
	doAlert("Character in slot "+saveSlotNum+" has been deleted.");
	updateCharSlots();
}

function getSavedCharacter (saveSlotNum) {
	return readCookie("GW_Char_"+saveSlotNum);
}


// ================ ON PAGE LOAD ===================== \\

var gLastTabSelected = 1;

$(document).ready( function() {

	TabOpen(1);

	$('.opentab1').click( function(event) {
		TabOpen(1);
	});

	$('.opentab2').click( function(event) {
		TabOpen(2);
	});
	
	$('.opentab3').click( function(event) {
		TabOpen(3);
	});
	
	$('.opentab4').click( function(event) {
		TabOpen(4);
		updateCharSlots();
	});

	$('.opentab5').click( function(event) {
		TabOpen(5);
	});

	//====== Create character controls

	$('.generatebutton').click( function(event) {
		clearExportCharFields();
		generateChar($('#name').val(), $('#level').val());
		//doAlert("New character created");
	});
		
	//====== Edit character controls
	
	$('#editnamebutton').click( function(event) {
		gChar.name = $('#editname').val();
		gChar.updateCharacterSheetFields();
		clearExportCharFields();
	});

	$('#editlevelbutton').click( function(event) {
		gChar.setLevel($('#editlevel').val());
		clearExportCharFields();
	});

	$('#kitswapbutton').click( function(event) {
		swapOutExplorerKit(gChar);
		clearExportCharFields();
	});
	
	$('#levelupbutton').click( function(event) {
		doAlert("Ding! You've leveled up");
		gChar.levelUp();
		clearExportCharFields();
	});

	$('#rerolloriginbutton').click( function(event) {
		setRandomOrigin(gChar);
		setRandomAbilities(gChar);	// must reset abilities because they are based on origin
		gChar.updateCharacterSheetFields();
		clearExportCharFields();
	});

	$('#rerollskillbutton').click( function(event) {
		setRandomSkills(gChar);
		gChar.updateCharacterSheetFields();
		clearExportCharFields();
	});

	$('#rerollgearbutton').click( function(event) {
		setAllGearRandomly(gChar);
		gChar.updateCharacterSheetFields();
		clearExportCharFields();
	});
	
	//====== Print, Save, Load controls
	
	$('#printbutton').click( function(event) {
		window.print();
	});
	
	$('#savebutton').click( function(event) {
		saveCharacter(gChar);
	});
	
	$('#exportbutton').click( function(event) {
		$('#exporttextarea').html(gChar.getCharacterString('export'));
	});

	$('#getlinkbutton').click( function(event) {
		$('#linktextarea').html(gChar.getCharacterString('link'));
	});

	$('#loadbutton').click( function(event) {
		loadCharacter(gChar, 1);
		clearExportCharFields();
	});
	
	$('#importbutton').click( function(event) {
		gChar.importCharacterFromString($('#importtextarea').val());
		clearExportCharFields();
	});

	var urlVars = getUrlVars();
	if (urlVars["c"]) {
		gChar.importCharacterFromString(urlVars["c"]);
	}
});

// ========================= USER INTERFACE ====================== \\


function OpenCharSheet ()
{
	$('#charactersheet').fadeIn("fast").slideDown("slow");
	gCharSheetOpen = true;
}

function clearExportCharFields () {
	$('#exporttextarea').html("");
	$('#linktextarea').html("");
}

function updateCharSlots () {
	var slotList = "";
	for (i=1; i <= gMaxSaveSlots; i++)
	{
		var charCookie = getSavedCharacter(i);
		if (charCookie == null) {
			slotList += '<li class="emptyslot"><span class="slotnum">' +i+ '</span>Empty Slot</li>';
		} else {
			slotList += '<li class="fullslot"><span class="slotnum">' +i+ '</span>' + charCookie.substr(2,7);
			slotList += '<br>';
			slotList += '<button type="button" onclick="loadCharacter(gChar,' +i+ ');">Load</button>';
			slotList += '<button type="button" onclick="deleteSavedCharacter(' +i+ ');">Delete</button>';
			slotList += '</li>';
		}
	}	
	$('#characterslots').html(slotList);
}

function TabOpen (n)
{
	TabClose(gLastTabSelected);
	gLastTabSelected = n;
	$('#tab'+n).addClass('tabselected').slideDown("fast");
	$('.opentab'+n).addClass('tabselected').removeClass('tabunselected');
}
function TabClose (n)
{
	$('#tab'+n).removeClass('tabselected').slideUp("fast");
	$('.opentab'+n).removeClass('tabselected').addClass('tabunselected');
}

function doAlert (msg)
{
	msg = msg.replace("\n", "<br>");
	$.jnotify(msg);
}

function doSystemAlert (msg)
{
	alert(msg);
}