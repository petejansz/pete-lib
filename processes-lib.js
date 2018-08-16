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
    },

    createNote = function ( host, playerId, responseHandler, errorHandler, noteText )
    {
        var text = noteText ? noteText : 'Make a note @ ' + new Date()
        const note =
            {
                alert: false,
                id: null,
                playerId: playerId,
                status: 1,
                type: 1,
                value: text,
                priority: 1,
                user: 'administrator',
            }

        const body =
            {
                callingClientId: lib1.getFirstIPv4Address(),
                transactionIdBase: lib1.generateUUID(),
                transactionTime: new Date().valueOf(),
                callerChannelId: lib1.caConstants.channelId,
                callerSystemId: lib1.caConstants.systemId,
                siteID: lib1.caConstants.siteID,
                playerId: playerId,
                note: note
            }

        const restPath = '/california/api/v1/processes/player-note'
        const url = util.format( '%s://%s:%s%s', 'http', host, lib1.crmProcessesPort, restPath )
        var options =
            {
                method: 'POST',
                uri: url,
                headers: lib1.commonHeaders,
                body: body,
                json: true
            }

        options.headers['x-player-id'] = playerId

        request( options )
            .then( function ( resp )
            {
                responseHandler( resp )
            } )
            .catch( function ( err )
            {
                errorHandler( err )
            } )
    }

    return {
        createAxiosInstance: createAxiosInstance,
        createProcessesRequest: createProcessesRequest,
        createNote: createNote
    }
} )()

module.exports = Processes