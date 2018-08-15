var igtCAS =
{
    CA_CONSTANTS =
    {
        CAT1_ADMIN_PORTAL_HOST: "10.164.172.231",
        siteID: 35,
        systemId: 8,
        channelId: 2
    },

    Headers =
    {
        "content-type": "application/json;charset=UTF-8",
        "Connection": "keep-alive",
        "x-site-id": CA_CONSTANTS.siteID,
        "x-channel-id": CA_CONSTANTS.channelId,
        "x-ex-system-id": CA_CONSTANTS.systemId,
        "cache-control": "no-cache"
    }
}

module.exports = igtCAS;

