import * as THREE from "three";
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
export default function picturesHoverEffect(selector) {
    const $images = document.querySelectorAll(selector);

    const myEffect = {
        uniforms: {
          "tDiffuse": { value: null },
          "resolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
          "uMouse": { value: new THREE.Vector2(-10,-10) },
          "uVelo": { value: 0 },
        },
        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
        fragmentShader: `uniform float time;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;
        uniform vec2 uMouse;
        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          uv*=resolution;
          float dist = sqrt(dot(uv, uv));
          return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        }
        void main()  {
            vec2 newUV = vUv;
            float c = circle(vUv, uMouse, 0.0, 0.2);
            float r = texture2D(tDiffuse, newUV.xy += c * (0.1 * .5)).x;
            float g = texture2D(tDiffuse, newUV.xy += c * (0.1 * .525)).y;
            float b = texture2D(tDiffuse, newUV.xy += c * (0.1 * .55)).z;
            vec4 color = vec4(r, g, b, 1.);

            gl_FragColor = color;
        }`
      }

    // set up post processing
       

    $images.forEach(image => {
        console.log(image);
        const { width, height, left, right} = image.getBoundingClientRect();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        let uMouse = new THREE.Vector2(0,0);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( width,height );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.domElement.setAttribute('data-webgl_rederer', '');
        image.insertAdjacentElement('beforebegin', renderer.domElement);

        let composer = new EffectComposer(renderer);
        let renderPass = new  RenderPass(scene, camera);
        // rendering our scene with an image
        composer.addPass(renderPass);
        camera.position.z = 300;
        window.camera1 = camera;
        let customPass = new  ShaderPass(myEffect);
        // making sure we are rendering it.
        customPass.renderToScreen = true;
        composer.addPass(customPass);
    
        // actually render scene with our shader pass
        composer.render();
        var animate = function () {
            customPass.uniforms.uMouse.value = uMouse;
      requestAnimationFrame( animate );

      // renderer.render( scene, camera );
      composer.render()
        };

        let TEXTURE = new THREE.TextureLoader().load(image.dataset.webgl, (tex) => {
            tex.needsUpdate = true;
            mesh.scale.set(1.0,   tex.image.width/tex.image.height, 1.0);
        }); 
        var uniforms = {
            u_texture: {type: 't', value: TEXTURE},
            mouse: { x: 50, y: 50 },
        };
        let mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(width, height), 
            new THREE.MeshBasicMaterial({ map: TEXTURE})
        );
        console.log(mesh);
        mesh.scale.set(1.0,  width / height, 1.0);
            scene.add(mesh);
            image.style.visibility = 'hidden';
            image.style.display = 'none';
            animate();
        const container = image.parentElement;
        container.addEventListener('mousemove', (e) => {
            // mousemove / touchmove
            // console.log(e);
            if (container.isAnimating === true) return;
            uMouse.x = ( e.clientX  / window.innerWidth ) ;
            uMouse.y = 1. - ( e.clientY/ window.innerHeight );
        });
        container.addEventListener('mouseleave', (e) => {
            gsap.to(uMouse, { x: 0, y: 0, onUpdate: () => console.log('ffff') })
            // uMouse = new THREE.Vector2(-100,-100)
        });
        container.addEventListener('mouseenter', (e) => {
            console.log(( e.clientX  / window.innerWidth ), 1. - ( e.clientY/ window.innerHeight ));
            gsap.timeline()
            .add(() => container.isAnimating = true)
            .to(
                uMouse, 
                { 
                    x: ( e.clientX  / window.innerWidth ) , 
                    y:  1. - ( e.clientY/ window.innerHeight ), 
                }
            )
            .add(() => container.isAnimating = false)
            // uMouse = new THREE.Vector2(-100,-100)
        });

    })
    // animate();


}