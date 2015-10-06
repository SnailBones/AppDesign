var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

function getMinutes(str)
{   arr=str.split(':');
    arr[0]=parseFloat(arr[0]);
    arr[1]=parseFloat(arr[1]);
    if (arr[0]<12)
    { arr[0]+=12; }
    return (arr[0]*60)+arr[1];
}

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
    return kvs
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
        if( req.url.indexOf( "get_time?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            var db = new sql.Database("telluride.sqlite");
            //console.log(kvs);
            var mytime =kvs.time.replace('%3A',':');
            var mymin=getMinutes(mytime);
            //console.log(mytime+" "+mymin);
            db.all( "SELECT Performers.Name as GroupName, Stages.Name as StageName," +
            "* FROM Performances " +
                  //'JOIN Stages.Name as StageName ON Stages.ID = Performances.SID '+
                'JOIN Stages ON Stages.ID = Performances.SID '+
                "JOIN Performers ON Performers.ID = Performances.PID",
              //  "JOIN Stages ON Stages.ID = Performances.SID "+
            //  "WHERE Capacity < GroupSize",
            function(err,rows){
              if (err != null)
              { console.log(err);
                return;
              }
              var mytext = "";
              //console.log(rows);
              //console.log(rows.length);
              for ( var i = 0; i < rows.length; i++ )
              {
                min = getMinutes(rows[i].Time);
                //console.log("minutes: "+ mymin + " "+ min);
                if (min>mymin)
                {
                  mytext+=( "NAME:"+ rows[i].GroupName + " STAGE: "+ rows[i].StageName+ " TIME: "+ rows[i].Time + "\n");
                }

                //console.log(min);

              }
              res.end("shows after "+mytime+ ":\n" +mytext);
            });
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
