
function BarChart(canvas, data) {
    this.canvas = canvas;
    this.data = data;
    this.labels = [];
    this.label_font = "14px Arial";
    this.label_textAlign = "center";
    this.label_textBaseLine = "bottom";
    this.label_fillStyle = "#000";
    this.label_padding = 10; // px

    // Grid style:
    this.grid_style = "rgba(150, 150, 150, 0.5)";

    // Y label:
    this.ylabel_angle = 0;
    this.ylabel_textBaseline = 'middle';
    this.ylabel_textAlign = 'center'; 
}

BarChart.prototype.set_labels = function set_labels(labels) {
    this.labels = labels;
}

BarChart.prototype.set_vertical_ylabels = function set_vertical_ylabels() {
    this.ylabel_angle = -Math.PI / 2;
    this.ylabel_textBaseline = 'top';
    this.ylabel_textAlign = 'left';      
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
    context.stroke();

    context.font = "13px Arial";
    context.textBaseline = 'middle';
    context.fillStyle = "#000";
    
    tick_width = 4;
    var stepSize = (canvas.height-padding*2) / (y_tick_count - 1);
    for(var i=0; i<y_tick_count; i++) 
        if (parseFloat(ticks[y_tick_count - i - 1])!=0)
        {   
            context.beginPath();
            context.moveTo(padding - tick_width/2, padding + stepSize*i);
            context.lineTo(padding + tick_width/2, padding + stepSize*i);
            context.stroke();
            context.beginPath();
            context.strokeStyle = this.grid_style;
            context.moveTo(padding + tick_width/2, padding + stepSize*i);
            context.lineTo(canvas.width - padding, padding + stepSize*i);
            context.stroke();
            context.beginPath();
            context.fillText(ticks[y_tick_count - i - 1], 
                padding + tick_width/2, padding + stepSize*i);
            context.stroke();
        }
}

BarChart.prototype.draw_ylabel = function draw_ylabel(canvas, text, padding) {
    context.save();
    context = canvas.getContext('2d');   
    context.translate(0, canvas.height/2);
    context.rotate(-Math.PI/2);
    context.textBaseline = 'top';
    context.textAlign = 'center';
    context.fillStyle = '#000';
    context.fillText(text, 0, 0);
    context.restore();
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
    bar_w = Math.ceil(bars_w / M);
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
    context.textAlign = this.label_textAlign;
    context.textBaseline = this.label_textBaseline;
    context.font = this.label_font;
    context.fillStyle = this.label_fillStyle;
    for(var i=0; i<this.labels.length; i++) {
        context.beginPath();
        context.save();
        context.textAlign = this.ylabel_textAlign;
        context.textBaseline = this.ylabel_textBaseline;
        context.translate(padding + bar_w*i + bar_w/2,
                h0 + padding - this.label_padding);
        context.rotate(this.ylabel_angle); // -Math.PI/2); 
        context.fillText(this.labels[i], 0, 0);
        context.restore();
        context.stroke();
    }              
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
    this.draw_ylabel(canvas, 'minutes', padding);
}
