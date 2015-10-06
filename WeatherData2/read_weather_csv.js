var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

function makeDB(arr,sfile)
{
  //var stext = fs.readFileSync(sfile);
  var db = new sql.Database( String(sfile) );
  //console.log(arr[24]);
  //console.log(arr.length);
  console.log("bloop");
  for ( var i = 0; i < arr.length; i++ )
  {
    db.run(
               "INSERT INTO Weather (Time, DewPoint,Humidity, SeaLevelPressure, Visibility, WindDirection, WindSpeed, GustSpeed, Precipitation, Events, Conditions, WindDirDegrees, Date)"
               + "VALUES ('" + arr[i][0] + "','"+ arr[i][1] + "','"+ arr[i][2] + "','"+ arr[i][3] + "','"+ arr[i][4] + "','"+ arr[i][5] + "','"+ arr[i][6] +
               "','"+ arr[i][7] + "','"+ arr[i][8] + "','"+ arr[i][9] + "','"+ arr[i][10] + "','"+ arr[i][11] + "','"+ arr[i][12] + "');"
                  )
  }
/*console.log(
             "INSERT INTO Weather (Time, DewPoint,Humidity, SeaLevelPressure, Visibility, WindDirection, WindSpeed, GustSpeed, Precipitation, Events, Conditions, WindDirDegrees, Date)"
             + "VALUES ('" + arr[i][0] + "','"+ arr[i][1] + "','"+ arr[i][2] + "','"+ arr[i][3] + "','"+ arr[i][4] + "','"+ arr[i][5] + "','"+ arr[i][6] +
             "','"+ arr[i][7] + "','"+ arr[i][8] + "','"+ arr[i][9] + "','"+ arr[i][10] + "','"+ arr[i][11] + "','"+ arr[i][12] + "');");
  /*
  sql.executeSql(
  INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
  VALUES (1, 'Paul', 32, 'California', 20000.00 );
  //sql.executeSql("INSERT INTO MyTable(123, "weather.sqlite", "blablablabl")")
  //sql.executeSql('INSERT INTO folderData (username) VALUES ()');
  //  tx.executeSql("INSERT INTO MyTable(ID, Name, Content) VALUES(?,?,?)",
  //              [123, "Some Name", content]);*/
}

function readFile( fn, sfile )
{
  //try
  {
      //lines1 and lines2 are arrays of strings
      var lines = fs.readFileSync( fn ).toString().split( "\n" );
      //console.log(lines);
      lines.splice(0,1);
      lines.splice(-1,1);

      var parts = [];
      // 2 d array, parts[i][0] is name, parts[i][1] is address
      for ( var i = 0; i < lines.length; i++ )
      {
          parts.push([]);
          parts[i]=lines[i].split(/\,+/);
          //parts[i][0]=parts[i][0] + " " + parts[i][1];
          //parts[i].splice(1,1);
          //console.log(parts[i][1]);
          //console.log(parts[i]);
      }
      //console.log("length:" + lines.length);
      //console.log(parts[24]);
      makeDB(parts,sfile);

  }
/*
  catch( e )
  {
      console.log("Error: Something bad happened trying to open "+fn );
      console.log( e );
      process.exit( 1 );
  }
*/
}
readFile("weather_data.csv", "weather.sqlite" );
