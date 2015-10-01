var http = require( 'http' );
var fs   = require( 'fs' );

/*
if( process.argv.length < 3 )
{
    console.log( "put in a file silly" );
    process.exit( 1 );
}
var fn = process.argv[ 2 ];
*/

function server_fun( req, res )
{
    // console.log( req );
    address=req.url;
    fn = address.slice(1,address.length);

    console.log( fn );
    try
    {
        var filetext=fs.readFileSync( fn );
        res.end(filetext);
    }
    catch( e )
    {
        console.log( "i'm sorry. i haven't heard from " + fn + " in years."  )
        res.end("the world is a sad place");
    }

    //res.writeHead( 200 );
    //res.end( "Hello world" );
    //res.end("this is a new line");

}

var server = http.createServer( server_fun );

server.listen( 8080 );
