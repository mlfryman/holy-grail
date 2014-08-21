/* jshint unused:false, camelcase:false */
/* global google:true, _:true */

(function(){
  'use strict';

  var map,
      directionsDisplay;

  $(document).ready(function(){
    directionsDisplay = new google.maps.DirectionsRenderer();
    initMap(39.8282, -98.5795, 4);
    directionsDisplay.setMap(map);
    var locations = getLocations();
    // console.log(locations);
    calcRoute(locations);
  });

  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#a2daf2'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'color':'#f7f1df'}]},{'featureType':'landscape.natural','elementType':'geometry','stylers':[{'color':'#d0e3b4'}]},{'featureType':'landscape.natural.terrain','elementType':'geometry','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#bde6ab'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi.medical','elementType':'geometry','stylers':[{'color':'#fbd3da'}]},{'featureType':'poi.business','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#ffe15f'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#efd151'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'black'}]},{'featureType':'transit.station.airport','elementType':'geometry.fill','stylers':[{'color':'#cfb2db'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles, icon:'/img/flag.png'};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function calcRoute(locs){
    var directionsService = new google.maps.DirectionsService(),
        start = _.min(locs, 'order'),
        end = _.max(locs, 'order'),
        waypts = _.cloneDeep(locs);
    // console.log('start', start);
    // console.log('end', end);
    // remove the starting location
    _.remove(waypts, function(point){
      return point.order === start.order;
    });
    // remove the end location
    _.remove(waypts, function(point){
      return point.order === end.order;
    });
    // sort first to last based on order
    waypts.sort(function(a, b){
      return a.order - b.order;
    });
    // convert points array to waypoints array
    waypts = waypts.map(function(p){
      return {location:p.name, stopover:true};
    });
    // create request object
    var request = {
      origin: start.name,
      destination: end.name,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status){
      if (status === google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }
    });
  }

  function getLocations(){
    var locations = $('table tbody tr').toArray().map(function(o){
      var loc = {};
      loc.name = $(o).attr('data-name');
      loc.lat = parseFloat($(o).attr('data-lat'));
      loc.lng = parseFloat($(o).attr('data-lng'));
      loc.order = parseInt($(o).attr('data-order'));
      // console.log(loc);
      return loc;
    });
    // console.log(locations);
    return locations;
  }

})();
