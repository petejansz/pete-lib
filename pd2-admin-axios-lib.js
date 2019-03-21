/**
 * Node Axios based pdadmin api calls
 * Author: Pete Jansz
 */

var PdAdmin = ( function ()
{
    const querystring = require( 'querystring' )
    var modulesPath = '/usr/share/node_modules/'
    var igtPdLib = require( modulesPath + 'pete-lib/igt-pd-lib' )
    var peteUtil = require( modulesPath + 'pete-lib/pete-util' )
    const axios = require( modulesPath + 'axios' )
    var ADMIN_PLAYERSREST_PATH = '/california-admin-rest/api/v1/admin/players'

    createAxiosInstance = function ( pdAdminSystem, moreHeaders, timeout )
    {
        var defaults =
        {
            baseURL: pdAdminSystem.url,
            headers: igtPdLib.getCommonHeaders()
        }

        defaults.headers.auth = pdAdminSystem.auth
        if ( pdAdminSystem.cookie )
        { defaults.headers.cookie = pdAdminSystem.cookie }
        defaults.headers.referer = peteUtil.getFirstIPv4Address()
        defaults.headers.dnt = '1'
        defaults.headers.rejectUnauthorized = false
        defaults.timeout = timeout ? timeout : 120000

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
            console.log( url )
            return axiosInstance.get( url )
        },

        createNote = function ( axiosInstance, playerId )
        {
            var url = ADMIN_PLAYERSREST_PATH + '/' + playerId + '/send-portal-message'
            var body =
            {
                message: "pd2-admin.js mknote " + new Date().getTime()
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

        // Get both Player Portal, SecondChance services states or set both to ACTIVATED or SUSPENDED state.
        // if services contains serviceIds[] then activate or suspend else get services[]
        // returns a promise of services[]
        services = function ( axiosInstance, services )
        {
            if ( services.serviceIds )
            {
                var body =
                {
                    '@class': 'ServiceDTO',
                    reason: services.activate ? 'Activate account services.' : 'Suspend account services.',
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
                var url = ADMIN_PLAYERSREST_PATH + '/' + services.playerId + '/services/' + services.activate
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
        createNote: createNote,
        getPlayerId: getPlayerId,
        getAdminEnums: getAdminEnums,
        getPlayerThing: getPlayerThing,
        searchForPlayers: searchForPlayers,
        services: services
    }
} )()

module.exports = PdAdmin