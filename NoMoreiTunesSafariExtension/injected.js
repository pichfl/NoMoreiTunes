//
//  injected.js
//  NoMoreiTunesSafariExtension
//
//  Created by Jared (jdf2) on 2018-08-17.
//  Updated by Florian Pichler (@pichfl) on 2018-08-20
//  MIT License 2018 NoMoreiTunes Developers
//

const locales = {
	_default: {
		info: 'NoMoreiTunes prevented this page from opening an app',
		retry: 'Click here to open the app this page tried to open',
	},
};

const locale = locales['_default'];

const ready = () => {
	const body = document.body;
	const bodyOnload = body.getAttribute('onload');

	// This if and the else if are for supporting an older version of the iTunes website
	// https://github.com/pichfl/NoMoreiTunes/issues/7
	if (bodyOnload === 'detectAndOpenItunes();') {
		// This is an old store page
		body.removeAttribute('onload');

		// Adds our locale.info
		const localNavLinks = document.querySelector('.localnav-links');

		localNavLinks.innerHTML = `
			<li><a class='localnav-link'>${locale.info}</a></li>
			${localNavLinks.innerHTML}
		`;
	} else if (typeof bodyOnload === 'string' && bodyOnload.indexOf('its.detect.openItunes') > -1) {
		// This is a "connecting to iTunes" page
		body.removeAttribute('onload');

		// This hides the current page text and adds our locale.info
		// Note: The handling of the "Click here to open the app this page tried to open" link is done in the onclick handler inside our inserted HTML string
		const loadingBox = document.querySelector('.loadingbox');

		loadingBox.innerHTML = `
			<div class="NoMoreiTunes-originalLoadingSection" style="display:none;">
				${loadingBox.innerHTML}
			</div>

			<div class="NoMoreiTunes-blockedInfoSection">
				<p class='title">
					${locale.info}
				</p>

				<div class="clear"></div>

				<!-- TODO: This is not exactly good HTML --> 
				<p class="footer">
					<a href="#" onclick="document.querySelector('.NoMoreiTunes-blockedInfoSection').style.display = 'none'; document.querySelector('.NoMoreiTunes-originalLoadingSection').style.display = 'block'; ${bodyOnload}">
						${locale.retry}
					</a>
				</p>
			</div>';
		`;
	} else {
		if (document.querySelector('meta[name="ember-cli-head-end"]')) {
			// This is a new store page

			// Checks to see if that this isn't an iOS store page, we don't do anything for them
			const possibleIOSAlert = document.querySelector('.l-content-width.we-banner');

			if (possibleIOSAlert !== null && possibleIOSAlert.innerHTML.indexOf('iOS') > -1) {
				return;
			}

			if (window.location.href.indexOf('launch=true') === -1) {
				// Remove the schemes we want to block from the CSP.
				// See (https://github.com/pichfl/NoMoreiTunes/issues/15#issuecomment-413724332)
				const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

				const newPolicy = csp
					.getAttribute('content')
					.replace(' itmss:', '')
					.replace(' macappstores:', '');

				csp.setAttribute('content', newPolicy);

				// Handle the "View in Mac App Store"/"Listen on Apple Music" button
				document.addEventListener(
					'click',
					event => {
						if (
							event.target.classList.contains('we-button__app-text') ||
							event.target.children[0].classList.contains('we-button__app-text')
						) {
							event.stopPropagation();

							window.location.href = '?launch=true'; //We redirect to the same page but with a new URL param
						}
					},
					false
				);

				// Add our locale.info, have to wait a sec cause Apple's ember app redoes some stuff on the page
				// TODO: There should be a way to access the Ember app and use the runloop to schedule this, timers are brittle
				setTimeout(() => {
					const localNavLinks = document.querySelector('.localnav-actions.we-localnav__actions');

					localNavLinks.innerHTML = `
						<div class="localnav-action localnav-action-button we-localnav__action" style="padding-right: 25px;">
							<button class="localnav-button we-button we-button--compact we-button-flat we-button-flat--plain" style="cursor: text;">
								${locale.info}
							</button>
						</div>

						${localNavLinks.innerHTML}
					`;
				}, 1000);

				return;
			}

			// This new page doesn't have the schemes blocked so we can now open the desired app
			const scheme = document.querySelector('.we-button__app-text').innerText.includes('Mac App Store')
				? 'macappstores'
				: 'itmss';

			location.href = `${scheme}://${location.host}${location.pathname}`;

			window.history.replaceState({}, document.title, location.href.replace('launch=true', ''));
		}
	}
};

document.addEventListener('DOMContentLoaded', ready, false);
