var mongoose = require('mongoose');
var Position = require('../models/Position');
var User = require('../models/User');

function findPositionplaces(min, max, longitude, latitude) {
    return Position.find({
            loc: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $minDistance: min,
                    $maxDistance: max
                }
            }
        }).populate('user')
        .exec();
}

function addPosition() {
    return new Position({
        user: '5bc23b8d4fe27e113c5f6efb',
        loc: {
            coordinates: [50, 32]
        }
    }).save(function (err) {
        if (err) console.log(err);
    });
}

module.exports = {
    findPositionplaces: findPositionplaces,
    addPosition: addPosition
}