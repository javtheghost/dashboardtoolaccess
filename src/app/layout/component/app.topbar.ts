import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <img src="assets/logos/logoHeader.png" alt="logo toolaccess" routerLink="/" class="layout-topbar-logo p-5 " />
            <a routerLink="/" class="layout-topbar-logo-text">
                <span>ToolAccess</span>
            </a>
        </div>

        <div class="layout-topbar-actions">

            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>

                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <!-- Botón que abre el menú desplegable de usuario -->
           <div class="relative">
    <button
    class="layout-topbar-action"
    pStyleClass="@next"
    enterFromClass="hidden"
    enterActiveClass="animate-scalein"
    leaveToClass="hidden"
    leaveActiveClass="animate-fadeout"
    [hideOnOutsideClick]="true"
  >
    <i class="pi pi-user"></i>
  </button>

  <!-- Menú desplegable debe ir justo DESPUÉS del botón, porque usa @next -->
  <div
    class="hidden absolute right-0 mt-2 w-40 borderrounded shadow-md z-50"
    style="background-color: var(--background-color); color: var(--text-color);"
  >
    <ul style="list-style:none; margin:0; padding:0;">
      <li>
        <a routerLink="/profile" class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Editar perfil
        </a>
      </li>
      <li>
        <a (click)="logout()" class="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
          Cerrar sesión
        </a>
      </li>
    </ul>

  </div>
</div>

        </div>
    </div>
    `
})
export class AppTopbar {
    constructor(public layoutService: LayoutService) { }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        // Aquí implementas la lógica de cerrar sesión
        console.log('Cerrando sesión...');
        // Ejemplo: this.authService.logout(); this.router.navigate(['/login']);
    }
}
