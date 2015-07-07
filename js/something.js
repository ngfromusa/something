$(document).ready(function(){
  ajaxCall();
});

function ajaxCall() {
  $(".address").hide();
    var name = $('#name').val().toLowerCase().replace(/ /g, '-');
  $.ajax({
    type:'GET',
    url: 'https://data.cityofnewyork.us/resource/xx67-kt59.json?dba='+name,
    contentType: "application/json; charset=utf-8",
    jsonp: 'jsonp_callback'
  }).done(function(results) {
      findAddress(results);
  });
}
function findAddress(results){
  var places=[];
  results.forEach(function(place){
    clickBoro(place, places);
  });
  findGrade(places);  
};


function clickBoro(place, places){
  $(".boro ul").on("click", "li", function(borough){ 
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