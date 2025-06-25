import { defineConfig } from "vite";
import BABYLON from "@babylonjs/core";

export default defineConfig(
    {
        plugins: [BABYLON()],
        base: "/xrtesting.github.io"
    });