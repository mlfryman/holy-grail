/* jshint camelcase:false */
/* global google:true */

(function(){
  'use strict';
  $(document).ready(function(){
    $('#addHint').click(addHint);
    $('form').submit(addTreasure);
  });

  function addHint(){
    var $i = $('<input>');
    $i.attr('type', 'text');
    $i.attr('name', 'hints');
    $i.addClass('form-control');
    $i.addClass('inserted');
    $('#hints').append($i);
  }

  function addTreasure(e){
    var lat = $('#lat').val();

    if(!lat){
      var name = $('#locName').val();
      geocode(name);
      e.preventDefault();
    }
  }

  function geocode(address){
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: address}, function(results, status){
      var name = results[0].formatted_address,
          lat = results[0].geometry.location.lat(),
          lng = results[0].geometry.location.lng();

      $('#name').val(name);
      $('#lat').val(lat);
      $('#lng').val(lng);
      $('form').submit();
      console.log(name, lat, lng);
    });
  }
})();
