import { createRouter } from "../createRouter";
import { userRouter } from "./user.router";

//merge --> merges the base app router with prefix as the first param
//and the router to be merged as second param.

export const appRouter = createRouter().merge("users.", userRouter);

//Export whatever the type of appRouter is
export type AppRouter = typeof appRouter;
