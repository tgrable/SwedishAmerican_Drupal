var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation, headerHeight;
function init() {
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		var d = document.getElementById("animation_container");
		d.className += "header-banner ios-header";
	}
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp=AdobeAn.getComposition("5B27E6CCEB9D4A8B977E37A63AE86E9C");
	var lib=comp.getLibrary();
	createjs.MotionGuidePlugin.install();
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
	loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
	var lib=comp.getLibrary();
	loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
	var images=comp.getImages();	
	if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }	
}
function handleComplete(evt,comp) {
	//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
	var lib=comp.getLibrary();
	var ss=comp.getSpriteSheet();
	var queue = evt.target;
	var ssMetadata = lib.ssMetadata;
	for(i=0; i<ssMetadata.length; i++) {
		ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
	}
	exportRoot = new lib.swedeshdrhome2();
	stage = new lib.Stage(canvas);
	stage.addChild(exportRoot);	
	//Registers the "tick" event listener.
	fnStartAnimation = function() {
		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", stage);
	}	    
	//Code to support hidpi screens and responsive scaling.
	function makeResponsive(isResp, respDim, isScale, scaleType) {		
		var lastW, lastH, lastS=1;		
		window.addEventListener('resize', resizeCanvas);		
		resizeCanvas();		
		function resizeCanvas() {			
			var w = lib.properties.width, h = lib.properties.height;			
			var iw = window.innerWidth, ih=window.innerHeight;			
			var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
			if(isResp) {                
				if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
					sRatio = lastS;                
				}				
				else if(!isScale) {					
					if(iw<w || ih<h)						
						sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==1) {					
					sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==2) {					
					sRatio = Math.max(xRatio, yRatio);				
				}			
			}			
			//canvas.width = w*pRatio*sRatio;			
			//canvas.height = h*pRatio*sRatio;
			canvas.style.width = dom_overlay_container.style.width = anim_container.style.width =  w*sRatio+'px';				
			canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h*sRatio+'px';
			headerHeight = anim_container.style.height = dom_overlay_container.style.height = h*sRatio;
			//stage.scaleX = pRatio*sRatio;			
			//stage.scaleY = pRatio*sRatio;			
			lastW = iw; lastH = ih; lastS = sRatio;		
		}

		// Note that "orientationchange" and screen.orientation are unprefixed in the following
		// code although this API is still vendor-prefixed browsers implementing it.
		window.addEventListener("orientationchange", function() {
			bsHacktoResizeHeader();
		});

		function bsHacktoResizeHeader() {
			if (window.innerWidth > 767) {
				var element = document.getElementsByTagName("header")[0];
				var  dynamicHeight = (headerHeight + 30) + "px"
				element.style.height = dynamicHeight;
			}
		}
		bsHacktoResizeHeader();
	}
	makeResponsive(true,'both',true,1);	
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
}

