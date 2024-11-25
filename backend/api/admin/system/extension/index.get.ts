import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary:
    "Lists all comments with pagination and optional filtering by user or post",
  operationId: "listComments",
  tags: ["Admin", "Content", "Comment"],
  responses: {
    200: {
      description: "List of comments with user and post details and pagination",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "ID of the extension" },
                productId: {
                  type: "string",
                  description: "Product ID of the extension",
                },
                name: { type: "string", description: "Name of the extension" },
                title: {
                  type: "string",
                  description: "Title of the extension",
                },
                description: {
                  type: "string",
                  description: "Description of the extension",
                },
                link: { type: "string", description: "Link to the extension" },
                status: {
                  type: "boolean",
                  description: "Status of the extension",
                },
                version: {
                  type: "string",
                  description: "Version of the extension",
                },
                image: {
                  type: "string",
                  description: "Image of the extension",
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Extensions"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Extension Management",
};

export default async (data: Handler) => {
  const cacheManager = new CacheManager();

  try {
    const extensions = await cacheManager.getExtensions();
    // Filter out entries with name 'swap' from cached data
    const filteredExtensions = Array.from(extensions.values()).filter(
      (extension: any) => extension.name !== "swap"
    );

    return filteredExtensions;
  } catch (error) {
    console.error("Error fetching extensions from cache:", error);
    return serverErrorResponse;
  }
};
