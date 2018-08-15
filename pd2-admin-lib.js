/**
 * Author: Pete Jansz
 */

var Pd2Admin = ( function ()
{
    var modulesPath = '/usr/share/node_modules/'
    var peteUtil = require( modulesPath + 'pete-lib/pete-util' )

    var getPlayerHistory = function ( pdAdminSystem, playerId, responseHandler )
    {
        var request = require( modulesPath + 'request-promise' )

        var options =
        {
            method: 'GET',
            rejectUnauthorized: false,
            url: pdAdminSystem.url + '/' + playerId + '/player-history',
            qs: pdAdminSystem.qs,
            headers:
            {
                'cache-control': 'no-cache',
                referer: peteUtil.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            }
        }

        if ( responseHandler )
        {
            request( options, responseHandler )
        }
        else
        {
            return request( options )
        }
    },

    // f: "per | pro"
    getPersProf = function ( pdAdminSystem, playerId, f, responseHandler )
    {
        var util = require( 'util' )
        var request = require( modulesPath + 'request' )

        var fun = f.match( /^per/i ) ? 'personal-info' : 'profile'
        var options =
        {
            method: 'GET',
            url: pdAdminSystem.url + util.format( '/%s/%s', playerId, fun ),
            headers: peteUtil.adminHeaders
        }

        options.headers.authorization = pdAdminSystem.auth,
        options.headers.referer = peteUtil.getFirstIPv4Address()
        options.headers.dnt = '1'

        request( options, responseHandler )
    },

    getPlayerId = function ( pdAdminSystem, username, responseHandler )
    {
        var request = require( modulesPath + 'request' )


        var options =
        {
            method: 'GET',
            url: pdAdminSystem.url,
            qs: { email: encodeURI( username ) },
            headers: peteUtil.adminHeaders
        }

        options.headers.authorization = pdAdminSystem.auth
        options.headers.referer = peteUtil.getFirstIPv4Address()
        options.headers.dnt = '1'

        request( options, responseHandler )
    },

    getAdminEnums = function ( pdAdminSystem, responseHandler )
    {
        var request = require( modulesPath + 'request' )

        var options =
        {
            method: 'GET',
            url: pdAdminSystem.url.toString().replace( 'players', 'enums' ),
            headers: peteUtil.adminHeaders
        }

        options.headers.authorization = pdAdminSystem.auth,
        options.headers.referer = peteUtil.getFirstIPv4Address()
        options.headers.dnt = '1'

        request( options, responseHandler )
    },

    // Return a promise when responseHandler null
    searchForPlayers = function ( pdAdminSystem, responseHandler )
    {
        var request = require( modulesPath + 'request-promise' )

        var options =
        {
            method: 'GET',
            rejectUnauthorized: false,
            url: pdAdminSystem.url,
            qs: pdAdminSystem.qs,
            headers:
            {
                'cache-control': 'no-cache',
                referer: peteUtil.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            }
        }

        if ( responseHandler )
        {
            request( options, responseHandler )
        }
        else
        {
            return request( options )
        }
    },

    createNote = function ( pdAdminSystem, playerId, responseHandler )
    {
        var request = require( modulesPath + 'request' )

        var options =
        {
            method: 'POST',
            rejectUnauthorized: false,
            url: pdAdminSystem.url + '/' + playerId + '/note',
            headers:
            {
                'cache-control': 'no-cache',
                referer: peteUtil.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            },
            body:
            {
                displayAlert: false,
                note: 'Make a note.',
                user: 'administrator',
                creationDate: new Date().getTime()
            },
            json: true
        }

        request( options, responseHandler )
    },

    closeAccount = function ( pdAdminSystem, playerId, responseHandler )
    {
        var request = require( modulesPath + 'request' )

        var options =
        {
            method: 'PUT',
            rejectUnauthorized: false,
            url: pdAdminSystem.url + '/' + playerId + '/closeaccount',
            headers:
            {
                'cache-control': 'no-cache',
                referer: peteUtil.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            },
            body:
            {
                contractId: playerId, reason: 'Admin, close this account!'
            },
            json: true
        }

        request( options, responseHandler )
    }

    // Get both Player Portal, SecondChance services states or set both to ACTIVATED or SUSPENDED state.
    services = function ( pdAdminSystem, services, responseHandler )
    {
        var request = require( modulesPath + 'request' )

        var options = {}

        if ( services.serviceIds )
        {
            options =
            {
                method: 'PUT',
                rejectUnauthorized: false,
                url: pdAdminSystem.url + '/' + services.playerId + '/services/' + services.activate,
                useQuerystring : true,
                qs:
                {
                    serviceId: services.serviceIds
                },
                headers:
                {
                    'cache-control': 'no-cache',
                    referer: peteUtil.getFirstIPv4Address(),
                    dnt: '1',
                    Authorization: pdAdminSystem.auth,
                },
                body:
                {
                    '@class': 'ServiceDTO',
                    reason: services.activate ? 'Activate account services.' : 'Suspend account services.',
                    creationDate: null,
                    lastModificationDate: null,
                    serviceId: services.serviceIds[0],
                    status: 3,
                    serviceType: 1,
                    serviceGroupType: 500,
                },
                json: true
            }
        }
        else
        {
            options =
            {
                method: 'GET',
                rejectUnauthorized: false,
                url: pdAdminSystem.url + '/' + services.playerId + '/services',
                headers:
                {
                    'cache-control': 'no-cache',
                    referer: peteUtil.getFirstIPv4Address(),
                    dnt: '1',
                    Authorization: pdAdminSystem.auth,
                },
                json: true
            }
        }

        request( options, responseHandler )
    }

    return {
        closeAccount: closeAccount,
        createNote: createNote,
        getPlayerId: getPlayerId,
        getAdminEnums: getAdminEnums,
        getPersProf: getPersProf,
        getPlayerHistory: getPlayerHistory,
        searchForPlayers: searchForPlayers,
        services: services
    }
} )()

module.exports = Pd2Admin