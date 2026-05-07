import { AppUserDto } from "@/models/app-user";
import type { LoginFormDto } from "@/models/form-data";
import { useBackendConfig as useBackendConfig } from "@/stores/backend-config";
import { useLoggedUser } from "@/stores/logged-user";
import axios from "axios";

export function loginUser(form: LoginFormDto) {
    const config = useBackendConfig();
    const user = useLoggedUser();
    axios
    .post(`${config.backend}/authenticate`, form)
    .then((response) => {
        user.user = AppUserDto.digestResponseData(response.data.details);
        config.token = response.data.token as string;
    });
}