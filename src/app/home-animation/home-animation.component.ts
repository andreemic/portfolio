import { Component, Input, OnInit, ViewChild, NgZone, HostListener, ElementRef } from '@angular/core';

import drawVert from './shaders/draw.vert';
import drawFrag from './shaders/draw.frag';

import quadVert from './shaders/quad.vert';

import screenFrag from './shaders/screen.frag';
import updateShader from './shaders/update.shader';

import * as util from './util';
import * as floatPacking from './floatPacking';

const DIM_X = 0;
const DIM_Y = 1;
const NUM_PARTICLES = 10000;

interface Program {
  program: WebGLProgram;
  attributes?: {[key: string]: GLint};
  uniforms?: {[key: string]: GLint};
}

@Component({
  selector: 'app-home-animation',
  templateUrl: './home-animation.component.html',
  styleUrls: ['./home-animation.component.scss']
})

export class HomeAnimationComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private gl: WebGLRenderingContext;
  w: number;
  h: number;
  aspectRatio: number;
 
  fadeOpacity = 0.997;      //how fast particle trails fade
  speedFactor = 0.001;       
  dropRate = 0.009;         //how often particle gets t.p'd to a random place
  dropRateBump = 0.01;      //dropRate increase relative to particle speed

  drawProgram: Program;
  screenProgram: Program;
  updateProgram: Program;

  quadBuffer: WebGLBuffer;
  framebuffer: WebGLBuffer;
  particleIndexBuffer: WebGLBuffer;
  
  screenTexture: WebGLTexture;
  backgroundTexture: WebGLTexture;
  forceFieldTexture: WebGLTexture;

  particleStateSize: number;
  particleStateTexture0: {x: WebGLTexture, y: WebGLTexture};
  particleStateTexture1: {x: WebGLTexture, y: WebGLTexture};

  click = {
    x: 0.0,
    y: 0.0
  };
    

  onResize() {
    const realToCSSPixels = window.devicePixelRatio;
    const canvas = this.canvas.nativeElement;
    const gl = this.gl;
    if (canvas) {

      //Update canvas size to fit screen
      this.w = Math.floor(canvas.clientWidth  * realToCSSPixels);
      this.h = Math.floor(canvas.clientHeight  * realToCSSPixels);
      this.aspectRatio = this.w / this.h;

      canvas.width = this.w;
      canvas.height = this.h;
      
      if (gl) {
        gl.viewport(0, 0, this.w, this.h);


        //Init empty textures
        const emptyPixels = new Uint8Array(this.w * this.h * 4);
        this.backgroundTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, this.w, this.h);
        this.screenTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, this.w, this.h);;
      }
    }

  }
  
  @HostListener('document:touchstart', ['$event'])
  onTouchStart(e) {
    //this.applyForceField = true;
    //this.updateForceField(e.touches);
    this.click = {
      x: e.touches[0].pageX / this.canvas.nativeElement.clientWidth,
      y: e.touches[0].pageY / this.canvas.nativeElement.clientHeight
    };
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(e) {
   // this.applyForceField = false;
   this.click = {
     x: 0,
     y: 0
   };
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(e) {
    //this.updateForceField(e.touches);
    this.click = {
      x: e.touches[0].pageX / this.canvas.nativeElement.clientWidth,
      y: e.touches[0].pageY / this.canvas.nativeElement.clientHeight
    };
  }

  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.init();
  }
  init() {
    //Prepare WebGL context
    this.gl = this.canvas.nativeElement.getContext('webgl');
    //Uncomment for debug: 
    //@ts-ignore
    //this.gl = WebGLDebugUtils.makeDebugContext(this.gl);

    const gl = this.gl;
    if (gl === null) {
      console.log('WebGL not supported.');
      return;
    }
    gl.clearColor(0.1333,0.1569,0.1921, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST); //To-do: Move to ngOnInit?


    this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
    this.screenProgram = util.createProgram(gl, quadVert, screenFrag);
    this.updateProgram = util.createProgram(gl, quadVert, updateShader.getFragSource());

    //Buffer describing vertices of a square as two triangles.

    this.quadBuffer = util.createBuffer(gl, new Float32Array([0, 0,   1, 0,   0, 1,   0, 1,   1, 0,   1, 1])); 
    this.framebuffer = gl.createFramebuffer(); 

    this.numParticles = NUM_PARTICLES;


    this.onResize();
    this.ngZone.runOutsideAngular(() => this.frame());
  }

  frame() {
    requestAnimationFrame(this.frame.bind(this));
      this.draw();
  }

  draw() {
    const gl = this.gl;
    util.bindTexture(gl, this.particleStateTexture0.x, 0);
    util.bindTexture(gl, this.particleStateTexture0.y, 1);

    this.drawScreen();
    this.updateParticles();
  }

  drawScreen() {
    const gl = this.gl;

    //Draw screen to temporary framebuffer 
    //to retain as background for next draw.
    util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
    gl.viewport(0, 0, this.w, this.h);

    this.drawTexture(this.backgroundTexture, this.fadeOpacity);
    this.drawParticles();

    util.bindFramebuffer(gl, null); //unbind frame buffer

    //enable blending to draw on top of fading background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.drawTexture(this.screenTexture, 1.0);
    gl.disable(gl.BLEND);

    //Save current screen as background for next draw.
    const temp = this.backgroundTexture;
    this.backgroundTexture = this.screenTexture;
    this.screenTexture = temp;
  }

  drawTexture(texture, opacity) {
    const gl = this.gl;

    const program = this.screenProgram;
    gl.useProgram(program.program);

    util.bindAttribute(gl, this.quadBuffer, program.attributes.a_pos, 2); //provide shader with vertices of a square
    util.bindTexture(gl, texture, 2);
    //Tell shader that u_screen texture is bound under unit 1
    gl.uniform1i(program.uniforms.u_screen, 2);  
    gl.uniform1f(program.uniforms.u_opacity, opacity);

    gl.drawArrays(gl.TRIANGLES, 0, 6); 
  }

  /*
   * Update either x or y dimension. (DIM_X or DIM_Y)
   */ 
  updateParticlesDimension(dimension: number) {
    const gl = this.gl;

    util.bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1[(dimension == DIM_X ? 'x' : 'y')]);
    gl.viewport(0, 0, this.particleStateSize, this.particleStateSize);

    const program = this.updateProgram;
    gl.useProgram(program.program);

    util.bindAttribute(gl, this.quadBuffer, program.attributes.a_pos, 2);
    
    gl.uniform1i(program.uniforms.u_particles_x, 0);
    gl.uniform1i(program.uniforms.u_particles_y, 1);

    gl.uniform1f(program.uniforms.u_rand_seed, Math.random());
    gl.uniform1f(program.uniforms.u_speed_factor, this.speedFactor);
    gl.uniform1f(program.uniforms.u_drop_rate, this.dropRate);
    gl.uniform1f(program.uniforms.u_drop_rate_bump, this.dropRateBump);
    gl.uniform1i(program.uniforms.u_out_dimension, dimension);  
    gl.uniform2f(program.uniforms.u_click_coord, this.click.x, this.click.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  updateParticles() {
    const gl = this.gl;
    
    this.updateParticlesDimension(DIM_X);
    this.updateParticlesDimension(DIM_Y);

    //Swap particle state textures
    const temp = this.particleStateTexture0;
    this.particleStateTexture0 = this.particleStateTexture1;
    this.particleStateTexture1 = temp;
  }

  /*
   * Use drawProgram to draw particles to the screen.
   * The shaders receive particleStateTexture (bound in draw),
   * a particle index (a_index) and the size of particleStateTexture
   * (u_particles_size). The colors of particleStateTexture into position.
   */
  drawParticles() {
    const gl = this.gl;
    const program = this.drawProgram;
    gl.useProgram(program.program);

    //Provide draw shader with index so it can look up
    //particle state in the texture.
    util.bindAttribute(gl, this.particleIndexBuffer, program.attributes.a_index, 1);
    gl.uniform1i(program.uniforms.u_particles_x, 0); //particle texture at unit 0 
    gl.uniform1i(program.uniforms.u_particles_y, 1); //particle texture at unit 0 
    gl.uniform1f(program.uniforms.u_particles_size, this.particleStateSize);
    gl.uniform1f(program.uniforms.u_aspect_ratio, this.aspectRatio);

    gl.drawArrays(gl.POINTS, 0, this._numParticles);
  }
  
  _numParticles: number;
  set numParticles(numParticles: number) {
    const gl = this.gl;

    //Create a square texture where each pixel represents
    //a particle position encoded as RGBA.
    const particleTexSize = this.particleStateSize = Math.ceil(Math.sqrt(numParticles));
    this._numParticles = particleTexSize * particleTexSize;
    
    const particleStateX = new Uint8Array(this._numParticles * 4);
    const particleStateY= new Uint8Array(this._numParticles * 4);
    for (let i = 0; i < particleStateX.length; i += 4) {
      floatPacking.encodeFloatRGBA(Math.random(), particleStateX, i); //randomize initial particle position
      floatPacking.encodeFloatRGBA(Math.random(), particleStateY, i); //randomize initial particle position
    }

    //create the textures to hold particle positions for current and next frame
    this.particleStateTexture0 = {
      x: util.createTexture(this.gl, this.gl.NEAREST, particleStateX, particleTexSize, particleTexSize),
      y: util.createTexture(this.gl, this.gl.NEAREST, particleStateY, particleTexSize, particleTexSize)
    };
    this.particleStateTexture1 = {
      x: util.createTexture(this.gl, this.gl.NEAREST, particleStateX, particleTexSize, particleTexSize),
      y: util.createTexture(this.gl, this.gl.NEAREST, particleStateY, particleTexSize, particleTexSize)
    };

    const particleIndicies = new Float32Array(this._numParticles);
    for (let i = 0; i < this._numParticles; i++) {
      particleIndicies[i] = i;
    }
    this.particleIndexBuffer = util.createBuffer(this.gl, particleIndicies);
  }

  get numParticles(): number{
    return this._numParticles;
  }
}
