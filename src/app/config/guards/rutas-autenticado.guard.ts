import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../../servicios/storage.service';

@Injectable({
	providedIn: 'root'
})
export class RutasAutenticadoGuard implements CanActivate {

	constructor(
		private router: Router,
		private storageService: StorageService
	) { }

	async canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Promise<boolean> {
		let resp = await this.storageService.get('ingreso').then(resp => resp);
		resp = JSON.parse(resp);
		if (resp) {
			return true;
		}
		this.router.navigateByUrl('login');
		return false;
	}
}
