var Firebird = require('node-firebird');
var Path = require('path');

var get_tables = function (callback) {
    var options = {};
    var tables_string = "";
    options.host = 'localhost';
    options.port = 3050;
    // options.database = Path.join(process.cwd(),'/db/employee.fdb');
    options.database = '/var/lib/firebird/3.0/data/employee.fdb';
    options.user = 'SYSDBA';
    options.password = 'masterkey';
    options.lowercase_keys = false; // set to true to lowercase keys
    options.role = null;            // default
    options.pageSize = 8192;        // default when creating database
  
    Firebird.attach(options, function(err, db) {
      if (err) {
        callback(err,"");
      } else {
          db.query("select rdb$relation_name as TABLE_NAME from rdb$relations \
            where rdb$system_flag = 0\
            and rdb$view_source is null order by 1", function(err, result) { 
            tables_string = "<table><tr><th>TABLE_NAME</th></tr>";
            for (var i in result) {
              if (result[i].hasOwnProperty('TABLE_NAME')) {
                tables_string = tables_string + "<tr><td>" + result[i].TABLE_NAME + "</td></tr>";
              }
            }
            tables_string = tables_string + "</table>";
            callback(err,tables_string);  
          });
          db.detach();
      }
    });
}

exports.get_tables = get_tables;