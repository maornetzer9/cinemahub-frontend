import { useState, useCallback } from "react";
import AddUser from "./AddUser";
import AllUsers from "./AllUsers";
import AddIcon from "@mui/icons-material/Add";
import PageWrapper from "../layout/PageWrapper";
import AppFab from "../../design-system/components/AppFab";

export default function Users() {
    const [selectedComponent, setSelectedComponent] = useState("All Users");

    const componentsHandler = useCallback((component) => setSelectedComponent(component), []);

    return (
        <PageWrapper>
            <AllUsers />
            {selectedComponent === "Add User" && (
                <AddUser componentsHandler={componentsHandler} selectedComponent={selectedComponent} />
            )}
            <AppFab title="Add User" onClick={() => componentsHandler("Add User")}>
                <AddIcon />
            </AppFab>
        </PageWrapper>
    );
}
