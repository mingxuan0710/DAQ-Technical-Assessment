import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

// Safe operating range for battery temperature
const MIN_SAFE_TEMP = 20;
const MAX_SAFE_TEMP = 80;
const VIOLATION_LIMIT = 3;
const TIME_WINDOW = 5000; // 5 seconds

// Queue to track recent temperature violations
const temperatureViolations: number[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();

    console.log(`Received: ${message}`);

    try {
      const parsedData = JSON.parse(message);

      // Validate battery_temperature
      if (typeof parsedData.battery_temperature === "number") {

        const formattedTemperature = parsedData.battery_temperature.toFixed(3);
        parsedData.battery_temperature = parseFloat(formattedTemperature);

        // Check if temperature is out of safe range
        const now = Date.now();
        if (
          parsedData.battery_temperature < MIN_SAFE_TEMP ||
          parsedData.battery_temperature > MAX_SAFE_TEMP
        ) {
          temperatureViolations.push(now);
          
          // Remove violations older than 5 seconds
          while (temperatureViolations.length > 0 && now - temperatureViolations[0] > TIME_WINDOW) {
            temperatureViolations.shift();
          }

          // If more than 3 violations in 5 seconds, log error
          if (temperatureViolations.length > VIOLATION_LIMIT) {
            console.error(`[${new Date().toISOString()}] ERROR: Battery temperature exceeded safe range more than ${VIOLATION_LIMIT} times in ${TIME_WINDOW / 1000} seconds.`);
            temperatureViolations.length = 0; // Reset violations after logging
          }
        }

        // Forward valid data to WebSocket clients
        websocketServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedData));
          }
        });
      } else {
        console.warn(`Invalid battery_temperature received:`, parsedData);
      }
    } catch (error) {
      console.error("Error parsing incoming data:", error);
    }
    
    // Send JSON over WS to frontend clients
    // websocketServer.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(message);
    //   }
    // });
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
