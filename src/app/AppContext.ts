import { createContext } from "react";
import { RouteConfig } from "react-router-config";
import { AppState } from "services/authorization-service";
import { SignalRService } from "services/signalr-service";

export const SignalRContext = createContext<SignalRService>(null);
export const AppStateContext = createContext<AppState>(null);
export const MenuContext = createContext<RouteConfig[]>([]);
