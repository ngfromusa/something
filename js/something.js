$(document).ready(function(){
  getName();
 
});

// x = 50;
// y = 75
// startx = 0;
// starty = 75;

// function drawIt() {

//     var c = document.getElementById("mycanvas");
//     var ctx = c.getContext("2d");

//     ctx.beginPath();
//     ctx.lineWidth = "2";
//     ctx.strokeStyle = "blue"; // Green path
//     ctx.moveTo(startx, starty);
//     ctx.lineTo(x, y);

//     ctx.stroke(); // Draw it    
//     if (x > 350) {
//         window.clearInterval(timerId);
//     } else if (y <= 25 && x >= 250) {
//         starty = 25;
//         x += 5;
//     } else if (y <= 75 && x >= 250) {
//         x = startx = 250;
//         y -= 5;
//     } else {
//         x += 5;
//     }
// }
// timerId = window.setInterval(drawIt, 30);

function getName(){
  $(".address").hide();
  $(".boro").hide();
  var typing;
  $('#name').keyup(_.debounce(function(){
    clearTimeout(typing);
    if ($('#name').val()){
      var name = $('#name').val().toLowerCase().replace(/ /g, '%').replace(/'/g, "%27");
      typing = setTimeout(ajaxCall(name), 5000);
    }
    else{
      $('.boro').html("");
      $('.address').html("");
      $('.result').html("");
    }
  },300));  
}
  
function ajaxCall(name) {
  $.ajax({
    type:'GET',
    url: 'https://data.cityofnewyork.us/resource/xx67-kt59.json?dba='+name,
    contentType: "application/json; charset=utf-8",
    jsonp: 'jsonp_callback'
  }).done(function(results) {
    if (results.length>0){
      $('#alert').html("");
      findAddress(results);
    }
    else {
      $('#alert').html("Our records don't match '"+name+"'. Please try typing it again");
      $('.boro ul').html("");
    }
  });
}

function findAddress(results){
  var places=[];
  var boros=[];
  results.forEach(function(place){
    findBoro(place, boros)
    clickBoro(place, places);
  });
  findGrade(places);  
};

function findBoro(place, boros){
  var existingBoros=['MANHATTAN']
  if (boros.indexOf(place.boro) < 0&&boros.length<4){
    addBoro(place.boro)
    boros.push(place.boro)
  }
}

function addBoro(boro){
  $(".boro").show();
  $('.boro ul').append(
    '<li>'+boro+'</li>'
  )
}

function clickBoro(place, places){
  $(".boro ul").on("click", "li", function(borough){ 
    $(".boro li").css('background', 'rgb(205, 210, 211)');
    $(this).css('background', 'rgb(183, 190, 192)');
    var boro = $(this).text();
    if (place.boro===boro){
      if (!_.where(places, {'street':place.street}).length) {
        addHTML(place)
        places.push(place); 
      }
    }
  });
};

function addHTML(place){
  $(".address").show();
  // $('.address ul').append('<li><a href="#">'+place.street+'</a></li>');
  $('.address ul').append(
    '<li>'+place.street+'</li>')
}

function findGrade(places){
  $(".address ul").on("click", "li", function(address){ 
    $(".address li").css('background', 'rgb(205, 210, 211)');
    $(this).css('background', 'rgb(183, 190, 192)');
    var streetClicked=this.textContent;
    _.each((places),function(place){
    // places.forEach(function(place){
      if (streetClicked===place.street){
        $('.result ul').html(
          '<li>'+place.grade+'</li>'+
          '<li>'+place.score+'</li>'+
          '<li>'+place.violation_description+'</li>'+
          '<li>'+place.inspection_date+'</li>'
        )
      }
    });
  });
};