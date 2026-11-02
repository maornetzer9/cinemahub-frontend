import { createContext, useContext } from "react";

export const RegisterPageReadyContext = createContext(null);

export function useRegisterPageReady() {
    const ctx = useContext(RegisterPageReadyContext);
    if (!ctx) throw new Error("useRegisterPageReady must be used within RegisterPageReadyProvider");
    return ctx;
}
