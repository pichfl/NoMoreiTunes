/*

	NoMoreiTunes
	------------
	
	An extension by Florian Pichler to stop 
	Apple's Preview websites from launching iTunes.
	Developed after an idea from Wolfgang Klatt.

	Online: http://einserver.de/extensions#nomoreitunes
	Contact: pichfl@einserver.de
	
	(c)2010-2011, Florian Pichler, All rights reserved
	This plugin is provided as is and at no cost.
	
	If you like the plugin, don't hesitate donate.

*/

var lang = NoMoreItunes.lang,
closeOnButtonClick = false;

if(Cookie.read('disableAutoLaunch') != 1){
	var a = new Date();
	a.setTime(a.getTime()+300000);
	Cookie.write('disableAutoLaunch', 1, {
		'duration': 0.0034,
		'path': '/',
		'domain': 'itunes.apple.com'
	});
}

safari.self.addEventListener("message", function(event) {
	if (event.name === 'setNoMoreItunesSettings') {
		closeOnButtonClick = event.message;
	}
}, false);
safari.self.tab.dispatchMessage('getNoMoreItunesSettings');

window.addEvent('domready', function() {
	var body = $(document.body),
	bl = navigator.language.substr(0,2),
	cl = 'en',
	bodyOnload = body.getProperty('onload'), 
	url = bodyOnload.toString().clean(),
	appStore = (url === 'detectAndOpenMacAppStore();'),
	newUrl = url,
	langStrings,
	bar,
	openiTunes = function() {
		newUrl = url.match(/(?:openItunes\(')(http|itms)(.*)(?:'\);)/) || 
					url.match(/(?:itmsOpen\(')(http|itms)(.*)(?:','http)/);

		newUrl = "itms"+newUrl[2];
		var hashIndex = newUrl.indexOf("#");
		if (hashIndex > -1) {
			newUrl = newUrl.substring(0, hashIndex);
		}
		window.location.replace(newUrl);
		$(body).removeClass('shownomoreitunesbar');
		closeWindow();
	},
	closeWindow = function() {
		if (closeOnButtonClick) {
			(function() {
				close();
				console.log('NoMoreiTunes tried to close this window.');
			}).delay(100);
		}
	};

	for (var i in lang) { if (i == bl) { cl = i; } }
	body.addClass(cl);

	langStrings = lang[cl][(appStore)?'appstore':'itunes'];

	body.removeProperty('onload');
	
	if ($$('.loadingbox .roundtop')) {
		body.addClass('remove-border');
	}

	bar = new Element('div', {
		'id': 'nomoreitunes',
		'class': 'bar',
		'html': '<div>{info}</div>'.substitute(langStrings)
	}).inject(body);
	
	var buttonTemp = $$('#left-stack a.action');
	if (buttonTemp && buttonTemp[0]) {
		button = buttonTemp[0].clone().inject(bar).setProperty('id','launch');
		button.set('html',langStrings.launch);
		button.addEvent('click', closeWindow);
	} else {
		button = new Element('div#launch', {
			'html': langStrings.launch,
			'events': {
				'click': openiTunes
			}
		}).inject(bar);
		body.addClass('oldschool');
	}

	window.addEvent('load', function() {
		(function() {
			document.body.parentNode.className = 'shownomoreitunesbar';
		}).delay(500);
	});

	var userOverride = $('userOverridePanel') || $$('.loadingbox .roundtop');
	if (userOverride) {
		$$('.roundtop, .roundbot, style').destroy();
		body.addClass('hide');
		if (body.getElement('table.info')) {
			body.addClass('hideloading');
		} else {
			var sub = body.getElement('p.subtitle');
			if (sub) {
				sub.set('html', sub.get('html')+' '+langStrings.click);
				body.addClass('hidetitle');
			}
		}
		var lb = body.getElement('.loadingbox');
		if (lb) {
			lb.addEvent('click', openiTunes);
		}
	} else {
		var a = body.getElement('.intro p:last-child');
		if (a) a.destroy();
	}
	if (body.getElement('.info')) {
		new Element('p', {
			'class': 'clickhere',
			'html': langStrings.launch
		}).replaces(body.getElement('clear'));
	}
});