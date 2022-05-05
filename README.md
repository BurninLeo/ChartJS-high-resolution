# ChartJS-high-resolution

JavaScript to download a ChartJS chart in high resolution.

Are you using ChartJS charts in your web application, and your customer asked if you could also download the charts? Of course, you can, but the screen resolution is usually insufficient. And when settings a larger `width` and `height` to the canvas and scale it down via CSS (setting the ChartJS option `responsive: false`), the mouseovers from ChartJS will not work properly and more.

Here is a little solution the will create a copy of the `Chart` in a larger `<canvas>`, resize the font size and line widths, and provide a download button.

## Usage

```
<script src="highres.js"></script>
<script type="text/javascript">
var canvas = document.getElementById("screenOutput");
var chart = new Chart(canvas, ...);
  
new ChartHighRes(chart, canvas);
</script>
```

## Licence

Please consider this repository public domain.
