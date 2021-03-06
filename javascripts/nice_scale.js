// This is translated from: http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks/16363437#16363437

function NiceScale(minPoint, maxPoint) {
  this.maxTicks = 10;
  var tickSpacing;
  var range;
  var niceMin;
  var niceMax;
  this.minPoint = minPoint;
  this.maxPoint = maxPoint;

  /**
   * Calculate and update values for tick spacing and nice
   * minimum and maximum data points on the axis.
   */
  this.calculate = function calculate() {
    this.range = this.niceNum(this.maxPoint - this.minPoint, false);
    this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
    this.niceMin =
      Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
    this.niceMax =
      Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
    console.log(this.tickSpacing, this.niceMin, this.niceMax);
  };

  this.log10 = function log10(val) {
    return Math.log(val) / Math.LN10;
  };
        
  /**
   * Returns a "nice" number approximately equal to range Rounds
   * the number if round = true Takes the ceiling if round = false.
   *
   * @param range the data range
   * @param round whether to round the result
   * @return a "nice" number to be used for the data range
   */
  this.niceNum = function niceNum(range, round) {
    var exponent; /** exponent of range */
    var fraction; /** fractional part of range */
    var niceFraction; /** nice, rounded fraction */

    exponent = Math.floor(this.log10(range));
    fraction = range / Math.pow(10, exponent);

    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    } else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  };

  /**
   * Sets the minimum and maximum data points for the axis.
   *
   * @param minPoint the minimum data point on the axis
   * @param maxPoint the maximum data point on the axis
   */
  this.setMinMaxPoints = function setMinMaxPoints(minPoint, maxPoint) {
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
    this.calculate();
  };

  /**
   * Sets maximum number of tick marks we're comfortable with
   *
   * @param maxTicks the maximum number of tick marks for the axis
   */
  this.setMaxTicks = function setMaxTicks(maxTicks) {
    this.maxTicks = maxTicks;
    this.calculate();
  };

  this.getTicks = function getTicks() {
    N = (this.niceMax - this.niceMin) / this.tickSpacing + 1;
    var ticks = new Array();
    for(var i=0; i<N; i++)
        ticks[i] = this.niceMin + i*this.tickSpacing;
    return ticks;
  };

  this.calculate();
}
 
