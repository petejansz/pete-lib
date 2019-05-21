/**
 * Author: Pete Jansz
 */

const modulesPath = '/usr/share/node_modules/'
var igtPdLib = require( modulesPath + 'pete-lib/igt-pd-lib' )
var igtCas = require( modulesPath + 'pete-lib/igt-cas' )
var peteUtil = require( modulesPath + 'pete-lib/pete-util' )
const axios = require( modulesPath + 'axios' )

function createAxiosInstance( host, playerId, moreHeaders )
{
    var headers = igtPdLib.getCommonHeaders()
    headers['x-player-id'] = playerId

    if ( moreHeaders )
    {
        for ( var key in moreHeaders )
        {
            headers[key] = moreHeaders[key]
        }
    }

    return axios.create(
        {
            baseURL: 'http://' + host + ':' + igtPdLib.getCrmProcessesPort(),
            headers: headers
        }
    )
}

function createProcessesRequest()
{
    var request =
    {
        callerChannelId: igtCas.getChannelId(),
        callingClientId: peteUtil.getFirstIPv4Address(),
        callerSystemId: igtCas.getSystemId(),
        transactionIdBase: peteUtil.generateUUID(),
        transactionTime: new Date().valueOf(),
        siteID: igtCas.getSiteId()
    }

    return request
}

module.exports =
    {
        createAxiosInstance,
        createProcessesRequest
    }
