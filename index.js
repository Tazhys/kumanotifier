const axios = require("axios");

const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

const MONITOR_ID_TO_TRACK = "MONITOR_ID_HERE";

let lastStatus = null;

const createEmbed = (status, ping, time) => {
    const statusEmoji = status === 0 ? "❌" : "✅";
    const statusMessage = status === 0 ? "DOWN" : "RECOVERED";

    return {
        embeds: [
            {
                title: `${statusEmoji} Monitor Alert`,
                description: `The monitor **#${MONITOR_ID_TO_TRACK}** is currently **${statusMessage}**.`,
                color: status === 0 ? 0xff0000 : 0x00ff00,
                fields: [
                    {
                        name: "Status",
                        value: status === 0 ? "❌ **Offline**" : "✅ **Online**",
                        inline: true,
                    },
                    {
                        name: "Ping",
                        value: ping !== null ? `📡 ${ping}ms` : "📡 No response",
                        inline: true,
                    },
                    {
                        name: "Last Checked",
                        value: `🕒 ${time}`,
                        inline: false,
                    },
                ],
                footer: {
                    text: "Kuma Notifier",
                },
                timestamp: new Date(),
            },
        ],
    };
};

const checkStatus = async () => {
    try {
        const response = await axios.get("https://uptime-kuma-status-page-here.com/api/status-page/heartbeat/default");
        const data = response.data;

        const heartbeatList = data.heartbeatList;
        if (!heartbeatList) {
            console.error("[Error] heartbeatList not found in API response.");
            return;
        }

        const monitorData = heartbeatList[MONITOR_ID_TO_TRACK];
        if (monitorData) {
            const latestEntry = monitorData[0];
            const { status, ping, time } = latestEntry;

            if (status !== lastStatus) {
                console.log(`[Status Change] Monitor ${MONITOR_ID_TO_TRACK} is now ${status === 0 ? "DOWN" : "RECOVERED"}.`);

                const embed = createEmbed(status, ping, time);

                await axios.post(DISCORD_WEBHOOK_URL, embed);
                console.log(`[Alert Sent] Monitor ${MONITOR_ID_TO_TRACK}: ${status === 0 ? "DOWN" : "RECOVERED"} at ${time}.`);

                lastStatus = status;
            } else {
                console.log(`[No Change] Monitor ${MONITOR_ID_TO_TRACK} remains ${status === 0 ? "DOWN" : "ONLINE"}.`);
            }
        } else {
            console.error(`[Error] Monitor ID ${MONITOR_ID_TO_TRACK} not found in heartbeatList.`);
        }
    } catch (error) {
        console.error(`[Error] Failed to query API or send alert: ${error.message}`);
    }
};

setInterval(checkStatus, 60 * 1000);
