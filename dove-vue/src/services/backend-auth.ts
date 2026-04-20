import type { AppUserDto } from "@/models/app-user";
import type { LoginFormDto } from "@/models/form-data";
import { useBackendConfig as useBackendConfig } from "@/stores/backend-config";
import { useLoggedUser } from "@/stores/logged-user";
import { useTipiSchedeOggetto } from "@/stores/schede-by-schema";
import axios from "axios";

export function loginUser(form: LoginFormDto) {
    const config = useBackendConfig();
    const schede = useTipiSchedeOggetto();
    const user = useLoggedUser();
    axios
    .post(`${config.backend}/authenticate`, form)
    .then((response) => {
        schede.init()
        .then(() => {});
        user.user = response.data.details as AppUserDto;
        config.token = response.data.token as string;
    });
}