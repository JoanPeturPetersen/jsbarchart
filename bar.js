
function BarChart(canvas, data) {
    this.canvas = canvas;
    this.data = data;
    this.labels = [];
    this.label_font = "14px Arial";
    this.label_textAlign = "center";
    this.label_textBaseLine = "bottom";
    this.label_fillStyle = "#000";
    this.label_padding = 10; // px
}

BarChart.prototype.set_labels = function set_labels(labels) {
    this.labels = labels;
}

BarChart.prototype.draw_axis = function draw_axis(canvas, padding, ticks) {
    y_tick_count = ticks.length;
    context = canvas.getContext('2d');
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.moveTo(padding, padding);
    context.lineTo(padding, canvas.height-padding);
    var dataplotmax = parseFloat(ticks[ticks.length - 1]);
    var dataplotmin = parseFloat(ticks[0]);
    var bars_h = canvas.height - padding*2;  
    var h0 = (dataplotmax/(dataplotmax-dataplotmin)) * bars_h; 
    context.moveTo(padding, h0 + padding);
    context.lineTo(canvas.width-padding, h0 + padding);

    context.font = "13px Arial";
    context.textBaseline = 'middle';
    context.fillStyle = "#000";
    
    tick_width = 4;
    var stepSize = (canvas.height-padding*2) / (y_tick_count - 1);
    for(var i=0; i<y_tick_count; i++) 
        if (parseFloat(ticks[y_tick_count - i - 1])!=0)
        {
            context.moveTo(padding - tick_width/2, padding + stepSize*i);
            context.lineTo(padding + tick_width/2, padding + stepSize*i);
                context.fillText(ticks[y_tick_count - i - 1], 
                        padding + tick_width/2, padding + stepSize*i);
        }
    context.stroke();
}

BarChart.prototype.draw_bars = 
  function draw_bars(canvas, data, dataplotmin, dataplotmax, padding) {
    // dataplotmax gives the highest data value on the plot (the top of
    // the y-axis).
    context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 200, 0.5)';
    M = data.length;
    bars_w = canvas.width - padding*2;
    bar_w = bars_w / M;
    bars_h = canvas.height - padding*2;
    var h0 = (dataplotmax/(dataplotmax-dataplotmin)) * bars_h;
    for(var i=0; i<M; i++) {
        h = (data[i]/(dataplotmax-dataplotmin)) * bars_h;
        context.fillRect(padding + bar_w*i, h0+padding, bar_w, -h);
    }
    context.stroke();
    context.beginPath();
    context.moveTo(padding, h0 + padding);
    context.lineTo(canvas.width-padding, h0 + padding);  
    context.stroke();
    // Draw labels:
    context.beginPath();
    context.textAlign = this.label_textAlign;
    context.textBaseline = this.label_textBaseline;
    context.font = this.label_font;
    context.fillStyle = this.label_fillStyle;
    for(var i=0; i<this.labels.length; i++) {
        var metrics = context.measureText(this.labels[i]);
        console.log(metrics);
        context.fillText(this.labels[i], padding + bar_w*i + bar_w/2,
                h0 + padding - this.label_padding);
    }              
    context.stroke();
}

BarChart.prototype.draw = function draw() {
    canvas = this.canvas;
    data = this.data;
    datamax = Math.max.apply(Math, data);
    datamin = Math.min.apply(Math, data);
    datamin = Math.min(datamin, 0); // Should pref. start from 0
    niceScale = new NiceScale(datamin, datamax);
    niceScale.setMaxTicks(5);
    context = canvas.getContext('2d');
    context.fillStyle = '#eee';
    context.fillRect(0, 0, canvas.width, canvas.height);
    var padding = 20;
    this.draw_axis(canvas, padding, niceScale.getTicks());
    this.draw_bars(canvas, data, niceScale.niceMin, niceScale.niceMax, padding);
}
