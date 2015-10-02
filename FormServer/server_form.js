var fs = require( 'fs' );
var http = require( 'http' );

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    // console.log( kvs );
    return kvs
}

function logValues( obj )
{
  //console.log(obj);
  //var logtext = ".mood: "+ arr.mood + ".how many: "+arr.how_many+".color: "+ arr.shiny + "\n";
  var logtext = "";
  for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
          logtext += i + " = " + obj[i] + "\n";
      }
  }
  logtext += "\n"
  var logfile = fs.appendFile("logfile.log", logtext);
  console.log("values has been logged");
  console.log(logtext);

}
function logValues2( arr )
{
  console.log(arr);
  var logtext = ".mood: "+ arr.mood + ".how many: "+arr.how_many+".color: "+ arr.shiny + "\n";
  var logfile = fs.appendFile("logfile.log", logtext);
  console.log("values has been logged");
  console.log(logtext);

}

function server_fun( req, res )
{
    console.log( req.url );
    // ...
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        // console.log( "huh?", req.url.indexOf( "second_form?" ) );
        if( req.url.indexOf( "first_form?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            res.writeHead( 200 );
            res.end( "You submitted the first form!!!!! " + kvs[ "how_many" ] );
            logValues(kvs);
        }
        else if( req.url.indexOf( "second_form?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            res.writeHead( 200 );
            res.end( "You submitted the second form!!!!!" );
            logValues(kvs);
        }
        else
        {
            // console.log( exp );
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
