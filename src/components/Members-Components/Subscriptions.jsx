import PermissionsLoader from "../UI/PermissionsLoader";
import Members from "./Members";

export default function Subscriptions() {
    return (
        <PermissionsLoader>
            <Members />
        </PermissionsLoader>
    );
}
