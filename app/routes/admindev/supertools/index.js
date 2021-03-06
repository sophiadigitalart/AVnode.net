const router = require('../../router')();
const mongoose = require('mongoose');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.get('/', (req, res) => {
  logger.debug('/admindev/supertools/');
  res.render('admindev/supertools/home', {
    title: 'admindev/supertools',
    superuser:config.superusers.indexOf(req.user._id.toString())!==-1,
    currentUrl: req.originalUrl,
    data: 'LOAD DATA'
  });
});

module.exports = router;