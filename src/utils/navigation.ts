// utils/sidebar.ts
import { getCollection, type CollectionEntry } from "astro:content";

type DocsEntry = CollectionEntry<"docs">;

interface SidebarNode {
  title: string;
  slug: string;
  id: string;
  children: SidebarNode[];
  isActive?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarNode[];
}

interface SidebarData {
  content: SidebarNode[];
  currentSectionFiles: SidebarSection[];
}

export async function getDocsSidebar(
  currentSlug: string,
): Promise<SidebarData> {
  const entries = await getCollection("docs");

  // Filter index documents for content hierarchy
  const indexDocs = entries.filter((entry) => entry.id.endsWith("index.mdoc"));

  // Build map of all entries by their path
  const entryMap = new Map<string, DocsEntry>();
  entries.forEach((entry) => {
    const path = entry.id.replace(/\.mdoc$/, "");
    entryMap.set(path, entry);
  });

  // Build content hierarchy (index files only)
  function buildContentHierarchy(): SidebarNode[] {
    const rootNodes: SidebarNode[] = [];
    const nodeMap = new Map<string, SidebarNode>();

    // Create nodes for all index documents
    indexDocs.forEach((entry) => {
      const node: SidebarNode = {
        title: entry.data.title,
        slug: entry.slug,
        id: entry.id,
        children: [],
        isActive:
          currentSlug === entry.slug ||
          currentSlug.startsWith(entry.slug + "/"),
      };
      nodeMap.set(entry.slug, node);
    });

    // Build parent-child relationships
    indexDocs.forEach((entry) => {
      const pathSegments = entry.slug.split("/");

      if (pathSegments.length === 1) {
        // Root level document
        const node = nodeMap.get(entry.slug);
        if (node) rootNodes.push(node);
      } else {
        // Find parent
        const parentPath = pathSegments.slice(0, -1).join("/");
        const parentNode = nodeMap.get(parentPath);
        const currentNode = nodeMap.get(entry.slug);

        if (parentNode && currentNode) {
          parentNode.children.push(currentNode);
        } else if (currentNode) {
          // Parent doesn't have index file, add to root
          rootNodes.push(currentNode);
        }
      }
    });

    // Sort children recursively
    function sortNodes(nodes: SidebarNode[]): SidebarNode[] {
      return nodes
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((node) => ({
          ...node,
          children: sortNodes(node.children),
        }));
    }

    return sortNodes(rootNodes);
  }

  // Get files for current section
  function getCurrentSectionFiles(): SidebarSection[] {
    const sections: SidebarSection[] = [];

    // Find the current entry's base path
    let currentBasePath = "";

    // Check if current slug is an index file
    const currentEntry = entries.find((entry) => entry.slug === currentSlug);
    if (currentEntry && currentEntry.id.endsWith("index.mdoc")) {
      // Current page is an index, show its direct children
      currentBasePath = currentEntry.id
        .replace(/\/index\.mdoc$/, "")
        .replace(/\.mdoc$/, "");
    } else {
      // Current page is a regular file, find its parent directory
      const pathSegments = currentSlug.split("/");
      if (pathSegments.length > 1) {
        currentBasePath = pathSegments.slice(0, -1).join("/");
      }
    }

    if (!currentBasePath) return sections;

    // Convert slug path back to file path for matching
    const currentFileBasePath = currentBasePath.replace(/-/g, " ");

    // Group files by their immediate parent directory
    const fileGroups = new Map<string, DocsEntry[]>();

    entries.forEach((entry) => {
      if (entry.id.endsWith("index.mdoc")) return; // Skip index files

      const entryPath = entry.id.replace(/\.mdoc$/, "");
      const entrySegments = entryPath.split("/");
      const entryBasePath = entrySegments.slice(0, -1).join("/");

      // Check if this file belongs to current section or its subdirectories
      if (
        entryBasePath === currentFileBasePath ||
        entryBasePath.startsWith(currentFileBasePath + "/")
      ) {
        const relativePath = entryBasePath.slice(
          currentFileBasePath.length + 1,
        );

        if (!relativePath) {
          // Direct child of current section
          const groupKey = "Files";
          if (!fileGroups.has(groupKey)) {
            fileGroups.set(groupKey, []);
          }
          fileGroups.get(groupKey)!.push(entry);
        } else {
          // Child of a subdirectory
          const subDir = relativePath.split("/")[0];
          if (!fileGroups.has(subDir)) {
            fileGroups.set(subDir, []);
          }
          fileGroups.get(subDir)!.push(entry);
        }
      }
    });

    // Convert groups to sections
    fileGroups.forEach((docs, groupName) => {
      const items: SidebarNode[] = docs.map((entry) => ({
        title: entry.data.title,
        slug: entry.slug,
        id: entry.id,
        children: [],
        isActive: currentSlug === entry.slug,
      }));

      sections.push({
        title: groupName,
        items: items.sort((a, b) => a.title.localeCompare(b.title)),
      });
    });

    return sections.sort((a, b) => {
      // Put "Files" section first, then alphabetical
      if (a.title === "Files") return -1;
      if (b.title === "Files") return 1;
      return a.title.localeCompare(b.title);
    });
  }

  return {
    content: buildContentHierarchy(),
    currentSectionFiles: getCurrentSectionFiles(),
  };
}
