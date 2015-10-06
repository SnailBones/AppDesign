var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();
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

function getMinutes(str)
{   var arr=str.split(/[\s:\+]+/);
    //console.log(arr);
    arr[0]=parseFloat(arr[0]);
    arr[1]=parseFloat(arr[1]);
    if (arr[0]==12)
    { arr[0]=0; }
    if (arr[2]=="PM")
    { arr[0]+=12; }
    return (arr[0]*60)+arr[1];
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
        //if( req.url.indexOf( "first_form?" ) >= 0 )
        if( req.url.indexOf( "first_form?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            fixstart=kvs.start_time.replace('%3A',':');
            fixend=kvs.end_time.replace('%3A',':');
            console.log(fixstart + " " + fixend);
            var minstart=getMinutes(fixstart);
            var minend=getMinutes(fixend);
            console.log(minstart + " " + minend);
            var db = new sql.Database( 'weather.sqlite' );
                db.all( "SELECT * FROM Weather",
                function( err, rows ) {
                    //console.log( rows );
                    res.writeHead( 200 );
                    resp_text = "";
                    if (!minstart|| !minend)
                    {
                      resp_text += "that's not a time silly! oh well. here's all the data: \n";
                      var show_em_all=true;
                    }
                    else if (minstart >= minend)
                    {
                      resp_text += "your second time needs to be later, silly. here's all the data: \n";
                      var show_em_all=true;
                    }
                    else {var show_em_all=false;}
                    for( var i = 0; i < rows.length; i++ )
                    {
                      a=rows[i]
                      var mindata = getMinutes(a.Time);
                      if (show_em_all || (mindata > minstart && mindata < minend))
                      {

                        resp_text += "Time: "+ a.Time + ", Dew Point: " + a.DewPoint + ", Humidity: " + a.Humidity + ", Pressure: " + a.SeaLevelPressure +", Visibility: " + a.Visibility +", Wind Direction: "+ a.WindDirection +", Wind Speed: " + a.WindSpeed +", Gust Speed: " + a.GustSpeed + ", Precipitation: "+a.Precipitation+", Events: "+a.Events+", Conditions: "
                          +a.Conditions+", Wind Direction (Degrees): "+ a.WindDirDegrees+", Date and Time: "+ a.Date+"\n";
                        //console.log( rows[i] );
                      }

                    }
                    res.end( resp_text );
                    //console.log( rows );
                } );
        }
        else if( req.url.indexOf( "add?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            res.writeHead( 200 );

            var arr=[];
            var i = 0;
            for (var key in kvs)
              {console.log(key + ": " + kvs[key]);
              var fix= kvs[key].replace('+'," ").replace('%3A',':');
              arr.push(fix);
              //arr[i]=kvs[key];
              //i++;
            }
            //console.log(arr);
            var db = new sql.Database( "weather.sqlite" );

                  //console.log( err );
                  res.writeHead( 200 );
                  resp_text = "";
                  try
                  {
                      db.run( "INSERT INTO Weather (Time, DewPoint,Humidity, SeaLevelPressure, Visibility, WindDirection, WindSpeed, GustSpeed, Precipitation, Events, Conditions, WindDirDegrees, Date)"
                             + "VALUES ('" + arr[0] + "','"+ arr[1] + "','"+ arr[2] + "','"+ arr[3] + "','"+ arr[4] + "','"+ arr[5] + "','"+ arr[6] +
                             "','"+ arr[7] + "','"+ arr[8] + "','"+ arr[9] + "','"+ arr[10] + "','"+ arr[11] + "','"+ arr[12] + "');"
                                )
                    //  console.log( "INSERT INTO Weather (Time, DewPoint,Humidity, SeaLevelPressure, Visibility, WindDirection, WindSpeed, GustSpeed, Precipitation, Events, Conditions, WindDirDegrees, Date)"
                      //       + "VALUES ('" + arr[0] + "','"+ arr[1] + "','"+ arr[2] + "','"+ arr[3] + "','"+ arr[4] + "','"+ arr[5] + "','"+ arr[6] +
                        //     "','"+ arr[7] + "','"+ arr[8] + "','"+ arr[9] + "','"+ arr[10] + "','"+ arr[11] + "','"+ arr[12] + "');"
                          //      )
                      resp_text += ( "added to database! here is your entry in his new home: \n" );
                  }
                  catch (e)
                  {
                      res.end( "Something went wrong :" );
                      console.log( e );
                  }
                  db.all( "SELECT * FROM Weather",
                    function( err, rows ) {
                    //  console.log(rows.length);
                      for( var i = 0; i < rows.length; i++ )
                      {
                        a=rows[i];
                        resp_text += "Time: "+ a.Time + ", Dew Point: " + a.DewPoint + ", Humidity: " + a.Humidity + ", Pressure: " + a.SeaLevelPressure +", Visibility: " + a.Visibility +", Wind Direction: "+ a.WindDirection +", Wind Speed: " + a.WindSpeed +", Gust Speed: " + a.GustSpeed + ", Precipitation: "+a.Precipitation+", Events: "+a.Events+", Conditions: "
                        +a.Conditions+", Wind Direction (Degrees): "+ a.WindDirDegrees+", Date and Time: "+ a.Date+"\n";
                      }
                      res.end( resp_text );
                    } );
                  //res.end( resp_text );



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
