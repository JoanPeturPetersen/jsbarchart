


function draw_axis(canvas, padding, ticks) {
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
    context.fillStyle = "#999999";
    
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
    for(var i=0; i<M; i++) {
        var h0 = (dataplotmax/(dataplotmax-dataplotmin)) * bars_h;
        h = (data[i]/(dataplotmax-dataplotmin)) * bars_h;
        context.fillRect(padding + bar_w*i, h0+padding, bar_w, -h);
    }
    context.stroke();
    context.beginPath();
    context.moveTo(padding, h0 + padding);
    context.lineTo(canvas.width-padding, h0 + padding);  
    context.stroke();
}

function plot_bar(canvas, data) {
    datamax = Math.max.apply(Math, data);
    datamin = Math.min.apply(Math, data);
    datamin = Math.min(datamin, 0); // Should pref. start from 0
    niceScale = new NiceScale(datamin, datamax);
    niceScale.setMaxTicks(5);
    context = canvas.getContext('2d');
    context.fillStyle = '#eee';
    context.fillRect(0, 0, canvas.width, canvas.height);
    var padding = 20;
    draw_axis(canvas, padding, niceScale.getTicks());
    draw_bars(canvas, data, niceScale.niceMin, niceScale.niceMax, padding);
}
