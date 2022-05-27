import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map,catchError,tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl : string = environment.baseUrl
  private _usuario !: Usuario

  get usuario(){
    return {...this._usuario} //lo retorno asi para no cambiar los valores accidentalmente
  }
  constructor(private http : HttpClient) { }

  login(email:string,password:string){
    const url = `${this.baseUrl}/auth`
    const body = {
      email,
      password
    }
    return this.http.post<AuthResponse>(url,body)
      .pipe(
        tap(resp=>{
          if(resp.ok){
            localStorage.setItem('token',resp.token!)
            this._usuario = {
              name : resp.name!,
              uid : resp.uid!
            }
          }
        }),
        //el map permite mutar la respuesta
        map(resp=> resp.ok),
        //para agarrar el error
        catchError(err => of(err.error.msg))
      )
  }

  validarToken(){
    const url = `${this.baseUrl}/auth/renew`
    const headers = new HttpHeaders()
      .set('x-token',localStorage.getItem('token') || '')
    return this.http.get(url,{headers})
  }



}
