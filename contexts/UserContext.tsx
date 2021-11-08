import * as React from "react";
import { UserType } from "../types";

const UserContext = React.createContext<UserType>({});

export default UserContext;
