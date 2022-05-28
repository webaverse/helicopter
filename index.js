import * as THREE from 'three';
import metaversefile from 'metaversefile';
import { Vector3 } from 'three';

const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useActivate} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\/]*$/, '$1'); 




export default () => {  

    const app = useApp();
    let prop = null;
    let heli = null;
    const physics = usePhysics();
    const physicsIds = [];

    (async () => {
        const u = `${baseUrl}/flying-machine.glb`;
        heli = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);
            
        });
        let propSpec = app.getComponent("propeller");
        heli.scene.traverse(o => {
          // if (o.isMesh) {
          //   console.log(o);
          // }
          if(o.name === propSpec.name) {  prop = o; }
        });
        //heli.scene.position.y=1;
        heli.scene.scale.set(0.7,0.7,0.7);
        //heli.scene.rotation.x = Math.PI/2;
        // group.add(heli.scene);
        app.add(heli.scene);
        let physicsId;
        physicsId = physics.addGeometry(heli.scene);
        physicsIds.push(physicsId)
        const geometry = new THREE.CircleGeometry( 5, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent:true, opacity:0.5, side: THREE.DoubleSide } );
        const circle = new THREE.Mesh( geometry, material );
        circle.rotation.x = Math.PI / 2;
        circle.position.y = 0.2;
        app.add( circle );
        app.updateMatrixWorld();


    })();

    
    

    useFrame(( { timeStamp } ) => {
      if(prop){
        prop.rotation.x = Math.PI / 2; 
        prop.rotation.y = 0; 
        prop.rotation.z += 10; 
        //prop.rotateZ(Math.cos(timeStamp));
        //console.log(prop.rotation)
      }
      app.updateMatrixWorld();
    });

    
    useCleanup(() => {
      for (const physicsId of physicsIds) {
        physics.removeGeometry(physicsId);
      }
    });

    return app;
}
