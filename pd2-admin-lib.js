/**
 * Author: Pete Jansz
 */

var modulesPath = '/usr/share/node_modules/'
var peteUtil = require( modulesPath + 'pete-lib/pete-util' )

function getPlayerThing( pdAdminSystem, playerId, thing, responseHandler )
{
    var request = require( modulesPath + 'request-promise' )

    var options =
    {
        method: 'GET',
        rejectUnauthorized: false,
        url: pdAdminSystem.url + '/' + playerId + '/' + thing,
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
}

function getPlayerId( pdAdminSystem, username, responseHandler )
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
}

function getAdminEnums( pdAdminSystem, responseHandler )
{
    var request = require( modulesPath + 'request' )

    var options =
    {
        method: 'GET',
        rejectUnauthorized: false,
        url: pdAdminSystem.url.toString().replace( 'players', 'enums' ),
        headers: peteUtil.adminHeaders
    }

    request( options, responseHandler )
}

// Return a promise when responseHandler null
function searchForPlayers( pdAdminSystem, responseHandler )
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
}

function createNote( pdAdminSystem, playerId, responseHandler )
{
    var request = require( modulesPath + 'request' )

    var options =
    {
        method: 'POST',
        rejectUnauthorized: false,
        url: pdAdminSystem.url + '/' + playerId + '/send-portal-message',
        headers:
        {
            'cache-control': 'no-cache',
            referer: peteUtil.getFirstIPv4Address(),
            dnt: '1',
            Authorization: pdAdminSystem.auth,
        },
        body:
        {
            message: "pd2-admin.js mknote " + new Date().getTime()
        },
        json: true
    }

    request( options, responseHandler )
}

function activateAccount( pdAdminSystem, playerId, personalInfo, responseHandler )
{
    var request = require( modulesPath + 'request' )

    var options =
    {
        method: 'POST',
        rejectUnauthorized: false,
        url: pdAdminSystem.url + '/' + playerId + '/activateAccount',
        headers:
        {
            'cache-control': 'no-cache',
            referer: peteUtil.getFirstIPv4Address(),
            dnt: '1',
            Authorization: pdAdminSystem.auth,
        },
        // body: personalInfo,
        json: true
    }
    options.body = personalInfo

    request( options, responseHandler )
}

function closeAccount( pdAdminSystem, playerId, responseHandler )
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
            contractId: playerId.toString(),
            reason: 'Admin, close this account!'
        },
        json: true
    }

    request( options, responseHandler )
}

// Get both Player Portal, SecondChance services states or set both to ACTIVATED or SUSPENDED state.
function services( pdAdminSystem, services, responseHandler )
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
                useQuerystring: true,
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

module.exports =
{
    activateAccount,
    closeAccount,
    createNote,
    getPlayerId,
    getAdminEnums,
    getPlayerThing,
    searchForPlayers,
    services
}
