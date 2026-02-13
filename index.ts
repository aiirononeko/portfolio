import index from "./index.html";

Bun.serve({
  routes: {
    "/": index,
    "/gba.glb": new Response(await Bun.file("./public/gba.glb").bytes(), {
      headers: { "Content-Type": "model/gltf-binary" },
    }),
    "/gbc.glb": async () => {
      const file = Bun.file("./public/gbc.glb");
      if (await file.exists()) {
        return new Response(await file.bytes(), {
          headers: { "Content-Type": "model/gltf-binary" },
        });
      }
      return new Response("Not Found", { status: 404 });
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});
