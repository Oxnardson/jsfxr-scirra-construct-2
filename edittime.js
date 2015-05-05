function GetPluginSettings()
{
	return {
		"name":			"jSFXR",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"jSFXR",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"jSFXR for C2",
		"author":		"Oxnard",
		"help url":		"https://www.patreon.com/creation?hid=1930914",
		"category":		"Media",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal			// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
//AddNumberParam("Number", "Enter a number to test if positive.");
//AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
AddNumberParam("waveType", "0 - Square, 1 - Saw, 2 - Sine, 3 - Noise");
AddNumberParam("attackTime", "How quickly the sound reaches full volume after the sound is activated. In seconds.");
AddNumberParam("sustainTime", "Duration of the full volume. In seconds.");
AddNumberParam("sustainPunch", "");
AddNumberParam("decayTime", "How quickly the sound drops to the 0 level after the sustain. In seconds.");
AddNumberParam("frequency", "Sound frequency in Hz. A4 note = 440 Hz.");
//AddNumberParam("minFrequency", "");
AddNumberParam("slide", "");
AddNumberParam("deltaSlide", "");
AddNumberParam("vibratoDepth", "Vibrato amplitude.");
AddNumberParam("vibratoSpeed", "Vibrato speed.");
AddNumberParam("changeAmount", "");
AddNumberParam("changeSpeed", "");
AddNumberParam("squareDuty", "The ratio of the high period to the total period of the square wave. From 0 to 1.", initial_string = 0.5);
AddNumberParam("dutySweep", "");
//AddNumberParam("repeatSpeed", "");
AddNumberParam("phaserOffset", "");
AddNumberParam("phaserSweep", "");
AddNumberParam("lpFilterCutoff", "", initial_string = 1);
AddNumberParam("lpFilterCutoffSweep", "");
AddNumberParam("lpFilterResonance", "");
//AddNumberParam("hpFilterCutoff", "");
//AddNumberParam("hpFilterCutoffSweep", "");
AddNumberParam("masterVolume", "Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddStringParam("tag", "Enter sound name for cache. Cached sound can be played later through \"Play cached\" action.");
AddAction(0, af_none, "Play PRO sound", "Generator", "Play {20}", "Play custom sound with PRO parameters.", "PlayCustom");

AddNumberParam("waveType", "0 - Square, 1 - Saw, 2 - Sine, 3 - Noise");
AddNumberParam("attackTime", "How quickly the sound reaches full volume after the sound is activated. In seconds.");
AddNumberParam("sustainTime", "Duration of the full volume. In seconds.");
AddNumberParam("sustainPunch", "");
AddNumberParam("decayTime", "How quickly the sound drops to the 0 level after the sustain. In seconds.");
AddNumberParam("frequency", "Sound frequency in Hz. A4 note = 440 Hz.");
//AddNumberParam("minFrequency", "");
AddNumberParam("slide", "");
AddNumberParam("deltaSlide", "");
AddNumberParam("vibratoDepth", "Vibrato amplitude.");
AddNumberParam("vibratoSpeed", "Vibrato speed.");
AddNumberParam("changeAmount", "");
AddNumberParam("changeSpeed", "");
AddNumberParam("squareDuty", "The ratio of the high period to the total period of the square wave. From 0 to 1.", initial_string = 0.5);
AddNumberParam("dutySweep", "");
//AddNumberParam("repeatSpeed", "");
AddNumberParam("phaserOffset", "");
AddNumberParam("phaserSweep", "");
AddNumberParam("lpFilterCutoff", "", initial_string = 1);
AddNumberParam("lpFilterCutoffSweep", "");
AddNumberParam("lpFilterResonance", "");
//AddNumberParam("hpFilterCutoff", "");
//AddNumberParam("hpFilterCutoffSweep", "");
AddNumberParam("masterVolume", "Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddStringParam("tag", "Enter sound name. For comfortable reading of event sheet.");
AddAction(1, af_none, "Cache PRO sound", "Cache", "Cache {20}", "Cache custom sound with PRO parameters.", "CacheCustom");
	
//UNI
AddNumberParam("waveType", "0 - Square, 1 - Saw, 2 - Sine, 3 - Noise");
AddNumberParam("attackTime", "How quickly the sound reaches full volume after the sound is activated. In seconds.");
AddNumberParam("sustainTime", "Duration of the full volume. In seconds.");
AddNumberParam("decayTime", "How quickly the sound drops to the 0 level after the sustain. In seconds.");
AddComboParamOption("Hz");
AddComboParamOption("Midi note");
AddComboParamOption("Note name");
AddComboParam("type", "Select preset.");
AddAnyTypeParam("HzMidiNote", "Sound frequency in Hz / Midi note number / Note name(C0,C#0...A#9,B9)");
AddNumberParam("vibratoDepth", "Vibrato amplitude.");
AddNumberParam("vibratoSpeed", "Vibrato speed.");
AddNumberParam("squareDuty", "The ratio of the high period to the total period of the square wave. From 0 to 1.", initial_string = 0.5);
AddNumberParam("masterVolume", "Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddStringParam("tag", "Enter sound name. For comfortable reading of event sheet.");
AddAction(2, af_none, "Play Sound", "Generator", "Play <b>{10}</b>", "Play sound with custom parameters.", "PlayUni");

AddNumberParam("waveType", "0 - Square, 1 - Saw, 2 - Sine, 3 - Noise");
AddNumberParam("attackTime", "How quickly the sound reaches full volume after the sound is activated. In seconds.");
AddNumberParam("sustainTime", "Duration of the full volume. In seconds.");
AddNumberParam("decayTime", "How quickly the sound drops to the 0 level after the sustain. In seconds.");
AddComboParamOption("Hz");
AddComboParamOption("Midi note");
AddComboParamOption("Note name");
AddComboParam("type", "Select preset.");
AddAnyTypeParam("HzMidiNote", "Sound frequency in Hz / Midi note number / Note name(C0,C#0...A#9,B9)");
AddNumberParam("vibratoDepth", "Vibrato amplitude.");
AddNumberParam("vibratoSpeed", "Vibrato speed.");
AddNumberParam("squareDuty", "The ratio of the high period to the total period of the square wave. From 0 to 1.", initial_string = 0.5);
AddNumberParam("masterVolume", "Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddStringParam("tag", "Enter sound name for cache. Cached sound can be played later through \"Play cached\" action.");
AddAction(3, af_none, "Cache Sound", "Cache", "Cache <b>{10}</b>", "Cache sound with custom parameters.", "CacheUni");

//Octave
AddNumberParam("waveType", "0 - Square, 1 - Saw, 2 - Sine, 3 - Noise");
AddNumberParam("attackTime", "How quickly the sound reaches full volume after the sound is activated. In seconds.");
AddNumberParam("sustainTime", "Duration of the full volume. In seconds.");
AddNumberParam("decayTime", "How quickly the sound drops to the 0 level after the sustain. In seconds.");
AddNumberParam("vibratoDepth", "Vibrato amplitude.");
AddNumberParam("vibratoSpeed", "Vibrato speed.");
AddNumberParam("squareDuty", "The ratio of the high period to the total period of the square wave. From 0 to 1.", initial_string = 0.5);
AddNumberParam("masterVolume", "Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddStringParam("tag", "Enter sound name. For comfortable reading of event sheet.");
AddNumberParam("octave_", "Octave to cache", initial_string = 4);
AddAction(4, af_none, "Cache Octave", "This is for you if you're a musician", "Cache <b>{8}</b> octave", "Cache octave with custom parameters.", "CacheOctave");

AddStringParam("tag", "Enter cached octave name.");
AddStringParam("note", "Enter note name", initial_string = "\"C\"");
AddAction(5, af_none, "Play cached note from octave", "This is for you if you're a musician", "Play cached <b>{1}</b> note from <b>{0}</b>", "Play cached note from octave.", "PlayOctave");

AddStringParam("tag", "Enter cached sound name.");
AddAction(6, af_none, "Play cached", "Cache", "Play cached <b>{0}</b>", "Play cached sound.", "PlayCached");

AddComboParamOption("Pickup Coin");
AddComboParamOption("Laser Shoot");
AddComboParamOption("Explosion");
AddComboParamOption("Powerup");
AddComboParamOption("Hit/Hurt");
AddComboParamOption("Jump");
AddComboParamOption("Blip/Select");
AddComboParam("Generate", "Select preset.");		// a dropdown list parameter
AddNumberParam("masterVolume","Volume of this sound. From 0 to 1.", initial_string = 0.5);
AddAction(7, af_none, "Generate random sound", "Random", "Generate <b>{0}</b>", "Generate random sound from preset", "GenerateRandom");


//CSV

AddStringParam("csvstring", "Enter CSV string");
AddStringParam("tag", "Enter sound name. For comfortable reading of event sheet.");
AddAction(8, af_none, "Play CSV string", "Generator", "Play <b>{1}</b>", "Play CSV string. You can copy string from as3sfxr.", "PlayCSV");

AddStringParam("csvstring", "Enter CSV string");
AddStringParam("tag", "Enter cached sound name.");
AddAction(9, af_none, "Cache CSV string", "Cache", "Cache <b>{1}</b>", "Cache CSV string. You can copy string from as3sfxr.", "CacheCSV");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(0, ef_return_string, "Leet expression", "Url", "LastSoundUrl", "Return last played sound Url in Base64 format.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [

	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();

}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}



//jsfxr
