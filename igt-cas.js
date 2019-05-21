/**
 * NodeJS JavaScript Calif site function library
 *
 * 2018-08-24 Pete Jansz
 */

const modulesPath = '/usr/share/node_modules/'
const igtPdLib = require( modulesPath + 'pete-lib/igt-pd-lib' )

const API_KEY = 'di9bJ9MPTXOZvEKAvd7CM8cRJ4Afo54b'
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

function getChannelId( hostname )
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
}

function createHeaders( hostname )
{
    var headers = igtPdLib.getCommonHeaders()

    headers['x-ex-system-id'] = CA_SITE_CONSTANTS.SYSTEM_ID
    headers['x-site-id'] = CA_SITE_CONSTANTS.SITE_ID
    headers['x-channel-id'] = CA_PD_CONSTANTS.PWS_CHANNEL_ID

    if ( hostname && hostname.match( /mobile/i ) )
    {
        headers['x-channel-id'] = CA_PD_CONSTANTS.MOBILE_CHANNEL_ID
        headers['x-esa-api-key'] = API_KEY
    }
    else
    {
        headers['x-channel-id'] = CA_PD_CONSTANTS.PWS_CHANNEL_ID
    }

    return headers
}

function createLoginRequest( hostname, username, password )
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

    if ( username && password )
    {
        request.resourceOwnerCredentials = { USERNAME: username, PASSWORD: password }
    }

    return request
}

function getSiteId() { return CA_SITE_CONSTANTS.SITE_ID }
function getSystemId() { return CA_SITE_CONSTANTS.SYSTEM_ID }

module.exports =
    {
        getChannelId, createHeaders, createLoginRequest, getSiteId, getSystemId
    }


