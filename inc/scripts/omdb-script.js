console.log( "main.js sourced" );

// Api Base URL
var apiBase = "http://omdbapi.com/";

// Build an return API call url
// Pass an object as an argument: { key:value, otherKey:value }
// Returns: apiBase url with ?key=value&otherKey=value at the end
var getUrlCall = function ( urlObj ) {

	// Check to see if the object is empty or undefined

	if ( jQuery.isEmptyObject(  urlObj ) || urlObj === undefined ) {

		// If it is empty, call an error
		console.error( "getUrlCall: URL Object is empty.", urlObj );

		// Return false
		return false;
	}

	// Create the query string
	var query = "";

	// Create a variable to track the iteration
	var count = 0;

	// For each key in urlObj
	for ( var item in urlObj ) {

		// If count is 0
		if( count === 0 ) {

			// Add a first query string
			query += "?" + item + "=" + urlObj[item];

			// Add to the count
			count++;
		} else {

			// Add an additional query string
			query += "&" + item + "=" + urlObj[item];
		}
	}

	return apiBase + query;
};

// Get results from each search
var getResults = function ( urlObj ) {

	$.getJSON( getUrlCall( urlObj ), function( data ) {
		displayResults( data );
	});	

};

var showInfo = function () {

	// Variable that grabs the movie ID from the clicked div
	var movieId = $( this ).data("movie-id");
	// Do another JSON call to get data of the specific movie
	$.getJSON( getUrlCall( { i: movieId } ), function ( movie ) {

		// Update the movie information in the modal
		$("#movie-info-title").html( movie.Title );
		$("#movie-info-year").html( movie.Year );
		$("#movie-info-plot").html( movie.Plot );

		// Change the background image in the modal
		$(".movie-poster-header").attr("style", "background-image:url('" + movie.Poster + "');");

		// Fade in the overlay modal
		$("#movie-info").fadeIn();
	});
};

var displayResults = function ( data ) {

	// Create an easier variable to work with
	var movies = data.Search;

	// Creat a new row div
	var row = $( "<div />", { class: "movie-row" } );

	// For every object in movies array
	for( var i = 0; i < movies.length; i++ ) {

		// Create a variable to handle the specific movie
		var movie = movies[i];
		// Create a div for our use
		var cell = $("<div />", { class: "movie-cell" });
			// Add a background-image to the div
			cell.attr("style","background-image: url('" + movie.Poster + "');");

			// Add data for later use to the DIV that contains the specific movie ID
			cell.data("movie-id", movie.imdbID );

			// Set an event listener to the div to show the movie information modal later
			cell.on("click", showInfo );

		// Append the movie to the row
		$(row).append( cell );
	}

	// Add the row to movie search results
	$("#movie-results").append( row );

};

$(document).ready( function () {

	// BUG: Soft fix to let CSS pain the overlay and hide it
	$("#movie-info").fadeOut(0);

	// Put the cursor inside of the search input box
	$("#searchInput").focus();

	// When the form is submitted
	$("#searchForm").on( "submit", function ( event ) {

		// Prevent form from sending to server.
		event.preventDefault();

		// variable for the value entered by the user
		var searchTerm = $("#searchInput").val();

		// If the value is empty or undefined, alert the user
		if( searchTerm === undefined || searchTerm === "" ) {
			alert( "Something went wrong! We can't search for nothing." );
			return false;
		}

		// Get results and show the movies
		getResults( { s: searchTerm } );

	} );

	// Add event listener when user clicks OUTSIDE of the modal
	$("#movie-info").on( "click", function () {
		$("#movie-info").fadeOut();
	} );

	// Prevents the event listener from INSIDE the modal
	$('.movie-window').click(function(event){
	    event.stopPropagation();
	});

} );