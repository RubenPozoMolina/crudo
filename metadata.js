var Firebird = require('node-firebird');
var Path = require('path');

var options = {};
options.host = 'localhost';
options.port = 3050;
// options.database = Path.join(process.cwd(),'/db/employee.fdb');
options.database = '/var/lib/firebird/3.0/data/employee.fdb';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 8192;        // default when creating database

var get_tables = function (callback) {
    var table_name = "";
    var tables_string = "";
    var table_link = "";
  
    Firebird.attach(options, function(err, db) {
      if (err) {
        callback(err,"");
      } else {
          db.query("select rdb$relation_name as TABLE_NAME from rdb$relations \
            where rdb$system_flag = 0\
            and rdb$view_source is null order by 1", function(err, result) { 
            tables_string = "<table>\n<tr><th>TABLE_NAME</th></tr>\n";
            for (var i in result) {
              if (result[i].hasOwnProperty('TABLE_NAME')) {
                table_name = result[i].TABLE_NAME;
                table_link = "<a href=\"/"+table_name.trim()+"\">"+table_name.trim()+"</a>"; 
                tables_string+= "<tr><td>" + table_link + "</td></tr>\n";
              }
            }
            tables_string += "</table>\n";
            callback(err,tables_string);  
          });
          db.detach();
      }
    });
}

var show_table = function (table_name,callback) {
  var tables_string = "";
  var field_name = "";
  var field_value = "";
  var table_header = "";
  var fields = "";
  var table_body = "";
  var fields_array = [];

  console.log("show table " + table_name);
  Firebird.attach(options, function(err, db) {
    if (err) {
      console.log(err);
      callback(err,"");
    } else {
        // Table header
        db.query(" select r.rdb$field_name as FIELD_NAME, r.rdb$null_flag, r.rdb$field_source, \
                   l.rdb$collation_name, f.rdb$computed_source, r.rdb$default_source, \
                   r.rdb$description \
                   from rdb$fields f \
                   join rdb$relation_fields r \
                   on f.rdb$field_name=r.rdb$field_source \
                   left outer join rdb$collations l \
                   on l.rdb$collation_id = r.rdb$collation_id \
                   and l.rdb$character_set_id = f.rdb$character_set_id \
                   where r.rdb$relation_name = ? \
                   order by r.rdb$field_position",[table_name], function(err,result){
                   if (err){
                    console.log(err);
                    callback(err,"");
                   }
                   table_header += "<tr>\n";
                   for (var i in result){
                      field_name = (result[i].FIELD_NAME).trim();
                      fields += field_name;
                      fields_array.push(field_name);
                      if (i < (Object.keys(result).length - 1)){
                        fields += ","; 
                      }
                      table_header += "<th>"+field_name+"</th>\n";
                   }
                   console.log(fields);
                   table_header += "</tr>\n";
                   db.query("select "+ fields +" from "+table_name, function(err,result){
                    console.log(fields_array);
                    if (err){
                      console.log(err);
                      callback(err,"");
                     }
                    for (var j in result){
                      table_body += "<tr>\n";
                      for (var k in fields_array)
                        {
                        table_body += "<td>"+result[j][fields_array[k]]+"</td>\n";
                        }
                      table_body += "<tr>";
                   }
                   tables_string = "<table>"+table_header+table_body+"</table>";
                   callback(err,tables_string);
                  }); 
        });
      db.detach();
    }
  });
}

exports.get_tables = get_tables;
exports.show_table = show_table;