import routerUser from "./user.routes.js";
import routerDocs from "./docs.routes.js";
export default function route(app) {
    app.use("/api/v1", routerUser);
    app.use("/api/v2", routerDocs);  // docs & openapi.json
}
