/**
 * Node Axios based pdadmin api calls
 * Author: Pete Jansz
 */

var PdAdmin = ( function ()
{
    const querystring = require( 'querystring' )
    var igtPdLib = require( './igt-pd-lib' )
    var peteUtil = require('./pete-util')
    const axios = require( 'axios' )
    var ADMIN_PLAYERSREST_PATH = '/california-admin-rest/api/v1/admin/players'

    createAxiosInstance = function ( pdAdminSystem, moreHeaders, timeout )
    {
        var defaults =
        {
            baseURL: pdAdminSystem.url,
            headers: igtPdLib.getCommonHeaders()
        }

        defaults.headers.Authorization = pdAdminSystem.auth
        if ( pdAdminSystem.cookie )
        { defaults.headers.cookie = pdAdminSystem.cookie }
        defaults.headers.referer = peteUtil.getFirstIPv4Address()
        defaults.headers.dnt = '1'
        defaults.headers.rejectUnauthorized = false
        defaults.timeout = timeout ? timeout : 120000
        defaults.headers.callingClientId = 'pdadmin.js'

        if ( moreHeaders )
        {
            for ( var key in moreHeaders )
            {
                defaults.headers[key] = moreHeaders[key]
            }
        }

        return axios.create( defaults )
    },

        getPlayerThing = function ( axiosInstance, playerId, thing )
        {
            var url = ADMIN_PLAYERSREST_PATH + '/' + playerId + '/' + thing
            return axiosInstance.get( url )
        },

        getPlayerId = function ( axiosInstance, username )
        {
            var url = ADMIN_PLAYERSREST_PATH + '?' + querystring.stringify( { email: username } )
            return axiosInstance.get( url )
        },

        getAdminEnums = function ( axiosInstance )
        {
            var url = ADMIN_PLAYERSREST_PATH.replace( 'players', 'enums' )
            return axiosInstance.get( url )
        },

        searchForPlayers = function ( axiosInstance, qs )
        {
            var url = ADMIN_PLAYERSREST_PATH + '?' + querystring.stringify( qs )
            return axiosInstance.get( url )
        },

        postNote = function ( axiosInstance, playerId )
        {
            var url = ADMIN_PLAYERSREST_PATH + '/' + playerId + '/note'
            var body =
            {
                displayAlert: false,
                note: 'pdadmin.js says, Hello!',
                user: 'administrator',
                creationDate: (new Date()).getTime()
            }

            return axiosInstance.post( url, body )
        },

        sendNotification = function ( axiosInstance, playerId )
        {
            var url = ADMIN_PLAYERSREST_PATH + '/' + playerId + '/send-portal-message'
            var body =
            {
                message: "pdadmin.js notification " + new Date()
            }

            return axiosInstance.post( url, body )
        },

        activateAccount = function ( pdAdminSystem, playerId, personalInfo, responseHandler )
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
        },

        closeAccount = function ( axiosInstance, playerId )
        {
            var url = ADMIN_PLAYERSREST_PATH + '/' + playerId + '/closeaccount'
            var body =
            {
                contractId: playerId.toString(),
                reason: 'Admin, close this account!'
            }

            return axiosInstance.put( url, body )
        },

        // Get both Player Portal, SecondChance services states or
        // if set both to PREACTIVE or ACTIVATED or SUSPENDED state.
        // if services contains serviceIds[] then activate or suspend else get services[]
        // returns a promise of services[]
        services = function ( axiosInstance, services )
        {
            if ( services.serviceIds )
            {
                var body =
                {
                    '@class': 'ServiceDTO',
                    reason: services.svcstate + ' account services.',
                    creationDate: null,
                    lastModificationDate: null,
                    serviceId: services.serviceIds[0],
                    status: 3,
                    serviceType: 1,
                    serviceGroupType: 500,
                }
                var qs =
                {
                    serviceId: services.serviceIds
                }
                //PUT /california-admin-rest/api/v1/admin/players/1000006363/services/activate?serviceId=11948&serviceId=11947
                var url = ADMIN_PLAYERSREST_PATH + '/' + services.playerId + '/services/' + services.svcstate
                url += '?' + querystring.stringify( qs )
                return axiosInstance.put( url, body )
            }
            else
            {
                var url = ADMIN_PLAYERSREST_PATH + '/' + services.playerId + '/services'
                return axiosInstance.get( url )
            }
        }

    return {
        activateAccount: activateAccount,
        closeAccount: closeAccount,
        createAxiosInstance: createAxiosInstance,
        postNote: postNote,
        sendNotification: sendNotification,
        getPlayerId: getPlayerId,
        getAdminEnums: getAdminEnums,
        getPlayerThing: getPlayerThing,
        searchForPlayers: searchForPlayers,
        services: services
    }
} )()

module.exports = PdAdmin