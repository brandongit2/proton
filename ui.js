var ui         = null;
var colors     = null;
var isMenuOpen = false;

$(function() {
    // Obtain JSON files
    var request1 = new XMLHttpRequest();
    request1.responseType = "json";
    request1.open("GET", "ui.json");
    request1.send();
    request1.onload = function() {
        ui = request1.response;
        populateToolbar();
    }

    var request2 = new XMLHttpRequest();
    request2.responseType = "json";
    request2.open("GET", "colors.json");
    request2.send();
    request2.onload = function() {
        colors = request2.response;
        setColors();
    }

    window.addEventListener("mouseup", function(e) {
        if (e.button == 0 && isMenuOpen && !(e.target.matches(".toolbar-menu") || e.target.matches(".toolbar-menu *"))) {
            document.getElementsByClassName("menu-open")[0].classList.add("menu-close");
            document.getElementsByClassName("menu-close")[0].classList.remove("menu-open");
            if (document.getElementById("leave-menu") != null) {
                document.getElementById("leave-menu").outerHTML = "";
            }
            isMenuOpen = false;
        }
    });
});

function setColors() {
    var toolbar = $("#toolbar");
    var theme   = colors.light;
    toolbar.css("background-color", theme.toolbar.background);
    toolbar.css("color",            theme.toolbar.color);
    document.getElementById("extra-styling").innerHTML = `
        .toolbar-item > span:hover {
            background-color: ${theme.toolbar.item.hover.background};
            color:            ${theme.toolbar.item.hover.text};
        }
    `;
}

function populateToolbar() {
    var toolbar = document.getElementById("toolbar");
    var items   = ui.toolbar;
    console.log(ui);
    for (var item in items) {
        $("#toolbar").append(`
            <div class="toolbar-item">
                <span>${item}</span>
                <div class="toolbar-menu" id="menu-item-${item.toLowerCase()}"></div>
            </div>
        `);
        var toolbarItem = document.querySelector(".toolbar-item:last-child");
        toolbarItem.addEventListener("mouseup", function(e) {
            if (e.button == 0 && !isMenuOpen) {
                var itemName = `menu-item-${e.target.innerText.toLowerCase()}`;
                document.getElementById(itemName).classList.remove("menu-close");
                document.getElementById(itemName).classList.add("menu-open");

                var leaveMenu = document.createElement("div"); // Prevents clicks on other UI elements while menu is open
                leaveMenu.style.height   = "100%";
                leaveMenu.style.width    = "100%";
                leaveMenu.style.position = "absolute";
                leaveMenu.style.zIndex   = "1";
                leaveMenu.setAttribute("id", "leave-menu");
                document.body.appendChild(leaveMenu);
                setTimeout(function() {
                    isMenuOpen = true;
                }, 30);
            }
        });
        // Close current menu and open new one when moving mouse over another menu
        toolbarItem.addEventListener("mouseleave", function(e) {
            if (e.relatedTarget != null) {
                if (isMenuOpen && e.relatedTarget.matches(".toolbar-item > span")) {
                    var openMenus = document.getElementsByClassName("menu-open");
                    for (var i = 0; i < openMenus.length; i++) {
                        openMenus[i].classList.add("menu-close");
                        openMenus[i].classList.remove("menu-open");
                    }

                    var itemName = `menu-item-${e.relatedTarget.innerText.toLowerCase()}`;
                    if (document.getElementById(itemName) != null) {
                        document.getElementById(itemName).classList.remove("menu-close");
                        document.getElementById(itemName).classList.add("menu-open");
                    }
                }
            }
        });

        for (var menuItem in items[item]) {
            switch (items[item][menuItem]["type"]) {
                case "button":
                    $(".toolbar-menu").last().append(`<div class="toolbar-menu-item">${menuItem}</div>`);
                    break;
                case "toggle":
                    $(".toolbar-menu").last().append(`
                        <div style="position:relative;" class="toolbar-menu-item">
                            <input type="checkbox">
                            <span>${menuItem}</span>
                        </div>
                    `);
                    break;
                case "line":
                    $(".toolbar-menu").last().append("<hr style=\"margin:3px 2px;\">");
                    break;
                case "panel":
                    $(".toolbar-menu").last().append(`<div class="toolbar-menu-item">${menuItem}</div>`);
            }
        }
    }
}
