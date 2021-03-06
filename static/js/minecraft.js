"use strict";
(function() {
    var servers = [{
            "host": "mod.say-hanabi.com",
            "port": "25565",
            "alias": "mod"
        }],
        api = "/minecraft/mcQuery.php",
        idPrefix = "mcstat-",
        queryParser = function(obj) {
            var result = "?";
            for (var i = 0; i < obj.length; ++i) {
                result = result + obj[i][0] + "=" + obj[i][1] + "&"
            }
            return result
        },
        ajaxRequest = function(host, parameters, alias) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    singleUpdater(JSON.parse(xhttp.responseText), alias)
                }
            };
            xhttp.open("GET", host + parameters, true);
            xhttp.send()
        },
        singleUpdater = function(jsonResult, queryName) {
            var targetElement = document.getElementById(idPrefix + queryName);
            if (jsonResult && jsonResult["result"] == 1) {
                targetElement.getElementsByClassName("online")[0].innerHTML = jsonResult["players"]["online"];
                if (jsonResult["description"]["text"]) {
                    targetElement.setAttribute("title", jsonResult["description"]["text"])
                } else {
                    targetElement.setAttribute("title", jsonResult["description"])
                }
                if (jsonResult["players"]["online"] > 0) {
                    var sample = jsonResult["players"]["sample"],
                        sampleElement = targetElement.getElementsByClassName("sample")[0],
                        buffer = "(",
                        textNode;
                    for (var i = 0; i < sample.length; ++i) {
                        buffer = buffer + sample[i]["name"] + ", "
                    }
                    textNode = document.createTextNode(buffer.substring(0, buffer.length - 2) + ")");
                    sampleElement.innerHTML = "";
                    sampleElement.appendChild(textNode)
                } else {
                    targetElement.getElementsByClassName("sample")[0].innerHTML = ""
                }
            }
        },
        MainQuerier = function() {
            for (var i = 0; i < servers.length; ++i) {
                ajaxRequest(api, queryParser([
                    ["server", servers[i]["alias"]]
                ]), servers[i]["alias"])
            }
        };
    document.addEventListener('DOMContentLoaded', function() {
        var mainTarget = document.getElementById("toptb").getElementsByClassName("z")[0],
            headElement = document.createElement("A");
        headElement.innerHTML = "Minecraft";
        headElement.style.color = "red";
        headElement.href = "/thread-9473-1-1.html";
        mainTarget.appendChild(headElement);
        for (var i = 0; i < servers.length; ++i) {
            var targetElement = document.createElement("A");
            targetElement.innerHTML = '<span class="address"></span> <span class="online"></span> \u4EBA\u5728\u7EBF<span class="sample" style="color:blue"></span>';
            targetElement.id = idPrefix + servers[i]["alias"];
            targetElement.getElementsByClassName("address")[0].innerHTML = servers[i]["host"];
            targetElement.href = "/thread-9473-1-1.html";
            mainTarget.appendChild(targetElement)
        }
        MainQuerier();
        setInterval(MainQuerier, 60000)
    }, false)
})();
