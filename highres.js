function ChartHighRes(chart, canvas) {
    // See https://stackoverflow.com/a/50300880/336311
    var button = document.createElement("img");
    button.src = "../layout/button.download.0.svg";
    button.setAttribute("alt", "⇓");
    button.style.width = "30px";
    button.style.display = "block";
    var link = document.createElement('a');
    link.download = 'chart.png';
    link.style.position = "absolute";
    link.style.display = "block";
    link.style.border = "1px solid #CCCCCC";
    link.style.borderRadius = "5px";
    link.style.background = "#EEEEEE";
    link.style.padding = "3px";
    link.style.opacity = 0;
    link.append(button);
    var container = canvas.offsetParent;
    container.append(link);
    var canvasWidth = canvas.offsetWidth;
    var canvasHeight = canvas.offsetHeight;

   /**
    * Report mouse position relative to the page.
    * @param {Event} evt
    * @return undefined|Object
    */
    function getMousePos(evt) {
        // IE events
        if (!evt) {
            evt = window.event;
        }
        if (!evt) {
            return;
        }
        var mouseX;
        var mouseY;

        // Store position
        if (evt.touches && evt.touches[0]) {
            mouseX = evt.touches[0].pageX;
            mouseY = evt.touches[0].pageY;
        } else if (evt.changedTouches && evt.changedTouches[0]) {
            mouseX = evt.changedTouches[0].pageX;
            mouseY = evt.changedTouches[0].pageY;
        } else if (evt.pageX) {
            // evt.pageX returns a wrong value on Samsung Galaxy III/Android?!
            mouseX = evt.pageX;
            mouseY = evt.pageY;
        } else if (evt.clientX) {
            mouseX = evt.clientX + document.body.scrollLeft;
            mouseY = evt.clientY + document.body.scrollTop;
        } else {
            return;
        }

        return {
            x: mouseX,
            y: mouseY
        };
    };
  
    function getNodePos(node) {
        if ((node === null) || (node === undefined)) {
            throw new Error("No HTML node specified for getNodePosition");
        }

        if (node.getBoundingClientRect) {
            // The body may tell a wrong value for top in Firefox
            // var root = document.body.getBoundingClientRect();
            var rect = node.getBoundingClientRect();

            var sx = -(window.scrollX ? window.scrollX : window.pageXOffset);
            var sy = -(window.scrollY ? window.scrollY : window.pageYOffset);

            return {
                x: rect.left - sx,
                y: rect.top - sy,
                w: rect.right - rect.left,
                h: rect.bottom - rect.top
            };
        }

        var px = node.offsetLeft;
        var py = node.offsetTop;

        // Find relative to page, not to offsetParent
        while (node.offsetParent) {
            node = node.offsetParent;
            px += node.offsetLeft - node.scrollLeft;
            py += node.offsetTop - node.scrollTop;
        }

        return {
            x: px,
            y: py,
            w: node.offsetWidth,
            h: node.offsetHeight
        };
    };
  
    /**
     * Try and change each size definition in the chart
     */
    function changeFontSize(options, factor, level) {
        if ((level > 10) || (typeof options !== 'object')) {
            return options;
        }
        for (var key in options) {
            if ((key === "font") && ("size" in options[key])) {
                options.font.size = options.font.size * factor;
            } else if ((key === "gridLines") && ("tickMarkLength" in options[key])) {
                options.gridLines.tickMarkLength = options.gridLines.tickMarkLength * factor;
            } else if (key === "borderWidth") {
                options.borderWidth = options.borderWidth * factor;
            } else {
                options[key] = changeFontSize(options[key], factor, level + 1);
            }
        }
        return options;
    }

    // Create a larger canvas for the high resolution output
    var canvas2 = document.createElement("canvas");
    canvas2.setAttribute("width", 2048);
    canvas2.setAttribute("height", Math.round(2048 / canvasWidth * canvasHeight));
    canvas2.style.position = "absolute";
    canvas2.style.zIndex = -1;
    canvas2.style.width = canvasWidth + "px";
    canvas2.style.height = canvasHeight + "px";
    document.body.append(canvas2);

    var options = changeFontSize(chart.config.options, 2048 / canvasWidth, 0);
    var data = changeFontSize(chart.config.data, 2048 / canvasWidth, 0);
    options.responsive = false;
    var chartCopy = new Chart(
        canvas2.getContext("2d"),
        {
            type: chart.config.type,
            data: data, 
            options: options
        }
    );

    function onMouseOver() {
        link.href = canvas2.toDataURL();
        link.style.left = (canvas.offsetLeft + canvas.offsetWidth - 32) + "px";
        link.style.top = (canvas.offsetTop + 1) + "px";

        if ("Velocity" in window) {
            Velocity(link, "stop");
            Velocity(
                link,
                { opacity: 1 },
                { duration: 150 }
            );
        } else {
            link.style.opacity = 1;
        }
    }

    function onMouseOut(evt) {
        window.setTimeout(function() {
            var mPos = getMousePos(evt);
            var cPos = getNodePos(canvas);
            if ((mPos.x < cPos.x ) || (mPos.x > cPos.x + cPos.w) || (mPos.y < cPos.y ) || (mPos.y > cPos.y + cPos.h)) {
                if ("Velocity" in window) {
                    Velocity(link, "stop");
                    Velocity(
                        link,
                        { opacity: 0 },
                        { duration: 250, delay: 100 }
                    );
                } else {
                    link.style.opacity = 0;
                }
            }
        }, 50);
    }

    function onLinkOver() {
        button.src = "../layout/button.download.1.svg";
    }

    function onLinkOut(evt) {
        button.src = "../layout/button.download.0.svg";
        onMouseOut(evt);
    }

    canvas.addEventListener("mouseover", onMouseOver);
    canvas.addEventListener("mouseout", onMouseOut);
    link.addEventListener("mouseover", onLinkOver);
    link.addEventListener("mouseout", onLinkOut);
}
