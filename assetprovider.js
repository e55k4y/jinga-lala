var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AssetProvider = function(host, port) {
  this.db= new Db('assetDb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


AssetProvider.prototype.getCollection= function(callback) {
  this.db.collection('asset', function(error, asset_collection) {
    if( error ) callback(error);
    else callback(null, asset_collection);
  });
};

//find asset by Id
AssetProvider.prototype.findAsset = function(id,callback) {
    this.getCollection(function(error, asset_collection) {
      if( error ) callback(error)
      else {
          asset_collection.findOne({_id:parseInt(id)},function(error, result) {
          
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//update asset status
AssetProvider.prototype.updateStat = function(assetId, newStatus, callback) {
    this.getCollection(function(error, asset_collection) {
      if( error ) callback(error);
      else {
        asset_collection.update(
                                        {_id: parseInt(assetId)},
                                        {$set:{status:newStatus}},
                                        function(error, newStatus) {
                                                if(error) callback(error);
                                                else callback(null,newStatus)       
                                        });
      }
    });
};

//update asset location
AssetProvider.prototype.updateLoc= function(assetId, newlocation, callback) {
    this.getCollection(function(error, asset_collection) {
      if( error ) callback(error);
      else {
        asset_collection.update(
                                        {_id: parseInt(assetId)},
                                        {$set:{left:newlocation.left,
					top:newlocation.top}},
                                        function(error, newlocation) {
                                                if(error) callback(error)
                                                else callback(null,newlocation)       
                                        });
      }
    });
};


exports.AssetProvider = AssetProvider;