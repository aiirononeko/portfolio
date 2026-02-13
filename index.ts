import index from "./index.html";

Bun.serve({
  routes: {
    "/": index,
    "/gba.glb": new Response(await Bun.file("./public/gba.glb").bytes(), {
      headers: { "Content-Type": "model/gltf-binary" },
    }),
  },
  development: {
    hmr: true,
    console: true,
  },
});
