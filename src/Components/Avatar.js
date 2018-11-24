import React, {Component} from 'react';
import * as THREE from 'three';
import path from 'path';
import FBXLoader from 'three-fbx-loader';
import OrbitControls from 'three-orbitcontrols'
import fs from 'fs-extra';

class Avatar extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.computeBoundinBox = this.computeBoundinBox.bind(this);
  }

  componentDidMount(){
    this.configureScene()
  }

  configureScene(){
    const model = 'minion/source/Minion.fbx';
    this.clock = new THREE.Clock();
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width/height, 1, 2000);
    camera.position.set( 100, 200, 300 );

    var globe = new THREE.Group();
    globe.position.set(0,0,0);
    scene.add(globe);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.globe = globe;
    var fbxLoader = new FBXLoader();
    var mixers = []
    var textures = this.loadTextures('minion/textures');
    let texturePromises = textures[1];
    textures = textures[0];
    var material;
    Promise.all(texturePromises).then(() => {
      material = new THREE.MeshStandardMaterial({
        aoMap: (textures.ao && textures.ao.value) ? textures.ao.value : null,
        normalMap: (textures.normal && textures.normal.value) ? textures.normal.value : null,
        normalMapType: THREE.TangentSpaceNormalMap,
        map: (textures.albedo && textures.albedo.value) ? textures.albedo.value : (textures.diffuse && textures.diffuse.value) ? textures.diffuse.value : null,
        roughnessMap: (textures.roughness && textures.roughness.value) ? textures.roughness.value : null,
        bumpMap: (textures.bump && textures.bump.value) ? textures.bump.value : null,
        displacementMap: (textures.displacement && textures.displacement.value) ? textures.displacement.value : null,
        emissiveMap: (textures.gloss && textures.gloss.value) ? textures.gloss.value : null,
        roughness: 5,
        lights: true,
        displacementScale: 0.03,
        aoMapIntensity: 0.5,
        bumpScale: 0.1,
        emissiveIntensity: 1,
        normalScale: new THREE.Vector2(1,1),
        refractionRatio: 0.1,
        metalness: 0.1,
        morphNormals: true,
        morphTargets: true,
        polygonOffset:  true,
        polygonOffsetFactor: 1000,
        polygonOffsetUnits: 1000,
        skinning: true,
        side: THREE.DoubleSide,
      });
      this.material = material;
      fbxLoader.load(model, obj => {
        obj.mixer = new THREE.AnimationMixer(obj)
        mixers.push( obj.mixer );
        var action = obj.mixer.clipAction( obj.animations[ 0 ] );
        action.play();
        obj.traverse(item => {
          if (item.isMesh){
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });
        var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        scene.add( obj );
        this.obj = obj;
        this.mixers = mixers;
        console.log('Object: ', this.obj)
        this.computeBoundinBox();
        let spotLight = new THREE.SpotLight(0xffffff, 2)
        spotLight.position.set(45, 50, 15);
        scene.add(spotLight);
  
        let dirLight = new THREE.DirectionalLight( 0xffffff, 2.25);
        dirLight.position.set(-360, -88, -200);
        dirLight.castShadow = true;
        scene.add( dirLight );
        renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        this.start()
      });
    }); 
  }

  loadTextures(dir){
    var loader = new THREE.TextureLoader();
    var textures = {};
    var texturePromises = [];
    let maps = fs.readdirSync(dir)
    console.log('MAPS: ', maps)
    // maps.map(map => {
    //   let mapName = path.basename(map).split('_');
    //   if (!mapName[mapName.length - 1].includes('LOD')){
    //     mapName = mapName[mapName.length - 1].split('.')[0]
    //   }
    //   else{
    //     mapName[mapName.length - 1] = mapName[mapName.length - 1].split('.')[0];
    //     mapName = mapName.splice(mapName.length-2).join('');
    //   }
    //   textures[mapName.toLowerCase()] = { uri: path.join(dir, mapName)  };
    // });
    // for (var key in textures){
    //   texturePromises.push(new Promise((resolve, reject) => {
    //     var entry = textures[key];
    //     var uri = entry.uri;
    //     loader.load(uri, texture => {
    //       entry.value = texture;
    //       texture.wrapS = THREE.RepeatWrapping;
    //       texture.wrapT = THREE.RepeatWrapping;
    //       texture.repeat.set(1, 1);
    //       if (entry.value instanceof THREE.Texture) resolve(entry);
    //     }, xhr => {
    //       console.log(uri + ' ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    //     }, xhr => {
    //       reject(new Error (xhr + 'An error occured while loading ' , entry.uri));
    //     })
    //   }));
    // }
    // console.log('Textures: ', textures);
    // return [textures, texturePromises];
  }

  computeBoundinBox(){
    this.setState({loading: false})
    this.globe.add(this.obj);
    let offset = 1.60;
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(this.obj);
    const center = boundingBox.getCenter();
    console.log('Center of model: ', center);
    const size = boundingBox.getSize();
    console.log('Box Size: ', size);
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    let cameraZ = maxDim / 2 / Math.tan( fov / 2 );
    cameraZ *= offset;
    this.camera.position.z = center.z + cameraZ;
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();

    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    // controls.target.set( 0, 100, 0 );
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.1;
    controls.enableKeys = false;
    controls.screenSpacePanning = true;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.dampingFactor = 1; // friction
    controls.update();
    this.controls = controls;
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.frameId = requestAnimationFrame(this.animate);
    if ( this.mixers.length > 0 ) {
      for ( var i = 0; i <  this.mixers.length; i ++ ) {
        this.mixers[ i ].update( this.clock.getDelta() );
      }
    }
    this.controls.update();
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;
  }

  render(){
    const {loading} = this.state;
    return(
      <div
        style={{width: '500px', height: '500px'}}
        ref={(mount) => { this.mount = mount }}
      >
      </div>
    )
  }
}

export default Avatar