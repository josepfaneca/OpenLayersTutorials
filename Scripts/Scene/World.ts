// import { GetScene } from "./SceneManager";
// import { GetTextureHelper } from "./Texture";
// import { Singleton } from "vincijs";
// var THREE =require('three')

// export interface IWorld {
//     SetPosition(x: number, y: number, z: number): IWorld
//     Reset(width: number, height: number): IWorld
// }
// class World implements IWorld {
//     private Ground: THREE.Mesh
//     constructor() {
//         let texture = GetTextureHelper().Load({ fileName: "ground", extension: ".jpg" });
//         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//         this.Ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), GetTextureHelper().GetMaterial("ground"))//
//         this.Ground.name = "ground";
//         this.Ground.rotation.x = - Math.PI / 2;
//         GetScene().add(this.Ground);
//     }
//     public SetPosition(x: number, y: number, z: number): IWorld {
//         this.Ground.position.set(x, y, z);
//         return this;
//     }
//     public Reset(width: number, height: number): IWorld {
//         this.Ground.scale.set(width += 100, height += 100, 1);
//         let texture = this.Ground.material as THREE.MeshBasicMaterial
//         texture.map.repeat.set(Math.floor(width / 50), Math.floor(height / 50));
//         return this;
//     }
// }
// export let GetWord: () => IWorld = Singleton(World, true);
