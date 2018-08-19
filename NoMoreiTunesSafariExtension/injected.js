//
//  injected.js
//  NoMoreiTunesSafariExtension
//
//  Created by Jared (jdf2) on 8/17/18.
//  MIT License 2018 NoMoreiTunes Developers
//

document.addEventListener("DOMContentLoaded", function () {
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
    } else {
        //This new page doesn't have the shemes blocked so we can now open the desired app
        location.href = (document.querySelector(".we-button__app-text").innerText == "Mac App Store" ? "macappstores" : "itmss") + "://" + location.host + location.pathname;
        setTimeout(function () {
            //Lil user friendlyness so that people won't go around copy and pasting "?launch=true" links
            window.history.go(-1);
        }, 1000)
    }
}, false);
