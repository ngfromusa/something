$(document).ready(function(){
  findName();
});

function findName() {
  $("#submit").click(function(){ 
    var name = $('#name').val().toLowerCase();
  $.ajax({
    type:'GET',
    url: 'https://data.cityofnewyork.us/resource/xx67-kt59.json?dba='+name,
    contentType: "application/json; charset=utf-8",
    jsonp: 'jsonp_callback'
    }).done(function(results) {

      findAddress(results);
    });
  });
}
function findAddress(results){
  var boro = $('#boro').val().toUpperCase();
  var streets=[];
  var places=[];
  results.forEach(function(place){
    if (place.boro===boro){
      if (!_.contains(streets, place.street)){
        addHTML(place.street)
        places.push(place); 
      }
      streets.push(place.street); 
    }
  });
  // var uniqStreets=_.uniq(streets);
  // _.each((uniqStreets),function(street){$('.address ul').append('<li id='+street.replace(/ /g, '-')+'><a href="#">'+street+'</a></li>');});
  findGrade(places);  
};

function addHTML(street){
  $('.address ul').append('<li id='+street.replace(/ /g, '-')+'><a href="#">'+street+'</a></li>')
}

function findGrade(places){
  $(".address ul").on("click", "li", function(address){ 
    var streetClicked=this.id;
    // _.each((places),function(place){place.street});
    places.forEach(function(place){
      if (streetClicked===place.street.replace(/ /g, '-')){
        $('.result ul').append('<li>'+place.grade+'</li>');
        $('.result ul').append('<li>'+place.score+'</li>');
        $('.result ul').append('<li>'+place.violation_description+'</li>');
        $('.result ul').append('<li>'+place.inspection_date+'</li>');
      }
    });
  });
};
  // $("#recursion").one('click', function() {
  //  $(".numbers").append("HI");
  // });

  // $("#hash").one('click', function() {
  //  $("#bunny").animate({left: "+=500"}, 2000);
  //  $(".images text").first().before("<strong>{</strong>");
  //  $(".images text").last().append("<strong>}</strong>");
  // });


