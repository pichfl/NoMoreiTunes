/*

	NoMoreiTunes
	------------

	An extension by Florian Pichler to stop
	Apple's Preview websites from launching iTunes.
	Developed after an idea from Wolfgang Klatt.

	Online: http://nomoreitunes.einserver.de
	Contact: pichfl@einserver.de

	(c)2010-2011, Florian Pichler, All rights reserved
	This plugin is provided as is and at no cost.

	If you like the plugin, don't hesitate donate.

*/

;(function(win,doc) {

	// Some helpers
	function $(sel) {
		var ret = doc.querySelectorAll(sel);
		return ret[0];
	}

	function $$(sel) {
		return doc.querySelectorAll(sel);
	}

	var forEach = Array.prototype.forEach;

	// Start extension code
	var NoMoreiTunes = NoMoreiTunes || {};

	// language strings
	NoMoreiTunes.lang = {
		// Defaults
		'en': {
			'itunes': {
				'info': 'NoMoreiTunes prevented this page from launching iTunes',
				'launch': 'Open in iTunes',
				'click': 'Click <span>here</span> to open iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Florian Pichler, florianpichler.de
		'de': {
			'itunes': {
				'info': 'NoMoreiTunes hat diese Seite am Öffnen von iTunes gehindert',
				'launch': 'In iTunes öffnen',
				'click': '<span>Hier</span> klicken um iTunes zu öffnen.'
			},
			'appstore': {
				'info': 'NoMoreiTunes hat diese Seite am Öffnen vom AppStore gehindert',
				'launch': 'Im AppStore öffnen',
				'click': '<span>Hier</span> klicken um den AppStore zu öffnen'
			}
		},
		// By Alfred Brose, alfred.brose@bcmsolutions.de
		'ru': {
			'itunes': {
				'info': 'NoMoreiTunes предотвратило открытие этой страницы',
				'launch': 'Открыть в iTunes',
				'click': 'Нажмите <span>здесь</span> чтобы открыть iTunes'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Giancarlo Nicolof, http://web.me.com/giancarlon/
		'it': {
			'itunes': {
				'info': 'NoMoreiTunes ha impedito a questa pagina di aprire iTunes',
				'launch': 'Apri in iTunes',
				'click': 'Cliccare <span>qui</span> per aprire iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Amine Benboubker, http://aminebenboubker.com/
		'fr': {
			'itunes': {
				'info': 'NoMoreiTunes a empêché cette page de lancer iTunes',
				'launch': 'Ouvrir dans iTunes',
				'click': 'Cliquez <span>ici</span> pour ouvrir iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Christoph Theel
		'es': {
			'itunes': {
				'info': 'NoMoreiTunes impidió a esta página de lanzar iTunes',
				'launch': 'Abrir en iTunes',
				'click': 'Haga clic <span>aqui</span> para abrir iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		'pt' : {
			'itunes': {
				'info': 'NoMoreiTunes impediu esta página de lançar iTunes',
				'launch': 'Abra o iTunes',
				'click': 'Clique <span>aqui</span> para abrir o iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		//By Oscar Palmér, http://oscarismy.name/
		'sv': {
			'itunes': {
				'info': 'NoMoreiTunes hindrade denna sida från att öppna iTunes',
				'launch': 'Öppna i iTunes',
				'click': 'Klicka <span>här</span> för att öppna iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes hindrade denna sida från att öppna App Store',
				'launch': 'Öppna i App Store',
				'click': 'Klicka <span>här</span> för att öppna App Store.'
			}
		},
		// By Łukasz Handke, lukasz.handke@gmail.com
		'pl': {
			'itunes': {
				'info': 'NoMoreiTunes uniemożliwił tej stronie automatyczne otwarcie iTunes',
				'launch': 'Otwórz w iTunes',
				'click': 'Kliknij <span>tutaj</span> by otworzyć iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Zhusee Zhang
		'zh': {
			'itunes': {
				'info': 'NoMoreiTunes 阻止了這個網頁自動打開 iTunes',
				'launch': '在 iTunes 中開啟',
				'click': '請點<span>這裡</span>來打開 iTunes。'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}
		},
		// By Daniel Göstenmeier, http://goestenmeier.com/
		'nl': {
			'itunes': {
				'info': 'NoMoreiTunes verhindert deze pagina om iTunes te openen',
				'launch': 'Open in iTunes',
				'click': 'Click <span>hier</span> om iTunes te openen.'
			},
			'appstore': {
				'info': 'NoMoreiTunes prevented this page from launching the AppStore',
				'launch': 'Open the AppStore',
				'click': 'Click <span>here</span> to open the AppStore'
			}

		},
		// By Johan K. Jensen, @Josso000
		'da': {
			'itunes': {
				'info': 'NoMoreiTunes stoppede denne side i at åbne iTunes',
				'launch': 'Åben i iTunes',
				'click': 'Klik <span>her</span> for at åbne iTunes.'
			},
			'appstore': {
				'info': 'NoMoreiTunes stoppede denne side i at åbne AppStoren',
				'launch': 'Åben AppStoren',
				'click': 'Klik <span>her</span> for at åbne AppStoren'
			}
		}
	};

		/* ,
		'': {
			'itunes': {
				'info': '',
				'launch': '',
				'click': ''
			}
			'appstore': {
				'info': '',
				'launch': '',
				'click': ''
			}
		}
		*/

	// Get extension settings
	NoMoreiTunes.tryClosingWindow = false;
	NoMoreiTunes.shouldHideToolbar = false;
	safari.self.addEventListener('message', function(event) {
		if (event.name === 'setNoMoreItunesCloseOnLaunch') {
			NoMoreiTunes.tryClosingWindow = event.message;
		}
		if (event.name === 'setNoMoreItunesHideToolbar') {
			NoMoreiTunes.shouldHideToolbar = event.message;
			hideBar();
		}
	}, false);

	safari.self.tab.dispatchMessage('getNoMoreiTunesSettings');

	if (Cookie.read('disableAutoLaunch') != 1) {
		var a = new Date();
		a.setTime(a.getTime()+300000);
		Cookie.write('disableAutoLaunch', 1, {
			'duration': 0.0034,
			'path': '/',
			'domain': 'itunes.apple.com'
		});
	}

	function closeWindow() {
		if (NoMoreiTunes.tryClosingWindow) {
			setTimeout(function() {
				close();
				console.log('NoMoreiTunes tried to close this window.');
			}, 100);
		}
	}

	function hideBar() {
		if (NoMoreiTunes.shouldHideToolbar) {
			setTimeout(function() {
				doc.documentElement.classList.remove('shownomoreitunesbar');
			}, 5100);
		}
	}

	function openStore() {
		if (url && url !== ''){
			doc.body.classList.remove('shownomoreitunesbar');
			win.location.replace(url);
			closeWindow();
		}
	}

	var bar,
	bodyOnload,
	url;

	win.addEventListener('DOMContentLoaded', function() {

		bodyOnload = doc.body.attributes.getNamedItem('onload');
		url = bodyOnload.value.clean();

		var bl = navigator.language.substr(0,2),
			appStore = (url === 'detectAndOpenMacAppStore();'),
			itunesStore = (url === 'detectAndOpenItunes();');

		doc.body.attributes.removeNamedItem('onload');

		var matchedUrl,
		launchButton = false,
		newUrl;

		if (appStore || itunesStore) {
			launchButton = $('#left-stack a.action');

			newUrl = launchButton.attributes.getNamedItem('onclick');
			url = newUrl.value;

			matchedUrl = url.match(/(?:return .*\(')(?:http|itms)(.*)(?:'\);)/);
		} else {
			matchedUrl = url.match(/(?:openItunes\(')(?:http|itms)(.*)(?:'\);)/) || url.match(/(?:itmsOpen\(')(?:http|itms)(.*)(?:','http)/);
		}

		if (matchedUrl) {
			var prefix = (appStore)?'macappstore':"itms";

			newUrl = prefix + matchedUrl[1];

			var unhashedUrl = newUrl.split('#');

			url = unhashedUrl[0];
		}

		// set language
		var clientLanguage = 'en',
			currentLang;

		for (currentLang in NoMoreiTunes.lang) {
			if (currentLang == bl) {
				clientLanguage = currentLang;
			}
		}
		doc.body.classList.add(clientLanguage);
		var langStrings = NoMoreiTunes.lang[clientLanguage][(appStore)?'appstore':'itunes'];

		if ($('.loadingbox .roundtop')) {
			doc.body.classList.add('remove-border');
		}

		bar = new Element('div', {
			'id': 'nomoreitunes',
			'class': 'bar',
			'html': '<div>' + langStrings.info + '</div>' + '<div id="launch">' + langStrings.launch + '</div>'
		}).inject(doc.body);

		if (!launchButton) {
			doc.body.classList.add('oldschool');
		}

		$('#nomoreitunes #launch').addEventListener('click', openStore, false);

		win.addEventListener('load', function() {
			setTimeout(function() {
				doc.documentElement.classList.add('shownomoreitunesbar');
			}, 500);
		}, false);

		var userOverride = $('#userOverridePanel, .loadingbox .roundtop');

		if (userOverride) {
			forEach.call($$('.roundtop, .roundbot, style, center, p.footer'), function(el){
				el.parentNode.removeChild(el);
			});

			doc.body.classList.add('hide');
			if ($('table.info')) {
				doc.body.classList.add('hideloading');
			} else {
				var sub = $('p.subtitle');
				if (sub) {
					var subHtml = sub.innerHTML;
					sub.innerHTML = subHtml+' '+langStrings.click;
					doc.body.classList.add('hidetitle');
				}
			}
			var lb = $('.loadingbox');
			if (lb) {
				lb.addEvent('click', openStore);
			}
		} else {
			var a = $('.intro p:last-child');
			if (a) {
				a.destroy();
			}
		}
	}, false);

}(window, document));