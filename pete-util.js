/**
 * NodeJS JavaScript REST and other functions, objects
 *
 * 2018-08-15 Make a proper library of this
 * 2017-12-06 Pete Jansz
 */

var util =
{
    elapsedTime: function ( startTime )
    {
        var endTime = new Date()
        var timeDiffMilliseconds = endTime - startTime
        // strip the ms
        var timeDiffSeconds = timeDiffMilliseconds /= 1000

        // get seconds
        return Math.round( timeDiffSeconds )
    },

    formatJSON: function ( json, indentSpaceCount )
    {
        var indentAmount = indentSpaceCount ? indentSpaceCount : 4
        var formattedString = ''

        if ( json !== null && typeof json === 'string' )
        {
            formattedString = JSON.stringify( JSON.parse( json ), null, indentAmount )
        }
        else if ( json === null && json === Object( json ) )
        {
            formattedString = JSON.stringify( json, null, indentAmount )
        }

        return formattedString
    },

    convertJSONToStringArray: function ( data, sep )
    {
        var stringArray = []

        var columnNames = Object.keys( data[0] )
        var headers = columnNames.join( sep )
        stringArray.push( headers )

        for ( var i = 1; i < data.length; i++ )
        {
            var row = data[i]
            var values = []
            columnNames.forEach( function ( columnName )
            {
                values.push( row[columnName] )
            } );

            stringArray.push( values.join( sep ) )
        }

        return stringArray
    },

    generateUUID: function ()
    {
        var d = new Date().getTime()
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c )
        {
            var r = ( d + Math.random() * 16 ) % 16 | 0;
            d = Math.floor( d / 16 );
            return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
        } );

        return uuid
    },

    getFirstIPv4Address: function ()
    {
        var os = require( 'os' );
        var ifaces = os.networkInterfaces();
        var values = Object.keys( ifaces ).map( function ( name )
        {
            return ifaces[name];
        } );
        values = [].concat.apply( [], values ).filter( function ( val )
        {
            return val.family == 'IPv4' && val.internal == false;
        } );

        return values.length ? values[0].address : '0.0.0.0';
    },

    sortUniq: function ( a )
    {
        return a.sort().filter( function ( item, pos, ary )
        {
            return !pos || item != ary[pos - 1];
        } );
    },

    convertArrayToMap: function ( a )
    {
        var seen = {};
        return a.filter( function ( item )
        {
            return seen.hasOwnProperty( item ) ? false : ( seen[item] = true );
        } );
    }
};

module.exports = util;
