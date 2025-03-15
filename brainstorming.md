# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder

For the first task, I just add this line under scripts "dev": "nodemon --exec \"next dev --turbopack\" --ext js,jsx,ts,tsx,json", to run nodemon instead of turbopack.

For the second task, I made some changes to server.ts under streaming-service. I ensured battery_temperature is a number by adding the if statement if (typeof parsedData.battery_temperature === "number"), else we print `Invalid battery_temperature received:`, parsedData in the console. You could see details of the incorrect battery format in the console.

For the third task, again I made more changes to server.ts, this time creating constants for safe battery temperatures and an array to contain the timestamps whenever battery temp is out of safety range. If temp exceeds safety range more than 3 times in 5 seconds, we could see [TIMESTAMP] ERROR: Battery temperature exceeded safe range more than 3 times in 5 secondS printed out in the console.

I didn't manage to successfully complete the 4th task onwards as it's getting too close to the deadline. But I did make an attempt. 

For the 4th task, I tried debugging and including console statements like console.log("Current WebSocket readyState: ", readyState) to see if readystate is reflected on the console. This is in page.tsx.

For the 5th task, in tailwind.config.js, I tried making different color fields for safe, nearing unsafe, and unsafe temps. I also made some changes in globals.css, by making classes like temperature-safe, temperature-unsafe, and including the color values. I made some changes to numeric.tsx, ensuring that the color changes if it crosses a certain threshold. But I don't think any of this work for now, but I did manage to get the 3 decimal place aspect to work.


## Cloud