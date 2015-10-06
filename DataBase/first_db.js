var sql = require( 'sqlite3' ).verbose();

var db = new sql.Database( 'first_db.sqlite' );

db.each( "SELECT * FROM Students",
    function( err, row ) {
        console.log( row );
    } );
