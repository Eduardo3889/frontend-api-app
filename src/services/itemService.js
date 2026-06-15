import { apiConfig } from "../config/apiConfig.js";
import { makeCrudService } from "./crudService.js";

export const itemService = makeCrudService(apiConfig.itemsPath);
