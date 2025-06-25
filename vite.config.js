import { defineConfig } from "vite";
import BABYLON from "https://cdn.babylonjs.com/babylon.max.js";

export default defineConfig(
    {
        plugins: [BABYLON()],
        base: "/xrtesting.github.io"
    });