(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [
		{name:"swedes_hdr_home_2_atlas_", frames: [[0,0,2880,615],[913,617,667,96],[0,617,911,72]]}
];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != null && cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != null && cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != null && cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:



(lib.animationheaderhome01 = function() {
	this.spriteSheet = ss["swedes_hdr_home_2_atlas_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.cloudslarge = function() {
	this.spriteSheet = ss["swedes_hdr_home_2_atlas_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.cloudssmall = function() {
	this.spriteSheet = ss["swedes_hdr_home_2_atlas_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.cloudssmall_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.cloudssmall();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloudssmall_1, new cjs.Rectangle(0,0,911,72), null);


(lib.cloudslarge_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.cloudslarge();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.cloudslarge_1, new cjs.Rectangle(0,0,667,96), null);


(lib.butterlfyflap = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AMIGoIh3gQQhDgLgwgTQgpgQgwgeIhSg5QgcAhg2AcIgoAVQhiBDi7gZQiWgUiEg+Qg7gcgVgMQgwgcgYgeQg8A5hjgWQhigVgphLQi3AKi0hZQi3hYiPinQg+hJgOgSQgRgUgIgRQgNgdAYgDQATgCANAYQAIANAKAaQARAeAnAvQBEBQBQA/QC1CPDEAiQBDAMBGgDQgHgTAAgVQg8AFhXgZQgwgPg0gcQg1gcgqghQhQhBgyhjQgrhUgXhzQgCgOAGgLQAIgNAOADQAOADAEARIACAdIABAsQABAbAFARQAMAqAZAvQAxBbBKA8QApAgAyAaQAxAaAuAPQBPAYA+gFQAPhPB0ARQBoARBMBBQAVgeAjgXQAhgWAjgJQAYgFAcgEINYAFQB1AGDtATQBQAGAyAAQBEABA+gIICEgPQBMgGA4AGQDEAXhqCGQhLBhiNBQQhxBAiUAVQhCAJhFAAQhEAAhHgJg");
	this.shape.setTransform(236.4,311.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AloCTQiFgGl7gTQjrgMkhgSQhVgFgpgFQgfgDghgJQgwgLA/gJQA2gHA4ACIAoABIAmgBQAmABgMgIQgLgHgYgEQlIgbiJgcQi6gnhNgeQg1gVgIgFQgjgVBEgCIB5ABIB8AAQCJgDBiADQA3ABBOAFICAAHQC8AJDFAEQCMACA3ADIEGAQQCYAJB+AEIC1AGQApADBOALQAvAHATANQALAIAMAPQAqAiBWAOQAXgPAjgJQA0gLBngHQDAgME1ADIEgABICEgBQBVgCAvABQBZABCVAJQA6AEC/AIQDGAGALAIQAOAKiEAOQjDAUlCAYIkTATIkcARIkwASQiGALhAAEg");
	this.shape_1.setTransform(242.7,296.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},7).to({state:[]},3).to({state:[{t:this.shape_1},{t:this.shape}]},13).to({state:[]},2).wait(3));

	// Layer 2
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AMIGoIh3gQQhDgLgwgTQgpgQgwgeIhSg5QgcAhg2AcIgoAVQhiBDi7gZQiWgUiEg+Qg7gcgVgMQgwgcgYgeQg8A5hjgWQhigVgphLQi3AKi0hZQi3hYiPinQg+hJgOgSQgRgUgIgRQgNgdAYgDQATgCANAYQAIANAKAaQARAeAnAvQBEBQBQA/QC1CPDEAiQBDAMBGgDQgHgTAAgVQg8AFhXgZQgwgPg0gcQg1gcgqghQhQhBgyhjQgrhUgXhzQgCgOAGgLQAIgNAOADQAOADAEARIACAdIABAsQABAbAFARQAMAqAZAvQAxBbBKA8QApAgAyAaQAxAaAuAPQBPAYA+gFQAPhPB0ARQBoARBMBBQAVgeAjgXQAhgWAjgJQAYgFAcgEINYAFQB1AGDtATQBQAGAyAAQBEABA+gIICEgPQBMgGA4AGQDEAXhqCGQhLBhiNBQQhxBAiUAVQhCAJhFAAQhEAAhHgJg");
	this.shape_2.setTransform(236.4,311.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AkRPyQhzgfiQgxQgtgPjQhKQmViRkdh+QjZhfhug7QixhdhpheQhCg7ghggQg2g3gbgtQguhMBZAHQAsADBzAiIBgAfQA6ATAoAJQAcAGA6ACQA9ADAaAEQAmAHA9AYQBHAcAaAHQBfAZBjAQQiehdhqhVQh+hlhLhsQhaiCg7hoQhHh+grhzQgyiEgLguQgjiRBEgMQATgEApAGIA9AHQA1AEBHgIQBGgHAxgBQA+AAA2AKQA4AKBNAgQBnAqAZAIQC4A8DJAYIBlANQA1AJApAQIEGBtQCYA8B+AcQCOAfBmA5QBeA0BZBaQAyAyAMBDQAFAeAABgQAAAtgPBsQgGBhAsAyQAXhqAjg6QA0hUBnguQBjgtCPgQQB9gPCGAJQCXAKCJgCQAfgBBlgJQBTgHAxADQA+AEA/AWQAbAJBWAlQA0AXBGAVQAlALBaAYQBdAYAiANQBLAeAHAlQAIAngpAzQggAng1AkQjYCYktCXQhzA6igBFIkcB3IkwCAQgmAQhAAkQhCAlgeAOg");
	this.shape_3.setTransform(234,210);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_3},{t:this.shape_2}]},4).to({state:[]},3).to({state:[{t:this.shape_3},{t:this.shape_2}]},3).to({state:[]},6).to({state:[{t:this.shape_3},{t:this.shape_2}]},4).to({state:[]},3).to({state:[{t:this.shape_3},{t:this.shape_2}]},2).to({state:[]},2).wait(1));

	// Layer 1
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AMHGoIh2gQQhDgLgwgTQgpgQgwgeIhSg5QgdAig1AbIgoAVQhiBDi7gZQiWgUiEg+Qg8gcgUgMQgxgcgXgeQg8A5hjgWQhigVgphLQi2AKi2hZQi2hZiPimQg0g8gZgfQgRgWgHgPQgNgdAYgDQATgCANAYQAIANAKAaQARAeAnAvQBDBPBRBAQC1CPDDAiQBFAMBEgDQgFgSgBgWQg+AFhVgZQgwgPg0gcQg1gcgqghQhQhBgyhjQgrhUgXhzQgDgOAHgLQAHgNAPADQAOADADARQADAJAAAUIABAsQABAbAFARQAMAqAZAvQAxBbBKA8QAoAgAyAaQAyAaAuAPQBPAYA+gFQAPhPB0ARQBoARBMBBQAVgeAjgXQAhgWAjgJQAZgGAbgDINYAFQB1AGDtATQBQAGAyAAQBDABA/gIICEgPQBMgGA4AGQDDAXhpCGQhLBhiNBQQhxBAiUAVQhCAJhFAAQhFAAhHgJg");
	this.shape_4.setTransform(236.2,311.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AjrYPQh1gviRhKQg+ggjDhoQmWjXkrjDQjfiShyhZQi2iOhviPQhIhegggvQg6hUgehFQgyh1BaALQAtAFB1A0QAhAQBCAhQA7AcAoAOQAdAJA6ADQA+AEAbAHQAmALA/AkQBJAqAbALQBkApBhAWQikiNhviDQiEibhSinQhhjIhCiiQhPjCgyiyQg7jVgMhAQgsjiBFgTQATgFAqAIIA+ALQAfAEAggCQAZgCAlgGQBHgLAygBQA/AAA3APQA6AQBQAyQBrBCAZAMQBjAwBdAfQBhAhBqATIBnAUQA2ANAqAaIEOCpQCeBdCBArQCQAxBpBYQBiBRBeCLQAzBMAPBoQAGAtAECUQABBGgLCmQgCCVAuBNQAUikAhhYQAxiBBmhIQBihECQgZQB9gWCJANQCWAPCMgEQAgAABmgOQBTgLAyAFQA+AGBAAhQAeAQBVA3QA2AkBHAgQApATBYAjQBgAmAgATQBMAuAJA6QAJA8gpBNQgfA7g0A4QjWDmkrDoQhyBYifBpIkZC1IksDCQgmAZg+A2QhBA5geAUg");
	this.shape_5.setTransform(230,155.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).to({state:[]},4).to({state:[{t:this.shape_5},{t:this.shape_4}]},12).to({state:[]},4).wait(8));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,459.9,355.1);


// stage content:
(lib.swedeshdrhome2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// butterfly 2
	this.instance = new lib.butterlfyflap();
	this.instance.parent = this;
	this.instance.setTransform(2930.6,119.5,0.09,0.09,47.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(94).to({guide:{path:[2930.6,119.4,2914.9,126.6,2895.3,132.5,2827.8,152.8,2739,151.9,2688.7,151.2,2615.4,141.1,2589.2,137.4,2478.9,119.5,2467,117.6,2455.7,115.8]}},85,cjs.Ease.quadInOut).wait(18).to({guide:{path:[2455.7,115.9,2383.3,104.5,2334.5,99.2,2253.4,90.5,2187.2,91.9,2147,92.9,2107.8,100.6]}},66,cjs.Ease.quadInOut).wait(16).to({guide:{path:[2107.7,100.8,2088.1,104.6,2068.8,110.2,2030.2,121.4,1973.2,146.7,1934.6,163.8,1929.2,166.1,1904.5,176.7,1885.2,183.3,1835.5,200.4,1789.3,202,1784.7,202.1,1780,202]}},67,cjs.Ease.quadInOut).wait(24).to({guide:{path:[1780,201.9,1746.9,200.8,1711.1,183.7,1695.5,176.3,1674.4,163.5,1649.6,148.1,1636.7,140.2,1587.9,110.2,1550.7,97.2,1496.8,78.1,1437.5,80.1,1380.6,82,1311.5,90.7,1293.5,93,1197.6,106.8,1133.4,116.2,1096.2,118.6,1045,122,1007.7,116,920.6,102,811.8,102.6,692,103.3,565.9,122,496.7,132.2,413,135.7,322.8,139.4,239.3,134.2,146.3,128.4,76.5,112.1,-1.8,94,-43.8,64.1]}},232,cjs.Ease.quadInOut).to({_off:true},1).wait(95));

	// butterfly
	this.instance_1 = new lib.butterlfyflap();
	this.instance_1.parent = this;
	this.instance_1.setTransform(-43.6,135.6,0.109,0.109,0,-27.8,152.2,31.4,59.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:59.6,guide:{path:[-43.6,135.5,-39.2,137.1,-34.5,138.7,7.6,153.3,50.9,162.2,111.5,174.6,165.8,173.9,231.3,173,284.2,153.2]}},42,cjs.Ease.quadInOut).wait(7).to({regX:31.7,regY:60,guide:{path:[284.3,153.2,286.3,152.4,288.3,151.6,337.8,132.3,357.8,125.6,394.8,113.3,423.1,109.7,457,105.3,486.5,112,519.3,119.2,550.1,140.8,573.6,157.1,597.5,176.3,610.6,186.8,630.7,203.4,646.2,215.8,655.8,220.9,667.6,227.2,678.9,227.6,709.7,228.8,737.7,214.9]}},60,cjs.Ease.quadInOut).wait(11).to({regX:31.9,regY:60.4,guide:{path:[737.7,214.9,744.8,211.4,751.6,207,764.9,198.5,781.4,184,791.1,175.6,810.9,157.3,829.2,140.7,843,130.2,861.9,115.9,880.8,106.4,927.2,82.9,985.7,82.1,1067.5,80.9,1147.1,98.3,1167.1,102.7,1199.3,110.4,1224.6,116,1239.6,116,1247.1,116,1254.5,115.6]}},60,cjs.Ease.quadInOut).wait(8).to({regX:31.4,regY:59.5,guide:{path:[1254.5,115.6,1296.9,113.5,1335.5,99,1377.5,83.3,1410.5,55,1441.8,28.2,1460,-5.4,1474.8,-32.8,1478.5,-60.2]}},25,cjs.Ease.quadOut).to({_off:true},89).wait(396));

	// clouds large
	this.instance_2 = new lib.cloudslarge_1();
	this.instance_2.parent = this;
	this.instance_2.setTransform(1427,108.6,1,1,0,0,0,333.7,47.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({x:1465},419,cjs.Ease.quadIn).to({x:1427},278,cjs.Ease.quadOut).wait(1));

	// clouds small
	this.instance_3 = new lib.cloudssmall_1();
	this.instance_3.parent = this;
	this.instance_3.setTransform(1505.2,123,1,1,0,0,0,455.7,25.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({x:1524.2},299,cjs.Ease.quadInOut).to({x:1505.2},398,cjs.Ease.quadOut).wait(1));

	// bkgrd
	this.instance_4 = new lib.animationheaderhome01();
	this.instance_4.parent = this;
	this.instance_4.setTransform(0,1);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(698));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1351.9,308.5,3046.4,615);
// library properties:
lib.properties = {
	id: '5B27E6CCEB9D4A8B977E37A63AE86E9C',
	width: 2880,
	height: 615,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [
		{src:"/themes/swedishamerican/images/swedes_hdr_home_2_atlas_.png", id:"swedes_hdr_home_2_atlas_"}
	],
	preloads: []
};

// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5B27E6CCEB9D4A8B977E37A63AE86E9C'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;