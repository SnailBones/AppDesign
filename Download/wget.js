var http = require( 'http' );
var fs   = require( 'fs' );

if( process.argv.length < 3 )
{
    console.log( "Error: File with downloads required" );
    process.exit( 1 );
}
var fn = process.argv[ 2 ];
try
{
    //lines1 and lines2 are arrays of strings
    var lines = fs.readFileSync( fn ).toString().split( "\n" );
    lines.splice(-1,1);

    var parts = [];
    // 2 d array, parts[i][0] is name, parts[i][1] is address
    for ( var i = 0; i < lines.length; i++ )
    {
        parts.push([]);
        parts[i]=lines[i].split( " " );
    }
    //console.log("parts:");
    //console.log(parts);

}
catch( e )
{
    console.log(
        "Error: Something bad happened trying to open "+
            fn);
    process.exit( 1 );
}
function download( url, dest, callback )
{
    //console.log( "Start downloading" );
    var file = fs.createWriteStream( dest );
    try
    {
        var request = http.get( url, function( response ) {
            // console.log( "response??? ", response );
            //console.log( "response??? " );
            file.on( 'finish', function() {
                //console.log( "Finished writing!" );
            } );
            response.pipe( file );
        } );
      }
      catch( e )
      {
          console.log(
              "Error: " +dest+" with url: " + url + " is not valid");
          process.exit( 1 );
      }
    // Not temporally after the "get" is done!!!!!!!!

    request.on( 'error', function( err ) {
        console.log( "Error!!!", err );
    } );

    //console.log( "Sent request" );
}

// download( "http://cs.coloradocollege.edu/index.html", "cs.html", null );
//download( "http://cs.coloradocolege.edu/index.html", "cs.html", null );
//download("http://upload.wikimedia.org/wikipedia/commons/c/cb/Foo_was_here.jpg","foo.jpg",null);

for ( var i = 0; i < parts.length; i++ )
{
    //console.log(parts[i][1] + "   " +parts[i][0]);
    download(parts[i][1],parts[i][0],null);
}

console.log( "Done?" );
