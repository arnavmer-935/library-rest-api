import zod, { email } from "zod";

export const reviewSchema = zod.object({
    userId: zod.number().positive(),
    rating: zod.number().min(1).max(5),
    comment: zod.string().trim().min(1)
});

export const bookSchema = zod.object({
    title: zod.string().trim().min(1),
    author: zod.string().trim().min(2),
    genre: zod.string().trim().min(2),
    price: zod.number().positive()
});

export const bookPatchSchema = bookSchema.partial();

export const idParamSchema = zod.object({
    id: zod.coerce.number().positive()
});

export const querySchema = zod.object({

    genre: zod.string().trim().toLowerCase().min(1).optional(),

    sortBy: zod.string()
                .trim()
                .toLowerCase()
                .pipe(
                    zod.enum(["genre", "title", "price"])
                )
                .default("title"),
    
    minPrice: zod.coerce.number().positive().optional(),
    maxPrice: zod.coerce.number().positive().optional(),
    order: zod.string().trim().toLowerCase()
                .pipe(
                    zod.enum(["asc", "desc"])
                )
                .default("asc"),
    
    limit: zod.coerce.number().int().positive().max(20).default(5),
    page: zod.coerce.number().int().positive().max(10).default(1)
                    
});

export const authBodySchema = zod.object({
    username: zod.string().trim().min(3).max(30).regex(/^[A-Za-z0-9_]+$/i),
    email: zod.string().trim().toLowerCase().email().max(254),
    password: zod.string().trim().min(8).max(72)

});

export const loginSchema = zod.object({
    identifier: zod.string().trim().min(3),
    password: zod.string().trim().max(72)
});