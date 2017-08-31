var animatePoints = function() {

  var points = document.getElementsByClassName('point');

   var revealPoint = function(value) {
        points[value].style.opacity = 1;
        points[value].style.transform = "scaleX(1) translateY(0)";
        points[value].style.msTransform = "scaleX(1) translateY(0)";
        points[value].style.WebkitTransform = "scaleX(1) translateY(0)";

  }
  for(var i = 0; i <  points.length; i++) {
    revealPoint(i);
  }
 };
