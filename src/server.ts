import { httpServer } from "./http";
import "./websocket";

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
