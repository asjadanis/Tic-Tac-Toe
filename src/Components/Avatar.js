import React, {Component} from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';

class Avatar extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      activeAction: 'Wave',
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.computeBoundinBox = this.computeBoundinBox.bind(this);
    this.changeAnimation = this.changeAnimation.bind(this);
  }

  componentDidMount(){
    this.configureScene()
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentWillReceiveProps(nextProps){
    // console.log('Animation: ', nextProps.currentAnimation)
    this.changeAnimation(nextProps.currentAnimation)
  }

  configureScene(){
    // const model = 'Robot/RobotExpressive.glb';
    const model = this.props.model;
    // console.log('MODEL PATH: ', model);
    this.clock = new THREE.Clock();
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width/height, 0.25, 100);
    if (this.props.player.includes('human')){
      camera.position.set( -9, 3, 1 );
    }
    scene.add(camera)
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    var gltfLoader = new GLTFLoader();
    var item;
    var mixer;
    var actions = {};
    this.states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
    this.emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
    var globe = new THREE.Group();
    scene.add(globe);
    gltfLoader.load(model, obj => {
      item = obj.scene
      // console.log('ITEM: ', item);
      if (this.props.player.includes('human')){
        setInterval(() => {
          globe.add(item); 
          var activeAction = actions[this.state.activeAction];
          activeAction.play();
          activeAction.fadeOut(6);
          activeAction = actions['Idle']
          activeAction.play()
        }, 1200)
      }
      else{
        globe.add(item);
      }
      if (this.props.player.includes('computer')){
        globe.rotateY(10.5)
      }
      mixer = new THREE.AnimationMixer(item);
      for (var i = 0; i < obj.animations.length; i++){
        var clip = obj.animations[i];
        var action = mixer.clipAction(clip);
        actions[clip.name] = action;
        if ( this.emotes.indexOf( clip.name ) >= 0 || this.states.indexOf( clip.name ) >= 3 ) {
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }
        if (this.props.player.includes('computer') && !clip.name.includes('idle') && !clip.name.includes('Run_L')){
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }
      }
      // console.log('Actions : ', actions)
      if (this.props.player.includes('human')){
        var face = item.getObjectByName( 'Head_2' );
        var expressions = Object.keys( face.morphTargetDictionary );
        this.expressions = expressions;
        // console.log('Expressions: ', expressions);
        // console.log('ACTIONS: ', this.actions);
      }
      else{
        activeAction = actions['idle']
        activeAction.fadeIn(6);
        activeAction.play()
        var activeAction = actions['Threaten'];
        activeAction.play();
        // activeAction.fadeOut(6);
        // activeAction = actions['idle']
        // activeAction.fadeIn(6);
        // activeAction.play()
      }
      this.actions = actions;
      this.mixer = mixer;
      this.obj = item;
      this.computeBoundinBox('none');
      
      var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
      light.position.set( -20, 20, 0 );
      camera.add( light );
      light = new THREE.DirectionalLight( 0xffffff, 2 );
      light.position.set( -20, 20, 10 );
      camera.add( light );
      if (this.props.player.includes('computer')){
        light = new THREE.AmbientLight(0xffffff, 2);
        light.position.set(0, 100, 0);
        camera.add(light)
      }
      renderer.setSize(width, height);
      this.mount.appendChild(this.renderer.domElement);
      this.start()
    }); 
  }

  changeAnimation(animation){
    if (animation){
      // console.log('Animation : ', animation, this.actions);
      var activeAction = this.actions[animation];
      if (this.activeAction){
        this.activeAction.fadeOut(0.3)
      }
      this.activeAction = activeAction;
      // activeAction.play();
      activeAction.reset()
					.setEffectiveTimeScale( 1 )
					.setEffectiveWeight( 1 )
					.fadeIn( 0.5 )
          .play();
    }
  }

  computeBoundinBox(animation){

    let controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.1;
    controls.enableKeys = false;
    controls.screenSpacePanning = true;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.dampingFactor = 1;
    this.controls = controls;

    let offset = this.props.player === 'computer' && animation.includes('Run_L') ? 2.0 : 1.60;
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(this.obj);
    const center = boundingBox.getCenter();
    const size = boundingBox.getSize();
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
    controls.target.set(center.x, center.y, center.z)
    controls.update();    
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
    if ( this.mixer ) {
      this.mixer.update( this.clock.getDelta() );
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
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
  }

  handleWindowResize(e){
    // this.camera.aspect = window.innerWidth/window.innerHeight;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
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