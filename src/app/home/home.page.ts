import { ServicioService } from './../services/servicio.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  id = '';
  empleado = {
    nombre: '',
    cargo: '',
    salario: 0,
  }

  listaDeUsuarios: any[] = [];

  constructor(private database: ServicioService) { }

  ngOnInit() {
    this.database.getAll('empleados').then(firebaseResponse => {
      firebaseResponse.subscribe(listaDeUsuariosRef => {

        this.listaDeUsuarios = listaDeUsuariosRef.map(usuarioRef => {
          let usuario = usuarioRef.payload.doc.data();
          usuario['id'] = usuarioRef.payload.doc.id;
          return usuario;
        })
        console.log(this.listaDeUsuarios);

      })
    })
  }

  eliminar(id) {
    this.database.delete('empleados', id).then(res => {
      alert("Se elimino con exito");
    }).catch(err => {
      console.log("ERROR al eliminar ", err);
    });
  }


  altaUsuario() {
    if(this.id.length > 0) {
      this.database.update('empleados', this.id, this.empleado).then(res => {
        this.id = '';
        this.empleado.nombre = '';
        this.empleado.cargo = '';
        this.empleado.salario = 0;
        alert("se modifico el usuario");
      }).catch(err => {
        console.log("Error al modificar: ", err)
      });
    } else {
      this.database.create('empleados', this.empleado).then(res => {
        console.log(res);
        this.id = '';
        this.empleado.nombre = '';
        this.empleado.cargo = '';
        this.empleado.salario = 0;
      }).catch(err => {
        console.log("error en alta: ", err);
      });
    }
  }

  modificar(item) {
    this.id = item.id;
    this.empleado.nombre = item.nombre;
    this.empleado.cargo = item.cargo;
    this.empleado.salario = item.salario;
  }

  obtenerPorId(id) {
    this.database.getById('usuarios', id).then(res => {
      res.subscribe(docRef => {
        let usuario = docRef.data();
        usuario['id'] = docRef.id;
        console.log(usuario)
      })
    })
  }

}
