import { apiConfig } from "../config/apiConfig.js";
import { makeCrudService } from "./crudService.js";

export const userService = makeCrudService(apiConfig.usersPath);
