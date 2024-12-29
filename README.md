# Kuma Notifier

A lightweight Node.js application that monitors the status of a specific Uptime Kuma monitor and sends alerts to a Discord webhook when the monitor goes **down** or **recovers**.

## Features
- Monitors Uptime Kuma status pages at regular intervals.
- Sends detailed alerts to a Discord webhook.
- Displays status changes, ping times, and timestamps in Discord embeds.

## Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or later).
- An Uptime Kuma instance with publicly accessible status pages.
- A Discord webhook URL.

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/kuma-notifier.git
   cd kuma-notifier
   ```

2. Install the required dependencies:
   ```bash
   npm install axios
   ```

3. Configure the application:
   - Open the script file and update the following constants:
     ```javascript
     const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";
     const MONITOR_ID_TO_TRACK = "YOUR_MONITOR_ID";
     ```
   - Replace `YOUR_DISCORD_WEBHOOK_URL` with your Discord webhook URL.
   - Replace `YOUR_MONITOR_ID` with the ID of the monitor you want to track.

4. Get your monitor IDs:
   Use the following snippet in your browser console (on the Uptime Kuma status page) to get the list of monitor IDs:
   ```javascript
   const monitors = [];
   window.preloadData.publicGroupList.forEach(group => {
       group.monitorList.forEach(monitor => {
           monitors.push({ id: monitor.id, name: monitor.name });
       });
   });
   console.log(monitors);
   ```

5. Update the Uptime Kuma API URL:
   Replace `"https://uptime-kuma-status-page-here.com/api/status-page/heartbeat/default"` in the script with the actual API URL of your Uptime Kuma status page.

## Usage
Run the script using Node.js:
```bash
node kuma-notifier.js
```

The script will:
1. Query the Uptime Kuma status API every 60 seconds.
2. Check the status of the specified monitor.
3. Send a Discord notification if the monitor's status changes (up or down).

## Discord Notification Example
The bot sends a message like this when a monitor changes status:

**Title**: ✅ Monitor Alert  
**Description**: The monitor **#Monitor_ID** is currently **RECOVERED**.  
**Fields**:
- **Status**: ✅ **Online**
- **Ping**: 📡 45ms
- **Last Checked**: 🕒 `2024-01-01T00:00:00Z`

## Customization
You can adjust the monitoring interval by changing the `setInterval` value in the script:
```javascript
setInterval(checkStatus, 60 * 1000); // Currently set to 60 seconds
```

## Troubleshooting
- **Error: Monitor ID not found**  
  Ensure the `MONITOR_ID_TO_TRACK` matches an existing monitor ID from the Uptime Kuma status page.

- **Error: Failed to query API or send alert**  
  Check your API URL and network connectivity.

## Contributing
Feel free to fork this repository, submit issues, or create pull requests with improvements or new features!
