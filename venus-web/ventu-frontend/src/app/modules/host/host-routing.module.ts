import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppMainComponent } from "src/app/shared/components";
import { HomeComponent } from "./pages/home/home.component";
import { DetalleEventoComponent } from "./pages/detalle-evento/detalle-evento.component";
import { ListaEventosComponent } from "./pages/lista-eventos/lista-eventos.component";
import { PersonalComponent } from "./pages/personal/personal.component";

const routes: Routes = [
    {
        path: "",
        component: AppMainComponent,
        children: [
            {
                path: "home",
                component: HomeComponent,
            },
            {
                path: "lista-eventos",
                component: ListaEventosComponent,
            },
            {
                path: "evento-cargado/:id",
                component: DetalleEventoComponent,
            },
            {
                path:"personal",
                component: PersonalComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HostRoutingModule {}
