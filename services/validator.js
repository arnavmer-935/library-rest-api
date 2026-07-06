import zod from "zod";

export const reviewSchema = zod.object({
    rating: zod.number().min(1).max(5),
    comment: zod.string().trim().min(1)
});

export const bookSchema = zod.object({
    title: zod.string().trim().min(5),
    genre: zod.string().trim().min(1),
    reviews: zod.array(reviewSchema).default([]),
    price: zod.number().positive()
});

export const idParamSchema = zod.object({
    id: zod.coerce.number().positive()
});

export const querySchema = zod.object({

    genre: zod.string().trim().toLowerCase().min(1).optional(),

    sortBy: zod.string()
                .trim()
                .toLowerCase()
                .pipe(
                    zod.enum(["genre", "title", "price", "avgrating"])
                )
                .default("title"),
    
    minPrice: zod.coerce.number().positive().optional(),
    maxPrice: zod.coerce.number().positive().optional(),
    minAvgRating: zod.coerce.number().min(1).max(5).optional(),
    maxAvgRating: zod.coerce.number().min(1).max(5).optional(),

    order: zod.string().trim().toLowerCase()
                .pipe(
                    zod.enum(["asc", "desc"])
                )
                .default("asc"),
    
    limit: zod.coerce.number().int().positive().max(20).default(5),
    page: zod.coerce.number().int().positive().max(10).default(1)
                    
});

export const bookPatchSchema = bookSchema.partial();