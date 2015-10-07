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
    return kvs
}

function addStudent( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Students(Name, SandwichPreference) VALUES ( ?, ? )", name, sandwich,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added student <a href='http://localhost:8080'> Home</a></body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>arror <a href='http://localhost:8080'> Home</a></body>" );
                }
            } );
}
function addTeacher( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Teachers(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added teacher <a href='http://localhost:8080'> Home</a></body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>arror <a href='http://localhost:8080'> Home</a></body>" );
                }
            } );
}
function addCourse( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'name' ];
    var sandwich = kvs[ 'sandwich' ];
    db.run( "INSERT INTO Courses(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added course <a href='http://localhost:8080'> Home</a></body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>arror <a href='http://localhost:8080'> Home</a></body>" );
                }
            } );
}
function addEnrollment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var student_id = kvs[ 'student_id' ];
    var course_id = kvs[ 'course_id' ];
    db.run( "INSERT INTO Enrollments(student, class) VALUES ( ?, ? )", student_id, course_id,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added assignment <a href='http://localhost:8080'> Home</a></body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>error <a href='http://localhost:8080'> Home</a></body>" );
                }
            } );
}
function addAssignment( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var teacher_id = kvs[ 'teacher_id' ];
    var course_id = kvs[ 'course_id' ];
    db.run( "INSERT INTO TeachingAssignments(teacher, class) VALUES ( ?, ? )", teacher_id, course_id,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added enrollment <a href='http://localhost:8080'> Home</a></body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>error <a href='http://localhost:8080'> Home</a></body>" );
                }
            } );
}

function showTable( table, res )
{
    var db = new sql.Database( 'registrar.sqlite' );
    db.all("SELECT * FROM " + table,
      function( err, rows ) {
        if (err != null)
        { console.log(err);
          return;
        }
        res.writeHead( 200 );
        var response_text = "<html><body><table><tbody><tr>";
        //making the label
        for( var item in rows[0])
        {
          response_text += "<td>" + item + ":</td>";
        }
        response_text+="</tr>";
        for( var i = 0; i < rows.length; i++ )
        {
          response_text += "<tr>"
          for( var item in rows[i])
          {
            //console.log(item + " " + rows[i][item];
            response_text += "<td>" + rows[i][item] + "</td>";
          }
          response_text += "</tr>"
        }
        response_text += "</tbody></table></body>"
        response_text +="<a href='http://localhost:8080/'>home</a></html>";
        res.end( response_text );
    } );
}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );
    // ...
    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            addStudent( req, res );
            res.end("<html>you added a student! <a href='http://localhost:8080/'>home</a></html>");
            //showTable( "Students", res );
        }
        else if( req.url.indexOf( "add_teacher?" ) >= 0 )
        {
            addTeacher( req, res );
            res.end("<html>you added a teacher! <a href='http://localhost:8080/'>home</a></html>");
            //showTable( "Students", res );
        }
        else if( req.url.indexOf( "add_course?" ) >= 0 )
        {
            addCourse( req, res );
            res.end("<html>you added a course! <a href='http://localhost:8080/'>home</a></html>");
            //showTable( "Students", res );
        }
        else if( req.url.indexOf( "add_enrollment?" ) >= 0 )
        {
            addEnrollment( req, res );
            res.end("<html>you enrolled in a course! <a href='http://localhost:8080/'>home</a></html>");
        }
        else if( req.url.indexOf( "add_assignment?" ) >= 0 )
        {
            addAssignment( req, res );
            res.end("<html>you assigned a course! <a href='http://localhost:8080/'>home</a></html>");
        }
        else if( req.url.indexOf( "view_student?" ) >= 0 )
        {
          showTable( "Students", res );
        }
        else if( req.url.indexOf( "view_teacher?" ) >= 0 )
        {
          showTable( "Teachers", res );
        }
        else if( req.url.indexOf( "view_assingment?" ) >= 0 )
        {
          showTable( "TeachingAssignments", res );
        }
        else if( req.url.indexOf( "view_enrollment?" ) >= 0 )
        {
          showTable( "Enrollments", res );
        }
        else if( req.url.indexOf( "view_course?" ) >= 0 )
        {
          showTable( "Courses", res );
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
