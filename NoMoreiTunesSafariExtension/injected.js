//
//  injected.js
//  NoMoreiTunesSafariExtension
//
//  Created by Jared (jdf2) on 8/17/18.
//  MIT License 2018 NoMoreiTunes Developers
//

document.addEventListener("DOMContentLoaded", function () {
    const preventedInfoText = "NoMoreiTunes prevented this page from opening an app";

    const bodyOnload = document.body.getAttribute("onload");

    //This if and the else if are for supporting an older version of the iTunes website
    //https://github.com/pichfl/NoMoreiTunes/issues/7
    if (bodyOnload == "detectAndOpenItunes();") {
        //This is an old store page
        document.body.removeAttribute("onload");

        //Adds our preventedInfoText
        let localNavLinks = document.querySelector(".localnav-links");
        localNavLinks.innerHTML = "<li><a class='localnav-link'>" + preventedInfoText + "</a></li>" + localNavLinks.innerHTML;
    } else if (typeof bodyOnload === "string" && bodyOnload.indexOf("its.detect.openItunes") > -1) {
        //This is a "connecting to iTunes" page
        document.body.removeAttribute("onload");

        //This hides the current page text and adds our preventedInfoText
        //Note: The handling of the "Click here to open the app this page tried to open" link is done in the onclick handler inside our inserted HTML string
        let loadingBox = document.querySelector(".loadingbox");
        loadingBox.innerHTML = "<div class='NoMoreiTunes-originalLoadingSection' style='display: none;'>" + loadingBox.innerHTML + "</div>";
        loadingBox.innerHTML += "<div class='NoMoreiTunes-blockedInfoSection'><p class='title'>" + preventedInfoText + "</p><div class='clear'></div><p class='footer'><a href='#' onclick=\"document.querySelector('.NoMoreiTunes-blockedInfoSection').style.display = 'none'; document.querySelector('.NoMoreiTunes-originalLoadingSection').style.display = 'block'; " + bodyOnload + "\">Click here to open the app this page tried to open</a></p></div>";
    } else {
        if (document.querySelector('meta[name="ember-cli-head-end"]')) {
            //This is a new store page

            //Checks to see if that this isn't an iOS store page, we don't do anything for them
            let possibleIOSAlert = document.querySelector(".l-content-width.we-banner");
            if (possibleIOSAlert == null || possibleIOSAlert.innerHTML.indexOf("iOS") == -1) {
                if (location.href.indexOf("launch=true") == -1) {
                    //Remove the schemes we want to block from the CSP. (https://github.com/pichfl/NoMoreiTunes/issues/15#issuecomment-413724332)
                    let newPolicy = document.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute("content").replace(" itmss:", "").replace(" macappstores:", "");
                    document.querySelector('meta[http-equiv="Content-Security-Policy"]').setAttribute("content", newPolicy);

                    //Handle the "View in Mac App Store"/"Listen on Apple Music" button
                    document.addEventListener("click", function (event) {
                        if (event.target.className == "we-button__app-text" || event.target.children[0].className == "we-button__app-text") {
                            event.stopPropagation();
                            location.href = "?launch=true"; //We redirect to the same page but with a new URL param
                        }
                    }, false);

                    //Add our preventedInfoText, have to wait a sec cause Apple's ember app redoes some stuff on the page
                    setTimeout(function () {
                        let localNavLinks = document.querySelector(".localnav-actions.we-localnav__actions");
                        localNavLinks.innerHTML = "<div class='localnav-action localnav-action-button we-localnav__action' style='padding-right: 25px;'><button class='localnav-button we-button we-button--compact we-button-flat we-button-flat--plain' style='cursor: text;'>" + preventedInfoText + "</button></div>" + localNavLinks.innerHTML;
                    }, 1000)
                } else {
                    //This new page doesn't have the shemes blocked so we can now open the desired app
                    location.href = (document.querySelector(".we-button__app-text").innerText == "Mac App Store" ? "macappstores" : "itmss") + "://" + location.host + location.pathname;

                    window.history.replaceState({}, document.title, location.href.replace("launch=true", ""));
                }
            }
        }
    }
}, false);
