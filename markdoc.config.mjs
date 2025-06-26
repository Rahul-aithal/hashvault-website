import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config";
import starlightMarkdoc from "@astrojs/starlight-markdoc";

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  nodes: {
    heading: {
      ...nodes.heading, // Preserve default anchor link generation
      render: component("./src/components/Heading.astro"),
    },
  },
});
