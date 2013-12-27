(function(){
	var SCRIPT_DATA=(function(){
		var elements=document.getElementsByTagName('script');
		var targetElement=elements[elements.length-1];
		console.log(targetElement.getAttribute('data-prefix-uri'));
		return{
			prefixUri:targetElement.getAttribute('data-prefix-uri')
			
		};
		
	})();
	
	var protocol=location.protocol=="https:"?"https:":"http:";
	console.log('protocol',protocol)
	var IFRAME_URL=(function(){
			if(!location.hostname.match(/mixi\.jp$/)||!SCRIPT_DATA.prefixUri||SCRIPT_DATA.prefixUri.match(/^http:\/\/plugins\.mixi\.jp/)){
				return protocol+"//plugins.mixi.jp/share_button.pl?";
			}
		
		var m=SCRIPT_DATA.prefixUri.match(/^https?:\/\/([^\/:]+(?::[0-9]+)?)(?:\/?[^?#]*)/);
		if(m[1].match(/\.st\./)){
			return protocol+"//"+m[1]+"/share_button.pl?";
		}else{
			return protocol+"//plugins."+m[1]+"/share_button.pl?";
		}
	})();
	console.log('IFRAME_URL',IFRAME_URL)
	
	var FRAME_SIZE={
			"button-1":{"height":20,"width":60},
			"button-2":{"height":20,"width":79},
			"button-3":{"height":20,"width":60},
			"button-4":{"height":20,"width":79},
			"button-5":{"height":27,"width":86},
			"button-6":{"height":22,"width":72},
			"icon-1":{"height":20,"width":20}
		};
		
	var BUBBLE_WIDTH=35;
	
	function buildQueryParams(params){
		var queries=[];
		for(var i=0,n=0;i<params.length;){
			var key=params[i++];
			var value=params[i++];
			if(!value)continue;
			queries[n++]=key+"="+encodeURIComponent(value);
		}
		return queries.join("&");
		console.log(queries.join("&"));
	}
	function findButtons(){
		var buttons=[];
		var elements=document.getElementsByTagName("a");
		console.log('elements',elements);
		for(var i=0,l=elements.length;i<l;i++){
			var element=elements[i];
			var className=element.className||"";
			console.log('className',className);
			var prefix=/(?:^|\s)mixi-check-button(?:\s|$)/.test(className)?"data-":element.getAttribute("check_key")?"check_":null;
			console.log('prefix',prefix);
			if(!prefix)continue;
			buttons.push({
				key:element.getAttribute(prefix+"key"),
				button:element.getAttribute(prefix+"button"),
				url:element.getAttribute(prefix+"url"),
				title:element.getAttribute(prefix+"text"),
				config:element.getAttribute(prefix+"config"),
				showCount:element.getAttribute(prefix+"show-count"),
				nocache:element.getAttribute(prefix+"nocache"),
				element:element
			});
		}
		return buttons;
	}
	function isTrue(value){
		if(value==null)return false;
		if(value==1)return true;
		if(value.toLowerCase()=="true")return true;
		if(value.toLowerCase()=="yes")return true;
		return false;
	}
	
	var buttons=findButtons();
	console.log('buttons',buttons);
	for(var i=0,l=buttons.length;i<l;i++){
		var button=buttons[i];
		var type=(button["button"]||"button-1.png").split(".");
		var buttonType=type[0];
		var query_params=buildQueryParams(["u",button["url"]||document.location.href,"k",button["key"],"t",button["title"],"b",buttonType,"s",button["showCount"],"nocache",button["nocache"]]);
		console.log('query_params',query_params);
		var href=IFRAME_URL+query_params;
		var element=button.element;
		var iframe=document.createElement("iframe");
		iframe.id="mixi-check-iframe"+Math.ceil(Math.random(10000)*10000);
		iframe.setAttribute("src",href);
		iframe.setAttribute("frameBorder",0);
		iframe.setAttribute("scrolling","no");
		iframe.setAttribute("allowTransparency","true");
		iframe.style.overflow="hidden";
		iframe.style.border="0";
		iframe.style.height=(FRAME_SIZE[buttonType]["height"])+"px";
		iframe.style.width=(isTrue(button["showCount"])?FRAME_SIZE[buttonType]["width"]+BUBBLE_WIDTH:FRAME_SIZE[buttonType]["width"])+"px";
		
		var parentSpan=document.createElement("span");
		element.parentNode.insertBefore(parentSpan,element);
		//element.parentNode.removeChild(element);
		parentSpan.appendChild(iframe);}
})();