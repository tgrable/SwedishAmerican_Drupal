var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation, headerHeight;
function init() {
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		var d = document.getElementById("animation_container");
		d.className += "header-banner ios-header";
	}
	
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp=AdobeAn.getComposition("BE0D6CDF443D4F89BE86B6403F24C10B");
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
	exportRoot = new lib.SAHFall2017animation();
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
	makeResponsive(true,'both',false,1);	
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
lib.ssMetadata = [];



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



(lib.Artboard1 = function() {
	this.initialize(img.Artboard1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2560,615);


(lib.Tween14 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Al4CzIgPgMIAPACQAnAAAggYQAXgRAdgmQARgWASgoIAchBIAhhBQAVgnAUgUQAcgdAlgSQAlgSAngGQAjgEAkAHQAmAHAdASIAAABQgvgBg+AnQgzAgggArQgOATgHANQAZgaAqgeQAsgeAlgPQApgQAxgJQA0gKAoADQAvACAfAOIAAAAQAVAPANAXIgCABQhFgXhMACQgdAAgPABIgDABQAKBXgXA9QgYA+hFA+QhgBWiEAYQgnAHgjAAQhiAAhEg3g");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-39.1,-23.4,78.4,46.8);


(lib.Tween13 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Al4CzIgPgMIAPACQAnAAAggYQAXgRAdgmQARgWASgoIAchBIAhhBQAVgnAUgUQAcgdAlgSQAlgSAngGQAjgEAkAHQAmAHAdASIAAABQgvgBg+AnQgzAgggArQgOATgHANQAZgaAqgeQAsgeAlgPQApgQAxgJQA0gKAoADQAvACAfAOIAAAAQAVAPANAXIgCABQhFgXhMACQgdAAgPABIgDABQAKBXgXA9QgYA+hFA+QhgBWiEAYQgnAHgjAAQhiAAhEg3g");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-39.1,-23.4,78.4,46.8);


(lib.Tween12 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("ABrCJQgtgMgug4IgggwQgUgcgRgQQgxgrg4ABQgWAAgcAKIgEgLQARgGAPgCQAugFAlAPQAmAQAkAtQAIAKAPAaQAPAYAKAMIABAAQgHgLgSgiQgOgagMgQQgqg1gtgMQghgIgUAGQAlgwAsgHQAygGAxAlQAkAaAcA5IAUArQAMAbAMAPQAhAtAwAIIAJACIgJAGQggAVgiAAQgPAAgQgEg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.3,-14.1,42.7,28.3);


(lib.Tween11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("ABrCJQgtgMgug4IgggwQgUgcgRgQQgxgrg4ABQgWAAgcAKIgEgLQARgGAPgCQAugFAlAPQAmAQAkAtQAIAKAPAaQAPAYAKAMIABAAQgHgLgSgiQgOgagMgQQgqg1gtgMQghgIgUAGQAlgwAsgHQAygGAxAlQAkAaAcA5IAUArQAMAbAMAPQAhAtAwAIIAJACIgJAGQggAVgiAAQgPAAgQgEg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-21.3,-14.1,42.7,28.3);


(lib.Tween10 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ai8DMQgXhaAghLQAdhEBDgxQAZgUAtgTQgwAPgpAbQg0AlghAvQgTAcgMAfIgBAAQgYgnAIg2QAIgxAdgpQAyhGBWgSQA3gLA9AMQBAANArAhQAzAlAaBEIgFgFQgngdg5ARQguAOg/BOQg7BMgzALQguAKg1gTQgMAzAYA4IgCABg");
	this.shape.setTransform(-0.4,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AAkA+QgBgYgFgNQgIgZgUgXQgRgWgYgQIAAAAQAqgDAeAeQAMA1gJArg");
	this.shape_1.setTransform(20.2,-0.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.2,-20.9,48.5,41.9);


(lib.Tween9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ai8DMQgXhaAghLQAdhEBDgxQAZgUAtgTQgwAPgpAbQg0AlghAvQgTAcgMAfIgBAAQgYgnAIg2QAIgxAdgpQAyhGBWgSQA3gLA9AMQBAANArAhQAzAlAaBEIgFgFQgngdg5ARQguAOg/BOQg7BMgzALQguAKg1gTQgMAzAYA4IgCABg");
	this.shape.setTransform(-0.4,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AAkA+QgBgYgFgNQgIgZgUgXQgRgWgYgQIAAAAQAqgDAeAeQAMA1gJArg");
	this.shape_1.setTransform(20.2,-0.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.2,-20.9,48.5,41.9);


(lib.Tween7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ak6B/QANgVAPgSQAsgxA3gSQA3gSBRAPQATAEApANQAnAMAWADIAAAAQgRgFgzgUQgpgQgbgFQhggSg7AcQgWALgLAJQgQALgKARQgGhWArgwQAYgcAmgPQAigOAogDQA9gFBVAiIA+AdQAmASAbAGQBPAQA6gjIAMgHIgEAOQgVBMhEAhQgjARgtACQgkABgugIQgQgDg/gSQgygNgggBQhdgBg8A2QgZAXgTAig");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.4,-13.4,63,26.8);


(lib.Tween5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgeB6QhAgUgkgkQghgjgTg7IgCAAIgdAMQg0AWgnAiIgBAAQACgTAJgQQAPgQAggRQAagOAlgIQAngJAdgBQAeAAAlAGQAmAHAXAKQgIgGgPgJQgigTgrgGQg0gIghAPIAAgBQAPgUAWgQQAXgQAZgHQA7gRA2AWQAUAIAZAUIAqAiIAmAjQAXAWASAIQAeARAVAFQAcAGAagMIAKgFIgGAMQgoBOhqAZQgrAKgoAAQg0AAgxgQg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-30.6,-13.8,61.2,27.6);


(lib.Tween3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AEMFIQAnhYgVhPQhTAdhJgQQgzgLgvgpQgdgagug7Qgyg+gZgYQgugsgygPQhZgbg9AvIgJAHQAqhqBPg7QBFgzBjgUQBhgUBWASQBCANA2AkQA4AjAnA2QAtBAAMBOQAMBVgmA9QgVg0gcgpQgZgkgkgkQgjgigmgaQg9gqhOgYQBCAcAsAgQAxAkAnAvQAoAwAXA2QAyB3glCMQgMADgOAGg");
	this.shape.setTransform(0.7,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("Ag0g1IAAgBQAvguBEADIAAABQgmAZgbAiQghAlgMAnQgGAUgCAnIgBAAQgOhGAShRg");
	this.shape_1.setTransform(-31.7,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-38,-32.9,76.1,65.8);


(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ak6B/QANgVAPgSQAsgxA3gSQA3gSBRAPQATAEApANQAnAMAWADIAAAAQgRgFgzgUQgpgQgbgFQhggSg7AcQgWALgLAJQgQALgKARQgGhWArgwQAYgcAmgPQAigOAogDQA9gFBVAiIA+AdQAmASAbAGQBPAQA6gjIAMgHIgEAOQgVBMhEAhQgjARgtACQgkABgugIQgQgDg/gSQgygNgggBQhdgBg8A2QgZAXgTAig");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.4,-13.4,63,26.8);


// stage content:
(lib.SAHFall2017animation = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// leaf 5
	this.instance = new lib.Tween9("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(1459,-70.4);
	this.instance._off = true;

	this.instance_1 = new lib.Tween10("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(1435.6,658.7);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(88).to({_off:false},0).wait(1).to({rotation:7.1,x:1462.6,y:-62.3},0).wait(1).to({rotation:13.9,x:1466.2,y:-54.5},0).wait(1).to({rotation:20.5,x:1469.6,y:-46.9},0).wait(1).to({rotation:27,x:1472.9,y:-39.5},0).wait(1).to({rotation:33.2,x:1476.1,y:-32.3},0).wait(1).to({rotation:39.3,x:1479.2,y:-25.4},0).wait(1).to({rotation:45.2,x:1482.2,y:-18.6},0).wait(1).to({rotation:51,x:1485.2,y:-12},0).wait(1).to({rotation:56.7,x:1488.1,y:-5.5},0).wait(1).to({rotation:62.3,x:1491,y:1},0).wait(1).to({rotation:67.9,x:1493.9,y:7.4},0).wait(1).to({rotation:73.4,x:1496.7,y:13.7},0).wait(1).to({rotation:79,x:1499.6,y:20.1},0).wait(1).to({rotation:84.6,x:1502.5,y:26.5},0).wait(1).to({rotation:90.2,x:1497.5,y:31.5},0).wait(1).to({rotation:96,x:1491,y:36.7},0).wait(1).to({rotation:101.8,x:1484.4,y:41.7},0).wait(1).to({rotation:107.7,x:1477.6,y:46.3},0).wait(1).to({rotation:113.8,x:1470.8,y:50.7},0).wait(1).to({rotation:120,x:1464,y:54.8},0).wait(1).to({rotation:126.3,x:1457.4,y:58.5},0).wait(1).to({rotation:132.8,x:1451.1,y:61.8},0).wait(1).to({rotation:139.4,x:1444.3,y:65},0).wait(1).to({rotation:146.2,x:1437.2,y:68.1},0).wait(1).to({rotation:153.1,x:1429.7,y:71},0).wait(1).to({rotation:160.2,x:1421.9,y:73.6},0).wait(1).to({rotation:167.4,x:1413.6,y:76},0).wait(1).to({rotation:174.8,x:1404.9,y:77.9},0).wait(1).to({rotation:182.3,x:1395.9,y:79.3},0).wait(1).to({rotation:190,x:1386.4,y:80.2},0).wait(1).to({rotation:197.8,x:1377.5,y:81.6},0).wait(1).to({rotation:205.8,x:1384.4,y:92.5},0).wait(1).to({rotation:213.9,x:1392.2,y:100.8},0).wait(1).to({rotation:222.1,x:1400.2,y:108.3},0).wait(1).to({rotation:230.5,x:1408.9,y:115.5},0).wait(1).to({rotation:239,x:1417.9,y:122.3},0).wait(1).to({rotation:247.6,x:1427.2,y:128.6},0).wait(1).to({rotation:256.3,x:1436.5,y:134.5},0).wait(1).to({rotation:265.1,x:1445.8,y:139.7},0).wait(1).to({rotation:274,x:1455.5,y:144.7},0).wait(1).to({rotation:283.1,x:1465.6,y:149.2},0).wait(1).to({rotation:292.2,x:1476.2,y:153.4},0).wait(1).to({rotation:301.5,x:1487.1,y:157},0).wait(1).to({rotation:311,x:1498.5,y:160.2},0).wait(1).to({rotation:326,x:1516.9,y:163.9},0).wait(1).to({rotation:340,x:1533.9,y:165.7},0).wait(1).to({rotation:353.1,x:1550.1,y:166},0).wait(1).to({rotation:365.3,x:1565.3,y:165.1},0).wait(1).to({rotation:376.7,x:1579.6,y:163},0).wait(1).to({rotation:387.5,x:1563.1,y:174.5},0).wait(1).to({rotation:397.6,x:1551.7,y:180.5},0).wait(1).to({rotation:407.2,x:1540.6,y:186},0).wait(1).to({rotation:416.2,x:1530,y:190.9},0).wait(1).to({rotation:424.8,x:1520,y:195.3},0).wait(1).to({rotation:433,x:1511,y:199},0).wait(1).to({rotation:440.8,x:1504.4,y:201.7},0).wait(1).to({rotation:448.2,x:1497.5,y:204.3},0).wait(1).to({rotation:455.2,x:1490.9,y:206.6},0).wait(1).to({rotation:462,x:1484.5,y:208.7},0).wait(1).to({rotation:468.4,x:1478.3,y:210.7},0).wait(1).to({rotation:474.6,x:1472.2,y:212.4},0).wait(1).to({rotation:480.5,x:1466.3,y:214},0).wait(1).to({rotation:486.2,x:1460.5,y:215.4},0).wait(1).to({rotation:491.7,x:1454.9,y:216.6},0).wait(1).to({rotation:496.9,x:1449.3,y:217.6},0).wait(1).to({rotation:502,x:1443.9,y:218.4},0).wait(1).to({rotation:506.9,x:1438.5,y:219.1},0).wait(1).to({rotation:511.7,x:1433.2,y:219.5},0).wait(1).to({rotation:516.3,x:1428,y:219.8},0).wait(1).to({rotation:520.9,x:1422.8},0).wait(1).to({rotation:525.3,x:1417.6,y:219.6},0).wait(1).to({rotation:529.6,x:1412.5,y:219.2},0).wait(1).to({rotation:533.9,x:1407.3,y:218.4},0).wait(1).to({rotation:538.1,x:1405.4,y:223.5},0).wait(1).to({rotation:542.3,x:1406.6,y:229.3},0).wait(1).to({rotation:546.6,x:1408.5,y:235},0).wait(1).to({rotation:550.9,x:1410.4,y:240},0).wait(1).to({rotation:555.3,x:1412.7,y:245.1},0).wait(1).to({rotation:559.8,x:1415.4,y:250.3},0).wait(1).to({rotation:564.7,x:1418.6,y:255.6},0).wait(1).to({rotation:569.9,x:1422.3,y:261.2},0).wait(1).to({rotation:575.5,x:1426.6,y:266.8},0).wait(1).to({rotation:581.3,x:1431.4,y:272.3},0).wait(1).to({rotation:587.3,x:1436.6,y:277.4},0).wait(1).to({rotation:593.6,x:1442.3,y:282.4},0).wait(1).to({rotation:600,x:1448.8,y:287.2},0).wait(1).to({rotation:606.8,x:1456.1,y:291.6},0).wait(1).to({rotation:613.8,x:1464,y:295.5},0).wait(1).to({rotation:621.1,x:1472.6,y:298.8},0).wait(1).to({rotation:628.7,x:1482,y:301.4},0).wait(1).to({rotation:636.6,x:1492.5,y:303.3},0).wait(1).to({rotation:644.7,x:1503.7,y:304.2},0).wait(1).to({rotation:653.2,x:1515.2,y:304.1},0).wait(1).to({rotation:662,x:1526.9,y:303},0).wait(1).to({rotation:671.2,x:1538.7,y:301.1},0).wait(1).to({rotation:680.7,x:1543,y:308.7},0).wait(1).to({rotation:690.6,x:1536.6,y:321.7},0).wait(1).to({rotation:700.8,x:1529.4,y:333.2},0).wait(1).to({rotation:711.4,x:1520.7,y:344.9},0).wait(1).to({rotation:722.3,x:1511.2,y:355.9},0).wait(1).to({rotation:733.7,x:1501.5,y:366},0).wait(1).to({rotation:745.4,x:1491.9,y:374.6},0).wait(1).to({rotation:757.5,x:1480.8,y:383},0).wait(1).to({rotation:769.9,x:1468.2,y:390.6},0).wait(1).to({rotation:782.6,x:1453.9,y:396.5},0).wait(1).to({rotation:795.7,x:1440,y:399},0).wait(1).to({rotation:809,x:1424.3,y:397.5},0).wait(1).to({rotation:822.5,x:1414.4,y:408},0).wait(1).to({rotation:836.2,x:1414.9,y:425.1},0).wait(1).to({rotation:850,x:1420.4,y:441.7},0).wait(1).to({rotation:863.9,x:1430.3,y:456.1},0).wait(1).to({rotation:877.7,x:1444.3,y:467.5},0).wait(1).to({rotation:891.3,x:1460.3,y:475.5},0).wait(1).to({rotation:904.7,x:1479.2,y:481.2},0).wait(1).to({rotation:917.9,x:1497.3,y:484.1},0).wait(1).to({rotation:930.6,x:1510.5,y:491},0).wait(1).to({rotation:943,x:1507.9,y:507.3},0).wait(1).to({rotation:954.8,x:1497.8,y:519.9},0).wait(1).to({rotation:966.1,x:1485.2,y:528.8},0).wait(1).to({rotation:976.8,x:1472.2,y:534.7},0).wait(1).to({rotation:986.9,x:1459.1,y:538.6},0).wait(1).to({rotation:996.4,x:1445.9,y:541.2},0).wait(1).to({rotation:1005.3,x:1433.9,y:542.5},0).wait(1).to({rotation:1013.5,x:1424.9,y:547.8},0).wait(1).to({rotation:1021.2,x:1426.6,y:576.8},0).wait(1).to({rotation:1028.3,x:1428.1,y:593.3},0).wait(1).to({rotation:1034.8,x:1429,y:602.3},0).wait(1).to({rotation:1040.8,x:1429.8,y:609.7},0).wait(1).to({rotation:1046.2,x:1430.6,y:616.5},0).wait(1).to({rotation:1051.1,x:1431.3,y:622.7},0).wait(1).to({rotation:1055.6,x:1431.9,y:628.3},0).wait(1).to({rotation:1059.6,x:1432.5,y:633.3},0).wait(1).to({rotation:1063.2,x:1433,y:637.8},0).wait(1).to({rotation:1066.4,x:1433.5,y:641.7},0).wait(1).to({rotation:1069.2,x:1433.9,y:645.2},0).wait(1).to({rotation:1071.6,x:1434.3,y:648.3},0).wait(1).to({rotation:1073.7,x:1434.6,y:650.9},0).wait(1).to({rotation:1075.5,x:1434.9,y:653},0).wait(1).to({rotation:1076.9,x:1435.1,y:654.8},0).wait(1).to({rotation:1078.1,x:1435.2,y:656.3},0).wait(1).to({rotation:1078.9,x:1435.4,y:657.4},0).wait(1).to({rotation:1079.5,x:1435.5,y:658.1},0).wait(1).to({rotation:1079.9,y:658.6},0).to({_off:true},1).wait(104));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(232).to({_off:false},0).to({startPosition:0},103).wait(1));

	// leaf 7
	this.instance_2 = new lib.Tween13("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(2049.3,-31.8);
	this.instance_2._off = true;

	this.instance_3 = new lib.Tween14("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(2025.3,692.7);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(110).to({_off:false},0).wait(1).to({rotation:6.3,x:2059,y:-10.2},0).wait(1).to({rotation:10.2,x:2064.9,y:2.9},0).wait(1).to({rotation:13.1,x:2069.4,y:12.9},0).wait(1).to({rotation:15.5,x:2073.1,y:21.2},0).wait(1).to({rotation:17.5,x:2076.3,y:28.3},0).wait(1).to({rotation:19.4,x:2079.1,y:34.6},0).wait(1).to({rotation:21.1,x:2081.7,y:40.3},0).wait(1).to({rotation:22.6,x:2084.1,y:45.7},0).wait(1).to({rotation:24.1,x:2086.3,y:50.7},0).wait(1).to({rotation:25.5,x:2088.5,y:55.5},0).wait(1).to({rotation:26.8,x:2090.5,y:60.1},0).wait(1).to({rotation:28.1,x:2092.5,y:64.6},0).wait(1).to({rotation:29.4,x:2090,y:68.1},0).wait(1).to({rotation:30.7,x:2085.9,y:71.6},0).wait(1).to({rotation:31.9,x:2081.6,y:75.1},0).wait(1).to({rotation:33.2,x:2077.4,y:78.3},0).wait(1).to({rotation:34.4,x:2073.1,y:81.4},0).wait(1).to({rotation:35.7,x:2068.8,y:84.3},0).wait(1).to({rotation:37,x:2064.5,y:87.1},0).wait(1).to({rotation:38.3,x:2060.2,y:89.8},0).wait(1).to({rotation:39.7,x:2055.8,y:92.4},0).wait(1).to({rotation:41,x:2051.4,y:95},0).wait(1).to({rotation:42.4,x:2047.4,y:97.2},0).wait(1).to({rotation:43.9,x:2043.1,y:99.4},0).wait(1).to({rotation:45.4,x:2038.6,y:101.7},0).wait(1).to({rotation:46.9,x:2033.8,y:103.9},0).wait(1).to({rotation:48.5,x:2028.8,y:106.1},0).wait(1).to({rotation:50.2,x:2023.4,y:108.3},0).wait(1).to({rotation:52,x:2017.7,y:110.4},0).wait(1).to({rotation:53.8,x:2011.6,y:112.3},0).wait(1).to({rotation:55.7,x:2005.2,y:114.2},0).wait(1).to({rotation:57.6,x:1998.3,y:115.8},0).wait(1).to({rotation:59.7,x:1990.9,y:117.2},0).wait(1).to({rotation:61.9,x:1983,y:118.3},0).wait(1).to({rotation:64.1,x:1974.6,y:118.9},0).wait(1).to({rotation:66.5,x:1968.8,y:122.7},0).wait(1).to({rotation:69,x:1975.4,y:131.8},0).wait(1).to({rotation:71.7,x:1982.9,y:139.8},0).wait(1).to({rotation:74.5,x:1991.2,y:147.4},0).wait(1).to({rotation:77.5,x:2000.5,y:155.1},0).wait(1).to({rotation:80.7,x:2010.6,y:162.6},0).wait(1).to({rotation:84,x:2021.4,y:169.7},0).wait(1).to({rotation:87.6,x:2032.9,y:176.5},0).wait(1).to({rotation:91.5,x:2045.3,y:182.9},0).wait(1).to({rotation:95.6,x:2059.1,y:189.1},0).wait(1).to({rotation:100.1,x:2074.7,y:194.7},0).wait(1).to({rotation:104.9,x:2092,y:199.5},0).wait(1).to({rotation:109.5,x:2108.9,y:202.7},0).wait(1).to({rotation:113.9,x:2124.7,y:204.3},0).wait(1).to({rotation:117.9,x:2139.8,y:204.6},0).wait(1).to({rotation:121.8,x:2154.1,y:203.8},0).wait(1).to({rotation:125.4,x:2167.5,y:202},0).wait(1).to({rotation:128.7,x:2156.2,y:211.5},0).wait(1).to({rotation:132,x:2145.5,y:217.2},0).wait(1).to({rotation:135,x:2135,y:222.6},0).wait(1).to({rotation:137.9,x:2125,y:227.3},0).wait(1).to({rotation:140.6,x:2115.4,y:231.6},0).wait(1).to({rotation:143.2,x:2106.4,y:235.5},0).wait(1).to({rotation:145.7,x:2099.2,y:238.4},0).wait(1).to({rotation:148.1,x:2092.9,y:240.9},0).wait(1).to({rotation:150.4,x:2086.5,y:243.3},0).wait(1).to({rotation:152.5,x:2080.5,y:245.4},0).wait(1).to({rotation:154.6,x:2074.5,y:247.4},0).wait(1).to({rotation:156.6,x:2068.7,y:249.2},0).wait(1).to({rotation:158.6,x:2063.1,y:250.8},0).wait(1).to({rotation:160.4,x:2057.6,y:252.3},0).wait(1).to({rotation:162.2,x:2052.2,y:253.6},0).wait(1).to({rotation:163.9,x:2047,y:254.8},0).wait(1).to({rotation:165.5,x:2041.8,y:255.8},0).wait(1).to({rotation:167.1,x:2036.7,y:256.6},0).wait(1).to({rotation:168.7,x:2031.7,y:257.3},0).wait(1).to({rotation:170.2,x:2026.7,y:257.8},0).wait(1).to({rotation:171.7,x:2021.8,y:258.2},0).wait(1).to({rotation:173.1,x:2017,y:258.4},0).wait(1).to({rotation:174.5,x:2012.1},0).wait(1).to({rotation:175.9,x:2007.3,y:258.1},0).wait(1).to({rotation:177.2,x:2002.5,y:257.7},0).wait(1).to({rotation:178.5,x:1997.7,y:257},0).wait(1).to({rotation:179.9,x:1995.6,y:261.6},0).wait(1).to({rotation:181.2,x:1996.7,y:267},0).wait(1).to({rotation:182.5,x:1998.4,y:272.5},0).wait(1).to({rotation:183.9,x:2000.2,y:277.3},0).wait(1).to({rotation:185.3,x:2002.3,y:282.1},0).wait(1).to({rotation:186.7,x:2004.7,y:287},0).wait(1).to({rotation:188.2,x:2007.6,y:292.1},0).wait(1).to({rotation:189.9,x:2011,y:297.4},0).wait(1).to({rotation:191.6,x:2014.9,y:302.8},0).wait(1).to({rotation:193.4,x:2019.2,y:308},0).wait(1).to({rotation:195.3,x:2023.9,y:313.1},0).wait(1).to({rotation:197.2,x:2029,y:317.9},0).wait(1).to({rotation:199.2,x:2034.7,y:322.6},0).wait(1).to({rotation:201.3,x:2041.1,y:327},0).wait(1).to({rotation:203.5,x:2048.2,y:331.1},0).wait(1).to({rotation:205.7,x:2055.9,y:334.7},0).wait(1).to({rotation:208.1,x:2064.1,y:337.7},0).wait(1).to({rotation:210.5,x:2073.1,y:340.2},0).wait(1).to({rotation:213,x:2083.2,y:341.9},0).wait(1).to({rotation:215.6,x:2093.7,y:342.8},0).wait(1).to({rotation:218.3,x:2104.6,y:342.7},0).wait(1).to({rotation:221,x:2115.7,y:341.8},0).wait(1).to({rotation:223.9,x:2126.9,y:340},0).wait(1).to({rotation:226.9,x:2134.2,y:344.1},0).wait(1).to({rotation:230,x:2128.7,y:357},0).wait(1).to({rotation:233.2,x:2122.4,y:367.7},0).wait(1).to({rotation:236.5,x:2114.5,y:378.9},0).wait(1).to({rotation:239.9,x:2105.9,y:389.5},0).wait(1).to({rotation:243.4,x:2096.8,y:399.5},0).wait(1).to({rotation:247.1,x:2087.8,y:408.2},0).wait(1).to({rotation:250.8,x:2078.2,y:416.4},0).wait(1).to({rotation:254.7,x:2067.3,y:424.1},0).wait(1).to({rotation:258.6,x:2054.8,y:431},0).wait(1).to({rotation:262.7,x:2041.6,y:435.8},0).wait(1).to({rotation:266.8,x:2028.1,y:437.7},0).wait(1).to({rotation:271,x:2013.1,y:435.6},0).wait(1).to({rotation:275.3,x:2004.6,y:447},0).wait(1).to({rotation:279.6,x:2005.1,y:463.1},0).wait(1).to({rotation:283.9,x:2010,y:478.9},0).wait(1).to({rotation:288.2,x:2018.8,y:492.6},0).wait(1).to({rotation:292.6,x:2031.4,y:503.9},0).wait(1).to({rotation:296.8,x:2045.8,y:512.1},0).wait(1).to({rotation:301.1,x:2063.1,y:518.2},0).wait(1).to({rotation:305.2,x:2080.3,y:521.7},0).wait(1).to({rotation:309.2,x:2096,y:523.8},0).wait(1).to({rotation:313.1,x:2101.1,y:537.3},0).wait(1).to({rotation:316.9,x:2094.5,y:551.6},0).wait(1).to({rotation:320.5,x:2084.7,y:561.4},0).wait(1).to({rotation:323.9,x:2072.4,y:569},0).wait(1).to({rotation:327.2,x:2060.7,y:573.9},0).wait(1).to({rotation:330.3,x:2048.4,y:577.4},0).wait(1).to({rotation:333.2,x:2036.4,y:579.7},0).wait(1).to({rotation:335.9,x:2025.4,y:580.9},0).wait(1).to({rotation:338.5,x:2015.6,y:582.2},0).wait(1).to({rotation:340.8,x:2016.1,y:606},0).wait(1).to({rotation:343,x:2018,y:627.4},0).wait(1).to({rotation:345.1,x:2018.9,y:636.8},0).wait(1).to({rotation:346.9,x:2019.7,y:643.9},0).wait(1).to({rotation:348.6,x:2020.4,y:650.3},0).wait(1).to({rotation:350.2,x:2021,y:656.1},0).wait(1).to({rotation:351.6,x:2021.6,y:661.4},0).wait(1).to({rotation:352.9,x:2022.1,y:666.2},0).wait(1).to({rotation:354.1,x:2022.6,y:670.6},0).wait(1).to({rotation:355.1,x:2023.1,y:674.5},0).wait(1).to({rotation:356,x:2023.5,y:677.9},0).wait(1).to({rotation:356.8,x:2023.9,y:680.9},0).wait(1).to({rotation:357.5,x:2024.2,y:683.6},0).wait(1).to({rotation:358.2,x:2024.4,y:685.8},0).wait(1).to({rotation:358.7,x:2024.7,y:687.7},0).wait(1).to({rotation:359.1,x:2024.9,y:689.3},0).wait(1).to({rotation:359.4,x:2025,y:690.6},0).wait(1).to({rotation:359.7,x:2025.1,y:691.5},0).wait(1).to({rotation:359.9,x:2025.2,y:692.2},0).wait(1).to({rotation:360,x:2025.3,y:692.6},0).to({_off:true},1).wait(73));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(263).to({_off:false},0).to({guide:{path:[2025.3,692.7,2022,666.1,2019.2,639.5,2016.2,610.5,2015.5,596,2014.7,581.5,2016.1,581.5,2025.3,581.2,2033.6,580.1]}},72).wait(1));

	// leaf 6
	this.instance_4 = new lib.Tween11("synched",0);
	this.instance_4.parent = this;
	this.instance_4.setTransform(1843.3,-102.9);
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween12("synched",0);
	this.instance_5.parent = this;
	this.instance_5.setTransform(1835.9,702);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_4}]},183).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(183).to({_off:false},0).wait(1).to({rotation:-8,x:1856.1,y:-74.3},0).wait(1).to({rotation:-14.6,x:1866.5,y:-50.9},0).wait(1).to({rotation:-20.4,x:1875.9,y:-30},0).wait(1).to({rotation:-25.8,x:1884.5,y:-10.8},0).wait(1).to({rotation:-30.8,x:1875.2,y:3.7},0).wait(1).to({rotation:-35.6,x:1858,y:15.8},0).wait(1).to({rotation:-40.1,x:1842.2,y:25.2},0).wait(1).to({rotation:-44.5,x:1828.3,y:32.1},0).wait(1).to({rotation:-48.6,x:1814.9,y:37.7},0).wait(1).to({rotation:-52.5,x:1801.3,y:42.1},0).wait(1).to({rotation:-56.3,x:1787.7,y:45.2},0).wait(1).to({rotation:-59.9,x:1774,y:47.1},0).wait(1).to({rotation:-63.4,x:1761.6,y:49},0).wait(1).to({rotation:-66.8,x:1771.2,y:62.6},0).wait(1).to({rotation:-70,x:1780.3,y:71.8},0).wait(1).to({rotation:-73,x:1790.2,y:80.4},0).wait(1).to({rotation:-76,x:1799.9,y:87.9},0).wait(1).to({rotation:-78.8,x:1809.3,y:94.5},0).wait(1).to({rotation:-81.5,x:1818.3,y:100.2},0).wait(1).to({rotation:-84,x:1826.7,y:105.1},0).wait(1).to({rotation:-86.4,x:1834.7,y:109.4},0).wait(1).to({rotation:-88.7,x:1842.6,y:113.2},0).wait(1).to({rotation:-90.9,x:1850.2,y:116.5},0).wait(1).to({rotation:-93,x:1857.6,y:119.5},0).wait(1).to({rotation:-94.9,x:1864.6,y:122},0).wait(1).to({rotation:-96.7,x:1871.3,y:124.1},0).wait(1).to({rotation:-98.4,x:1877.5,y:126},0).wait(1).to({rotation:-99.9,x:1883.4,y:127.5},0).wait(1).to({rotation:-101.3,x:1888.7,y:128.7},0).wait(1).to({rotation:-102.6,x:1893.4,y:129.7},0).wait(1).to({rotation:-103.8,x:1897.8,y:130.4},0).wait(1).to({rotation:-104.8,x:1901.6,y:131.1},0).wait(1).to({rotation:-105.7,x:1905,y:131.5},0).wait(1).to({rotation:-106.5,x:1907.9,y:131.9},0).wait(1).to({rotation:-107.1,x:1910.3,y:132.2},0).wait(1).to({rotation:-107.6,x:1912.1,y:132.3},0).wait(1).to({rotation:-107.9,x:1913.4,y:132.5},0).wait(1).to({rotation:-108.1,x:1914.2},0).wait(1).to({x:1914.3},0).wait(1).to({rotation:-108,x:1914.4},0).wait(1).to({rotation:-107.8,x:1913.4},0).wait(1).to({rotation:-107.4,x:1911.8,y:132.3},0).wait(1).to({rotation:-106.8,x:1909.6,y:132.1},0).wait(1).to({rotation:-106,x:1906.8,y:131.8},0).wait(1).to({rotation:-105.1,x:1903.3,y:131.3},0).wait(1).to({rotation:-104,x:1899.2,y:130.7},0).wait(1).to({rotation:-106.3,x:1907.6,y:131.9},0).wait(1).to({rotation:-110.9,x:1925.3,y:133.1},0).wait(1).to({rotation:-115.2,x:1941.9,y:132.8},0).wait(1).to({rotation:-119.2,x:1957.6,y:131.1},0).wait(1).to({rotation:-123,x:1953,y:138.3},0).wait(1).to({rotation:-126.5,x:1939.2,y:145.8},0).wait(1).to({rotation:-129.9,x:1927.1,y:151.9},0).wait(1).to({rotation:-133,x:1915.6,y:157.3},0).wait(1).to({rotation:-136.1,x:1904.7,y:162.1},0).wait(1).to({rotation:-138.9,x:1894.7,y:166.3},0).wait(1).to({rotation:-141.6,x:1887.6,y:169.1},0).wait(1).to({rotation:-144.2,x:1880,y:171.9},0).wait(1).to({rotation:-146.7,x:1872.9,y:174.4},0).wait(1).to({rotation:-149,x:1865.9,y:176.7},0).wait(1).to({rotation:-151.3,x:1859.1,y:178.7},0).wait(1).to({rotation:-153.4,x:1852.4,y:180.6},0).wait(1).to({rotation:-155.5,x:1845.9,y:182.2},0).wait(1).to({rotation:-157.4,x:1839.6,y:183.5},0).wait(1).to({rotation:-159.3,x:1833.4,y:184.7},0).wait(1).to({rotation:-161.2,x:1827.3,y:185.6},0).wait(1).to({rotation:-162.9,x:1821.3,y:186.3},0).wait(1).to({rotation:-164.6,x:1815.4,y:186.8},0).wait(1).to({rotation:-166.3,x:1809.6,y:186.9},0).wait(1).to({rotation:-167.9,x:1803.9,y:186.8},0).wait(1).to({rotation:-169.4,x:1798.2,y:186.4},0).wait(1).to({rotation:-170.9,x:1792.6,y:185.7},0).wait(1).to({rotation:-172.4,x:1789.3,y:189.7},0).wait(1).to({rotation:-173.8,x:1790.5,y:195.5},0).wait(1).to({rotation:-175.2,x:1792.3,y:201.6},0).wait(1).to({rotation:-176.5,x:1794.3,y:206.6},0).wait(1).to({rotation:-177.9,x:1796.4,y:211.4},0).wait(1).to({rotation:-179.2,x:1798.8,y:216.2},0).wait(1).to({rotation:-180.5,x:1801.4,y:220.8},0).wait(1).to({rotation:-181.9,x:1804.3,y:225.3},0).wait(1).to({rotation:-183.2,x:1807.4,y:229.7},0).wait(1).to({rotation:-184.6,x:1810.7,y:234},0).wait(1).to({rotation:-186,x:1814.4,y:238.2},0).wait(1).to({rotation:-187.5,x:1818.3,y:242.3},0).wait(1).to({rotation:-189.1,x:1822.7,y:246.4},0).wait(1).to({rotation:-190.8,x:1827.8,y:250.6},0).wait(1).to({rotation:-192.6,x:1833.4,y:254.6},0).wait(1).to({rotation:-194.5,x:1839.6,y:258.4},0).wait(1).to({rotation:-196.4,x:1846.4,y:261.8},0).wait(1).to({rotation:-198.4,x:1853.7,y:264.8},0).wait(1).to({rotation:-200.5,x:1861.4,y:267.3},0).wait(1).to({rotation:-202.6,x:1870.1,y:269.4},0).wait(1).to({rotation:-204.9,x:1879.5,y:270.8},0).wait(1).to({rotation:-207.2,x:1889.3,y:271.4},0).wait(1).to({rotation:-209.6,x:1899.4,y:271.2},0).wait(1).to({rotation:-212,x:1909.7,y:270.3},0).wait(1).to({rotation:-214.6,x:1920.1,y:268.7},0).wait(1).to({rotation:-217.3,x:1928.2,y:271.1},0).wait(1).to({rotation:-220.1,x:1923.6,y:283.5},0).wait(1).to({rotation:-222.9,x:1917.8,y:293.6},0).wait(1).to({rotation:-225.9,x:1910.6,y:304.2},0).wait(1).to({rotation:-229,x:1902.7,y:314.5},0).wait(1).to({rotation:-232.1,x:1894.1,y:324.2},0).wait(1).to({rotation:-235.4,x:1885.5,y:333.2},0).wait(1).to({rotation:-238.8,x:1876.7,y:341.1},0).wait(1).to({rotation:-242.4,x:1866.8,y:348.8},0).wait(1).to({rotation:-246,x:1855.5,y:356},0).wait(1).to({rotation:-249.7,x:1842.7,y:362},0).wait(1).to({rotation:-253.6,x:1830,y:365.5},0).wait(1).to({rotation:-257.5,x:1815.9,y:366},0).wait(1).to({rotation:-261.6,x:1800.8,y:365.2},0).wait(1).to({rotation:-265.7,x:1798,y:382.1},0).wait(1).to({rotation:-269.9,x:1800.4,y:398.5},0).wait(1).to({rotation:-274.2,x:1807.2,y:413.8},0).wait(1).to({rotation:-278.5,x:1818.4,y:427.1},0).wait(1).to({rotation:-282.9,x:1832.8,y:437.2},0).wait(1).to({rotation:-287.2,x:1849.9,y:444.6},0).wait(1).to({rotation:-291.6,x:1869,y:449.4},0).wait(1).to({rotation:-295.9,x:1887.2,y:451.8},0).wait(1).to({rotation:-300.2,x:1895,y:465.1},0).wait(1).to({rotation:-304.4,x:1887.3,y:481.3},0).wait(1).to({rotation:-308.4,x:1875,y:492.4},0).wait(1).to({rotation:-312.4,x:1859.9,y:500.4},0).wait(1).to({rotation:-316.2,x:1845.2,y:505.2},0).wait(1).to({rotation:-319.9,x:1829.3,y:508.4},0).wait(1).to({rotation:-323.4,x:1814.5,y:509.8},0).wait(1).to({rotation:-326.7,x:1810.7,y:528.7},0).wait(1).to({rotation:-329.8,x:1816.6,y:574.6},0).wait(1).to({rotation:-332.8,x:1819.5,y:595},0).wait(1).to({rotation:-335.5,x:1821.3,y:607.1},0).wait(1).to({rotation:-338.1,x:1822.8,y:617.3},0).wait(1).to({rotation:-340.5,x:1824.2,y:626.6},0).wait(1).to({rotation:-342.8,x:1825.5,y:635.3},0).wait(1).to({rotation:-344.8,x:1826.7,y:643.2},0).wait(1).to({rotation:-346.7,x:1827.8,y:650.6},0).wait(1).to({rotation:-348.5,x:1828.8,y:657.3},0).wait(1).to({rotation:-350,x:1829.8,y:663.5},0).wait(1).to({rotation:-351.5,x:1830.6,y:669.1},0).wait(1).to({rotation:-352.8,x:1831.4,y:674.1},0).wait(1).to({rotation:-354,x:1832.1,y:678.7},0).wait(1).to({rotation:-355,x:1832.7,y:682.8},0).wait(1).to({rotation:-356,x:1833.3,y:686.4},0).wait(1).to({rotation:-356.8,x:1833.8,y:689.6},0).wait(1).to({rotation:-357.5,x:1834.2,y:692.4},0).wait(1).to({rotation:-358.1,x:1834.6,y:694.7},0).wait(1).to({rotation:-358.6,x:1834.9,y:696.7},0).wait(1).to({rotation:-359.1,x:1835.2,y:698.4},0).wait(1).to({rotation:-359.4,x:1835.4,y:699.7},0).wait(1).to({rotation:-359.7,x:1835.6,y:700.7},0).wait(1).to({rotation:-359.9,x:1835.7,y:701.4},0).wait(1).to({rotation:-360,y:701.8},0).to({_off:true},1).wait(1));

	// leaf 5
	this.instance_6 = new lib.Tween9("synched",0);
	this.instance_6.parent = this;
	this.instance_6.setTransform(1618.8,-39.4);
	this.instance_6._off = true;

	this.instance_7 = new lib.Tween10("synched",0);
	this.instance_7.parent = this;
	this.instance_7.setTransform(1578.9,637.8);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(24).to({_off:false},0).wait(1).to({rotation:5.6,x:1627,y:-21.1},0).wait(1).to({rotation:9.1,x:1632.2,y:-9.4},0).wait(1).to({rotation:11.8,x:1636.2,y:-0.5},0).wait(1).to({rotation:14,x:1639.5,y:6.9},0).wait(1).to({rotation:16,x:1642.4,y:13.2},0).wait(1).to({rotation:17.7,x:1644.9,y:18.9},0).wait(1).to({rotation:19.2,x:1647.2,y:24},0).wait(1).to({rotation:20.7,x:1646.9,y:28.3},0).wait(1).to({rotation:22,x:1643,y:31.8},0).wait(1).to({rotation:23.3,x:1638.8,y:35.3},0).wait(1).to({rotation:24.5,x:1634.8,y:38.4},0).wait(1).to({rotation:25.7,x:1631,y:41.2},0).wait(1).to({rotation:26.8,x:1627.3,y:43.8},0).wait(1).to({rotation:27.9,x:1623.7,y:46.2},0).wait(1).to({rotation:29,x:1620.3,y:48.4},0).wait(1).to({rotation:30.1,x:1616.9,y:50.6},0).wait(1).to({rotation:31.1,x:1613.5,y:52.6},0).wait(1).to({rotation:32.2,x:1610.2,y:54.6},0).wait(1).to({rotation:33.3,x:1607.1,y:56.4},0).wait(1).to({rotation:34.3,x:1604.2,y:58},0).wait(1).to({rotation:35.4,x:1601.1,y:59.6},0).wait(1).to({rotation:36.5,x:1598,y:61.2},0).wait(1).to({rotation:37.6,x:1594.8,y:62.8},0).wait(1).to({rotation:38.7,x:1591.5,y:64.4},0).wait(1).to({rotation:39.8,x:1588.1,y:65.9},0).wait(1).to({rotation:41,x:1584.6,y:67.5},0).wait(1).to({rotation:42.2,x:1580.9,y:69},0).wait(1).to({rotation:43.4,x:1577.1,y:70.4},0).wait(1).to({rotation:44.7,x:1573.2,y:71.9},0).wait(1).to({rotation:45.9,x:1569,y:73.2},0).wait(1).to({rotation:47.3,x:1564.7,y:74.6},0).wait(1).to({rotation:48.6,x:1560.2,y:75.8},0).wait(1).to({rotation:50,x:1555.4,y:76.9},0).wait(1).to({rotation:51.5,x:1550.4,y:78},0).wait(1).to({rotation:53,x:1545.2,y:78.9},0).wait(1).to({rotation:54.6,x:1539.7,y:79.6},0).wait(1).to({rotation:56.2,x:1533.9,y:80.1},0).wait(1).to({rotation:57.9,x:1527.9,y:80.4},0).wait(1).to({rotation:59.6,x:1524,y:83.4},0).wait(1).to({rotation:61.4,x:1528.5,y:90.2},0).wait(1).to({rotation:63.3,x:1534,y:96.6},0).wait(1).to({rotation:65.3,x:1539.1,y:101.8},0).wait(1).to({rotation:67.4,x:1545.1,y:107.4},0).wait(1).to({rotation:69.6,x:1551.5,y:112.9},0).wait(1).to({rotation:71.8,x:1558.3,y:118.3},0).wait(1).to({rotation:74.2,x:1565.6,y:123.6},0).wait(1).to({rotation:76.7,x:1573.2,y:128.8},0).wait(1).to({rotation:79.3,x:1581.3,y:133.8},0).wait(1).to({rotation:82.1,x:1589.7,y:138.6},0).wait(1).to({rotation:85,x:1598.7,y:143.3},0).wait(1).to({rotation:88,x:1608.5,y:147.9},0).wait(1).to({rotation:91.3,x:1619.3,y:152.3},0).wait(1).to({rotation:94.8,x:1631,y:156.4},0).wait(1).to({rotation:98.4,x:1643.8,y:160},0).wait(1).to({rotation:102.4,x:1657.6,y:163},0).wait(1).to({rotation:106.5,x:1671.7,y:165},0).wait(1).to({rotation:110.3,x:1685.4,y:166},0).wait(1).to({rotation:114,x:1698.5},0).wait(1).to({rotation:117.4,x:1711,y:165.1},0).wait(1).to({rotation:120.7,x:1722.7,y:163.5},0).wait(1).to({rotation:123.8,x:1715.4,y:170.9},0).wait(1).to({rotation:126.8,x:1704.1,y:177.1},0).wait(1).to({rotation:129.6,x:1694.8,y:181.9},0).wait(1).to({rotation:132.3,x:1685.8,y:186.3},0).wait(1).to({rotation:134.8,x:1677.2,y:190.3},0).wait(1).to({rotation:137.3,x:1669,y:194},0).wait(1).to({rotation:139.6,x:1661.2,y:197.3},0).wait(1).to({rotation:141.9,x:1655.3,y:199.7},0).wait(1).to({rotation:144.1,x:1649.6,y:201.9},0).wait(1).to({rotation:146.1,x:1644.1,y:204},0).wait(1).to({rotation:148.1,x:1638.7,y:205.9},0).wait(1).to({rotation:150.1,x:1633.5,y:207.7},0).wait(1).to({rotation:151.9,x:1628.3,y:209.4},0).wait(1).to({rotation:153.7,x:1623.3,y:210.9},0).wait(1).to({rotation:155.4,x:1618.5,y:212.3},0).wait(1).to({rotation:157.1,x:1613.7,y:213.6},0).wait(1).to({rotation:158.7,x:1609,y:214.8},0).wait(1).to({rotation:160.3,x:1604.4,y:215.8},0).wait(1).to({rotation:161.8,x:1599.8,y:216.8},0).wait(1).to({rotation:163.3,x:1595.4,y:217.6},0).wait(1).to({rotation:164.7,x:1591,y:218.3},0).wait(1).to({rotation:166.1,x:1586.7,y:218.8},0).wait(1).to({rotation:167.4,x:1582.4,y:219.3},0).wait(1).to({rotation:168.7,x:1578.2,y:219.6},0).wait(1).to({rotation:170,x:1574,y:219.8},0).wait(1).to({rotation:171.2,x:1569.9},0).wait(1).to({rotation:172.4,x:1565.8,y:219.7},0).wait(1).to({rotation:173.6,x:1561.7,y:219.5},0).wait(1).to({rotation:174.8,x:1557.7,y:219.1},0).wait(1).to({rotation:176,x:1553.7,y:218.5},0).wait(1).to({rotation:177.1,x:1551,y:221.2},0).wait(1).to({rotation:178.2,x:1551.7,y:226},0).wait(1).to({rotation:179.3,x:1553,y:230.7},0).wait(1).to({rotation:180.5,x:1554.3,y:234.9},0).wait(1).to({rotation:181.6,x:1555.8,y:238.7},0).wait(1).to({rotation:182.7,x:1557.4,y:242.5},0).wait(1).to({rotation:183.9,x:1559.2,y:246.3},0).wait(1).to({rotation:185,x:1561.2,y:250.1},0).wait(1).to({rotation:186.2,x:1563.4,y:253.9},0).wait(1).to({rotation:187.5,x:1565.9,y:257.8},0).wait(1).to({rotation:188.8,x:1568.7,y:261.8},0).wait(1).to({rotation:190.2,x:1571.8,y:265.9},0).wait(1).to({rotation:191.7,x:1575.3,y:270.1},0).wait(1).to({rotation:193.2,x:1578.9,y:274},0).wait(1).to({rotation:194.8,x:1582.9,y:277.8},0).wait(1).to({rotation:196.4,x:1587.2,y:281.6},0).wait(1).to({rotation:198.1,x:1591.9,y:285.2},0).wait(1).to({rotation:199.8,x:1597,y:288.7},0).wait(1).to({rotation:201.6,x:1602.6,y:291.9},0).wait(1).to({rotation:203.5,x:1608.6,y:294.9},0).wait(1).to({rotation:205.3,x:1615,y:297.5},0).wait(1).to({rotation:207.3,x:1621.7,y:299.8},0).wait(1).to({rotation:209.3,x:1629.1,y:301.7},0).wait(1).to({rotation:211.4,x:1637.1,y:303.2},0).wait(1).to({rotation:213.5,x:1645.5,y:304},0).wait(1).to({rotation:215.7,x:1654.1,y:304.3},0).wait(1).to({rotation:218,x:1662.9,y:304},0).wait(1).to({rotation:220.3,x:1671.8,y:303.2},0).wait(1).to({rotation:222.7,x:1680.7,y:301.8},0).wait(1).to({rotation:225.2,x:1689.3,y:300.8},0).wait(1).to({rotation:227.8,x:1687.8,y:311.4},0).wait(1).to({rotation:230.4,x:1682.8,y:321.3},0).wait(1).to({rotation:233.1,x:1677.3,y:330.2},0).wait(1).to({rotation:235.9,x:1670.9,y:339.2},0).wait(1).to({rotation:238.7,x:1664.1,y:347.9},0).wait(1).to({rotation:241.7,x:1656.8,y:356.3},0).wait(1).to({rotation:244.7,x:1649.4,y:364},0).wait(1).to({rotation:247.8,x:1642.3,y:370.7},0).wait(1).to({rotation:251,x:1634.3,y:377.5},0).wait(1).to({rotation:254.2,x:1625.5,y:383.9},0).wait(1).to({rotation:257.6,x:1615.7,y:389.8},0).wait(1).to({rotation:260.9,x:1604.9,y:394.8},0).wait(1).to({rotation:264.4,x:1594.5,y:397.8},0).wait(1).to({rotation:267.9,x:1583.2,y:399.1},0).wait(1).to({rotation:271.5,x:1570.9,y:397.7},0).wait(1).to({rotation:275.1,x:1561.1,y:402.7},0).wait(1).to({rotation:278.7,x:1559.9,y:416.4},0).wait(1).to({rotation:282.4,x:1561.8,y:429.6},0).wait(1).to({rotation:286,x:1566.5,y:442.1},0).wait(1).to({rotation:289.7,x:1573.8,y:453.2},0).wait(1).to({rotation:293.4,x:1583.6,y:462.8},0).wait(1).to({rotation:297,x:1594.8,y:470.2},0).wait(1).to({rotation:300.5,x:1607.8,y:476.2},0).wait(1).to({rotation:304.1,x:1622,y:480.5},0).wait(1).to({rotation:307.5,x:1635.6,y:483.1},0).wait(1).to({rotation:310.9,x:1648.4,y:484.6},0).wait(1).to({rotation:314.1,x:1656.6,y:491.8},0).wait(1).to({rotation:317.3,x:1655.3,y:503.9},0).wait(1).to({rotation:320.3,x:1648.8,y:514.6},0).wait(1).to({rotation:323.2,x:1641,y:522.3},0).wait(1).to({rotation:326.1,x:1631.6,y:528.5},0).wait(1).to({rotation:328.7,x:1622.3,y:533},0).wait(1).to({rotation:331.3,x:1613.4,y:536.3},0).wait(1).to({rotation:333.7,x:1603.7,y:538.9},0).wait(1).to({rotation:336,x:1594.6,y:540.7},0).wait(1).to({rotation:338.1,x:1586.2,y:541.9},0).wait(1).to({rotation:340.2,x:1578.5,y:542.6},0).wait(1).to({rotation:342.1,x:1571.5,y:543.1},0).wait(1).to({rotation:343.9,x:1571.2,y:559.7},0).wait(1).to({rotation:345.5,x:1572.9,y:581.7},0).wait(1).to({rotation:347.1,x:1573.8,y:590.6},0).wait(1).to({rotation:348.5,x:1574.3,y:596.4},0).wait(1).to({rotation:349.9,x:1574.9,y:601.4},0).wait(1).to({rotation:351.1,x:1575.3,y:605.8},0).wait(1).to({rotation:352.2,x:1575.8,y:609.9},0).wait(1).to({rotation:353.3,x:1576.2,y:613.7},0).wait(1).to({rotation:354.2,x:1576.6,y:617.1},0).wait(1).to({rotation:355.1,x:1576.9,y:620.3},0).wait(1).to({rotation:355.9,x:1577.2,y:623.1},0).wait(1).to({rotation:356.6,x:1577.5,y:625.6},0).wait(1).to({rotation:357.2,x:1577.8,y:627.9},0).wait(1).to({rotation:357.8,x:1578,y:629.9},0).wait(1).to({rotation:358.3,x:1578.2,y:631.6},0).wait(1).to({rotation:358.7,x:1578.4,y:633.2},0).wait(1).to({rotation:359.1,x:1578.5,y:634.4},0).wait(1).to({rotation:359.4,x:1578.6,y:635.5},0).wait(1).to({rotation:359.6,x:1578.7,y:636.3},0).wait(1).to({rotation:359.8,x:1578.8,y:637},0).wait(1).to({rotation:359.9,x:1578.9,y:637.4},0).wait(1).to({rotation:360,y:637.7},0).to({_off:true},1).wait(131));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(205).to({_off:false},0).to({x:1581.5,y:662},130).wait(1));

	// leaf 4
	this.instance_8 = new lib.Tween7("synched",0);
	this.instance_8.parent = this;
	this.instance_8.setTransform(1362.9,-13.5);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(47).to({_off:false},0).wait(1).to({rotation:6.8,x:1372.8,y:8.4},0).wait(1).to({rotation:10.8,x:1363.7,y:18.5},0).wait(1).to({rotation:13.9,x:1353.6,y:26.1},0).wait(1).to({rotation:16.4,x:1345.4,y:31.6},0).wait(1).to({rotation:18.6,x:1338.5,y:35.8},0).wait(1).to({rotation:20.5,x:1332.6,y:39.3},0).wait(1).to({rotation:22.3,x:1327.7,y:42},0).wait(1).to({rotation:23.9,x:1323.2,y:44.3},0).wait(1).to({rotation:25.5,x:1318.8,y:46.5},0).wait(1).to({rotation:26.9,x:1314.5,y:48.5},0).wait(1).to({rotation:28.4,x:1310.3,y:50.4},0).wait(1).to({rotation:29.8,x:1306,y:52.1},0).wait(1).to({rotation:31.2,x:1301.8,y:53.8},0).wait(1).to({rotation:32.6,x:1297.4,y:55.3},0).wait(1).to({rotation:34,x:1293,y:56.8},0).wait(1).to({rotation:35.4,x:1288.5,y:58.1},0).wait(1).to({rotation:36.8,x:1283.9,y:59.3},0).wait(1).to({rotation:38.3,x:1279,y:60.4},0).wait(1).to({rotation:39.7,x:1274,y:61.4},0).wait(1).to({rotation:41.3,x:1268.8,y:62.3},0).wait(1).to({rotation:42.8,x:1263.4,y:62.9},0).wait(1).to({rotation:44.5,x:1257.7,y:63.4},0).wait(1).to({rotation:46.2,x:1251.8,y:63.6},0).wait(1).to({rotation:47.9,x:1249.9,y:68.4},0).wait(1).to({rotation:49.7,x:1254.2,y:74.3},0).wait(1).to({rotation:51.6,x:1259.6,y:80.4},0).wait(1).to({rotation:53.6,x:1264.7,y:85.6},0).wait(1).to({rotation:55.7,x:1270.6,y:91.1},0).wait(1).to({rotation:57.9,x:1277,y:96.5},0).wait(1).to({rotation:60.2,x:1283.8,y:101.9},0).wait(1).to({rotation:62.7,x:1291.2,y:107.2},0).wait(1).to({rotation:65.3,x:1299,y:112.4},0).wait(1).to({rotation:68,x:1307.2,y:117.5},0).wait(1).to({rotation:70.9,x:1315.8,y:122.4},0).wait(1).to({rotation:74,x:1325.2,y:127.3},0).wait(1).to({rotation:77.2,x:1335.5,y:132},0).wait(1).to({rotation:80.7,x:1346.9,y:136.5},0).wait(1).to({rotation:84.5,x:1359.4,y:140.6},0).wait(1).to({rotation:88.5,x:1373.2,y:144.3},0).wait(1).to({rotation:92.9,x:1388,y:147.1},0).wait(1).to({rotation:97.6,x:1404.3,y:148.9},0).wait(1).to({rotation:102.7,x:1422.3,y:149.2},0).wait(1).to({rotation:108,x:1441.1,y:147.7},0).wait(1).to({rotation:113,x:1441.6,y:153.4},0).wait(1).to({rotation:117.5,x:1424.7,y:162.6},0).wait(1).to({rotation:121.8,x:1410.8,y:169.5},0).wait(1).to({rotation:125.7,x:1397.7,y:175.6},0).wait(1).to({rotation:129.5,x:1385.6,y:180.7},0).wait(1).to({rotation:133,x:1376,y:184.6},0).wait(1).to({rotation:136.3,x:1367.6,y:187.7},0).wait(1).to({rotation:139.4,x:1359.3,y:190.6},0).wait(1).to({rotation:142.3,x:1351.4,y:193.2},0).wait(1).to({rotation:145.1,x:1343.7,y:195.5},0).wait(1).to({rotation:147.8,x:1336.2,y:197.4},0).wait(1).to({rotation:150.3,x:1329,y:199.1},0).wait(1).to({rotation:152.7,x:1321.9,y:200.5},0).wait(1).to({rotation:155,x:1315,y:201.6},0).wait(1).to({rotation:157.2,x:1308.3,y:202.4},0).wait(1).to({rotation:159.3,x:1301.7,y:202.9},0).wait(1).to({rotation:161.3,x:1295.2,y:203},0).wait(1).to({rotation:163.3,x:1288.9,y:202.8},0).wait(1).to({rotation:165.1,x:1282.7,y:202.3},0).wait(1).to({rotation:166.9,x:1276.7,y:201.4},0).wait(1).to({rotation:168.6,y:209.2},0).wait(1).to({rotation:170.3,x:1278.6,y:215.9},0).wait(1).to({rotation:171.9,x:1280.6,y:221.4},0).wait(1).to({rotation:173.5,x:1282.8,y:226.6},0).wait(1).to({rotation:175,x:1285.3,y:231.5},0).wait(1).to({rotation:176.5,x:1287.9,y:236.3},0).wait(1).to({rotation:178,x:1290.8,y:240.8},0).wait(1).to({rotation:179.5,x:1293.8,y:245.2},0).wait(1).to({rotation:181,x:1297,y:249.4},0).wait(1).to({rotation:182.4,x:1300.4,y:253.4},0).wait(1).to({rotation:183.9,x:1303.9,y:257.2},0).wait(1).to({rotation:185.5,x:1307.7,y:260.8},0).wait(1).to({rotation:187.1,x:1311.9,y:264.5},0).wait(1).to({rotation:188.8,x:1316.6,y:268.2},0).wait(1).to({rotation:190.7,x:1322.1,y:271.9},0).wait(1).to({rotation:192.7,x:1328.1,y:275.4},0).wait(1).to({rotation:194.7,x:1334.7,y:278.6},0).wait(1).to({rotation:196.8,x:1341.8,y:281.4},0).wait(1).to({rotation:199.1,x:1349.4,y:283.8},0).wait(1).to({rotation:201.4,x:1358,y:285.7},0).wait(1).to({rotation:203.8,x:1367.2,y:287},0).wait(1).to({rotation:206.3,x:1376.8,y:287.5},0).wait(1).to({rotation:208.9,x:1386.7,y:287.3},0).wait(1).to({rotation:211.6,x:1396.9,y:286.4},0).wait(1).to({rotation:214.4,x:1407.2,y:284.7},0).wait(1).to({rotation:217.4,x:1415,y:287.7},0).wait(1).to({rotation:220.4,x:1410.3,y:299.9},0).wait(1).to({rotation:223.6,x:1404.5,y:309.9},0).wait(1).to({rotation:226.9,x:1397.3,y:320.7},0).wait(1).to({rotation:230.3,x:1389.2,y:331},0).wait(1).to({rotation:233.9,x:1380.5,y:340.8},0).wait(1).to({rotation:237.6,x:1371.7,y:349.8},0).wait(1).to({rotation:241.4,x:1362.8,y:357.8},0).wait(1).to({rotation:245.4,x:1352.5,y:365.7},0).wait(1).to({rotation:249.5,x:1340.9,y:372.9},0).wait(1).to({rotation:253.7,x:1327.6,y:378.8},0).wait(1).to({rotation:258.1,x:1314.6,y:381.9},0).wait(1).to({rotation:262.6,x:1299.9,y:381.7},0).wait(1).to({rotation:267.1,x:1286.4,y:384.9},0).wait(1).to({rotation:271.8,x:1285,y:402},0).wait(1).to({rotation:276.6,x:1288.6,y:418.6},0).wait(1).to({rotation:281.3,x:1296.5,y:433.5},0).wait(1).to({rotation:286.2,x:1308.8,y:446.2},0).wait(1).to({rotation:291,x:1323.6,y:455.4},0).wait(1).to({rotation:295.7,x:1341.5,y:462.2},0).wait(1).to({rotation:300.4,x:1360,y:466.2},0).wait(1).to({rotation:305,x:1377,y:468.6},0).wait(1).to({rotation:309.5,x:1381.4,y:483.5},0).wait(1).to({rotation:313.8,x:1373.3,y:498.4},0).wait(1).to({rotation:317.9,x:1361.8,y:508.5},0).wait(1).to({rotation:321.9,x:1348.3,y:515.8},0).wait(1).to({rotation:325.6,x:1335.6,y:520.4},0).wait(1).to({rotation:329.1,x:1321.7,y:523.6},0).wait(1).to({rotation:332.4,x:1309,y:525.3},0).wait(1).to({rotation:335.5,x:1297.6,y:526.1},0).wait(1).to({rotation:338.3,x:1296.3,y:545.1},0).wait(1).to({rotation:340.9,x:1298.6,y:572.3},0).wait(1).to({rotation:343.3,x:1299.7,y:583.2},0).wait(1).to({rotation:345.6,x:1300.5,y:591},0).wait(1).to({rotation:347.6,x:1301.3,y:598.1},0).wait(1).to({rotation:349.4,x:1302,y:604.6},0).wait(1).to({rotation:351,x:1302.7,y:610.4},0).wait(1).to({rotation:352.5,x:1303.3,y:615.6},0).wait(1).to({rotation:353.9,x:1303.8,y:620.3},0).wait(1).to({rotation:355,x:1304.3,y:624.4},0).wait(1).to({rotation:356,x:1304.7,y:628},0).wait(1).to({rotation:356.9,x:1305.1,y:631.1},0).wait(1).to({rotation:357.7,x:1305.5,y:633.8},0).wait(1).to({rotation:358.3,x:1305.7,y:636.1},0).wait(1).to({rotation:358.9,x:1306,y:637.9},0).wait(1).to({rotation:359.3,x:1306.1,y:639.4},0).wait(1).to({rotation:359.6,x:1306.3,y:640.5},0).wait(1).to({rotation:359.8,x:1306.4,y:641.3},0).wait(1).to({rotation:360,y:641.8},0).wait(1).to({x:1306.5,y:641.9},0).to({startPosition:0},150).wait(1));

	// leaf 3
	this.instance_9 = new lib.Tween5("synched",0);
	this.instance_9.parent = this;
	this.instance_9.setTransform(1138.7,-32.4);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(132).to({_off:false},0).wait(1).to({rotation:11.7,x:1147.7,y:-12.2},0).wait(1).to({rotation:19,x:1153.4,y:0.3},0).wait(1).to({rotation:24.6,x:1157.7,y:9.9},0).wait(1).to({rotation:29.2,x:1161.2,y:17.8},0).wait(1).to({rotation:33.2,x:1164.3,y:24.7},0).wait(1).to({rotation:36.7,x:1167,y:30.7},0).wait(1).to({rotation:39.9,x:1169.5,y:36.3},0).wait(1).to({rotation:42.9,x:1171.8,y:41.4},0).wait(1).to({rotation:45.7,x:1173.9,y:46.2},0).wait(1).to({rotation:48.3,x:1176,y:50.7},0).wait(1).to({rotation:50.9,x:1177.9,y:55},0).wait(1).to({rotation:53.3,x:1179.8,y:59.2},0).wait(1).to({rotation:55.7,x:1181.6,y:63.3},0).wait(1).to({rotation:58,x:1180.3,y:66.7},0).wait(1).to({rotation:60.3,x:1176.7,y:69.9},0).wait(1).to({rotation:62.6,x:1172.8,y:73.1},0).wait(1).to({rotation:64.8,x:1168.9,y:76.1},0).wait(1).to({rotation:67.1,x:1165.1,y:79},0).wait(1).to({rotation:69.4,x:1161.2,y:81.7},0).wait(1).to({rotation:71.7,x:1157.4,y:84.3},0).wait(1).to({rotation:74,x:1153.5,y:86.8},0).wait(1).to({rotation:76.4,x:1149.5,y:89.3},0).wait(1).to({rotation:78.8,x:1145.6,y:91.7},0).wait(1).to({rotation:81.3,x:1141.6,y:94},0).wait(1).to({rotation:83.8,x:1138,y:96},0).wait(1).to({rotation:86.4,x:1134.1,y:98.1},0).wait(1).to({rotation:89.1,x:1130.1,y:100.1},0).wait(1).to({rotation:91.8,x:1125.9,y:102.1},0).wait(1).to({rotation:94.7,x:1121.5,y:104.1},0).wait(1).to({rotation:97.6,x:1116.8,y:106.1},0).wait(1).to({rotation:100.7,x:1111.9,y:108.1},0).wait(1).to({rotation:103.8,x:1106.7,y:109.9},0).wait(1).to({rotation:107.1,x:1101.2,y:111.7},0).wait(1).to({rotation:110.5,x:1095.4,y:113.4},0).wait(1).to({rotation:114,x:1089.2,y:114.9},0).wait(1).to({rotation:117.7,x:1082.7,y:116.3},0).wait(1).to({rotation:121.5,x:1075.7,y:117.3},0).wait(1).to({rotation:125.5,x:1068.3,y:118.1},0).wait(1).to({rotation:129.7,x:1060.5,y:118.4},0).wait(1).to({rotation:134.1,x:1060,y:125.1},0).wait(1).to({rotation:138.7,x:1066.6,y:133.2},0).wait(1).to({rotation:143.5,x:1073.2,y:140.1},0).wait(1).to({rotation:148.6,x:1080.8,y:147.1},0).wait(1).to({rotation:154,x:1089.1,y:154},0).wait(1).to({rotation:159.6,x:1098.2,y:160.7},0).wait(1).to({rotation:165.6,x:1107.8,y:167.3},0).wait(1).to({rotation:172,x:1118,y:173.5},0).wait(1).to({rotation:178.7,x:1128.7,y:179.4},0).wait(1).to({rotation:185.9,x:1140.5,y:185.1},0).wait(1).to({rotation:193.5,x:1153.6,y:190.5},0).wait(1).to({rotation:201.7,x:1168.1,y:195.4},0).wait(1).to({rotation:210.5,x:1184,y:199.5},0).wait(1).to({rotation:218.9,x:1199.3,y:202.2},0).wait(1).to({rotation:226.8,x:1213.7,y:203.7},0).wait(1).to({rotation:234.2,x:1227.6,y:204.1},0).wait(1).to({rotation:241.3,x:1240.8,y:203.5},0).wait(1).to({rotation:247.9,x:1253.3,y:202},0).wait(1).to({rotation:254.2,x:1255.2,y:205.4},0).wait(1).to({rotation:260.2,x:1239.7,y:214.2},0).wait(1).to({rotation:265.9,x:1229.9,y:219.3},0).wait(1).to({rotation:271.3,x:1220.5,y:223.9},0).wait(1).to({rotation:276.5,x:1211.5,y:228.1},0).wait(1).to({rotation:281.4,x:1202.8,y:232},0).wait(1).to({rotation:286.2,x:1194.7,y:235.4},0).wait(1).to({rotation:290.7,x:1188.5,y:237.9},0).wait(1).to({rotation:295,x:1182.6,y:240.2},0).wait(1).to({rotation:299.2,x:1176.8,y:242.4},0).wait(1).to({rotation:303.2,x:1171.1,y:244.4},0).wait(1).to({rotation:307.1,x:1165.7,y:246.3},0).wait(1).to({rotation:310.8,x:1160.3,y:248},0).wait(1).to({rotation:314.3,x:1155.1,y:249.5},0).wait(1).to({rotation:317.8,x:1150,y:251},0).wait(1).to({rotation:321.1,x:1145,y:252.2},0).wait(1).to({rotation:324.3,x:1140,y:253.4},0).wait(1).to({rotation:327.4,x:1135.2,y:254.4},0).wait(1).to({rotation:330.5,x:1130.5,y:255.3},0).wait(1).to({rotation:333.4,x:1125.8,y:256.1},0).wait(1).to({rotation:336.2,x:1121.2,y:256.7},0).wait(1).to({rotation:339,x:1116.6,y:257.2},0).wait(1).to({rotation:341.7,x:1112.1,y:257.6},0).wait(1).to({rotation:344.3,x:1107.7,y:257.8},0).wait(1).to({rotation:346.8,x:1103.2},0).wait(1).to({rotation:349.4,x:1098.8,y:257.7},0).wait(1).to({rotation:351.8,x:1094.4,y:257.4},0).wait(1).to({rotation:354.3,x:1090,y:256.9},0).wait(1).to({rotation:356.7,x:1085.6,y:256.1},0).wait(1).to({rotation:359.1,x:1085.2,y:262.2},0).wait(1).to({rotation:361.5,x:1086.3,y:267.2},0).wait(1).to({rotation:363.9,x:1087.9,y:272.1},0).wait(1).to({rotation:366.3,x:1089.5,y:276.4},0).wait(1).to({rotation:368.8,x:1091.3,y:280.8},0).wait(1).to({rotation:371.3,x:1093.4,y:285.1},0).wait(1).to({rotation:374,x:1095.8,y:289.6},0).wait(1).to({rotation:376.8,x:1098.6,y:294.1},0).wait(1).to({rotation:379.7,x:1101.8,y:298.9},0).wait(1).to({rotation:382.9,x:1105.4,y:303.7},0).wait(1).to({rotation:386.2,x:1109.4,y:308.4},0).wait(1).to({rotation:389.5,x:1113.6,y:312.9},0).wait(1).to({rotation:393,x:1118.2,y:317.2},0).wait(1).to({rotation:396.6,x:1123.3,y:321.4},0).wait(1).to({rotation:400.3,x:1128.9,y:325.4},0).wait(1).to({rotation:404.1,x:1135.1,y:329.2},0).wait(1).to({rotation:408.1,x:1141.8,y:332.6},0).wait(1).to({rotation:412.2,x:1149,y:335.6},0).wait(1).to({rotation:416.4,x:1156.6,y:338.1},0).wait(1).to({rotation:420.8,x:1165.1,y:340.2},0).wait(1).to({rotation:425.3,x:1174.2,y:341.6},0).wait(1).to({rotation:430,x:1183.7,y:342.3},0).wait(1).to({rotation:434.8,x:1193.5,y:342.2},0).wait(1).to({rotation:439.7,x:1203.5,y:341.4},0).wait(1).to({rotation:444.9,x:1213.5,y:340},0).wait(1).to({rotation:450.2,x:1223.1,y:338.8},0).wait(1).to({rotation:455.6,x:1221,y:350.6},0).wait(1).to({rotation:461.3,x:1215.5,y:361.2},0).wait(1).to({rotation:467.1,x:1209.1,y:371.2},0).wait(1).to({rotation:473.1,x:1201.7,y:381.1},0).wait(1).to({rotation:479.3,x:1193.9,y:390.6},0).wait(1).to({rotation:485.6,x:1185.7,y:399.5},0).wait(1).to({rotation:492.2,x:1177.7,y:407.3},0).wait(1).to({rotation:498.9,x:1169.1,y:414.7},0).wait(1).to({rotation:505.8,x:1159.4,y:421.8},0).wait(1).to({rotation:512.9,x:1148.5,y:428.3},0).wait(1).to({rotation:520.1,x:1136.4,y:433.6},0).wait(1).to({rotation:527.4,x:1124.9,y:436.5},0).wait(1).to({rotation:535,x:1111.9,y:436.9},0).wait(1).to({rotation:542.6,x:1098.2,y:433.8},0).wait(1).to({rotation:550.3,x:1093.8,y:449.6},0).wait(1).to({rotation:558.1,x:1094.8,y:464.2},0).wait(1).to({rotation:565.9,x:1099.5,y:478.4},0).wait(1).to({rotation:573.8,x:1107.4,y:491},0).wait(1).to({rotation:581.6,x:1118.4,y:501.6},0).wait(1).to({rotation:589.4,x:1131.2,y:509.6},0).wait(1).to({rotation:597.1,x:1146.4,y:515.8},0).wait(1).to({rotation:604.7,x:1162.4,y:519.9},0).wait(1).to({rotation:612.2,x:1177.5,y:522.2},0).wait(1).to({rotation:619.4,x:1189.4,y:527},0).wait(1).to({rotation:626.5,y:541.2},0).wait(1).to({rotation:633.3,x:1181.9,y:553.5},0).wait(1).to({rotation:639.9,x:1172.2,y:562.2},0).wait(1).to({rotation:646.2,x:1160.9,y:568.9},0).wait(1).to({rotation:652.2,x:1150.1,y:573.3},0).wait(1).to({rotation:657.9,x:1138.7,y:576.7},0).wait(1).to({rotation:663.3,x:1127.4,y:578.9},0).wait(1).to({rotation:668.4,x:1117,y:580.2},0).wait(1).to({rotation:673.3,x:1107.5,y:580.9},0).wait(1).to({rotation:677.8,x:1104.8,y:594.3},0).wait(1).to({rotation:682,x:1106.8,y:621.2},0).wait(1).to({rotation:686,x:1107.9,y:632.5},0).wait(1).to({rotation:689.7,x:1108.7,y:639.9},0).wait(1).to({rotation:693.1,x:1109.4,y:646.3},0).wait(1).to({rotation:696.3,x:1110,y:652.3},0).wait(1).to({rotation:699.2,x:1110.7,y:657.8},0).wait(1).to({rotation:701.9,x:1111.2,y:662.8},0).wait(1).to({rotation:704.4,x:1111.7,y:667.4},0).wait(1).to({rotation:706.6,x:1112.2,y:671.6},0).wait(1).to({rotation:708.6,x:1112.7,y:675.4},0).wait(1).to({rotation:710.5,x:1113.1,y:678.9},0).wait(1).to({rotation:712.1,x:1113.5,y:682},0).wait(1).to({rotation:713.6,x:1113.8,y:684.7},0).wait(1).to({rotation:714.9,x:1114.1,y:687.2},0).wait(1).to({rotation:716,x:1114.3,y:689.3},0).wait(1).to({rotation:717,x:1114.6,y:691.1},0).wait(1).to({rotation:717.8,x:1114.7,y:692.7},0).wait(1).to({rotation:718.5,x:1114.9,y:693.9},0).wait(1).to({rotation:719.1,x:1115,y:695},0).wait(1).to({rotation:719.5,x:1115.1,y:695.7},0).wait(1).to({rotation:719.8,x:1115.2,y:696.3},0).wait(1).to({rotation:719.9,y:696.6},0).wait(1).to({rotation:720,x:1115.3,y:696.7},0).to({startPosition:0},34).wait(1));

	// leaf 2
	this.instance_10 = new lib.Tween3("synched",0);
	this.instance_10.parent = this;
	this.instance_10.setTransform(845.9,-65.3);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(199).to({_off:false},0).wait(1).to({rotation:-3.8,x:851.4,y:-53},0).wait(1).to({rotation:-7.4,x:856.7,y:-41.1},0).wait(1).to({rotation:-11,x:861.9,y:-29.5},0).wait(1).to({rotation:-14.4,x:866.9,y:-18.4},0).wait(1).to({rotation:-17.6,x:871.7,y:-7.7},0).wait(1).to({rotation:-20.8,x:876.3,y:2.6},0).wait(1).to({rotation:-23.8,x:880.7,y:12.5},0).wait(1).to({rotation:-26.7,x:885,y:22},0).wait(1).to({rotation:-29.5,x:883.7,y:30},0).wait(1).to({rotation:-32.2,x:875.6,y:36.7},0).wait(1).to({rotation:-34.7,x:867.3,y:42.9},0).wait(1).to({rotation:-37.1,x:859.4,y:48.1},0).wait(1).to({rotation:-39.4,x:852.1,y:52.7},0).wait(1).to({rotation:-41.6,x:845.3,y:56.6},0).wait(1).to({rotation:-43.7,x:839.4,y:59.8},0).wait(1).to({rotation:-45.7,x:833.8,y:62.7},0).wait(1).to({rotation:-47.6,x:828.2,y:65.3},0).wait(1).to({rotation:-49.5,x:822.7,y:67.7},0).wait(1).to({rotation:-51.3,x:817.2,y:69.9},0).wait(1).to({rotation:-53.1,x:811.7,y:71.9},0).wait(1).to({rotation:-54.8,x:806.2,y:73.7},0).wait(1).to({rotation:-56.5,x:800.5,y:75.3},0).wait(1).to({rotation:-58.3,x:794.7,y:76.8},0).wait(1).to({rotation:-60.1,x:788.7,y:78},0).wait(1).to({rotation:-61.9,x:782.3,y:79.1},0).wait(1).to({rotation:-63.8,x:775.6,y:79.9},0).wait(1).to({rotation:-65.9,x:768.5,y:80.3},0).wait(1).to({rotation:-68,x:762.2,y:82.2},0).wait(1).to({rotation:-70.3,x:767.8,y:91},0).wait(1).to({rotation:-72.7,x:774.5,y:98.6},0).wait(1).to({rotation:-75.3,x:781.4,y:105.2},0).wait(1).to({rotation:-78,x:789.4,y:112.2},0).wait(1).to({rotation:-80.9,x:798.1,y:119.2},0).wait(1).to({rotation:-84,x:807.6,y:125.9},0).wait(1).to({rotation:-87.3,x:817.7,y:132.4},0).wait(1).to({rotation:-90.8,x:828.3,y:138.6},0).wait(1).to({rotation:-94.5,x:839.6,y:144.4},0).wait(1).to({rotation:-98.4,x:852,y:150},0).wait(1).to({rotation:-101.9,x:863.7,y:154.4},0).wait(1).to({rotation:-105,x:874,y:157.7},0).wait(1).to({rotation:-108,x:884.3,y:160.5},0).wait(1).to({rotation:-110.9,x:894.5,y:162.7},0).wait(1).to({rotation:-113.8,x:904.4,y:164.3},0).wait(1).to({rotation:-116.7,x:914.4,y:165.4},0).wait(1).to({rotation:-119.5,x:924.3,y:166},0).wait(1).to({rotation:-122.3,x:934.2},0).wait(1).to({rotation:-125,x:944,y:165.6},0).wait(1).to({rotation:-127.7,x:953.7,y:164.6},0).wait(1).to({rotation:-130.4,x:963.1,y:163.2},0).wait(1).to({rotation:-133,x:954.3,y:170.7},0).wait(1).to({rotation:-135.6,x:944.2,y:176.4},0).wait(1).to({rotation:-138.1,x:935.9,y:180.7},0).wait(1).to({rotation:-140.6,x:927.7,y:184.8},0).wait(1).to({rotation:-143.1,x:919.5,y:188.6},0).wait(1).to({rotation:-145.5,x:911.6,y:192.3},0).wait(1).to({rotation:-147.9,x:903.7,y:195.7},0).wait(1).to({rotation:-150.2,x:896.6,y:198.6},0).wait(1).to({rotation:-152.5,x:890.9,y:200.9},0).wait(1).to({rotation:-154.8,x:884.9,y:203.2},0).wait(1).to({rotation:-157,x:878.9,y:205.4},0).wait(1).to({rotation:-159.2,x:873,y:207.4},0).wait(1).to({rotation:-161.4,x:867.1,y:209.4},0).wait(1).to({rotation:-163.5,x:861.2,y:211.2},0).wait(1).to({rotation:-165.6,x:855.2,y:212.8},0).wait(1).to({rotation:-167.7,x:849.3,y:214.4},0).wait(1).to({rotation:-169.7,x:843.4,y:215.7},0).wait(1).to({rotation:-171.7,x:837.4,y:217},0).wait(1).to({rotation:-173.7,x:831.4,y:218},0).wait(1).to({rotation:-175.7,x:825.4,y:218.8},0).wait(1).to({rotation:-177.6,x:819.3,y:219.4},0).wait(1).to({rotation:-179.5,x:813.1,y:219.8},0).wait(1).to({rotation:-181.4,x:806.9},0).wait(1).to({rotation:-183.3,x:800.6,y:219.5},0).wait(1).to({rotation:-185.2,x:794.2,y:218.8},0).wait(1).to({rotation:-187.1,x:789.8,y:222.5},0).wait(1).to({rotation:-189,x:791.3,y:229.8},0).wait(1).to({rotation:-190.9,x:793.8,y:237},0).wait(1).to({rotation:-193,x:796.6,y:243.6},0).wait(1).to({rotation:-195,x:800,y:250.4},0).wait(1).to({rotation:-197.2,x:804.1,y:257.2},0).wait(1).to({rotation:-199.5,x:808.9,y:263.9},0).wait(1).to({rotation:-201.9,x:814.3,y:270.5},0).wait(1).to({rotation:-204.3,x:820.3,y:276.7},0).wait(1).to({rotation:-206.9,x:827,y:282.5},0).wait(1).to({rotation:-209.6,x:834.7,y:288},0).wait(1).to({rotation:-212.3,x:843.3,y:293},0).wait(1).to({rotation:-215.2,x:852.8,y:297.2},0).wait(1).to({rotation:-218.3,x:863.1,y:300.6},0).wait(1).to({rotation:-221.4,x:874.8,y:303},0).wait(1).to({rotation:-224.7,x:887.5,y:304.2},0).wait(1).to({rotation:-228,x:900.6,y:304.1},0).wait(1).to({rotation:-231.6,x:914,y:302.7},0).wait(1).to({rotation:-235.2,x:927.2,y:300.4},0).wait(1).to({rotation:-239,x:924.6,y:315.3},0).wait(1).to({rotation:-243,x:917.2,y:328.2},0).wait(1).to({rotation:-247.1,x:908,y:341.4},0).wait(1).to({rotation:-251.3,x:897.7,y:353.8},0).wait(1).to({rotation:-255.6,x:887.1,y:365},0).wait(1).to({rotation:-260.1,x:876.5,y:374.6},0).wait(1).to({rotation:-264.7,x:864.5,y:383.7},0).wait(1).to({rotation:-269.4,x:850.7,y:391.6},0).wait(1).to({rotation:-274.2,x:835.6,y:397.3},0).wait(1).to({rotation:-279,x:820.6,y:399.1},0).wait(1).to({rotation:-283.9,x:804.1,y:395.9},0).wait(1).to({rotation:-288.8,x:798.6,y:413.4},0).wait(1).to({rotation:-293.6,x:800.7,y:430.7},0).wait(1).to({rotation:-298.4,x:807.6,y:446.5},0).wait(1).to({rotation:-303.1,x:818.6,y:459.7},0).wait(1).to({rotation:-307.7,x:832.4,y:469.6},0).wait(1).to({rotation:-312.2,x:848,y:476.7},0).wait(1).to({rotation:-316.4,x:865.1,y:481.5},0).wait(1).to({rotation:-320.5,x:881,y:484},0).wait(1).to({rotation:-324.4,x:893.7,y:487.9},0).wait(1).to({rotation:-328,x:894.7,y:501.8},0).wait(1).to({rotation:-331.4,x:888.1,y:513.9},0).wait(1).to({rotation:-334.6,x:879.8,y:522.1},0).wait(1).to({rotation:-337.5,x:870,y:528.7},0).wait(1).to({rotation:-340.3,x:860.6,y:533.2},0).wait(1).to({rotation:-342.8,x:851.9,y:536.3},0).wait(1).to({rotation:-345.1,x:842.8,y:538.8},0).wait(1).to({rotation:-347.1,x:834.6,y:540.5},0).wait(1).to({rotation:-349,x:827.2,y:541.6},0).wait(1).to({rotation:-350.7,x:820.8,y:542.3},0).wait(1).to({rotation:-352.3,x:815.1,y:542.7},0).wait(1).to({rotation:-353.6,x:810.1,y:543.1},0).wait(1).to({rotation:-354.9,x:809.6,y:554.9},0).wait(1).to({rotation:-355.9,x:810.7,y:571.5},0).wait(1).to({rotation:-356.8,x:811.2,y:578},0).wait(1).to({rotation:-357.6,x:811.5,y:581.5},0).wait(1).to({rotation:-358.3,x:811.8,y:584},0).wait(1).to({rotation:-358.8,x:812,y:586.1},0).wait(1).to({rotation:-359.3,x:812.1,y:587.7},0).wait(1).to({rotation:-359.6,x:812.2,y:588.9},0).wait(1).to({rotation:-359.8,x:812.3,y:589.7},0).wait(1).to({rotation:-360,x:812.4,y:590.2},0).wait(1).to({y:590.4},0).wait(1));

	// leaf 1
	this.instance_11 = new lib.Tween1("synched",0);
	this.instance_11.parent = this;
	this.instance_11.setTransform(525.9,-13.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({rotation:360,guide:{path:[525.9,-13.5,532,0,538,13.6,523.9,27,501.3,40.4,456.2,67.2,414,67.2,412.9,67.2,413,68.3,413,69.4,414.3,71.7,417,76.3,423.5,83.3,440.3,101.2,465.2,117.1,497.4,137.5,532.1,146.4,575,157.5,617.1,149.4,619,149,615.2,151.5,611.3,154,601.8,159.4,580.5,171.3,556.5,181.6,483.1,213.1,441.5,204.9,440.8,204.7,440.6,205.8,440.4,206.8,440.6,209.1,441.2,213.9,443.6,220.8,450,239.3,463.3,255.1,481,275.9,506,284.8,537.1,295.9,576.8,287.2,580.2,286.5,579.5,291.2,578.8,295.7,574.5,303.9,564.6,322.8,546.5,342.7,524.9,366.5,503.1,377.5,476.4,391,454.5,382.4,454,382.1,453.4,382.8,452.7,383.5,452,385.2,450.5,388.7,449.9,394.1,448.1,408.5,453.3,422.6,460.3,441.2,478.3,453.2,500.7,468.1,538.3,471.3,545.7,471.9,546.4,480.6,547.2,489.7,539.5,499.8,530.4,511.7,512.7,519.3,491.5,528.4,461.3,529.6,459.8,529.6,460.6,544.1,461.3,558.6,464.3,587.5,467.4,616.4,471,645.3]}},221).to({startPosition:0},114,cjs.Ease.quadIn).wait(1));

	// bkgrd
	this.instance_12 = new lib.Artboard1();
	this.instance_12.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(336));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1280,280.5,2560,642.1);
// library properties:
lib.properties = {
	id: 'BE0D6CDF443D4F89BE86B6403F24C10B',
	width: 2560,
	height: 615,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [
		{src:"/themes/swedishamerican/images/Artboard1.png", id:"Artboard1"}
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
an.compositions['BE0D6CDF443D4F89BE86B6403F24C10B'] = {
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