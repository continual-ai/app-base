import { createOperationApi } from "./api";
import { createOperationContext } from "./context";
import { operations } from "./operations";

export const appApi = createOperationApi(operations, createOperationContext);
