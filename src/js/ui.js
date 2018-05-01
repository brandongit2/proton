/**
 * Represents one point on the graph in terms of its X and Y coordinate.
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

(function() {
    window.data = {
        ui:     null,
        colors: null,
        layout: null,
        panels: null
    };
    var isMenuOpen = false;

    window.mouse = {
        x:  0,
        y:  0,
        dX: 0,
        dY: 0
    };

    $(function() {
        // Obtain JSON files
        var request1 = new XMLHttpRequest();
        request1.responseType = 'json';
        request1.open('GET', 'ui.json');
        request1.send();
        request1.onload = function() {
            data.ui = request1.response;
            populateToolbar();
        }

        var request2 = new XMLHttpRequest();
        request2.responseType = 'json';
        request2.open('GET', 'colors.json');
        request2.send();
        request2.onload = function() {
            data.colors = request2.response;
            setColors();
        }

        var request3 = new XMLHttpRequest();
        request3.responseType = 'json';
        request3.open('GET', 'default.math');
        request3.send();
        request3.onload = function() {
            data.layout = request3.response;
        }

        // Closes menus when user clicks outside of a menu
        window.addEventListener('mouseup', function(e) {
            if (e.button == 0 && isMenuOpen && !(e.target.matches('.toolbar-menu') || e.target.matches('.toolbar-menu *'))) {
                document.getElementsByClassName('menu-open')[0].classList.add('menu-close');
                document.getElementsByClassName('menu-close')[0].classList.remove('menu-open');
                if (document.getElementById('leave-menu') != null) {
                    document.getElementById('leave-menu').outerHTML = '';
                }
                isMenuOpen = false;
            }
        });

        var prevMouseX = 0;
        var prevMouseY = 0;
        var resetMousePos = null;
        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y - 20; // 20 is the toolbar height

            mouse.dX = mouse.x - prevMouseX;
            mouse.dY = mouse.y - prevMouseY;
            prevMouseX = mouse.x;
            prevMouseY = mouse.y;

            pan();

            clearTimeout(resetMousePos);
            resetMousePos = setTimeout(function() {
                mouse.dX = 0;
                mouse.dY = 0;
            }, 20);
        });

        //createWorkspace();
        displayGraph();
    });

    /**
     * Sets colors of different UI elements based on values set in colors.json.
     */
    function setColors() {
        var toolbar = $('#toolbar');
        var theme   = data.colors.light;
        toolbar.css('background-color', theme.toolbar.background);
        toolbar.css('color',            theme.toolbar.color);
        document.getElementById('extra-styling').innerHTML = `
            .toolbar-item > span:hover {
                background-color: ${theme.toolbar.item.hover.background};
                color:            ${theme.toolbar.item.hover.text};
            }
        `;

        var tools = $('#tools');
        tools.css('background-color', theme.panels.background);

        var tool = $('.tool');
        tool.css('color',  theme.panels.tools.color);
        tool.css('stroke', theme.panels.tools.color);
        tool.css('fill',   theme.panels.tools.color);

        // Replace all <img> SVGs with inline SVG so I can change their colors (code from Stack Overflow)
        // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
        $('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');

        });
    }

    /**
     * Populates the toolbar with items defined in ui.json.
     */
    function populateToolbar() {
        var toolbar = document.getElementById('toolbar');
        var items   = data.ui.toolbar;
        for (var item in items) {
            $("#toolbar").append(`
                <div class="toolbar-item">
                    <span>${item}</span>
                    <div class="toolbar-menu" id="menu-item-${item.toLowerCase()}"></div>
                </div>
            `);
            var toolbarItem = document.querySelector('.toolbar-item:last-child');

            // Opens menu
            toolbarItem.addEventListener('mouseup', function(event) {
                if (event.button == 0 && !isMenuOpen) {
                    var itemName = `menu-item-${event.target.innerText.toLowerCase()}`;
                    document.getElementById(itemName).classList.remove('menu-close');
                    document.getElementById(itemName).classList.add('menu-open');

                    var leaveMenu = document.createElement('div'); // Prevents clicks on other UI elements while menu is open
                    leaveMenu.style.height   = '100%';
                    leaveMenu.style.width    = '100%';
                    leaveMenu.style.position = 'absolute';
                    leaveMenu.style.zIndex   = '1';
                    leaveMenu.setAttribute('id', 'leave-menu');
                    document.body.appendChild(leaveMenu);
                    setTimeout(function() {
                        isMenuOpen = true;
                    }, 30);
                }
            });

            // Close current menu and open new one when moving mouse over another menu
            toolbarItem.addEventListener('mouseleave', function(event) {
                if (event.relatedTarget != null) {
                    if (isMenuOpen && event.relatedTarget.matches('.toolbar-item > span')) {
                        var openMenus = document.getElementsByClassName('menu-open');
                        for (var i = 0; i < openMenus.length; i++) {
                            openMenus[i].classList.add('menu-close');
                            openMenus[i].classList.remove('menu-open');
                        }

                        var itemName = `menu-item-${event.relatedTarget.innerText.toLowerCase()}`;
                        if (document.getElementById(itemName) != null) {
                            document.getElementById(itemName).classList.remove('menu-close');
                            document.getElementById(itemName).classList.add('menu-open');
                        }
                    }
                }
            });

            for (var menuItem in items[item]) {
                switch (items[item][menuItem]['type']) {
                    case 'button':
                        $('.toolbar-menu').last().append(`
                            <div></div>
                            <span class="toolbar-menu-item">${menuItem}</span>
                            <div></div>`);
                        break;
                    case 'toggle':
                        $('.toolbar-menu').last().append(`
                                <input type="checkbox" style="margin-left:8px;">
                                <span class="toolbar-menu-item center">${menuItem}</span>
                                <div></div>
                            </div>
                        `);
                        break;
                    case 'line':
                        $('.toolbar-menu').last().append('<hr style="margin:3px 2px; grid-column:1 / span 3;">');
                        break;
                    case 'panel':
                        $('.toolbar-menu').last().append('<div></div>');

                        var panelItem = document.createElement('div');
                        panelItem.classList.add('toolbar-menu-item');
                        panelItem.addEventListener('mouseover', function(event) {
                            if ($(event.target.parentNode).hasClass('menu-open')) {
                                event.target.append('<div class="menu-panel"></div>');
                            }
                        });
                        panelItem.innerHTML = menuItem;
                        document.getElementById('menu-item-' + item.toLowerCase()).appendChild(panelItem);
                        $('.toolbar-menu').last().append(`<div></div>`);

                }
            }
        }
    }
})(window);
