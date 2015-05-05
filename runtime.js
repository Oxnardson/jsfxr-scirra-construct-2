// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.jSFXR = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.jSFXR.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	
	
	function Acts() {};
	
	Acts.prototype.outUrl = "0";
	
	// the example action
	Acts.prototype.PlayCustom = function (waveType,attackTime,sustainTime,sustainPunch,decayTime,frequency,slide,deltaSlide,vibratoDepth,vibratoSpeed,changeAmount,changeSpeed,squareDuty,dutySweep,phaserOffset,phaserSweep,lpFilterCutoff,lpFilterCutoffSweep,lpFilterResonance,masterVolume)
	{
		var soundURL = jsfxr([waveType,attackTime,sustainTime,sustainPunch,decayTime,returnFrq(frequency),0,slide,deltaSlide,vibratoDepth,vibratoSpeed,changeAmount,changeSpeed,squareDuty,dutySweep,0,phaserOffset,phaserSweep,lpFilterCutoff,lpFilterCutoffSweep,lpFilterResonance,0,0,masterVolume]);
		var player = new Audio();
		player.src = soundURL;
		player.play();
		Acts.prototype.outUrl = soundURL;
	};
	
	Acts.prototype.PlayCSV = function (csvstring)
	{
		var soundURL = jsfxr(playString(csvstring));
		var player = new Audio();
		player.src = soundURL;
		player.play();
		Acts.prototype.outUrl = soundURL;
	};
	
	Acts.prototype.CacheCSV = function (csvstring,tag)
	{
		var value = jsfxr(playString(csvstring));
		CacheSound(tag, value);
	};
	
	Acts.prototype.PlayUni = function (waveType,attackTime,sustainTime,decayTime,type,HzMidiNote,vibratoDepth,vibratoSpeed,squareDuty,masterVolume)
	{
		var playType = ["Hz","Midi note","Note name"][type];
		if (playType == "Hz") 		 var soundURL = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrq(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		if (playType == "Midi note") var soundURL = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNote(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		if (playType == "Note name") var soundURL = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		
		var player = new Audio();
		player.src = soundURL;
		player.play();
		Acts.prototype.outUrl = soundURL;
	};
	
	Acts.prototype.CacheCustom = function (waveType,attackTime,sustainTime,sustainPunch,decayTime,frequency,slide,deltaSlide,vibratoDepth,vibratoSpeed,changeAmount,changeSpeed,squareDuty,dutySweep,phaserOffset,phaserSweep,lpFilterCutoff,lpFilterCutoffSweep,lpFilterResonance,masterVolume,tag)
	{
		var value = jsfxr([waveType,attackTime,sustainTime,sustainPunch,decayTime,returnFrq(frequency),0,slide,deltaSlide,vibratoDepth,vibratoSpeed,changeAmount,changeSpeed,squareDuty,dutySweep,0,phaserOffset,phaserSweep,lpFilterCutoff,lpFilterCutoffSweep,lpFilterResonance,0,0,masterVolume]);
		CacheSound(tag, value);
	};
	
	Acts.prototype.CacheUni = function (waveType,attackTime,sustainTime,decayTime,type,HzMidiNote,vibratoDepth,vibratoSpeed,squareDuty,masterVolume,tag)
	{
		var playType = ["Hz","Midi note","Note name"][type];
		if (playType == "Hz") 		 var value = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrq(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		if (playType == "Midi note") var value = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNote(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		if (playType == "Note name") var value = jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName(HzMidiNote),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]);
		
		CacheSound(tag, value);
	};
	
	Acts.prototype.PlayCached = function (tag)
	{
		var player = new Audio();
		player.src = GetSound(tag);
		player.play();
		Acts.prototype.outUrl = player.src;
	};
	
	Acts.prototype.GenerateRandom = function (c,masterVolume)
	{
		//var soundURL = jsfxr([3,0,(0.1 + Math.random() * 0.3),(0.2 + Math.random() * 0.2),(0.3+Math.random() * 0.5),(0.05 + Math.random() * 0.1),0,(-0.1 + Math.random() * 0.4),0,0,0,(0.8 - Math.random() * 1.6),(0.6 + Math.random() * 0.3),0,0,0,0,0,1,0,0,0,0,0.5]);
		
		var fx = ["GeneratePickupCoin", "GenerateLaserShoot", "GenerateExplosion", "GeneratePowerup", "GenerateHitHurt", "GenerateJump", "GenerateBlipSelect"][c];
	
		if (fx == "GeneratePickupCoin") GeneratePickupCoin();
		if (fx == "GenerateLaserShoot") GenerateLaserShoot();
		if (fx == "GenerateExplosion") GenerateExplosion();
		if (fx == "GeneratePowerup") GeneratePowerup();
		if (fx == "GenerateHitHurt") GenerateHitHurt();
		if (fx == "GenerateJump") GenerateJump();
		if (fx == "GenerateBlipSelect") GenerateBlipSelect();
		var soundURL = jsfxr([synthG.waveType,synthG.attackTime,synthG.sustainTime,synthG.sustainPunch,synthG.decayTime,synthG.startFrequency,synthG.minFrequency,synthG.slide,synthG.deltaSlide,synthG.vibratoDepth,synthG.vibratoSpeed,synthG.changeAmount,synthG.changeSpeed,synthG.squareDuty,synthG.dutySweep,synthG.repeatSpeed,synthG.phaserOffset,synthG.phaserSweep,synthG.lpFilterCutoff,synthG.lpFilterCutoffSweep,synthG.lpFilterResonance,synthG.hpFilterCutoff,synthG.hpFilterCutoffSweep,masterVolume]);
		var player = new Audio();
		player.src = soundURL;
		player.play();
		Acts.prototype.outUrl = soundURL;
	};
	//returnFrqFromNote(note)
	
var banksIndexArr = ["0"];
var banksArr = ["0"];

	Acts.prototype.CacheOctave = function (waveType,attackTime,sustainTime,decayTime,vibratoDepth,vibratoSpeed,squareDuty,masterVolume,tag,octave_)
	{
	
		banksIndexArr[banksIndexArr.length] = tag;
		
		banksArr[banksArr.length] = [jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("C"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("C#"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("D"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("D#"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("E"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("F"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("F#"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("G"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("G#"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("A"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("A#"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume]),
									 jsfxr([waveType,attackTime,sustainTime,0,decayTime,returnFrqFromNoteName("B"+octave_),0,0,0,vibratoDepth,vibratoSpeed,0,0,squareDuty,0,0,0,0,1,0,0,0,0,masterVolume])
									];
		
		
		//"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"
		
	};
	
	Acts.prototype.PlayOctave = function (tag,note)
	{
		
		var idtempOc = banksIndexArr.indexOf(tag); //get bank index
		if (idtempOc >= 0) {
		var bankSoundOc = banksArr[idtempOc];		   //get bank sounds array 
		var ocNoteIndex = notesArr.indexOf(note);
		var sUrlOc = bankSoundOc[ocNoteIndex]; 
		var player = new Audio();
		player.src = sUrlOc;
		player.play();
		Acts.prototype.outUrl = sUrlOc;}
		
	};
	
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.LastSoundUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(Acts.prototype.outUrl);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();
	
	//jsfxr code
	
	/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
window['jsfxr'] = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}

//Convert startFrequency to Hz & Midi note
function returnFrq(Hz) {
    return (Math.sqrt(Hz*100/8/44100)-0.001);
}
function returnFrqFromNote(note) {
	return (Math.sqrt((440* Math.pow(2, ((note-69)/12)))*100/8/44100)-0.001);
	//return 440* Math.pow(2, ((note-69)/12));
}

var notesArr = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
var corr = (-1);

function returnFrqFromNoteName(note) {
	var notePos = 0;
	if (note.length == 2) {
		
		var notePos = notesArr.indexOf(note.charAt(0)); // return index of note in array by notename
		var octave  = note.charAt(1)-corr;
		var noteFin = (octave*12)+notePos;
	}
	if (note.length == 3) {
	
		var notePos = notesArr.indexOf(note.charAt(0)+note.charAt(1)); // return index of note in array by notename
		var octave  = note.charAt(2)-corr;
		var noteFin = (octave*12)+notePos;
	}
	return (Math.sqrt((440* Math.pow(2, ((noteFin-69)/12)))*100/8/44100)-0.001);
	//return 440* Math.pow(2, ((note-69)/12));
}

var soundIndexArr = [0];
var soundUrlArr = [0];
//}

function CacheSound (tag, value){
soundIndexArr[soundIndexArr.length] = tag;
soundUrlArr[soundUrlArr.length] = value;
}

function GetSound(tag){
var idtemp = soundIndexArr.indexOf(tag);
var sUrl = soundUrlArr[idtemp]
return sUrl;
}



//Generate Sounds	
var synthG	= new Object();
function resetParams() {
synthG.waveType = 0;
synthG.attackTime = 0;
synthG.sustainTime = 0.3;
synthG.sustainPunch = 0;
synthG.decayTime = 0.4;
synthG.startFrequency = 0.3;
synthG.minFrequency = 0;
synthG.slide = 0;
synthG.deltaSlide = 0;
synthG.vibratoDepth = 0;
synthG.vibratoSpeed = 0;
synthG.changeAmount = 0;
synthG.changeSpeed = 0;
synthG.squareDuty = 0;
synthG.dutySweep = 0;
synthG.repeatSpeed = 0;
synthG.phaserOffset = 0;
synthG.phaserSweep = 0;
synthG.lpFilterCutoff = 1;
synthG.lpFilterCutoffSweep = 0;
synthG.lpFilterResonance = 0;
synthG.hpFilterCutoff = 0;
synthG.hpFilterCutoffSweep = 0;
synthG.masterVolume = 0.5;
}

	function GenerateExplosion() {
        resetParams();
		synthG.waveType = 3;
		

        if (Math.random() < 0.5) {
          synthG.startFrequency = 0.1 + Math.random() * 0.4;
          synthG.slide = -0.1 + Math.random() * 0.4;
        }
        else {
          synthG.startFrequency = 0.2 + Math.random() * 0.7;
          synthG.slide = -0.2 - Math.random() * 0.2;
        }

        synthG.startFrequency *= synthG.startFrequency;

        if (Math.random() < 0.2) synthG.slide = 0.0;
        if (Math.random() < 0.33) synthG.repeatSpeed = 0.3 + Math.random() * 0.5;

        synthG.sustainTime = 0.1 + Math.random() * 0.3;
        synthG.decayTime = Math.random() * 0.5;
        synthG.sustainPunch = 0.2 + Math.random() * 0.6;

        if (Math.random() < 0.5) {
          synthG.phaserOffset = -0.3 + Math.random() * 0.9;
          synthG.phaserSweep = -Math.random() * 0.3;
        }

        if (Math.random() < 0.33) {
          synthG.changeSpeed = 0.6 + Math.random() * 0.3;
          synthG.changeAmount = 0.8 - Math.random() * 1.6;
        }
      }
      
	function GeneratePickupCoin() {
        resetParams();

        synthG.startFrequency = 0.4 + Math.random() * 0.5;

        synthG.sustainTime = Math.random() * 0.1;
        synthG.decayTime = 0.1 + Math.random() * 0.4;
        synthG.sustainPunch = 0.3 + Math.random() * 0.3;

        if (Math.random() < 0.5) {
          synthG.changeSpeed = 0.5 + Math.random() * 0.2;
          synthG.changeAmount = 0.2 + Math.random() * 0.4;
        }
      }	 

	function GenerateLaserShoot() {
        resetParams();

        synthG.waveType = Math.floor(Math.random() * 3);
        if (synthG.waveType == 2 && Math.random() < 0.5) {
          synthG.waveType = Math.floor(Math.random() * 2);
        }

        synthG.startFrequency = 0.5 + Math.random() * 0.5;
        synthG.minFrequency = synthG.startFrequency - 0.2 - Math.random() * 0.6;
        if (synthG.minFrequency < 0.2) {
          synthG.minFrequency = 0.2;
        }

        synthG.slide = -0.15 - Math.random() * 0.2;

        if (Math.random() < 0.33) {
          synthG.startFrequency = 0.3 + Math.random() * 0.6;
          synthG.minFrequency = Math.random() * 0.1;
          synthG.slide = -0.35 - Math.random() * 0.3;
        }

        if (Math.random() < 0.5) {
          synthG.squareDuty = Math.random() * 0.5;
          synthG.dutySweep = Math.random() * 0.2;
        }
        else {
          synthG.squareDuty = 0.4 + Math.random() * 0.5;
          synthG.dutySweep = -Math.random() * 0.7;
        }

        synthG.sustainTime = 0.1 + Math.random() * 0.2;
        synthG.decayTime = Math.random() * 0.4;
        if (Math.random() < 0.5) synthG.sustainPunch = Math.random() * 0.3;

        if (Math.random() < 0.33) {
          synthG.phaserOffset = Math.random() * 0.2;
          synthG.phaserSweep = -Math.random() * 0.2;
        }

        if (Math.random() < 0.5) synthG.hpFilterCutoff = Math.random() * 0.3;
      }	  
	
	function GeneratePowerup() {
        resetParams();

        if (Math.random() < 0.5) synthG.waveType = 1;
        else synthG.squareDuty = Math.random() * 0.6;

        if (Math.random() < 0.5) {
          synthG.startFrequency = 0.2 + Math.random() * 0.3;
          synthG.slide = 0.1 + Math.random() * 0.4;
          synthG.repeatSpeed = 0.4 + Math.random() * 0.4;
        }
        else {
          synthG.startFrequency = 0.2 + Math.random() * 0.3;
          synthG.slide = 0.05 + Math.random() * 0.2;

          if (Math.random() < 0.5) {
            synthG.vibratoDepth = Math.random() * 0.7;
            synthG.vibratoSpeed = Math.random() * 0.6;
          }
        }

        synthG.sustainTime = Math.random() * 0.4;
        synthG.decayTime = 0.1 + Math.random() * 0.4;
      }
	  
    function GenerateHitHurt() {
        resetParams();
        synthG.waveType = Math.floor(Math.random() * 3);
        if (synthG.waveType == 2) synthG.waveType = 3;
        else if (synthG.waveType == 0) synthG.squareDuty = Math.random() * 0.6;

        synthG.startFrequency = 0.2 + Math.random() * 0.6;
        synthG.slide = -0.3 - Math.random() * 0.4;

        synthG.sustainTime = Math.random() * 0.1;
        synthG.decayTime = 0.1 + Math.random() * 0.2;

        if (Math.random() < 0.5) synthG.hpFilterCutoff = Math.random() * 0.3;
      }	
	  
	function GenerateJump() {
        resetParams();

        synthG.waveType = 0;
        synthG.squareDuty = Math.random() * 0.6;
        synthG.startFrequency = 0.3 + Math.random() * 0.3;
        synthG.slide = 0.1 + Math.random() * 0.2;

        synthG.sustainTime = 0.1 + Math.random() * 0.3;
        synthG.decayTime = 0.1 + Math.random() * 0.2;

        if (Math.random() < 0.5) synthG.hpFilterCutoff = Math.random() * 0.3;
        if (Math.random() < 0.5) synthG.lpFilterCutoff = 1.0 - Math.random() * 0.6;
      }  
	  
	function GenerateBlipSelect() {
        resetParams();

        synthG.waveType = Math.floor(Math.random() * 2);
        if (synthG.waveType == 0) synthG.squareDuty = Math.random() * 0.6;

        synthG.startFrequency = 0.2 + Math.random() * 0.4;

        synthG.sustainTime = 0.1 + Math.random() * 0.1;
        synthG.decayTime = Math.random() * 0.2;
        synthG.hpFilterCutoff = 0.1;
      }
	     function playString(csvstring) {
       var csvtemp = csvstring.split(",");
       var csvparams = new Array();
       for(var i = 0; i < csvtemp.length; i++) {
         csvparams[i] = parseFloat(csvtemp[i]);
       }
       return csvparams;
    }
}());