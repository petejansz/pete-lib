/**
 * NodeJS JavaScript PD function library
 *
 * 2018-08-24 Pete Jansz
 */

const ADMIN_REST_PORT = 8280
const CRM_PROCESSES_PORT = 8180

function getAdminRestPort() { return ADMIN_REST_PORT }
function getCrmProcessesPort() { return CRM_PROCESSES_PORT }
function getCommonHeaders()
{
    var headers =
    {
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
        'connection': 'keep-alive'
    }

    return headers
}

module.exports =
    {
        getAdminRestPort, getCrmProcessesPort, getCommonHeaders
    }
