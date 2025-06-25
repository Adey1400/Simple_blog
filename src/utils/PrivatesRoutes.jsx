import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export const PrivateRoutes=()=>{
const {user}= useAuth()
return user? <Outlet></Outlet>: <Navigate to ="/login"/>
}
 
