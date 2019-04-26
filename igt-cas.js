/**
 * NodeJS JavaScript Calif site function library
 *
 * 2018-08-24 Pete Jansz
 */

var IGTCas = ( function ()
{
    const modulesPath = '/usr/share/node_modules/'
    const igtPdLib = require( modulesPath + 'pete-lib/igt-pd-lib' )

    const CA_SITE_CONSTANTS =
    {
        SITE_ID: 35,
        SYSTEM_ID: 8
    }

    const CA_PD_CONSTANTS =
    {
        MOBILE_CLIENT_ID: 'CAMOBILEAPP',
        PWS_CLIENT_ID: 'SolSet2ndChancePortal',
        MOBILE_CHANNEL_ID: 3,
        PWS_CHANNEL_ID: 2
    }

    getChannelId = function ( hostname )
    {
        var channelId

        if ( hostname && hostname.match( /mobile/i ) )
        {
            channelId = CA_PD_CONSTANTS.MOBILE_CHANNEL_ID
        }
        else
        {
            channelId = CA_PD_CONSTANTS.PWS_CHANNEL_ID
        }

        return channelId
    },

    createHeaders = function ( hostname )
    {
        var headers = igtPdLib.getCommonHeaders()

        headers['x-ex-system-id'] = CA_SITE_CONSTANTS.SYSTEM_ID
        headers['x-site-id'] = CA_SITE_CONSTANTS.SITE_ID
        headers['x-channel-id'] = CA_PD_CONSTANTS.PWS_CHANNEL_ID

        if ( hostname && hostname.match( /mobile/i ) )
        {
            headers['x-channel-id'] = CA_PD_CONSTANTS.MOBILE_CHANNEL_ID
            headers['x-esa-api-key'] = 'di9bJ9MPTXOZvEKAvd7CM8cRJ4Afo54b'
        }
        else
        {
            headers['x-channel-id'] = CA_PD_CONSTANTS.PWS_CHANNEL_ID
        }

        return headers
    },

    createLoginRequest = function ( hostname, username, password )
    {
        request = { siteId: CA_SITE_CONSTANTS.SITE_ID }

        if ( hostname.match( /mobile/i ) )
        {
            request.clientId = CA_PD_CONSTANTS.MOBILE_CLIENT_ID
        }
        else
        {
            request.clientId = CA_PD_CONSTANTS.PWS_CLIENT_ID
        }

        if (username && password )
        {
            request.resourceOwnerCredentials = { USERNAME: username, PASSWORD: password }
        }

        return request
    },

    getSiteId = function () { return CA_SITE_CONSTANTS.SITE_ID },
    getSystemId = function () { return CA_SITE_CONSTANTS.SYSTEM_ID }

    return { getChannelId: getChannelId, createHeaders: createHeaders, createLoginRequest: createLoginRequest, getSiteId: getSiteId, getSystemId: getSystemId }
} )()

module.exports = IGTCas;

