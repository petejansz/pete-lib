/**
 * Author: Pete Jansz
 */

var peteUtil = require('./pete-util')
var igtPdLib = require( './igt-pd-lib' )
var igtCas = require( './igt-cas' )
const axios = require( 'axios' )

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
