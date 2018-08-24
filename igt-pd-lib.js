/**
 * NodeJS JavaScript PD function library
 *
 * 2018-08-24 Pete Jansz
 */

var IGTPdLib = ( function ()
{
    const ADMIN_REST_PORT = 8280
    const CRM_PROCESSES_PORT = 8180

    getAdminRestPort = function () { return ADMIN_REST_PORT }
    getCrmProcessesPort = function () { return CRM_PROCESSES_PORT }
    getCommonHeaders = function()
    {
        var headers =
        {
            'cache-control': 'no-cache',
            'content-type': 'application/json;charset=UTF-8',
            'connection': 'keep-alive'
        }

        return headers
    }

    return {
        getAdminRestPort: getAdminRestPort, getCrmProcessesPort: getCrmProcessesPort, getCommonHeaders: getCommonHeaders
    }
} )()

module.exports = IGTPdLib