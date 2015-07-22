var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
var apicache = require('apicache').options({ debug: true }).middleware;

router.get('/club/:id', apicache('5 minutes'), function(req, res, next) {

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

router.get('/club/:id/members', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listMembers({id:req.params.id},function(err,payload) {
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

router.get('/club/:id/activities', apicache('5 minutes'), function(req, res, next) {

  strava.clubs.listActivities({id:req.params.id},function(err,payload) {
    if(!err) {

      var response = [];
      for(var i = 0; i < payload.length; ++i){
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

module.exports = router;
