import {z} from "zod";

export const baseQueryOptionsSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().default(10),
    orderBy: z.enum(["asc", "desc"]).default("desc"),
    sortBy: z.any().optional(),
});

export type baseQueryOptions = z.infer<typeof baseQueryOptionsSchema>;

export const basePaginationResponseSchema = z.object({
    data: z.array(z.any()),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type basePaginationResponse = z.infer<typeof basePaginationResponseSchema>;