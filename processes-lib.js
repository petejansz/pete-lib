/**
 * Author: Pete Jansz
 */

var Processes = ( function ()
{
    const modulesPath = '/usr/share/node_modules/'
    const axios = require( modulesPath + 'axios' )
    var request = require( modulesPath + 'request-promise' )
    var lib1 = require( modulesPath + 'pete-lib/pete-util' )
    var util = require( 'util' )

    var createAxiosInstance = function( host, playerId )
    {
        var headers = lib1.commonHeaders
        headers['x-player-id'] = playerId

        return axios.create(
            {
                baseURL: 'http://' + host + ':' + lib1.crmProcessesPort,
                headers: headers,
            }
        )
    },

    createProcessesRequest = function ()
    {
        var request =
            {
                callerChannelId: lib1.caConstants.channelId,
                callingClientId: lib1.getFirstIPv4Address(),
                callerSystemId: lib1.caConstants.systemId,
                transactionIdBase: lib1.generateUUID(),
                transactionTime: new Date().valueOf(),
                siteID: lib1.caConstants.siteID
            }

        return request
    }

    return {
        createAxiosInstance: createAxiosInstance,
        createProcessesRequest: createProcessesRequest
    }
} )()

module.exports = Processes