var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
var apicache = require('apicache').options({ debug: true }).middleware;

router.get('/club/:id', apicache('60 minutes'), function(req, res, next) {

  strava.clubs.get({id:req.params.id},function(err,payload) {
    if(!err) {
      response = {
        'id':payload.id,
        'name':payload.name,
        'avatar':payload.profile,
        'description':payload.description
      };
      return res.json(response);
    }
    else {
      console.log(err);
    }
  });

});

router.get('/club/:id/members', apicache('60 minutes'), function(req, res, next) {

  strava.clubs.listMembers({id:req.params.id, per_page:200},function(err,payload) {
    if(!err) {

      var response = [];
      for(var i = 0; i < payload.length; ++i){

        response[i] = {
          'id':payload[i].id, 
          'name':payload[i].firstname,
          'avatar':payload[i].profile_medium
        };
      }

      return res.json(response);
    }
    else {
      console.log(err);
    }
  });

});

router.get('/club/:id/leaderboard', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listActivities({id:req.params.id, per_page:200},function(err,payload) {
    if(!err) {

      if(payload.message == "Authorization Error"){
        return res.status(401);
      }
      var currentDate = new Date().toISOString();

      var reduced = payload.reduce(function(acc, x) {
        if(x.start_date_local.substring(0,7) != currentDate.substring(0,7)){
          return acc;
        }
        var id = acc[x.athlete.id];
        if (id) {
          id.rides += 1;
          id.distance += x.distance;
          id.moving_time += x.moving_time;
          id.total_elevation_gain += x.total_elevation_gain;
          id.achievement_count += x.achievement_count;
        } else {
          acc[x.athlete.id] = x;
          acc[x.athlete.id].rides = 1;
          delete x.athlete.id;
        }
        return acc;
      },{});

      var response = [];
      var iterator = 0;

      for(var key in reduced) {
        response[iterator] = {
          'id':key,
          'name':reduced[key].athlete.firstname + ' ' + reduced[key].athlete.lastname,
          'distance':parseFloat((reduced[key].distance/1000).toFixed(1)),
          'time':reduced[key].moving_time,
          'elevation_gain':Math.round(reduced[key].total_elevation_gain),
          'average_speed':parseFloat(((reduced[key].distance/reduced[key].moving_time)*3.6).toFixed(1)),
          'achievement_count':reduced[key].achievement_count,
          'ride_count':reduced[key].rides,
          'avatar':reduced[key].athlete.profile_medium
        };
        ++iterator;
      }

      return res.json(response);
    }
    else {
      console.log(err);
    }
  });


});

router.get('/club/:id/activities', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listActivities({id:req.params.id, per_page:200},function(err,payload) {
    if(!err) {

      var currentDate = new Date().toISOString();

      var response = [];
      for(var i = 0; i < payload.length; ++i){
        if(payload[i].start_date_local.substring(0,7) != currentDate.substring(0,7)){
          break;
        }
        response[i] = {
          'id':payload[i].id, 
          'athlete':payload[i].athlete.firstname + ' ' + payload[i].athlete.lastname,
          'athlete_id':payload[i].athlete.id,
          'avatar':payload[i].athlete.profile_medium,
          'name':payload[i].name,
          'distance':(payload[i].distance/1000).toFixed(1),
          'time':payload[i].moving_time,
          'elevation_gain':Math.round(payload[i].total_elevation_gain),
          'type':payload[i].type,
          'start_date':payload[i].start_date_local,
          'achievement_count':payload[i].achievement_count,
          'average_speed':(payload[i].average_speed*3.6).toFixed(1),
          'average_watts':Math.round(payload[i].average_watts),
          'energy_output':Math.round(payload[i].kilojoules)
        };
      }
      return res.json(response);
    }
    else {
      console.log(err);
    }
  });

});

//last 5 rides
router.get('/club/:id/activities/latest', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listActivities({id:req.params.id, per_page:200},function(err,payload) {
    if(!err) {

      var currentDate = new Date().toISOString();

      var response = [];
      for(var i = 0; i < payload.length; ++i){
        if(i > 4){
          break;
        }
        response[i] = {
          'id':payload[i].id, 
          'athlete':payload[i].athlete.firstname + ' ' + payload[i].athlete.lastname,
          'athlete_id':payload[i].athlete.id,
          'avatar':payload[i].athlete.profile_medium,
          'name':payload[i].name,
          'distance':(payload[i].distance/1000).toFixed(1),
          'time':payload[i].moving_time,
          'elevation_gain':Math.round(payload[i].total_elevation_gain),
          'type':payload[i].type,
          'start_date':payload[i].start_date_local.substring(0,10),
          'achievement_count':payload[i].achievement_count,
          'average_speed':(payload[i].average_speed*3.6).toFixed(1),
          'average_watts':Math.round(payload[i].average_watts),
          'energy_output':Math.round(payload[i].kilojoules)
        };
      }
      return res.json(response);
    }
    else {
      console.log(err);
    }
  });

});

router.get('/club/:id/activities/sum', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listActivities({id:req.params.id, per_page:200},function(err,payload) {
    if(!err) {

      var currentDate = new Date().toISOString();

      var distance = 0;
      var time = 0;
      var elevation_gain = 0;

      for(var i = 0; i < payload.length; ++i){
        if(payload[i].start_date_local.substring(0,7) != currentDate.substring(0,7)){
          break;
        }
        distance += payload[i].distance/1000;
        time += payload[i].moving_time;
        elevation_gain += payload[i].total_elevation_gain;
      }

      var response = {
          'distance':distance.toFixed(1),
          'time':time,
          'elevation_gain':Math.round(elevation_gain)
      };

      return res.json(response);
    }
    else {
      console.log(err);
    }
  });

});

module.exports = router;
