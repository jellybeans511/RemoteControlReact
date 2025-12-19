var lm=Object.defineProperty;var dm=(e,t,r)=>t in e?lm(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var xs=(e,t,r)=>dm(e,typeof t!="symbol"?t+"":t,r);import{r as oe,j as W,c as pm,R as cm}from"./client-B9F7oGqJ.js";const fm=[{urls:"stun:10.100.0.35:3478"}],hm=e=>{const{signalingUrl:t,offerPeerId:r,targetPeerId:n,useIceServers:a,videoCodec:i,onRemoteStream:s,onSignalingState:u,onIceState:l,onDataChannel:d}=e,c=oe.useRef(null),f=oe.useRef(null),h=oe.useRef(null),m=oe.useRef(null),y=oe.useRef([]),[_,x]=oe.useState("idle"),[$,w]=oe.useState(null),S=oe.useCallback(()=>{var I,z,A;try{(I=f.current)==null||I.getSenders().forEach(M=>M.track&&M.track.stop()),(z=f.current)==null||z.close()}catch{}f.current=null;try{(A=c.current)==null||A.close()}catch{}c.current=null,x("idle")},[]),k=oe.useCallback(async I=>{const z=f.current;if(z)if((I==null?void 0:I.kind)==="answer"&&I.sdp)for(await z.setRemoteDescription(new RTCSessionDescription({type:"answer",sdp:I.sdp}));y.current.length>0;){const A=y.current.shift();A&&await z.addIceCandidate(new RTCIceCandidate(A))}else(I==null?void 0:I.kind)==="ice"&&I.candidate&&(z.remoteDescription?await z.addIceCandidate(new RTCIceCandidate(I.candidate)):y.current.push(I.candidate))},[]),T=oe.useCallback(async()=>{if(S(),!r||!n)throw x("error"),new Error("offerPeerId and targetPeerId are required");const I=new WebSocket(t);c.current=I,I.onopen=()=>{x("connecting");const F={type:"register",payload:{role:"offer",peerId:r}};I.send(JSON.stringify(F))},I.onerror=()=>{x("error"),u==null||u("Error")},I.onclose=()=>{u==null||u("Disconnected")},I.onmessage=async F=>{const ee=JSON.parse(F.data);ee.type==="signal"&&ee.data?await k(ee.data):(ee.type==="answer"||ee.type==="ice")&&await k({kind:ee.type==="answer"?"answer":"ice",...ee.payload})};const z=new RTCPeerConnection(a?{iceServers:fm}:{});f.current=z,h.current=new MediaStream,s&&h.current&&s(h.current);const A=z.createDataChannel("control",{ordered:!0});m.current=A,w(A);const M=F=>{d&&d(F)};A.onopen=()=>M(A),A.onclosing=()=>x("connecting"),A.onclose=()=>w(null),M(A),z.addTransceiver("video",{direction:"recvonly"}),z.addTransceiver("audio",{direction:"recvonly"}),z.onicecandidate=F=>{if(F.candidate&&I.readyState===WebSocket.OPEN){const ee={type:"signal",from:{role:"offer",peerId:r},to:{role:"answer",peerId:n},data:{kind:"ice",candidate:F.candidate}};I.send(JSON.stringify(ee))}},z.oniceconnectionstatechange=()=>{l==null||l(z.iceConnectionState)},z.ontrack=F=>{h.current||(h.current=new MediaStream),h.current.addTrack(F.track),s&&h.current&&s(h.current)};const j=await z.createOffer();i&&(j.sdp=mm(j.sdp||"",i)),await z.setLocalDescription(j);const V={type:"signal",from:{role:"offer",peerId:r},to:{role:"answer",peerId:n},data:{kind:"offer",sdp:j.sdp}};I.send(JSON.stringify(V)),x("connected")},[S,r,n,t,a,i,k,s,l,u]);return oe.useEffect(()=>()=>S(),[S]),{status:_,connection:{start:T,close:S,dataChannel:$},dataChannel:$}};function mm(e,t){const r=e.split(`
`),n=r.findIndex(c=>c.startsWith("m=video"));if(n===-1)return e;const i=r.map((c,f)=>({line:c,i:f})).filter(({line:c})=>c.startsWith("a=rtpmap:")).map(({line:c,i:f})=>{const h=c.match(/a=rtpmap:(\d+)\s+(\w+)/);return h?{payload:h[1],codec:h[2],i:f}:null}).filter(Boolean).find(c=>c.codec.toUpperCase().includes(t.toUpperCase()));if(!i)return e;const s=r[n].trim().split(" "),u=s.slice(0,3),d=s.slice(3).filter(c=>c!==i.payload);return r[n]=[...u,i.payload,...d].join(" "),r.join(`
`)}const Ze=(e,t,r)=>Math.min(r,Math.max(t,e)),gm=()=>({isRemoteCont:!1,inputSteer:0,inputEngineCycle:0,inputShuttle:0,inputPtoOn:0,inputHorn:0,inputGear:1,inputPtoHeight:0,inputSpeed:0,isAutoRunStart:0,isUseSafetySensorInTeleDrive:0}),ym=()=>{const e={ptoCount:0,ptoFlag:!1,upGearFlag:!1,downGearFlag:!1,upLinkFlag:!1,downLinkFlag:!1,speedUpFlag:!1,speedDownFlag:!1,remoteButtonFlag:!1,setRemoteControl:!1,maxUpLinkCount:0,minDownLinkCount:0},t=240;return(r,n)=>{var s,u,l,d,c,f,h,m,y,_,x,$,w,S,k,T;const a={...r};a.inputSteer=Ze(Math.floor((n.axes[0]||0)*100),-70,70),a.inputEngineCycle=Math.floor((n.axes[2]||0)*1e3-1e3)*-1+800,(s=n.buttons[2])!=null&&s.pressed?a.inputShuttle=1:(u=n.buttons[0])!=null&&u.pressed?a.inputShuttle=-1:(l=n.buttons[1])!=null&&l.pressed&&(a.inputShuttle=0),(d=n.buttons[3])!=null&&d.pressed?(e.ptoFlag=!0,e.ptoCount+=1,a.inputPtoOn=0):!((c=n.buttons[3])!=null&&c.pressed)&&e.ptoFlag&&(e.ptoCount=0,e.ptoFlag=!1),e.ptoCount>t&&(a.inputPtoOn=1),a.inputHorn=(f=n.buttons[8])!=null&&f.pressed?1:0,(h=n.buttons[4])!=null&&h.pressed?e.upGearFlag=!0:!((m=n.buttons[4])!=null&&m.pressed)&&e.upGearFlag&&(a.inputGear=Ze(a.inputGear+1,1,8),e.upGearFlag=!1),(y=n.buttons[5])!=null&&y.pressed?e.downGearFlag=!0:!((_=n.buttons[5])!=null&&_.pressed)&&e.downGearFlag&&(a.inputGear=Ze(a.inputGear-1,1,8),e.downGearFlag=!1);const i=n.axes[9]??0;return i===-1?(e.upLinkFlag=!0,e.maxUpLinkCount+=1):Math.round(i*10)/10===1.3&&e.upLinkFlag&&(e.maxUpLinkCount=0,e.upLinkFlag=!1,a.inputPtoHeight=Ze(a.inputPtoHeight+5,0,100)),e.maxUpLinkCount>t&&(e.maxUpLinkCount=0,a.inputPtoHeight=100),Math.round(i*10)/10===1.3&&e.maxUpLinkCount!==0&&(e.maxUpLinkCount=0),Math.floor(i*10)/10===.1?(e.downLinkFlag=!0,e.minDownLinkCount+=1):Math.round(i*10)/10===1.3&&e.downLinkFlag&&(e.minDownLinkCount=0,e.downLinkFlag=!1,a.inputPtoHeight=Ze(a.inputPtoHeight-5,0,100)),e.minDownLinkCount>t&&(e.minDownLinkCount=0,a.inputPtoHeight=0),Math.round(i*10)/10===1.3&&e.minDownLinkCount!==0&&(e.minDownLinkCount=0),(x=n.buttons[21])!=null&&x.pressed?e.speedUpFlag=!0:!(($=n.buttons[21])!=null&&$.pressed)&&e.speedUpFlag&&(e.speedUpFlag=!1,a.inputSpeed=Ze(a.inputSpeed+.5,0,10),a.inputSpeed=Math.floor(a.inputSpeed*10)/10),(w=n.buttons[22])!=null&&w.pressed?e.speedDownFlag=!0:!((S=n.buttons[22])!=null&&S.pressed)&&e.speedDownFlag&&(e.speedDownFlag=!1,a.inputSpeed=Ze(a.inputSpeed-.5,0,10),a.inputSpeed=Math.floor(a.inputSpeed*10)/10),(k=n.buttons[24])!=null&&k.pressed&&(e.remoteButtonFlag=!0),!((T=n.buttons[24])!=null&&T.pressed)&&e.remoteButtonFlag&&(e.remoteButtonFlag=!1,e.setRemoteControl===!1?(a.inputGear=1,a.inputPtoOn=0,a.inputPtoHeight=100,a.inputShuttle=0,a.inputSpeed=0,a.isRemoteCont=!0,e.setRemoteControl=!0):(a.isRemoteCont=!1,a.isAutoRunStart=0,e.setRemoteControl=!1)),a}},_m=()=>{const e={ptoCount:0,ptoFlag:!1,upGearFlag:!1,downGearFlag:!1,upLinkFlag:!1,downLinkFlag:!1,remoteButtonFlag:!1,setRemoteControl:!1,maxUpLinkCount:0,minDownLinkCount:0},t=240;return(r,n,a)=>{var m,y,_,x,$,w,S,k,T,O,I,z;const i={...r},s=n.axes[0]??0,u=.09,l=35,d=2.5;i.inputSteer=Math.floor(Math.abs(s)<=u?0:Math.abs(s)>=.5?s>0?l:-l:(s>0?1:-1)*l*Math.pow((Math.abs(s)-u)/(.5-u),d)),i.inputEngineCycle=Math.floor((n.axes[7]??0)*1e3+1e3)+800,(m=n.buttons[0])!=null&&m.pressed?i.inputShuttle=1:(y=n.buttons[2])!=null&&y.pressed?i.inputShuttle=-1:(_=n.buttons[4])!=null&&_.pressed&&(i.inputShuttle=0),(x=n.buttons[5])!=null&&x.pressed?(e.ptoFlag=!0,e.ptoCount+=1,i.inputPtoOn=0):!(($=n.buttons[5])!=null&&$.pressed)&&e.ptoFlag&&(e.ptoCount=0,e.ptoFlag=!1),e.ptoCount>t&&(i.inputPtoOn=1),i.inputHorn=(w=n.buttons[6])!=null&&w.pressed?1:0,(S=n.buttons[15])!=null&&S.pressed?e.upGearFlag=!0:!((k=n.buttons[15])!=null&&k.pressed)&&e.upGearFlag&&(i.inputGear=Ze(i.inputGear+1,1,8),e.upGearFlag=!1),(T=n.buttons[16])!=null&&T.pressed?e.downGearFlag=!0:!((O=n.buttons[16])!=null&&O.pressed)&&e.downGearFlag&&(i.inputGear=Ze(i.inputGear-1,1,8),e.downGearFlag=!1);const c=n.axes[9]??0,f=Math.round(c*100);f===-100?(e.upLinkFlag=!0,e.maxUpLinkCount+=1):f===329&&e.upLinkFlag&&(e.maxUpLinkCount=0,e.upLinkFlag=!1,i.inputPtoHeight=Ze(i.inputPtoHeight+5,0,100)),e.maxUpLinkCount>t&&(e.maxUpLinkCount=0,i.inputPtoHeight=100),f===329&&e.maxUpLinkCount!==0&&(e.maxUpLinkCount=0),f===14?(e.downLinkFlag=!0,e.minDownLinkCount+=1):f===329&&e.downLinkFlag&&(e.minDownLinkCount=0,e.downLinkFlag=!1,i.inputPtoHeight=Ze(i.inputPtoHeight-5,0,100)),e.minDownLinkCount>t&&(e.minDownLinkCount=0,i.inputPtoHeight=0),f===329&&e.minDownLinkCount!==0&&(e.minDownLinkCount=0);const h=Math.floor(((a.axes[3]??0)*2.5+2.5)*10)/10;return i.inputSpeed=Math.floor(h*10)/10,(I=a.buttons[29])!=null&&I.pressed&&(e.remoteButtonFlag=!0),!((z=a.buttons[29])!=null&&z.pressed)&&e.remoteButtonFlag&&(e.remoteButtonFlag=!1,e.setRemoteControl===!1?(i.inputGear=1,i.inputPtoOn=0,i.inputPtoHeight=100,i.inputShuttle=0,i.inputSpeed=0,i.isRemoteCont=!0,e.setRemoteControl=!0):(i.isRemoteCont=!1,i.isAutoRunStart=0,e.setRemoteControl=!1)),i}};function bm(e){const t=[null,null];for(let r=0;r<e.length;r++){const n=e[r];if(!n)continue;const a=n.id.match(/Vendor: ([0-9a-f]+)/i),i=n.id.match(/Product: ([0-9a-f]+)/i);if(a&&i){const s=a[1].toLowerCase(),u=i[1].toLowerCase();s==="0f0d"&&(u==="0182"?t[0]=n:u==="0183"&&(t[1]=n))}!t[0]&&n.id.toUpperCase().includes("STEERING")&&(t[0]=n),!t[1]&&n.id.toUpperCase().includes("PANEL")&&(t[1]=n)}return t}const wm=()=>{const[e,t]=oe.useState(gm()),[r,n]=oe.useState([]),[a,i]=oe.useState([null,null]),s=oe.useRef(e);return oe.useEffect(()=>{s.current=e},[e]),oe.useEffect(()=>{let u=null;const l=ym(),d=_m(),c=()=>{const f=navigator.getGamepads?Array.from(navigator.getGamepads()).filter(Boolean):[];n(f);const h=bm(f);i(h);let m=s.current;h[0]&&h[1]?m=d(m,h[0],h[1]):f[0]&&(m=l(m,f[0])),m!==s.current&&(s.current=m,t(m)),u=requestAnimationFrame(c)};return c(),()=>{u!=null&&cancelAnimationFrame(u)}},[]),{control:e,pads:r,ordered:a}},$m=(e=100)=>{let t=null,r=()=>vm,n=null;const a=()=>{if(!t)return;const d=r();t(xm(d))};return{start:()=>{n==null&&(n=window.setInterval(a,e))},stop:()=>{n!=null&&(clearInterval(n),n=null)},setSender:d=>{t=d},setControlSource:d=>{r=d}}},vm={isRemoteCont:!1,inputSteer:0,inputEngineCycle:0,inputShuttle:0,inputPtoOn:0,inputHorn:0,inputGear:1,inputPtoHeight:0,inputSpeed:0,isAutoRunStart:0,isUseSafetySensorInTeleDrive:0};function xm(e){return{type:"inputAutorunInfo",...e,inputSteer:Number(e.inputSteer)||0,inputEngineCycle:Number(e.inputEngineCycle)||0,inputShuttle:Number(e.inputShuttle)||0,inputPtoOn:Number(e.inputPtoOn)||0,inputHorn:Number(e.inputHorn)||0,inputGear:Number(e.inputGear)||0,inputPtoHeight:Number(e.inputPtoHeight)||0,inputSpeed:Number(e.inputSpeed)||0,isRemoteCont:!!e.isRemoteCont,isAutoRunStart:Number(e.isAutoRunStart)||0,isUseSafetySensorInTeleDrive:Number(e.isUseSafetySensorInTeleDrive)||0}}async function ks(e){const{apiKey:t,remotePeerId:r,localPeerId:n,onStream:a,onData:i,onOpen:s}=e;if(typeof Peer>"u")throw new Error("SkyWay old SDK (Peer) is not loaded. Please include the SkyWay script.");if(!t)throw new Error("SkyWay API key is required");const u=new Peer(n||void 0,{key:t,debug:2}),l={readyState:"connecting",onopen:null,onmessage:null,send:h=>{c&&c.open?c.send(typeof h=="string"?h:JSON.stringify(h)):console.warn("[OldSkyWay Offer] data connection not open yet")},close:()=>{try{c&&c.close&&c.close(!0)}catch{}}};let d=null,c=null;await new Promise((h,m)=>{u.once("open",y=>{if(s&&s(y),!r){h();return}try{d=u.call(r,null,{}),d&&d.on("stream",_=>{a&&a(_)}),c=u.connect(r),c.once("open",()=>{l.readyState="open",l.onopen&&l.onopen(),h()}),c.on("data",_=>{l.onmessage&&l.onmessage({data:_}),i&&i(_)}),c.on("close",()=>{l.readyState="closed"}),c.on("error",_=>{console.error("[OldSkyWay Offer] DataConnection error",_)})}catch(_){m(_)}}),u.on("error",y=>m(y))});const f=()=>{try{d&&d.close&&d.close(!0)}catch{}try{c&&c.close&&c.close(!0)}catch{}try{u&&u.destroy&&u.destroy()}catch{}l.readyState="closed"};return{peerId:u.id||null,dataChannel:l,close:f}}const Rn=1920,Bn=1080;function km(e){const{canvas:t,video:r,getRobotInfo:n,getControlInfo:a,getDetectionInfo:i}=e,s=t.getContext("2d");if(!s)throw new Error("2d context not available");let u=null;t.width=Rn,t.height=Bn,t.hidden=!0;const l=()=>{if(t.hidden){u=requestAnimationFrame(l);return}if(!r||r.readyState<2){u=requestAnimationFrame(l);return}const m=n(),y=a(),_=i?i():void 0;Sm(s,r,m,y,_),u=requestAnimationFrame(l)};return{start:()=>{u==null&&(u=requestAnimationFrame(l))},stop:()=>{u!=null&&(cancelAnimationFrame(u),u=null)},show:()=>{t.hidden=!1},hide:()=>{t.hidden=!0}}}function Sm(e,t,r,n,a){e.drawImage(t,0,0,Rn,Bn),a&&a.detections&&a.isEnabled&&Em(e,a.detections),n.isRemoteCont?Im(e,r):Tm(e),Cm(e,r,n)}function Tm(e){e.setLineDash([]),e.lineWidth=2,e.fillStyle="red",e.font="Italic 80px serif",e.fillText("AutoDriving Mode",10,1060),e.strokeStyle="magenta",e.strokeText("AutoDriving Mode",10,1060)}function Im(e,t){let r=Math.max(-90,Math.min(90,t.headingError||0));const n=960-Math.floor(1060*Math.sin(r*Math.PI/180));e.beginPath(),e.strokeStyle="cyan",e.lineWidth=10,e.setLineDash([10,10]),e.moveTo(960,1060),e.lineTo(n,320),e.stroke(),e.setLineDash([]),e.lineWidth=2,e.fillStyle="red",e.font="Italic 80px serif",e.fillText("TeleDriving Mode",10,1060),e.strokeStyle="magenta",e.strokeText("TeleDriving Mode",10,1060),e.fillStyle="blue";const a=`Lateral Error : ${Math.floor((t.lateralError||0)*100)} cm`;e.fillText(a,1200,1060),e.strokeStyle="cyan",e.strokeText(a,1200,1060)}function Cm(e,t,r){e.font="Italic 48px serif",e.lineWidth=2,e.fillStyle="white",e.strokeStyle="magenta";const n=`Speed : ${t.gnssSpeed||0} km/h`;if(e.fillText(n,10,50),e.strokeText(n,10,50),r.isRemoteCont){const a=r.inputPtoOn?"ON":"OFF";kt(e,`Hitch Height : ${r.inputPtoHeight||0}%`,1470,50),kt(e,`PTO : ${a}`,1470,105),kt(e,`Shuttle : ${r.inputShuttle||0}`,10,165),kt(e,`Set Speed : ${r.inputSpeed||0} km/h`,10,105)}e.font="Italic 64px serif",e.fillStyle="yellow",e.strokeStyle="orange",kt(e,"10m",10,400),kt(e,"5m",30,720),kt(e,"3m",200,820),zm(e)}function kt(e,t,r,n){e.fillText(t,r,n),e.strokeText(t,r,n)}function Em(e,t){if(!t||t.length===0)return;const r=Rn/640,n=Bn/640,a=["person","bicycle","car","motorcycle","airplane","bus","train","truck","boat","traffic light","fire hydrant","stop sign","parking meter","bench","bird","cat","dog","horse","sheep","cow","elephant","bear","zebra","giraffe","backpack","umbrella","handbag","tie","suitcase","frisbee","skis","snowboard","sports ball","kite","baseball bat","baseball glove","skateboard","surfboard","tennis racket","bottle","wine glass","cup","fork","knife","spoon","bowl","banana","apple","sandwich","orange","broccoli","carrot","hot dog","pizza","donut","cake","chair","couch","potted plant","bed","dining table","toilet","tv","laptop","mouse","remote","keyboard","cell phone","microwave","oven","toaster","sink","refrigerator","book","clock","vase","scissors","teddy bear","hair drier","toothbrush"];t.forEach((i,s)=>{const{bbox:u}=i,l=u.x*r,d=u.y*n,c=u.width*r,f=u.height*n,m=`hsl(${s*137.5%360}, 100%, 50%)`;e.save(),e.strokeStyle=m,e.lineWidth=6,e.setLineDash([]),e.strokeRect(l,d,c,f);const y=a[i.classId]||`Class ${i.classId}`,_=(i.confidence*100).toFixed(1),x=`${y} ${_}%`;e.font="bold 32px Arial";const w=e.measureText(x).width,S=40,k=Math.max(0,l),T=Math.max(S,d);e.fillStyle=m,e.fillRect(k,T-S,w+16,S+8),e.fillStyle="white",e.fillText(x,k+8,T-8),e.restore()})}function zm(e){e.beginPath(),e.strokeStyle="black",e.setLineDash([10,10]),e.lineWidth=5,e.moveTo(860,370),e.lineTo(1060,370),e.stroke(),e.beginPath(),e.strokeStyle="white",e.moveTo(960,1060),e.lineTo(960,370),e.lineWidth=5,e.setLineDash([5,5,60,5]),e.stroke(),e.beginPath(),e.setLineDash([5,5,10]),e.strokeStyle="orange",e.moveTo(230,710),e.quadraticCurveTo(960,210,1690,710),e.strokeStyle="red",e.moveTo(395,790),e.quadraticCurveTo(960,310,1525,790),e.stroke()}const St=({title:e,children:t})=>W.jsxs("fieldset",{style:{marginTop:8,padding:8,width:"max-content"},children:[W.jsx("legend",{children:e}),t]});/*!
 * ONNX Runtime Web v1.22.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Mn=Object.defineProperty,Om=Object.getOwnPropertyDescriptor,Am=Object.getOwnPropertyNames,Rm=Object.prototype.hasOwnProperty,Bm=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),q=(e,t)=>()=>(e&&(t=e(e=0)),t),Ft=(e,t)=>{for(var r in t)Mn(e,r,{get:t[r],enumerable:!0})},Mm=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Am(t))!Rm.call(e,a)&&a!==r&&Mn(e,a,{get:()=>t[a],enumerable:!(n=Om(t,a))||n.enumerable});return e},pr=e=>Mm(Mn({},"__esModule",{value:!0}),e),Zt,gt,Lt,Ss,ad,sd=q(()=>{Zt=new Map,gt=[],Lt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let n=Zt.get(e);if(n===void 0)Zt.set(e,{backend:t,priority:r});else{if(n.priority>r)return;if(n.priority===r&&n.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=gt.indexOf(e);a!==-1&&gt.splice(a,1);for(let i=0;i<gt.length;i++)if(Zt.get(gt[i]).priority<=r){gt.splice(i,0,e);return}gt.push(e)}return}throw new TypeError("not a valid backend")},Ss=async e=>{let t=Zt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(n){return r||(t.error=`${n}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},ad=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),n=r.length===0?gt:r,a,i=[],s=new Set;for(let l of n){let d=await Ss(l);typeof d=="string"?i.push({name:l,err:d}):(a||(a=d),a===d&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${i.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of i)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),Dm=q(()=>{sd()}),od,Nm=q(()=>{od="1.22.0"}),gi,qe,ud=q(()=>{Nm(),gi="warning",qe={wasm:{},webgl:{},webgpu:{},versions:{common:od},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);gi=e}},get logLevel(){return gi}},Object.defineProperty(qe,"logLevel",{enumerable:!0})}),$e,Pm=q(()=>{ud(),$e=qe}),ld,dd,Um=q(()=>{ld=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let n=r.getContext("2d");if(n!=null){let a,i;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],i=e.dims[3]):(a=e.dims[3],i=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let c=i*a,f=0,h=c,m=c*2,y=-1;s==="RGBA"?(f=0,h=c,m=c*2,y=c*3):s==="RGB"?(f=0,h=c,m=c*2):s==="RBG"&&(f=0,m=c,h=c*2);for(let _=0;_<i;_++)for(let x=0;x<a;x++){let $=(e.data[f++]-d[0])*l[0],w=(e.data[h++]-d[1])*l[1],S=(e.data[m++]-d[2])*l[2],k=y===-1?255:(e.data[y++]-d[3])*l[3];n.fillStyle="rgba("+$+","+w+","+S+","+k+")",n.fillRect(x,_,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},dd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),n;if(r!=null){let a,i,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],i=e.dims[1],s=e.dims[3]):(a=e.dims[3],i=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let f=i*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,m=0,y=1,_=2,x=3,$=0,w=f,S=f*2,k=-1;u==="RGBA"?($=0,w=f,S=f*2,k=f*3):u==="RGB"?($=0,w=f,S=f*2):u==="RBG"&&($=0,S=f,w=f*2),n=r.createImageData(a,i);for(let T=0;T<i*a;m+=h,y+=h,_+=h,x+=h,T++)n.data[m]=(e.data[$++]-c[0])*d[0],n.data[y]=(e.data[w++]-c[1])*d[1],n.data[_]=(e.data[S++]-c[2])*d[2],n.data[x]=k===-1?255:(e.data[k++]-c[3])*d[3]}else throw new Error("Can not access image data");return n}}),kr,pd,cd,fd,hd,md,Wm=q(()=>{Dn(),kr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:n}=t,a=t.norm??{mean:255,bias:0},i,s;typeof a.mean=="number"?i=[a.mean,a.mean,a.mean,a.mean]:i=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*n,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),f=4,h=0,m=1,y=2,_=3,x=0,$=d,w=d*2,S=-1;u==="RGB"&&(f=3,h=0,m=1,y=2,_=-1),l==="RGBA"?S=d*3:l==="RBG"?(x=0,w=d,$=d*2):l==="BGR"&&(w=0,$=d,x=d*2);for(let k=0;k<d;k++,h+=f,y+=f,m+=f,_+=f)c[x++]=(e[h]+s[0])/i[0],c[$++]=(e[m]+s[1])/i[1],c[w++]=(e[y]+s[2])/i[2],S!==-1&&_!==-1&&(c[S++]=(e[_]+s[3])/i[3]);return l==="RGBA"?new Ne("float32",c,[1,4,r,n]):new Ne("float32",c,[1,3,r,n])},pd=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,n=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,m=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,m=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=m}else u.tensorFormat="RGBA",u.height=h,u.width=m;f.drawImage(e,0,0),s=f.getImageData(0,0,m,h).data}else throw new Error("Can not access image data")}else if(n){let c,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,f=t.resizedWidth):(c=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=f,t!==void 0){let h=l();h.width=f,h.height=c;let m=d(h);if(m!=null)m.putImageData(e,0,0),s=m.getImageData(0,0,f,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,m=e.width;return f.drawImage(e,0,0,m,h),s=f.getImageData(0,0,m,h).data,u.height=h,u.width=m,kr(s,u)}else throw new Error("Can not access image data")}else{if(i)return new Promise((c,f)=>{let h=l(),m=d(h);if(!e||!m)return f();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{h.width=y.width,h.height=y.height,m.drawImage(y,0,0,h.width,h.height);let _=m.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,c(kr(_.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return kr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},cd=(e,t)=>{let{width:r,height:n,download:a,dispose:i}=t,s=[1,n,r,4];return new Ne({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:i})},fd=(e,t)=>{let{dataType:r,dims:n,download:a,dispose:i}=t;return new Ne({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:n,download:a,dispose:i})},hd=(e,t)=>{let{dataType:r,dims:n,download:a,dispose:i}=t;return new Ne({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:n,download:a,dispose:i})},md=(e,t,r)=>new Ne({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),zt,sr,yi,gd,Lm=q(()=>{zt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),sr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),yi=!1,gd=()=>{if(!yi){yi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,n=typeof r<"u"&&r.from;e&&(zt.set("int64",BigInt64Array),sr.set(BigInt64Array,"int64")),t&&(zt.set("uint64",BigUint64Array),sr.set(BigUint64Array,"uint64")),n?(zt.set("float16",r),sr.set(r,"float16")):zt.set("float16",Uint16Array)}}}),yd,_d,qm=q(()=>{Dn(),yd=e=>{let t=1;for(let r=0;r<e.length;r++){let n=e[r];if(typeof n!="number"||!Number.isSafeInteger(n))throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);if(n<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);t*=n}return t},_d=(e,t)=>{switch(e.location){case"cpu":return new Ne(e.type,e.data,t);case"cpu-pinned":return new Ne({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ne({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ne({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ne({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ne,Dn=q(()=>{Um(),Wm(),Lm(),qm(),Ne=class{constructor(e,t,r){gd();let n,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,n=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=zt.get(n);if(!s)throw new TypeError(`unsupported type "${n}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(n!=="float32")throw new TypeError(`unsupported type "${n}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(n!=="float32"&&n!=="float16"&&n!=="int32"&&n!=="int64"&&n!=="uint32"&&n!=="uint8"&&n!=="bool"&&n!=="uint4"&&n!=="int4")throw new TypeError(`unsupported type "${n}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(n!=="float32"&&n!=="float16"&&n!=="int32"&&n!=="int64"&&n!=="uint32"&&n!=="uint64"&&n!=="int8"&&n!=="uint8"&&n!=="bool"&&n!=="uint4"&&n!=="int4")throw new TypeError(`unsupported type "${n}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(n=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=zt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${n} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")n="string",s=e;else if(l==="boolean")n="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)n="uint8",s=Uint8Array.from(e);else{let l=sr.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);n=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let i=yd(a);if(this.cpuData&&i!==this.cpuData.length&&!((n==="uint4"||n==="int4")&&Math.ceil(i/2)===this.cpuData.length))throw new Error(`Tensor's size(${i}) does not match data length(${this.cpuData.length}).`);this.type=n,this.dims=a,this.size=i}static async fromImage(e,t){return pd(e,t)}static fromTexture(e,t){return cd(e,t)}static fromGpuBuffer(e,t){return fd(e,t)}static fromMLTensor(e,t){return hd(e,t)}static fromPinnedBuffer(e,t,r){return md(e,t,r)}toDataURL(e){return ld(this,e)}toImageData(e){return dd(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return _d(this,e)}}}),Pe,bd=q(()=>{Dn(),Pe=Ne}),Ur,_i,it,Xe,wd=q(()=>{ud(),Ur=(e,t)=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||console.timeStamp(`${e}::ORT::${t}`)},_i=(e,t)=>{var a;let r=((a=new Error().stack)==null?void 0:a.split(/\r\n|\r|\n/g))||[],n=!1;for(let i=0;i<r.length;i++){if(n&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Ur("CPU",s);return}r[i].includes("TRACE_FUNC")&&(n=!0)}},it=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||_i("BEGIN",e)},Xe=e=>{(typeof qe.trace>"u"?!qe.wasm.trace:!qe.trace)||_i("END",e)}}),$d,Vm=q(()=>{sd(),bd(),wd(),$d=class vd{constructor(t){this.handler=t}async run(t,r,n){it();let a={},i={};if(typeof t!="object"||t===null||t instanceof Pe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Pe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);a[d]=null}if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(c.indexOf(f)!==-1){let h=r[f];(h===null||h instanceof Pe)&&(d=!0,s=!1,a[f]=h)}if(d){if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)a[d]=null;let u=await this.handler.run(t,a,i),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let c=u[d];c instanceof Pe?l[d]=c:l[d]=new Pe(c.type,c.data,c.dims)}return Xe(),l}async release(){return this.handler.dispose()}static async create(t,r,n,a){it();let i,s={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,f=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(h=t.byteLength-f,typeof n=="number"){if(h=n,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||f+h>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-f}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof n<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(c,f,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await ad(s),d=await u.createInferenceSessionHandler(i,l);return Xe(),new vd(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Wr,Gm=q(()=>{Vm(),Wr=$d}),Fm=q(()=>{}),Hm=q(()=>{}),jm=q(()=>{}),Km=q(()=>{}),Zm={};Ft(Zm,{InferenceSession:()=>Wr,TRACE:()=>Ur,TRACE_FUNC_BEGIN:()=>it,TRACE_FUNC_END:()=>Xe,Tensor:()=>Pe,env:()=>$e,registerBackend:()=>Lt});var Ye=q(()=>{Dm(),Pm(),Gm(),bd(),Fm(),Hm(),wd(),jm(),Km()}),Nn=q(()=>{}),xd={};Ft(xd,{default:()=>kd});var bi,wi,kd,Qm=q(()=>{var e;zf(),Dt(),Pn(),bi="ort-wasm-proxy-worker",wi=((e=globalThis.self)==null?void 0:e.name)===bi,wi&&(self.onmessage=t=>{let{type:r,in:n}=t.data;try{switch(r){case"init-wasm":Un(n.wasm).then(()=>{ra(n).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})})},a=>{postMessage({type:r,err:a})});break;case"init-ep":{let{epName:a,env:i}=n;ia(i,a).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:a}=n,i=jr(a);postMessage({type:r,out:i});break}case"create":{let{model:a,options:i}=n;na(a,i).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":aa(n),postMessage({type:r});break;case"run":{let{sessionId:a,inputIndices:i,inputs:s,outputIndices:u,options:l}=n;sa(a,i,s,u,new Array(u.length).fill(null),l).then(d=>{d.some(c=>c[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},ua([...s,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":oa(n),postMessage({type:r});break;default:}}catch(a){postMessage({type:r,err:a})}}),kd=wi?null:t=>new Worker(t??De,{type:"module",name:bi})}),Sd={};Ft(Sd,{default:()=>Td});var $i,vi,Td,Ts,Xm=q(()=>{var e,t;vi=($i=import.meta.url,async function(r={}){var vs;var n,a,i=r,s=new Promise((o,p)=>{n=o,a=p}),u=typeof window=="object",l=typeof WorkerGlobalScope<"u",d=l&&((vs=self.name)==null?void 0:vs.startsWith("em-pthread"));i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Fb||(i.Fb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Fb};var c=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let f=o=>async(...p)=>{var g;try{if(i.Gb)throw Error("Session already started");let b=i.Gb={ec:p[0],errors:[]},v=await o(...p);if(i.Gb!==b)throw Error("Session mismatch");(g=i.Kb)==null||g.flush();let C=b.errors;if(0<C.length){let B=await Promise.all(C);if(B=B.filter(L=>L),0<B.length)throw Error(B.join(`
`))}return v}finally{i.Gb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Kb,i.Vb,i.Zb,i.Lb,i.Yb,i.kb,i.$b,i.bc,i.Wb,i.Xb,i.ac]=p;let g=i.Kb;i.jsepRegisterBuffer=(b,v,C,B)=>g.registerBuffer(b,v,C,B),i.jsepGetBuffer=b=>g.getBuffer(b),i.jsepCreateDownloader=(b,v,C)=>g.createDownloader(b,v,C),i.jsepOnCreateSession=b=>{g.onCreateSession(b)},i.jsepOnReleaseSession=b=>{g.onReleaseSession(b)},i.jsepOnRunStart=b=>g.onRunStart(b),i.cc=(b,v)=>{g.upload(b,v)}}else if(o==="webnn"){let g=p[0];[i.oc,i.Ob,i.webnnEnsureTensor,i.Pb,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Ob,i.webnnUploadTensor=i.Pb,i.webnnOnRunStart=b=>g.onRunStart(b),i.webnnOnRunEnd=g.onRunEnd.bind(g),i.webnnRegisterMLContext=(b,v)=>{g.registerMLContext(b,v)},i.webnnOnReleaseSession=b=>{g.onReleaseSession(b)},i.webnnCreateMLTensorDownloader=(b,v)=>g.createMLTensorDownloader(b,v),i.webnnRegisterMLTensor=(b,v,C,B)=>g.registerMLTensor(b,v,C,B),i.webnnCreateMLContext=b=>g.createMLContext(b),i.webnnRegisterMLConstant=(b,v,C,B,L,G)=>g.registerMLConstant(b,v,C,B,L,i.Fb,G),i.webnnRegisterGraphInput=g.registerGraphInput.bind(g),i.webnnIsGraphInput=g.isGraphInput.bind(g),i.webnnRegisterGraphOutput=g.registerGraphOutput.bind(g),i.webnnIsGraphOutput=g.isGraphOutput.bind(g),i.webnnCreateTemporaryTensor=g.createTemporaryTensor.bind(g),i.webnnIsGraphInputOutputTypeSupported=g.isGraphInputOutputTypeSupported.bind(g)}};let h=()=>{let o=(p,g,b)=>(...v)=>{let C=et,B=g==null?void 0:g();v=p(...v);let L=g==null?void 0:g();return B!==L&&(p=L,b(B),g=b=null),et!=C?new Promise((G,Y)=>{ui={resolve:G,reject:Y}}):v};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],g=>i[p]=g)})(),f!==void 0&&(i._OrtRun=f(i._OrtRun),i._OrtRunWithBinding=f(i._OrtRunWithBinding)),h=void 0};i.asyncInit=()=>{h==null||h()};var m,y,_=Object.assign({},i),x=(o,p)=>{throw p},$="";(u||l)&&(l?$=self.location.href:typeof document<"u"&&document.currentScript&&($=document.currentScript.src),$i&&($=$i),$=$.startsWith("blob:")?"":$.slice(0,$.replace(/[?#].*/,"").lastIndexOf("/")+1),l&&(y=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),m=async o=>{if(P(o))return new Promise((g,b)=>{var v=new XMLHttpRequest;v.open("GET",o,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?g(v.response):b(v.status)},v.onerror=b,v.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var w=console.log.bind(console),S=console.error.bind(console),k=w,T=S;Object.assign(i,_),_=null;var O,I,z,A,M,j,V,F,ee,ne,H,ae,K,te=i.wasmBinary,be=!1,P=o=>o.startsWith("file://");function E(){return O.buffer!=A.buffer&&ge(),A}function U(){return O.buffer!=A.buffer&&ge(),M}function Q(){return O.buffer!=A.buffer&&ge(),j}function me(){return O.buffer!=A.buffer&&ge(),V}function N(){return O.buffer!=A.buffer&&ge(),F}function pe(){return O.buffer!=A.buffer&&ge(),ee}function We(){return O.buffer!=A.buffer&&ge(),ne}function Ce(){return O.buffer!=A.buffer&&ge(),K}if(d){let o=function(p){try{var g=p.data,b=g.Cb;if(b==="load"){let v=[];self.onmessage=C=>v.push(C),self.startWorker=()=>{postMessage({Cb:"loaded"});for(let C of v)o(C);self.onmessage=o};for(let C of g.Sb)i[C]&&!i[C].proxy||(i[C]=(...B)=>{postMessage({Cb:"callHandler",Rb:C,args:B})},C=="print"&&(k=i[C]),C=="printErr"&&(T=i[C]));O=g.lc,ge(),Ve(g.mc)}else if(b==="run"){Ff(g.Bb),ci(g.Bb,0,0,1,0,0),ga(),si(g.Bb),nt||(ds(),nt=!0);try{Hf(g.hc,g.Ib)}catch(v){if(v!="unwind")throw v}}else g.target!=="setimmediate"&&(b==="checkMailbox"?nt&&fr():b&&(T(`worker: received unknown command ${b}`),T(g)))}catch(v){throw ps(),v}};var Ve,nt=!1;T=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Cb:"alert",text:p.join(" "),jc:$r()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function ge(){var o=O.buffer;i.HEAP8=A=new Int8Array(o),i.HEAP16=j=new Int16Array(o),i.HEAPU8=M=new Uint8Array(o),i.HEAPU16=V=new Uint16Array(o),i.HEAP32=F=new Int32Array(o),i.HEAPU32=ee=new Uint32Array(o),i.HEAPF32=ne=new Float32Array(o),i.HEAPF64=K=new Float64Array(o),i.HEAP64=H=new BigInt64Array(o),i.HEAPU64=ae=new BigUint64Array(o)}function xe(){d?startWorker(i):re.Da()}d||(O=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),ge());var Me,$t=0,vt=null;function la(){if(--$t==0&&vt){var o=vt;vt=null,o()}}function dt(o){throw T(o="Aborted("+o+")"),be=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),a(o),o}function da(){return{a:{L:Gf,Aa:Vf,b:Kf,$:wa,A:xa,pa:ka,X:Ta,Z:Ia,qa:Ca,na:Ea,ga:za,ma:Oa,J:Aa,Y:Ra,V:Ba,oa:Ma,W:Da,va:Zf,E:Qf,Q:Xf,O:Jf,D:th,v:rh,r:ih,P:nh,z:ph,R:ch,ja:fh,T:hh,aa:mh,M:gh,F:yh,ia:si,sa:_h,t:bh,Ca:wh,w:xh,o:kh,m:Th,c:ii,Ba:Ih,n:Ch,j:Oh,u:Ah,p:Rh,f:Bh,s:Mh,l:Dh,e:Nh,k:Ph,h:Uh,g:Wh,d:Lh,da:qh,ea:Vh,fa:Gh,ba:Qa,ca:Xa,N:Ya,xa:Hh,ua:Kh,i:Zh,C:Qh,G:Xh,ta:jh,x:Yh,ra:Jh,U:em,q:Fh,y:tm,K:rm,S:im,za:nm,ya:am,ka:rs,la:is,_:Jr,B:ns,I:as,ha:ss,H:os,a:O,wa:Yr}}}var Zr={840156:(o,p,g,b,v)=>{if(i===void 0||!i.Fb)return 1;if((o=Te(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Fb.get(o)))return 2;if(p=Number(p>>>0),g=Number(g>>>0),b=Number(b>>>0),p+g>o.byteLength)return 3;try{let C=o.subarray(p,p+g);switch(v){case 0:U().set(C,b>>>0);break;case 1:i.nc?i.nc(b,C):i.cc(b,C);break;default:return 4}return 0}catch{return 4}},840980:(o,p,g)=>{i.Pb(o,U().subarray(p>>>0,p+g>>>0))},841044:()=>i.oc(),841086:o=>{i.Ob(o)},841123:()=>{i.Wb()},841154:()=>{i.Xb()},841183:()=>{i.ac()},841208:o=>i.Vb(o),841241:o=>i.Zb(o),841273:(o,p,g)=>{i.Lb(Number(o),Number(p),Number(g),!0)},841336:(o,p,g)=>{i.Lb(Number(o),Number(p),Number(g))},841393:()=>typeof wasmOffsetConverter<"u",841450:o=>{i.kb("Abs",o,void 0)},841501:o=>{i.kb("Neg",o,void 0)},841552:o=>{i.kb("Floor",o,void 0)},841605:o=>{i.kb("Ceil",o,void 0)},841657:o=>{i.kb("Reciprocal",o,void 0)},841715:o=>{i.kb("Sqrt",o,void 0)},841767:o=>{i.kb("Exp",o,void 0)},841818:o=>{i.kb("Erf",o,void 0)},841869:o=>{i.kb("Sigmoid",o,void 0)},841924:(o,p,g)=>{i.kb("HardSigmoid",o,{alpha:p,beta:g})},842003:o=>{i.kb("Log",o,void 0)},842054:o=>{i.kb("Sin",o,void 0)},842105:o=>{i.kb("Cos",o,void 0)},842156:o=>{i.kb("Tan",o,void 0)},842207:o=>{i.kb("Asin",o,void 0)},842259:o=>{i.kb("Acos",o,void 0)},842311:o=>{i.kb("Atan",o,void 0)},842363:o=>{i.kb("Sinh",o,void 0)},842415:o=>{i.kb("Cosh",o,void 0)},842467:o=>{i.kb("Asinh",o,void 0)},842520:o=>{i.kb("Acosh",o,void 0)},842573:o=>{i.kb("Atanh",o,void 0)},842626:o=>{i.kb("Tanh",o,void 0)},842678:o=>{i.kb("Not",o,void 0)},842729:(o,p,g)=>{i.kb("Clip",o,{min:p,max:g})},842798:o=>{i.kb("Clip",o,void 0)},842850:(o,p)=>{i.kb("Elu",o,{alpha:p})},842908:o=>{i.kb("Gelu",o,void 0)},842960:o=>{i.kb("Relu",o,void 0)},843012:(o,p)=>{i.kb("LeakyRelu",o,{alpha:p})},843076:(o,p)=>{i.kb("ThresholdedRelu",o,{alpha:p})},843146:(o,p)=>{i.kb("Cast",o,{to:p})},843204:o=>{i.kb("Add",o,void 0)},843255:o=>{i.kb("Sub",o,void 0)},843306:o=>{i.kb("Mul",o,void 0)},843357:o=>{i.kb("Div",o,void 0)},843408:o=>{i.kb("Pow",o,void 0)},843459:o=>{i.kb("Equal",o,void 0)},843512:o=>{i.kb("Greater",o,void 0)},843567:o=>{i.kb("GreaterOrEqual",o,void 0)},843629:o=>{i.kb("Less",o,void 0)},843681:o=>{i.kb("LessOrEqual",o,void 0)},843740:(o,p,g,b,v)=>{i.kb("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},843915:(o,p,g,b,v)=>{i.kb("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844089:(o,p,g,b,v)=>{i.kb("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844263:(o,p,g,b,v)=>{i.kb("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844438:(o,p,g,b,v)=>{i.kb("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844612:(o,p,g,b,v)=>{i.kb("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844785:(o,p,g,b,v)=>{i.kb("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},844958:(o,p,g,b,v)=>{i.kb("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},845135:(o,p,g,b,v)=>{i.kb("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},845315:(o,p,g,b,v)=>{i.kb("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!g,axes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},845495:o=>{i.kb("Where",o,void 0)},845548:(o,p,g)=>{i.kb("Transpose",o,{perm:p?Array.from(N().subarray(Number(p)>>>0,Number(g)>>>0)):[]})},845672:(o,p,g,b)=>{i.kb("DepthToSpace",o,{blocksize:p,mode:Te(g),format:b?"NHWC":"NCHW"})},845805:(o,p,g,b)=>{i.kb("DepthToSpace",o,{blocksize:p,mode:Te(g),format:b?"NHWC":"NCHW"})},845938:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze,Ut)=>{i.kb("ConvTranspose",o,{format:G?"NHWC":"NCHW",autoPad:p,dilations:[g],group:b,kernelShape:[v],pads:[C,B],strides:[L],wIsConst:()=>!!E()[Y>>>0],outputPadding:le?Array.from(N().subarray(Number(le)>>>0,Number(ce)>>>0)):[],outputShape:_e?Array.from(N().subarray(Number(_e)>>>0,Number(ze)>>>0)):[],activation:Te(Ut)})},846371:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:p,dilations:Array.from(N().subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:b,kernelShape:Array.from(N().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(N().subarray(Number(C)>>>0,4+(Number(C)>>>0)>>>0)),strides:Array.from(N().subarray(Number(B)>>>0,2+(Number(B)>>>0)>>>0)),wIsConst:()=>!!E()[G>>>0],outputPadding:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],outputShape:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[],activation:Te(ze)})},847032:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze,Ut)=>{i.kb("ConvTranspose",o,{format:G?"NHWC":"NCHW",autoPad:p,dilations:[g],group:b,kernelShape:[v],pads:[C,B],strides:[L],wIsConst:()=>!!E()[Y>>>0],outputPadding:le?Array.from(N().subarray(Number(le)>>>0,Number(ce)>>>0)):[],outputShape:_e?Array.from(N().subarray(Number(_e)>>>0,Number(ze)>>>0)):[],activation:Te(Ut)})},847465:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:p,dilations:Array.from(N().subarray(Number(g)>>>0,2+(Number(g)>>>0)>>>0)),group:b,kernelShape:Array.from(N().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(N().subarray(Number(C)>>>0,4+(Number(C)>>>0)>>>0)),strides:Array.from(N().subarray(Number(B)>>>0,2+(Number(B)>>>0)>>>0)),wIsConst:()=>!!E()[G>>>0],outputPadding:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],outputShape:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[],activation:Te(ze)})},848126:(o,p)=>{i.kb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},848217:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:b,storage_order:v,dilations:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[],kernel_shape:L?Array.from(N().subarray(Number(L)>>>0,Number(G)>>>0)):[],pads:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],strides:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[]})},848696:(o,p)=>{i.kb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},848787:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("AveragePool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:b,storage_order:v,dilations:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[],kernel_shape:L?Array.from(N().subarray(Number(L)>>>0,Number(G)>>>0)):[],pads:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],strides:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[]})},849266:(o,p)=>{i.kb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},849353:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:b,storage_order:v,dilations:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[],kernel_shape:L?Array.from(N().subarray(Number(L)>>>0,Number(G)>>>0)):[],pads:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],strides:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[]})},849828:(o,p)=>{i.kb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},849915:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze)=>{i.kb("MaxPool",o,{format:ze?"NHWC":"NCHW",auto_pad:p,ceil_mode:g,count_include_pad:b,storage_order:v,dilations:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[],kernel_shape:L?Array.from(N().subarray(Number(L)>>>0,Number(G)>>>0)):[],pads:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],strides:ce?Array.from(N().subarray(Number(ce)>>>0,Number(_e)>>>0)):[]})},850390:(o,p,g,b,v)=>{i.kb("Gemm",o,{alpha:p,beta:g,transA:b,transB:v})},850494:o=>{i.kb("MatMul",o,void 0)},850548:(o,p,g,b)=>{i.kb("ArgMax",o,{keepDims:!!p,selectLastIndex:!!g,axis:b})},850656:(o,p,g,b)=>{i.kb("ArgMin",o,{keepDims:!!p,selectLastIndex:!!g,axis:b})},850764:(o,p)=>{i.kb("Softmax",o,{axis:p})},850827:(o,p)=>{i.kb("Concat",o,{axis:p})},850887:(o,p,g,b,v)=>{i.kb("Split",o,{axis:p,numOutputs:g,splitSizes:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},851043:o=>{i.kb("Expand",o,void 0)},851097:(o,p)=>{i.kb("Gather",o,{axis:Number(p)})},851168:(o,p)=>{i.kb("GatherElements",o,{axis:Number(p)})},851247:(o,p)=>{i.kb("GatherND",o,{batch_dims:Number(p)})},851326:(o,p,g,b,v,C,B,L,G,Y,le)=>{i.kb("Resize",o,{antialias:p,axes:g?Array.from(N().subarray(Number(g)>>>0,Number(b)>>>0)):[],coordinateTransformMode:Te(v),cubicCoeffA:C,excludeOutside:B,extrapolationValue:L,keepAspectRatioPolicy:Te(G),mode:Te(Y),nearestMode:Te(le)})},851688:(o,p,g,b,v,C,B)=>{i.kb("Slice",o,{starts:p?Array.from(N().subarray(Number(p)>>>0,Number(g)>>>0)):[],ends:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[],axes:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[]})},851952:o=>{i.kb("Tile",o,void 0)},852004:(o,p,g)=>{i.kb("InstanceNormalization",o,{epsilon:p,format:g?"NHWC":"NCHW"})},852118:(o,p,g)=>{i.kb("InstanceNormalization",o,{epsilon:p,format:g?"NHWC":"NCHW"})},852232:o=>{i.kb("Range",o,void 0)},852285:(o,p)=>{i.kb("Einsum",o,{equation:Te(p)})},852366:(o,p,g,b,v)=>{i.kb("Pad",o,{mode:p,value:g,pads:b?Array.from(N().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},852509:(o,p,g,b,v,C)=>{i.kb("BatchNormalization",o,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!b,format:C?"NHWC":"NCHW"})},852678:(o,p,g,b,v,C)=>{i.kb("BatchNormalization",o,{epsilon:p,momentum:g,spatial:!!v,trainingMode:!!b,format:C?"NHWC":"NCHW"})},852847:(o,p,g)=>{i.kb("CumSum",o,{exclusive:Number(p),reverse:Number(g)})},852944:(o,p,g)=>{i.kb("DequantizeLinear",o,{axis:p,blockSize:g})},853034:(o,p,g,b,v)=>{i.kb("GridSample",o,{align_corners:p,mode:Te(g),padding_mode:Te(b),format:v?"NHWC":"NCHW"})},853204:(o,p,g,b,v)=>{i.kb("GridSample",o,{align_corners:p,mode:Te(g),padding_mode:Te(b),format:v?"NHWC":"NCHW"})},853374:(o,p)=>{i.kb("ScatterND",o,{reduction:Te(p)})},853459:(o,p,g,b,v,C,B,L,G)=>{i.kb("Attention",o,{numHeads:p,isUnidirectional:g,maskFilterValue:b,scale:v,doRotary:C,qkvHiddenSizes:B?Array.from(N().subarray(Number(L)>>>0,Number(L)+B>>>0)):[],pastPresentShareBuffer:!!G})},853731:o=>{i.kb("BiasAdd",o,void 0)},853786:o=>{i.kb("BiasSplitGelu",o,void 0)},853847:o=>{i.kb("FastGelu",o,void 0)},853903:(o,p,g,b,v,C,B,L,G,Y,le,ce,_e,ze,Ut,um)=>{i.kb("Conv",o,{format:ce?"NHWC":"NCHW",auto_pad:p,dilations:g?Array.from(N().subarray(Number(g)>>>0,Number(b)>>>0)):[],group:v,kernel_shape:C?Array.from(N().subarray(Number(C)>>>0,Number(B)>>>0)):[],pads:L?Array.from(N().subarray(Number(L)>>>0,Number(G)>>>0)):[],strides:Y?Array.from(N().subarray(Number(Y)>>>0,Number(le)>>>0)):[],w_is_const:()=>!!E()[Number(_e)>>>0],activation:Te(ze),activation_params:Ut?Array.from(We().subarray(Number(Ut)>>>0,Number(um)>>>0)):[]})},854487:o=>{i.kb("Gelu",o,void 0)},854539:(o,p,g,b,v,C,B,L,G)=>{i.kb("GroupQueryAttention",o,{numHeads:p,kvNumHeads:g,scale:b,softcap:v,doRotary:C,rotaryInterleaved:B,smoothSoftmax:L,localWindowSize:G})},854756:(o,p,g,b)=>{i.kb("LayerNormalization",o,{axis:p,epsilon:g,simplified:!!b})},854867:(o,p,g,b)=>{i.kb("LayerNormalization",o,{axis:p,epsilon:g,simplified:!!b})},854978:(o,p,g,b,v,C)=>{i.kb("MatMulNBits",o,{k:p,n:g,accuracyLevel:b,bits:v,blockSize:C})},855105:(o,p,g,b,v,C)=>{i.kb("MultiHeadAttention",o,{numHeads:p,isUnidirectional:g,maskFilterValue:b,scale:v,doRotary:C})},855264:(o,p)=>{i.kb("QuickGelu",o,{alpha:p})},855328:(o,p,g,b,v)=>{i.kb("RotaryEmbedding",o,{interleaved:!!p,numHeads:g,rotaryEmbeddingDim:b,scale:v})},855467:(o,p,g)=>{i.kb("SkipLayerNormalization",o,{epsilon:p,simplified:!!g})},855569:(o,p,g)=>{i.kb("SkipLayerNormalization",o,{epsilon:p,simplified:!!g})},855671:(o,p,g,b)=>{i.kb("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:g,blockSize:b})},855792:o=>{i.$b(o)},855826:(o,p)=>i.bc(Number(o),Number(p),i.Gb.ec,i.Gb.errors)};function Vf(o,p,g){return Ga(async()=>{await i.Yb(Number(o),Number(p),Number(g))})}function Gf(){return typeof wasmOffsetConverter<"u"}class Qr{constructor(p){xs(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var pa=o=>{o.terminate(),o.onmessage=()=>{}},Xr=[],ca=o=>{ct.length==0&&(_a(),ya(ct[0]));var p=ct.pop();if(!p)return 6;Ht.push(p),xt[o.Bb]=p,p.Bb=o.Bb;var g={Cb:"run",hc:o.fc,Ib:o.Ib,Bb:o.Bb};return p.postMessage(g,o.Nb),0},pt=0,ve=(o,p,...g)=>{for(var b=2*g.length,v=mi(),C=hi(8*b),B=C>>>3,L=0;L<g.length;L++){var G=g[L];typeof G=="bigint"?(H[B+2*L]=1n,H[B+2*L+1]=G):(H[B+2*L]=0n,Ce()[B+2*L+1>>>0]=G)}return o=cs(o,0,b,C,p),xr(v),o};function Yr(o){if(d)return ve(0,1,o);if(z=o,!(0<pt)){for(var p of Ht)pa(p);for(p of ct)pa(p);ct=[],Ht=[],xt={},be=!0}x(0,new Qr(o))}function fa(o){if(d)return ve(1,0,o);Jr(o)}var Jr=o=>{if(z=o,d)throw fa(o),"unwind";Yr(o)},ct=[],Ht=[],ha=[],xt={},ma=o=>{var p=o.Bb;delete xt[p],ct.push(o),Ht.splice(Ht.indexOf(o),1),o.Bb=0,fs(p)};function ga(){ha.forEach(o=>o())}var ya=o=>new Promise(p=>{o.onmessage=v=>{var C=(v=v.data).Cb;if(v.Hb&&v.Hb!=$r()){var B=xt[v.Hb];B?B.postMessage(v,v.Nb):T(`Internal error! Worker sent a message "${C}" to target pthread ${v.Hb}, but that thread no longer exists!`)}else C==="checkMailbox"?fr():C==="spawnThread"?ca(v):C==="cleanupThread"?ma(xt[v.ic]):C==="loaded"?(o.loaded=!0,p(o)):C==="alert"?alert(`Thread ${v.jc}: ${v.text}`):v.target==="setimmediate"?o.postMessage(v):C==="callHandler"?i[v.Rb](...v.args):C&&T(`worker sent an unknown command ${C}`)},o.onerror=v=>{throw T(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var g,b=[];for(g of[])i.propertyIsEnumerable(g)&&b.push(g);o.postMessage({Cb:"load",Sb:b,lc:O,mc:I})});function _a(){var o=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});ct.push(o)}var Ff=o=>{ge();var p=pe()[o+52>>>2>>>0];o=pe()[o+56>>>2>>>0],gs(p,p-o),xr(p)},Hf=(o,p)=>{pt=0,o=ys(o,p),0<pt?z=o:fi(o)};class jf{constructor(p){this.Jb=p-24}}function Kf(o,p,g){var b=new jf(o>>>=0);throw p>>>=0,g>>>=0,pe()[b.Jb+16>>>2>>>0]=0,pe()[b.Jb+4>>>2>>>0]=p,pe()[b.Jb+8>>>2>>>0]=g,o}function ba(o,p,g,b){return d?ve(2,1,o,p,g,b):wa(o,p,g,b)}function wa(o,p,g,b){if(o>>>=0,g>>>=0,b>>>=0,c===void 0)return 6;var v=[];return d&&v.length===0?ba(o,p>>>=0,g,b):(o={fc:g,Bb:o,Ib:b,Nb:v},d?(o.Cb="spawnThread",postMessage(o,v),0):ca(o))}var $a=typeof TextDecoder<"u"?new TextDecoder:void 0,va=(o,p=0,g=NaN)=>{var b=(p>>>=0)+g;for(g=p;o[g]&&!(g>=b);)++g;if(16<g-p&&o.buffer&&$a)return $a.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,g):o.slice(p,g));for(b="";p<g;){var v=o[p++];if(128&v){var C=63&o[p++];if((224&v)==192)b+=String.fromCharCode((31&v)<<6|C);else{var B=63&o[p++];65536>(v=(240&v)==224?(15&v)<<12|C<<6|B:(7&v)<<18|C<<12|B<<6|63&o[p++])?b+=String.fromCharCode(v):(v-=65536,b+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else b+=String.fromCharCode(v)}return b},Te=(o,p)=>(o>>>=0)?va(U(),o,p):"";function xa(o,p,g){return d?ve(3,1,o,p,g):0}function ka(o,p){if(d)return ve(4,1,o,p)}var Sa=o=>{for(var p=0,g=0;g<o.length;++g){var b=o.charCodeAt(g);127>=b?p++:2047>=b?p+=2:55296<=b&&57343>=b?(p+=4,++g):p+=3}return p},Pt=(o,p,g)=>{var b=U();if(p>>>=0,0<g){var v=p;g=p+g-1;for(var C=0;C<o.length;++C){var B=o.charCodeAt(C);if(55296<=B&&57343>=B&&(B=65536+((1023&B)<<10)|1023&o.charCodeAt(++C)),127>=B){if(p>=g)break;b[p++>>>0]=B}else{if(2047>=B){if(p+1>=g)break;b[p++>>>0]=192|B>>6}else{if(65535>=B){if(p+2>=g)break;b[p++>>>0]=224|B>>12}else{if(p+3>=g)break;b[p++>>>0]=240|B>>18,b[p++>>>0]=128|B>>12&63}b[p++>>>0]=128|B>>6&63}b[p++>>>0]=128|63&B}}b[p>>>0]=0,o=p-v}else o=0;return o};function Ta(o,p){if(d)return ve(5,1,o,p)}function Ia(o,p,g){if(d)return ve(6,1,o,p,g)}function Ca(o,p,g){return d?ve(7,1,o,p,g):0}function Ea(o,p){if(d)return ve(8,1,o,p)}function za(o,p,g){if(d)return ve(9,1,o,p,g)}function Oa(o,p,g,b){if(d)return ve(10,1,o,p,g,b)}function Aa(o,p,g,b){if(d)return ve(11,1,o,p,g,b)}function Ra(o,p,g,b){if(d)return ve(12,1,o,p,g,b)}function Ba(o){if(d)return ve(13,1,o)}function Ma(o,p){if(d)return ve(14,1,o,p)}function Da(o,p,g){if(d)return ve(15,1,o,p,g)}var Na,ft,Zf=()=>dt(""),Je=o=>{for(var p="";U()[o>>>0];)p+=Na[U()[o++>>>0]];return p},ei={},ti={};function at(o,p,g={}){return function(b,v,C={}){var B=v.name;if(!b)throw new ft(`type "${B}" must have a positive integer typeid pointer`);if(ti.hasOwnProperty(b)){if(C.Tb)return;throw new ft(`Cannot register type '${B}' twice`)}ti[b]=v,ei.hasOwnProperty(b)&&(v=ei[b],delete ei[b],v.forEach(L=>L()))}(o,p,g)}var Pa=(o,p,g)=>{switch(p){case 1:return g?b=>E()[b>>>0]:b=>U()[b>>>0];case 2:return g?b=>Q()[b>>>1>>>0]:b=>me()[b>>>1>>>0];case 4:return g?b=>N()[b>>>2>>>0]:b=>pe()[b>>>2>>>0];case 8:return g?b=>H[b>>>3]:b=>ae[b>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function Qf(o,p,g){g>>>=0,at(o>>>=0,{name:p=Je(p>>>0),fromWireType:b=>b,toWireType:function(b,v){if(typeof v!="bigint"&&typeof v!="number")throw v=v===null?"null":(b=typeof v)=="object"||b==="array"||b==="function"?v.toString():""+v,new TypeError(`Cannot convert "${v}" to ${this.name}`);return typeof v=="number"&&(v=BigInt(v)),v},Db:ht,readValueFromPointer:Pa(p,g,p.indexOf("u")==-1),Eb:null})}var ht=8;function Xf(o,p,g,b){at(o>>>=0,{name:p=Je(p>>>0),fromWireType:function(v){return!!v},toWireType:function(v,C){return C?g:b},Db:ht,readValueFromPointer:function(v){return this.fromWireType(U()[v>>>0])},Eb:null})}var ri=[],st=[];function ii(o){9<(o>>>=0)&&--st[o+1]==0&&(st[o]=void 0,ri.push(o))}var Ae=o=>{if(!o)throw new ft("Cannot use deleted val. handle = "+o);return st[o]},Le=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=ri.pop()||st.length;return st[p]=o,st[p+1]=1,p}};function ni(o){return this.fromWireType(pe()[o>>>2>>>0])}var Yf={name:"emscripten::val",fromWireType:o=>{var p=Ae(o);return ii(o),p},toWireType:(o,p)=>Le(p),Db:ht,readValueFromPointer:ni,Eb:null};function Jf(o){return at(o>>>0,Yf)}var eh=(o,p)=>{switch(p){case 4:return function(g){return this.fromWireType(We()[g>>>2>>>0])};case 8:return function(g){return this.fromWireType(Ce()[g>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function th(o,p,g){g>>>=0,at(o>>>=0,{name:p=Je(p>>>0),fromWireType:b=>b,toWireType:(b,v)=>v,Db:ht,readValueFromPointer:eh(p,g),Eb:null})}function rh(o,p,g,b,v){if(o>>>=0,g>>>=0,p=Je(p>>>0),v===-1&&(v=4294967295),v=L=>L,b===0){var C=32-8*g;v=L=>L<<C>>>C}var B=p.includes("unsigned")?function(L,G){return G>>>0}:function(L,G){return G};at(o,{name:p,fromWireType:v,toWireType:B,Db:ht,readValueFromPointer:Pa(p,g,b!==0),Eb:null})}function ih(o,p,g){function b(C){var B=pe()[C>>>2>>>0];return C=pe()[C+4>>>2>>>0],new v(E().buffer,C,B)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];at(o>>>=0,{name:g=Je(g>>>0),fromWireType:b,Db:ht,readValueFromPointer:b},{Tb:!0})}function nh(o,p){at(o>>>=0,{name:p=Je(p>>>0),fromWireType:function(g){for(var b,v=pe()[g>>>2>>>0],C=g+4,B=C,L=0;L<=v;++L){var G=C+L;L!=v&&U()[G>>>0]!=0||(B=Te(B,G-B),b===void 0?b=B:(b+="\0",b+=B),B=G+1)}return tt(g),b},toWireType:function(g,b){b instanceof ArrayBuffer&&(b=new Uint8Array(b));var v=typeof b=="string";if(!(v||b instanceof Uint8Array||b instanceof Uint8ClampedArray||b instanceof Int8Array))throw new ft("Cannot pass non-string to std::string");var C=v?Sa(b):b.length,B=vr(4+C+1),L=B+4;if(pe()[B>>>2>>>0]=C,v)Pt(b,L,C+1);else if(v)for(v=0;v<C;++v){var G=b.charCodeAt(v);if(255<G)throw tt(B),new ft("String has UTF-16 code units that do not fit in 8 bits");U()[L+v>>>0]=G}else for(v=0;v<C;++v)U()[L+v>>>0]=b[v];return g!==null&&g.push(tt,B),B},Db:ht,readValueFromPointer:ni,Eb(g){tt(g)}})}var Ua=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,ah=(o,p)=>{for(var g=o>>1,b=g+p/2;!(g>=b)&&me()[g>>>0];)++g;if(32<(g<<=1)-o&&Ua)return Ua.decode(U().slice(o,g));for(g="",b=0;!(b>=p/2);++b){var v=Q()[o+2*b>>>1>>>0];if(v==0)break;g+=String.fromCharCode(v)}return g},sh=(o,p,g)=>{if(g??(g=2147483647),2>g)return 0;var b=p;g=(g-=2)<2*o.length?g/2:o.length;for(var v=0;v<g;++v){var C=o.charCodeAt(v);Q()[p>>>1>>>0]=C,p+=2}return Q()[p>>>1>>>0]=0,p-b},oh=o=>2*o.length,uh=(o,p)=>{for(var g=0,b="";!(g>=p/4);){var v=N()[o+4*g>>>2>>>0];if(v==0)break;++g,65536<=v?(v-=65536,b+=String.fromCharCode(55296|v>>10,56320|1023&v)):b+=String.fromCharCode(v)}return b},lh=(o,p,g)=>{if(p>>>=0,g??(g=2147483647),4>g)return 0;var b=p;g=b+g-4;for(var v=0;v<o.length;++v){var C=o.charCodeAt(v);if(55296<=C&&57343>=C&&(C=65536+((1023&C)<<10)|1023&o.charCodeAt(++v)),N()[p>>>2>>>0]=C,(p+=4)+4>g)break}return N()[p>>>2>>>0]=0,p-b},dh=o=>{for(var p=0,g=0;g<o.length;++g){var b=o.charCodeAt(g);55296<=b&&57343>=b&&++g,p+=4}return p};function ph(o,p,g){if(o>>>=0,p>>>=0,g=Je(g>>>=0),p===2)var b=ah,v=sh,C=oh,B=L=>me()[L>>>1>>>0];else p===4&&(b=uh,v=lh,C=dh,B=L=>pe()[L>>>2>>>0]);at(o,{name:g,fromWireType:L=>{for(var G,Y=pe()[L>>>2>>>0],le=L+4,ce=0;ce<=Y;++ce){var _e=L+4+ce*p;ce!=Y&&B(_e)!=0||(le=b(le,_e-le),G===void 0?G=le:(G+="\0",G+=le),le=_e+p)}return tt(L),G},toWireType:(L,G)=>{if(typeof G!="string")throw new ft(`Cannot pass non-string to C++ string type ${g}`);var Y=C(G),le=vr(4+Y+p);return pe()[le>>>2>>>0]=Y/p,v(G,le+4,Y+p),L!==null&&L.push(tt,le),le},Db:ht,readValueFromPointer:ni,Eb(L){tt(L)}})}function ch(o,p){at(o>>>=0,{Ub:!0,name:p=Je(p>>>0),Db:0,fromWireType:()=>{},toWireType:()=>{}})}function fh(o){ci(o>>>0,!l,1,!u,131072,!1),ga()}var ai=o=>{if(!be)try{if(o(),!(0<pt))try{d?fi(z):Jr(z)}catch(p){p instanceof Qr||p=="unwind"||x(0,p)}}catch(p){p instanceof Qr||p=="unwind"||x(0,p)}};function si(o){o>>>=0,typeof Atomics.kc=="function"&&(Atomics.kc(N(),o>>>2,o).value.then(fr),o+=128,Atomics.store(N(),o>>>2,1))}var fr=()=>{var o=$r();o&&(si(o),ai(ms))};function hh(o,p){(o>>>=0)==p>>>0?setTimeout(fr):d?postMessage({Hb:o,Cb:"checkMailbox"}):(o=xt[o])&&o.postMessage({Cb:"checkMailbox"})}var oi=[];function mh(o,p,g,b,v){for(p>>>=0,b/=2,oi.length=b,g=v>>>0>>>3,v=0;v<b;v++)oi[v]=H[g+2*v]?H[g+2*v+1]:Ce()[g+2*v+1>>>0];return(p?Zr[p]:om[o])(...oi)}var gh=()=>{pt=0};function yh(o){o>>>=0,d?postMessage({Cb:"cleanupThread",ic:o}):ma(xt[o])}function _h(o){}var hr=(o,p)=>{var g=ti[o];if(g===void 0)throw o=ls(o),g=Je(o),tt(o),new ft(`${p} has unknown type ${g}`);return g},Wa=(o,p,g)=>{var b=[];return o=o.toWireType(b,g),b.length&&(pe()[p>>>2>>>0]=Le(b)),o};function bh(o,p,g){return p>>>=0,g>>>=0,o=Ae(o>>>0),p=hr(p,"emval::as"),Wa(p,g,o)}function wh(o,p){return p>>>=0,o=Ae(o>>>0),(p=hr(p,"emval::as")).toWireType(null,o)}var mr=o=>{try{o()}catch(p){dt(p)}},mt=0,et=null,La=0,gr=[],qa={},Va={},$h=0,ui=null,vh=[];function Ga(o){return function(p){if(!be){if(mt===0){var g=!1,b=!1;p((v=0)=>{if(!be&&(La=v,g=!0,b)){mt=2,mr(()=>ws(et)),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.resume(),v=!1;try{var C=function(){var G=N()[et+8>>>2>>>0];return G=re[Va[G]],--pt,G()}()}catch(G){C=G,v=!0}var B=!1;if(!et){var L=ui;L&&(ui=null,(v?L.reject:L.resolve)(C),B=!0)}if(v&&!B)throw C}}),b=!0,g||(mt=1,et=function(){var v=vr(65548),C=v+12;pe()[v>>>2>>>0]=C,pe()[v+4>>>2>>>0]=C+65536,C=gr[0];var B=qa[C];return B===void 0&&(B=$h++,qa[C]=B,Va[B]=C),C=B,N()[v+8>>>2>>>0]=C,v}(),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.pause(),mr(()=>_s(et)))}else mt===2?(mt=0,mr($s),tt(et),et=null,vh.forEach(ai)):dt(`invalid state: ${mt}`);return La}}(p=>{o().then(p)})}function xh(o){return o>>>=0,Ga(async()=>{var p=await Ae(o);return Le(p)})}var yr=[];function kh(o,p,g,b){return g>>>=0,b>>>=0,(o=yr[o>>>0])(null,p=Ae(p>>>0),g,b)}var Sh={},_r=o=>{var p=Sh[o];return p===void 0?Je(o):p};function Th(o,p,g,b,v){return g>>>=0,b>>>=0,v>>>=0,(o=yr[o>>>0])(p=Ae(p>>>0),p[g=_r(g)],b,v)}function Ih(o,p){return p>>>=0,(o=Ae(o>>>0))==Ae(p)}var Fa=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Ch(o){return(o>>>=0)==0?Le(Fa()):(o=_r(o),Le(Fa()[o]))}var Eh=o=>{var p=yr.length;return yr.push(o),p},zh=(o,p)=>{for(var g=Array(o),b=0;b<o;++b)g[b]=hr(pe()[p+4*b>>>2>>>0],"parameter "+b);return g},Ha=(o,p)=>Object.defineProperty(p,"name",{value:o});function Oh(o,p,g){var b=(p=zh(o,p>>>0)).shift();o--;var v=`return function (obj, func, destructorsRef, args) {
`,C=0,B=[];g===0&&B.push("obj");for(var L=["retType"],G=[b],Y=0;Y<o;++Y)B.push("arg"+Y),L.push("argType"+Y),G.push(p[Y]),v+=`  var arg${Y} = argType${Y}.readValueFromPointer(args${C?"+"+C:""});
`,C+=p[Y].Db;return v+=`  var rv = ${g===1?"new func":"func.call"}(${B.join(", ")});
`,b.Ub||(L.push("emval_returnValue"),G.push(Wa),v+=`  return emval_returnValue(retType, destructorsRef, rv);
`),L.push(v+`};
`),o=function(le){var ce=Function;if(!(ce instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof ce} which is not a function`);var _e=Ha(ce.name||"unknownFunctionName",function(){});return _e.prototype=ce.prototype,_e=new _e,(le=ce.apply(_e,le))instanceof Object?le:_e}(L)(...G),g=`methodCaller<(${p.map(le=>le.name).join(", ")}) => ${b.name}>`,Eh(Ha(g,o))}function Ah(o){return o=_r(o>>>0),Le(i[o])}function Rh(o,p){return p>>>=0,o=Ae(o>>>0),p=Ae(p),Le(o[p])}function Bh(o){9<(o>>>=0)&&(st[o+1]+=1)}function Mh(){return Le([])}function Dh(o){o=Ae(o>>>0);for(var p=Array(o.length),g=0;g<o.length;g++)p[g]=o[g];return Le(p)}function Nh(o){return Le(_r(o>>>0))}function Ph(){return Le({})}function Uh(o){for(var p=Ae(o>>>=0);p.length;){var g=p.pop();p.pop()(g)}ii(o)}function Wh(o,p,g){p>>>=0,g>>>=0,o=Ae(o>>>0),p=Ae(p),g=Ae(g),o[p]=g}function Lh(o,p){return p>>>=0,o=(o=hr(o>>>0,"_emval_take_value")).readValueFromPointer(p),Le(o)}function qh(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),N()[p>>>2>>>0]=o.getUTCSeconds(),N()[p+4>>>2>>>0]=o.getUTCMinutes(),N()[p+8>>>2>>>0]=o.getUTCHours(),N()[p+12>>>2>>>0]=o.getUTCDate(),N()[p+16>>>2>>>0]=o.getUTCMonth(),N()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,N()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,N()[p+28>>>2>>>0]=o}var ja=o=>o%4==0&&(o%100!=0||o%400==0),Ka=[0,31,60,91,121,152,182,213,244,274,305,335],Za=[0,31,59,90,120,151,181,212,243,273,304,334];function Vh(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),N()[p>>>2>>>0]=o.getSeconds(),N()[p+4>>>2>>>0]=o.getMinutes(),N()[p+8>>>2>>>0]=o.getHours(),N()[p+12>>>2>>>0]=o.getDate(),N()[p+16>>>2>>>0]=o.getMonth(),N()[p+20>>>2>>>0]=o.getFullYear()-1900,N()[p+24>>>2>>>0]=o.getDay();var g=(ja(o.getFullYear())?Ka:Za)[o.getMonth()]+o.getDate()-1|0;N()[p+28>>>2>>>0]=g,N()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),g=new Date(o.getFullYear(),6,1).getTimezoneOffset();var b=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(g!=b&&o.getTimezoneOffset()==Math.min(b,g)),N()[p+32>>>2>>>0]=o}function Gh(o){o>>>=0;var p=new Date(N()[o+20>>>2>>>0]+1900,N()[o+16>>>2>>>0],N()[o+12>>>2>>>0],N()[o+8>>>2>>>0],N()[o+4>>>2>>>0],N()[o>>>2>>>0],0),g=N()[o+32>>>2>>>0],b=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),C=new Date(p.getFullYear(),0,1).getTimezoneOffset(),B=Math.min(C,v);return 0>g?N()[o+32>>>2>>>0]=+(v!=C&&B==b):0<g!=(B==b)&&(v=Math.max(C,v),p.setTime(p.getTime()+6e4*((0<g?B:v)-b))),N()[o+24>>>2>>>0]=p.getDay(),g=(ja(p.getFullYear())?Ka:Za)[p.getMonth()]+p.getDate()-1|0,N()[o+28>>>2>>>0]=g,N()[o>>>2>>>0]=p.getSeconds(),N()[o+4>>>2>>>0]=p.getMinutes(),N()[o+8>>>2>>>0]=p.getHours(),N()[o+12>>>2>>>0]=p.getDate(),N()[o+16>>>2>>>0]=p.getMonth(),N()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Qa(o,p,g,b,v,C,B){return d?ve(16,1,o,p,g,b,v,C,B):-52}function Xa(o,p,g,b,v,C){if(d)return ve(17,1,o,p,g,b,v,C)}var jt={},Fh=()=>performance.timeOrigin+performance.now();function Ya(o,p){if(d)return ve(18,1,o,p);if(jt[o]&&(clearTimeout(jt[o].id),delete jt[o]),!p)return 0;var g=setTimeout(()=>{delete jt[o],ai(()=>hs(o,performance.timeOrigin+performance.now()))},p);return jt[o]={id:g,rc:p},0}function Hh(o,p,g,b){o>>>=0,p>>>=0,g>>>=0,b>>>=0;var v=new Date().getFullYear(),C=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var B=Math.max(C,v);pe()[o>>>2>>>0]=60*B,N()[p>>>2>>>0]=+(C!=v),o=(p=L=>{var G=Math.abs(L);return`UTC${0<=L?"-":"+"}${String(Math.floor(G/60)).padStart(2,"0")}${String(G%60).padStart(2,"0")}`})(C),p=p(v),v<C?(Pt(o,g,17),Pt(p,b,17)):(Pt(o,b,17),Pt(p,g,17))}var jh=()=>Date.now();function Kh(o,p,g){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),H[g>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var li=[],Ja=(o,p)=>{li.length=0;for(var g;g=U()[o++>>>0];){var b=g!=105;p+=(b&=g!=112)&&p%8?4:0,li.push(g==112?pe()[p>>>2>>>0]:g==106?H[p>>>3]:g==105?N()[p>>>2>>>0]:Ce()[p>>>3>>>0]),p+=b?8:4}return li};function Zh(o,p,g){return o>>>=0,p=Ja(p>>>0,g>>>0),Zr[o](...p)}function Qh(o,p,g){return o>>>=0,p=Ja(p>>>0,g>>>0),Zr[o](...p)}var Xh=()=>{};function Yh(o,p){return T(Te(o>>>0,p>>>0))}var Jh=()=>{throw pt+=1,"unwind"};function em(){return 4294901760}var tm=()=>navigator.hardwareConcurrency;function rm(){return dt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function im(o){o>>>=0;var p=U().length;if(o<=p||4294901760<o)return!1;for(var g=1;4>=g;g*=2){var b=p*(1+.2/g);b=Math.min(b,o+100663296);e:{b=(Math.min(4294901760,65536*Math.ceil(Math.max(o,b)/65536))-O.buffer.byteLength+65535)/65536|0;try{O.grow(b),ge();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}var br=()=>(dt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Kt={},es=o=>{o.forEach(p=>{br()})};function nm(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),es(o),Kt.Mb=br(),Kt.dc=o,Kt.Mb}function am(o,p,g){if(o>>>=0,p>>>=0,Kt.Mb==o)var b=Kt.dc;else(b=Error().stack.toString().split(`
`))[0]=="Error"&&b.shift(),es(b);for(var v=3;b[v]&&br()!=o;)++v;for(o=0;o<g&&b[o+v];++o)N()[p+4*o>>>2>>>0]=br();return o}var di,pi={},ts=()=>{if(!di){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in pi)pi[o]===void 0?delete p[o]:p[o]=pi[o];var g=[];for(o in p)g.push(`${o}=${p[o]}`);di=g}return di};function rs(o,p){if(d)return ve(19,1,o,p);o>>>=0,p>>>=0;var g=0;return ts().forEach((b,v)=>{var C=p+g;for(v=pe()[o+4*v>>>2>>>0]=C,C=0;C<b.length;++C)E()[v++>>>0]=b.charCodeAt(C);E()[v>>>0]=0,g+=b.length+1}),0}function is(o,p){if(d)return ve(20,1,o,p);o>>>=0,p>>>=0;var g=ts();pe()[o>>>2>>>0]=g.length;var b=0;return g.forEach(v=>b+=v.length+1),pe()[p>>>2>>>0]=b,0}function ns(o){return d?ve(21,1,o):52}function as(o,p,g,b){return d?ve(22,1,o,p,g,b):52}function ss(o,p,g,b){return d?ve(23,1,o,p,g,b):70}var sm=[null,[],[]];function os(o,p,g,b){if(d)return ve(24,1,o,p,g,b);p>>>=0,g>>>=0,b>>>=0;for(var v=0,C=0;C<g;C++){var B=pe()[p>>>2>>>0],L=pe()[p+4>>>2>>>0];p+=8;for(var G=0;G<L;G++){var Y=U()[B+G>>>0],le=sm[o];Y===0||Y===10?((o===1?k:T)(va(le)),le.length=0):le.push(Y)}v+=L}return pe()[b>>>2>>>0]=v,0}d||function(){for(var o=i.numThreads-1;o--;)_a();Xr.unshift(()=>{$t++,function(p){d?p():Promise.all(ct.map(ya)).then(p)}(()=>la())})}();for(var us=Array(256),wr=0;256>wr;++wr)us[wr]=String.fromCharCode(wr);Na=us,ft=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},i.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},st.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>st.length/2-5-ri.length;var re,om=[Yr,fa,ba,xa,ka,Ta,Ia,Ca,Ea,za,Oa,Aa,Ra,Ba,Ma,Da,Qa,Xa,Ya,rs,is,ns,as,ss,os];(async function(){function o(b,v){return re=b.exports,re=function(){var C=re,B={};for(let[L,G]of Object.entries(C))B[L]=typeof G=="function"?(...Y)=>{gr.push(L);try{return G(...Y)}finally{be||(gr.pop(),et&&mt===1&&gr.length===0&&(mt=0,pt+=1,mr(bs),typeof Fibers<"u"&&Fibers.sc()))}}:G;return B}(),re=function(){var C=re,B=G=>Y=>G(Y)>>>0,L=G=>()=>G()>>>0;return(C=Object.assign({},C)).Ea=B(C.Ea),C.gb=L(C.gb),C.ib=B(C.ib),C.ub=B(C.ub),C.vb=L(C.vb),C.__cxa_get_exception_ptr=B(C.__cxa_get_exception_ptr),C}(),ha.push(re.jb),I=v,la(),re}$t++;var p=da();if(i.instantiateWasm)return new Promise(b=>{i.instantiateWasm(p,(v,C)=>{o(v,C),b(v.exports)})});if(d)return new Promise(b=>{Ve=v=>{var C=new WebAssembly.Instance(v,da());b(o(C,v))}});Me??(Me=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",$):$+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep-CLPRrI3A.wasm",import.meta.url).href);try{var g=await async function(b){var v=Me;if(!te&&typeof WebAssembly.instantiateStreaming=="function"&&!P(v))try{var C=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(C,b)}catch(B){T(`wasm streaming compile failed: ${B}`),T("falling back to ArrayBuffer instantiation")}return async function(B,L){try{var G=await async function(Y){if(!te)try{var le=await m(Y);return new Uint8Array(le)}catch{}if(Y==Me&&te)Y=new Uint8Array(te);else{if(!y)throw"both async and sync fetching of the wasm failed";Y=y(Y)}return Y}(B);return await WebAssembly.instantiate(G,L)}catch(Y){T(`failed to asynchronously prepare wasm: ${Y}`),dt(Y)}}(v,b)}(p);return o(g.instance,g.module)}catch(b){return a(b),Promise.reject(b)}})();var ls=o=>(ls=re.Ea)(o),ds=()=>(ds=re.Fa)();i._OrtInit=(o,p)=>(i._OrtInit=re.Ga)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=re.Ha)(o,p),i._OrtCreateSessionOptions=(o,p,g,b,v,C,B,L,G,Y)=>(i._OrtCreateSessionOptions=re.Ia)(o,p,g,b,v,C,B,L,G,Y),i._OrtAppendExecutionProvider=(o,p,g,b,v)=>(i._OrtAppendExecutionProvider=re.Ja)(o,p,g,b,v),i._OrtAddFreeDimensionOverride=(o,p,g)=>(i._OrtAddFreeDimensionOverride=re.Ka)(o,p,g),i._OrtAddSessionConfigEntry=(o,p,g)=>(i._OrtAddSessionConfigEntry=re.La)(o,p,g),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=re.Ma)(o),i._OrtCreateSession=(o,p,g)=>(i._OrtCreateSession=re.Na)(o,p,g),i._OrtReleaseSession=o=>(i._OrtReleaseSession=re.Oa)(o),i._OrtGetInputOutputCount=(o,p,g)=>(i._OrtGetInputOutputCount=re.Pa)(o,p,g),i._OrtGetInputOutputMetadata=(o,p,g,b)=>(i._OrtGetInputOutputMetadata=re.Qa)(o,p,g,b),i._OrtFree=o=>(i._OrtFree=re.Ra)(o),i._OrtCreateTensor=(o,p,g,b,v,C)=>(i._OrtCreateTensor=re.Sa)(o,p,g,b,v,C),i._OrtGetTensorData=(o,p,g,b,v)=>(i._OrtGetTensorData=re.Ta)(o,p,g,b,v),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=re.Ua)(o),i._OrtCreateRunOptions=(o,p,g,b)=>(i._OrtCreateRunOptions=re.Va)(o,p,g,b),i._OrtAddRunConfigEntry=(o,p,g)=>(i._OrtAddRunConfigEntry=re.Wa)(o,p,g),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=re.Xa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=re.Ya)(o),i._OrtBindInput=(o,p,g)=>(i._OrtBindInput=re.Za)(o,p,g),i._OrtBindOutput=(o,p,g,b)=>(i._OrtBindOutput=re._a)(o,p,g,b),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=re.$a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=re.ab)(o),i._OrtRunWithBinding=(o,p,g,b,v)=>(i._OrtRunWithBinding=re.bb)(o,p,g,b,v),i._OrtRun=(o,p,g,b,v,C,B,L)=>(i._OrtRun=re.cb)(o,p,g,b,v,C,B,L),i._OrtEndProfiling=o=>(i._OrtEndProfiling=re.db)(o),i._JsepOutput=(o,p,g)=>(i._JsepOutput=re.eb)(o,p,g),i._JsepGetNodeName=o=>(i._JsepGetNodeName=re.fb)(o);var $r=()=>($r=re.gb)(),tt=i._free=o=>(tt=i._free=re.hb)(o),vr=i._malloc=o=>(vr=i._malloc=re.ib)(o),ci=(o,p,g,b,v,C)=>(ci=re.lb)(o,p,g,b,v,C),ps=()=>(ps=re.mb)(),cs=(o,p,g,b,v)=>(cs=re.nb)(o,p,g,b,v),fs=o=>(fs=re.ob)(o),fi=o=>(fi=re.pb)(o),hs=(o,p)=>(hs=re.qb)(o,p),ms=()=>(ms=re.rb)(),gs=(o,p)=>(gs=re.sb)(o,p),xr=o=>(xr=re.tb)(o),hi=o=>(hi=re.ub)(o),mi=()=>(mi=re.vb)(),ys=i.dynCall_ii=(o,p)=>(ys=i.dynCall_ii=re.wb)(o,p),_s=o=>(_s=re.xb)(o),bs=()=>(bs=re.yb)(),ws=o=>(ws=re.zb)(o),$s=()=>($s=re.Ab)();return i.stackSave=()=>mi(),i.stackRestore=o=>xr(o),i.stackAlloc=o=>hi(o),i.setValue=function(o,p,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":case"i8":E()[o>>>0]=p;break;case"i16":Q()[o>>>1>>>0]=p;break;case"i32":N()[o>>>2>>>0]=p;break;case"i64":H[o>>>3]=BigInt(p);break;case"float":We()[o>>>2>>>0]=p;break;case"double":Ce()[o>>>3>>>0]=p;break;case"*":pe()[o>>>2>>>0]=p;break;default:dt(`invalid type for setValue: ${g}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return E()[o>>>0];case"i16":return Q()[o>>>1>>>0];case"i32":return N()[o>>>2>>>0];case"i64":return H[o>>>3];case"float":return We()[o>>>2>>>0];case"double":return Ce()[o>>>3>>>0];case"*":return pe()[o>>>2>>>0];default:dt(`invalid type for getValue: ${p}`)}},i.UTF8ToString=Te,i.stringToUTF8=Pt,i.lengthBytesUTF8=Sa,function o(){if(0<$t)vt=o;else if(d)n(i),xe();else{for(;0<Xr.length;)Xr.shift()(i);0<$t?vt=o:(i.calledRun=!0,be||(xe(),n(i)))}}(),i.PTR_SIZE=4,s}),Td=vi,Ts=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Ts&&vi()}),xi,yn,Is,De,Id,Sr,Cs,Es,ki,zs,Si,Cd,Ti,Ed,Pn=q(()=>{Nn(),xi=typeof location>"u"?void 0:location.origin,yn=import.meta.url>"file:"&&import.meta.url<"file;",Is=()=>{{if(yn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,xi).href}return import.meta.url}},De=Is(),Id=()=>{if(De&&!De.startsWith("blob:"))return De.substring(0,De.lastIndexOf("/")+1)},Sr=(e,t)=>{try{let r=t??De;return(r?new URL(e,r):new URL(e)).origin===xi}catch{return!1}},Cs=(e,t)=>{let r=t??De;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Es=(e,t)=>`${t??"./"}${e}`,ki=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},zs=async e=>(await import(e)).default,Si=(Qm(),pr(xd)).default,Cd=async()=>{if(!De)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Sr(De))return[void 0,Si()];let e=await ki(De);return[e,Si(e)]},Ti=(Xm(),pr(Sd)).default,Ed=async(e,t,r)=>{if(!e&&!t&&Ti&&De&&Sr(De))return[void 0,Ti];{let n="ort-wasm-simd-threaded.jsep.mjs",a=e??Cs(n,t),i=r&&a&&!Sr(a,t),s=i?await ki(a):a??Es(n,t);return[i?s:void 0,await zs(s)]}}}),Ii,Tr,Qt,Ci,Os,As,Rs,Un,we,Dt=q(()=>{Pn(),Tr=!1,Qt=!1,Ci=!1,Os=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},As=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Rs=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Un=async e=>{if(Tr)return Promise.resolve();if(Qt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ci)throw new Error("previous call to 'initializeWebAssembly()' failed.");Qt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Rs())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!As())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let n=Os();r>1&&!n&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,i=typeof a=="string"?a:void 0,s=a==null?void 0:a.mjs,u=(s==null?void 0:s.href)??s,l=a==null?void 0:a.wasm,d=(l==null?void 0:l.href)??l,c=e.wasmBinary,[f,h]=await Ed(u,i,r>1),m=!1,y=[];if(t>0&&y.push(new Promise(_=>{setTimeout(()=>{m=!0,_()},t)})),y.push(new Promise((_,x)=>{let $={numThreads:r};if(c)$.wasmBinary=c;else if(d||i)$.locateFile=w=>d??i+w;else if(u&&u.indexOf("blob:")!==0)$.locateFile=w=>new URL(w,u).href;else if(f){let w=Id();w&&($.locateFile=S=>w+S)}h($).then(w=>{Qt=!1,Tr=!0,Ii=w,_(),f&&URL.revokeObjectURL(f)},w=>{Qt=!1,Ci=!0,x(w)})})),await Promise.race(y),m)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},we=()=>{if(Tr&&Ii)return Ii;throw new Error("WebAssembly is not initialized yet.")}}),Qe,Lr,ye,Wn=q(()=>{Dt(),Qe=(e,t)=>{let r=we(),n=r.lengthBytesUTF8(e)+1,a=r._malloc(n);return r.stringToUTF8(e,a,n),t.push(a),a},Lr=(e,t,r,n)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,i])=>{let s=t?t+a:a;if(typeof i=="object")Lr(i,s+".",r,n);else if(typeof i=="string"||typeof i=="number")n(s,i.toString());else if(typeof i=="boolean")n(s,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},ye=e=>{let t=we(),r=t.stackSave();try{let n=t.PTR_SIZE,a=t.stackAlloc(2*n);t._OrtGetLastError(a,a+n);let i=Number(t.getValue(a,n===4?"i32":"i64")),s=t.getValue(a+n,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),zd,Ym=q(()=>{Dt(),Wn(),zd=e=>{let t=we(),r=0,n=[],a=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(a.terminate=!1);let i=0;return(e==null?void 0:e.tag)!==void 0&&(i=Qe(e.tag,n)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,i),r===0&&ye("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Lr(e.extra,"",new WeakSet,(s,u)=>{let l=Qe(s,n),d=Qe(u,n);t._OrtAddRunConfigEntry(r,l,d)!==0&&ye(`Can't set a run config entry: ${s} - ${u}.`)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),n.forEach(s=>t._free(s)),i}}}),Bs,Ms,Ds,Xt,Ns,Od,Jm=q(()=>{Dt(),Wn(),Bs=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Ms=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Ds=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Xt=(e,t,r,n)=>{let a=Qe(t,n),i=Qe(r,n);we()._OrtAddSessionConfigEntry(e,a,i)!==0&&ye(`Can't set a session config entry: ${t} - ${r}.`)},Ns=async(e,t,r)=>{for(let n of t){let a=typeof n=="string"?n:n.name,i=[];switch(a){case"webnn":if(a="WEBNN",typeof n!="string"){let c=n==null?void 0:n.deviceType;c&&Xt(e,"deviceType",c,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let c=n;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);Xt(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let s=Qe(a,r),u=i.length,l=0,d=0;if(u>0){l=we()._malloc(u*we().PTR_SIZE),r.push(l),d=we()._malloc(u*we().PTR_SIZE),r.push(d);for(let c=0;c<u;c++)we().setValue(l+c*we().PTR_SIZE,i[c][0],"*"),we().setValue(d+c*we().PTR_SIZE,i[c][1],"*")}await we()._OrtAppendExecutionProvider(e,s,l,d,u)!==0&&ye(`Can't append execution provider: ${a}.`)}},Od=async e=>{let t=we(),r=0,n=[],a=e||{};Ds(a);try{let i=Bs(a.graphOptimizationLevel??"all"),s=Ms(a.executionMode??"sequential"),u=typeof a.logId=="string"?Qe(a.logId,n):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let d=a.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof a.optimizedModelFilePath=="string"?Qe(a.optimizedModelFilePath,n):0;if(r=t._OrtCreateSessionOptions(i,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,d,c),r===0&&ye("Can't create session options."),a.executionProviders&&await Ns(r,a.executionProviders,n),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);Xt(r,"enableGraphCapture",a.enableGraphCapture.toString(),n)}if(a.freeDimensionOverrides)for(let[f,h]of Object.entries(a.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let m=Qe(f,n);t._OrtAddFreeDimensionOverride(r,m,h)!==0&&ye(`Can't set a free dimension override: ${f} - ${h}.`)}return a.extra!==void 0&&Lr(a.extra,"",new WeakSet,(f,h)=>{Xt(r,f,h,n)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&ye("Can't release session options."),n.forEach(s=>t._free(s)),i}}}),Ot,ut,At,Kr,qr,Ln,qn,_n,ie=q(()=>{Ot=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},ut=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},At=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],n=typeof t=="number"?t:t.reduce((a,i)=>a*i,1);return r>0?Math.ceil(n*r):void 0},Kr=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},qr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ln=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",qn=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",_n=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Vn,Ad=q(()=>{Nn(),Vn=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),n=r?parseInt(r,10):0;if(n<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),i;try{i=new ArrayBuffer(n)}catch(u){if(u instanceof RangeError){let l=Math.ceil(n/65536);i=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let d=l.byteLength;new Uint8Array(i,s,d).set(l),s+=d}return new Uint8Array(i,0,n)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ps,Us,Ws,Ls,Gn,qs,de,lt=q(()=>{ie(),Ps=["V","I","W","E","F"],Us=(e,t)=>{console.log(`[${Ps[e]},${new Date().toISOString()}]${t}`)},Gn=(e,t)=>{Ws=e,Ls=t},qs=(e,t)=>{let r=qr(e),n=qr(Ws);r>=n&&Us(r,typeof t=="function"?t():t)},de=(...e)=>{Ls&&qs(...e)}}),Vs,Vt,R,Vr,Rd,Bd,Md,se=q(()=>{Vs=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Vt=class{static calcShape(e,t,r=!1){let n=e.length,a=t.length;if(n===0)return t;if(a===0)return e;let i=Math.max(e.length,t.length),s=new Array(i);if(r){if(n<2||a<2)return;let u=Vs.calcMatMulShape([e[n-2],e[n-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[i-2],s[i-1]]=u}for(let u=r?3:1;u<=i;u++){let l=n-u<0?1:e[n-u],d=a-u<0?1:t[a-u];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[i-u]=Math.max(l,d);else{if(c>1)return;s[i-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,n=t.length;if(r>n)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[n-a])return!1;return!0}},R=class Nr{static size(t){return Nr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let n=t.length;if(n===0)return[];let a=new Array(n),i=n-1;for(;i>=0;){if(t[i]%r===0){a[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");a[i]=1,r/=t[i],i--}for(i--;i>=0;i--)a[i]=t[i];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Nr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Nr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,n){let a=1;for(let i=r;i<n;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[i])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let n=new Array(r);n[r-1]=1,n[r-2]=t[r-1];for(let a=r-3;a>=0;--a)n[a]=n[a+1]*t[a+1];return n}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(n=>this.normalizeAxis(n,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(n=>t[n]):t.slice().reverse()}static padShape(t,r){let n=t.length;return t.map((a,i)=>a+r[i]+r[i+n])}static areEqual(t,r){return t.length!==r.length?!1:t.every((n,a)=>n===r[a])}},Vr=class or{static adjustPoolAttributes(t,r,n,a,i,s){if(!t&&n.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=n.length?n.push(r[u+2]):n[u]=r[u+2];for(let u=0;u<n.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<n.length;u++)if(u<i.length){if(i[u]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let u=0;u<n.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<n.length;u++){if(n[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=n[u]||s[u+n.length]>=n[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,n,a,i,s,u){if(u){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)or.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],n[l],a[l],i,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,n,a,i,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return or.computeShapeHelper(t,r,l,n,a,i,s,u),l}static computeConvOutputShape(t,r,n,a,i,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return or.computeShapeHelper(!1,t,l,n,a,i,s,u),l}static computeShapeHelper(t,r,n,a,i,s,u,l){if(t)for(let d=0;d<r.length-2;d++)n.push(1);else for(let d=0;d<r.length-2;d++)n.push(or.adjustPadAndReturnShape(r[d+2],a[d],i[d],s[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,n,a,i,s,u,l){let d=n*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return i[s]=0,i[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(n!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+a-t;return i[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),i[u]=c-i[s],Math.floor((t+c-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[s]+i[u]-d)/r+1)}},Rd=class{static getShapeOfGemmResult(e,t,r,n,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let i,s,u;t?(i=e[1],s=e[0]):(i=e[0],s=e[1]);let l=-1;if(n?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(i<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Vt.isValidBroadcast(a,[i,u]))throw new Error("gemm: invalid bias shape for broadcast");return[i,u,s]}},Bd=-34028234663852886e22,Md=34028234663852886e22}),Fn,Dd=q(()=>{ie(),Fn=(e,t)=>new(Kr(t))(e)}),Ei,bn,zi,Gs,Oi,Fs,Ai,Ri,Bi,Hs,Nd,eg=q(()=>{ie(),lt(),Ei=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),bn=(e,t)=>{if(t==="int32")return e;let r=Ei.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let n=r/8;if(e.byteLength%n!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${n}.`);let a=e.byteLength/n,i=new(Kr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let u=0;u<a;u++){let l=i[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&i.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(i,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},zi=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,n=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(n,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(n.some(i=>i<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(n,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(n.some(i=>i<-128||i>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(n,Number);return new Uint8Array(a.buffer)}case"uint8":{if(n.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(n,Number)}case"uint32":{if(n.some(i=>i<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(n,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Gs=1,Oi=()=>Gs++,Fs=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Ai=(e,t)=>{let r=Ei.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((n,a)=>n*a)*r/8):0},Ri=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:n,dataType:a,shape:i,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=n,this.dataType=a,this.tensorShape=i,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Ai(this.dataType,this.tensorShape)}destroy(){de("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=zi(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((n,a)=>n===r[a])}setIsDataConverted(e){this.isDataConverted=e}},Bi=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,n){let a=this.tensorManager.getMLContext(e),i;if(!a.opSupportLimits().input.dataTypes.includes(t)){if(i=Fs.get(t),!i||!a.opSupportLimits().input.dataTypes.includes(i))throw new Error(`WebNN backend does not support data type: ${t}`);de("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${i}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(n){if(this.wrapper.byteLength!==Ai(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0,i),n&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=bn(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else de("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let n=(t=this.wrapper)!=null&&t.isDataConverted?zi(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(n):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(n);return}else return n.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Hs=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Oi();return this.tensorTrackersById.set(e,new Bi(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,n,a){de("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${n}, copyOld: ${a}}`);let i=this.tensorTrackersById.get(t);if(!i)throw new Error("Tensor not found.");return i.ensureTensor(e,r,n,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){de("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,n){let a=this.getMLContext(e),i=Oi(),s=new Ri({sessionId:e,context:a,tensor:t,dataType:r,shape:n});return this.tensorTrackersById.set(i,new Bi(this,s)),this.externalTensors.add(s),i}async getCachedTensor(e,t,r,n,a,i,s){let u=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){de("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}de("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:n,writable:a,readable:i});return new Ri({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Nd=(...e)=>new Hs(...e)}),Yt,js,Pd,tg=q(()=>{ie(),Dt(),Dd(),eg(),lt(),Yt=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),js=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),n=Object.keys(t).sort();return r.length===n.length&&r.every((a,i)=>a===n[i]&&e[a]===t[a])},Pd=class{constructor(e){this.tensorManager=Nd(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,Gn(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){de("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){de("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)de("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(n=>n.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:n}),n}}else if(e===void 0){let r=this.mlContextCache.findIndex(n=>n.options===void 0&&n.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let n=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:n}),n}}let t=this.mlContextCache.findIndex(r=>js(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let n=this.mlContextCache.findIndex(a=>a.mlContext===t);n!==-1&&this.mlContextCache.splice(n,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){de("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,n,a){let i=Yt.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,i,n,a)}async createTemporaryTensor(e,t,r){de("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let n=Yt.get(t);if(!n)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,n,r,!1);let i=this.temporarySessionTensorIds.get(e);return i?i.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!we().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");de("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Fn(r,t)}}registerMLTensor(e,t,r,n){let a=Yt.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let i=this.tensorManager.registerTensor(e,t,a,n);return de("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${n}} -> {tensorId: ${i}}`),i}registerMLConstant(e,t,r,n,a,i,s=!1){if(!i)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=i.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(a.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":if(s){let f=bn(new Uint8Array(d),"int64");c=new Int32Array(f.buffer),a.dataType="int32"}else c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return de("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),n.constant(a,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let n=this.mlContextBySessionId.get(e),a=Yt.get(Ot(t));return typeof a>"u"?!1:r?!!(n!=null&&n.opSupportLimits().input.dataTypes.includes(a)):!!(n!=null&&n.opSupportLimits().output.dataTypes.includes(a))}flush(){}}}),Hn=q(()=>{}),Mi,Ir,Cr,Ks,Zs,Di,wn,Qs,Ud,rg=q(()=>{lt(),Hn(),Mi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Ir=[],Cr=e=>Math.ceil(Number(e)/16)*16,Ks=e=>{for(let t=0;t<Ir.length;t++){let r=Ir[t];if(e<=r)return r}return Math.ceil(e/16)*16},Zs=1,Di=()=>Zs++,wn=async(e,t,r,n)=>{let a=Cr(r),i=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,i,0,a),e.flush(),await i.mapAsync(GPUMapMode.READ);let u=i.getMappedRange();if(n){let l=n();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{i.destroy()}},Qs=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Mi)Ir.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,n=t.byteOffset,a=t.byteLength,i=Cr(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:i,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,n,a)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,i),this.backend.device.queue.submit([d.finish()]),u.destroy(),de("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let n=this.storageCache.get(t);if(!n)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==n.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=Cr(r.originalSize),i=this.backend.getCommandEncoder();this.backend.endComputePass(),i.copyBufferToBuffer(r.gpuData.buffer,0,n.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let n;if(r){if(n=r[0],e===r[1])return de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${n}, buffer is the same, skip.`),n;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else n=Di();return this.storageCache.set(n,{gpuData:{id:n,type:0,buffer:e},originalSize:t}),de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${n}, registered.`),n}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),de("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Ks(e),n,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,i=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||i){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?n=u.pop():n=this.backend.device.createBuffer({size:r,usage:t}):n=this.backend.device.createBuffer({size:r,usage:t})}else n=this.backend.device.createBuffer({size:r,usage:t});let s={id:Di(),type:0,buffer:n};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),de("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return de("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await wn(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Mi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(de("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Ud=(...e)=>new Qs(...e)}),Xs,he,Se=q(()=>{Xs=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},he=e=>new Xs(e)}),Gt,Er,Ie,Oe,J,ke,$n,qt,bt,X,Jt,D,Z,Wd,jn,Ys,Ld,ue=q(()=>{ie(),se(),Gt=64,Er=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ie=(e,t=1)=>{let r=Er(e,t);return typeof r=="string"?r:r[0]},Oe=(e,t=1)=>{let r=Er(e,t);return typeof r=="string"?r:r[1]},J=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:R.computeStrides(r)})}),t},ke=e=>e%4===0?4:e%2===0?2:1,$n=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,qt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,bt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,X=(e,t,r,n)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?n==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:n==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Jt=(e,t,r,n,a)=>{let i=typeof r=="number",s=i?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Er(t,a),c=typeof d=="string"?d:d[1],f=typeof d=="string"?d:d[0],h={indices:l,value:c,storage:f,tensor:t},m=P=>typeof P=="string"?P:`${P}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},_=i?"uniforms.":"",x=`${_}${e}_shape`,$=`${_}${e}_strides`,w="";for(let P=0;P<s-1;P++)w+=`
    let dim${P} = current / ${X($,P,s)};
    let rest${P} = current % ${X($,P,s)};
    indices[${P}] = dim${P};
    current = rest${P};
    `;w+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,k=P=>(y.offsetToIndices=!0,s<2?P:`o2i_${e}(${P})`),T=[];if(s>=2)for(let P=s-1;P>=0;P--)T.push(`${X($,P,s)} * (indices[${P}])`);let O=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${T.join("+")};
  }`,I=P=>(y.indicesToOffset=!0,s<2?P:`i2o_${e}(${P})`),z=(...P)=>s===0?"0u":`${h.indices}(${P.map(m).join(",")})`,A=(P,E)=>s<2?`${P}`:`${X(P,E,s)}`,M=(P,E,U)=>s<2?`${P}=${U};`:`${X(P,E,s)}=${U};`,j={},V=(P,E)=>{y.broadcastedIndicesToOffset=!0;let U=`${E.name}broadcastedIndicesTo${e}Offset`;if(U in j)return`${U}(${P})`;let Q=[];for(let me=s-1;me>=0;me--){let N=E.indicesGet("outputIndices",me+E.rank-s);Q.push(`${A($,me)} * (${N} % ${A(x,me)})`)}return j[U]=`fn ${U}(outputIndices: ${E.type.indices}) -> u32 {
             return ${Q.length>0?Q.join("+"):"0u"};
           }`,`${U}(${P})`},F=(P,E)=>(()=>{if(h.storage===h.value)return`${e}[${P}]=${E};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${P}]=vec2<u32>(u32(${E}), select(0u, 0xFFFFFFFFu, ${E} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${P}]=vec2<u32>(u32(${E}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${P}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${E}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ee=P=>(()=>{if(h.storage===h.value)return`${e}[${P}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${P}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${P}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${P}] & 0xFFu), bool(${e}[${P}] & 0xFF00u), bool(${e}[${P}] & 0xFF0000u), bool(${e}[${P}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ne=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${c} {
    return ${ee(`i2o_${e}(indices)`)};
  }`,H=s<2?"":(()=>{let P=u.map(U=>`d${U}: u32`).join(", "),E=u.map(U=>`d${U}`).join(", ");return`
  fn get_${e}(${P}) -> ${c} {
    return get_${e}ByIndices(${z(E)});
  }`})(),ae=(...P)=>{if(P.length!==s)throw new Error(`indices length must be ${s}`);let E=P.map(m).join(",");return s===0?ee("0u"):s===1?ee(E[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${E})`)},K=P=>s<2?ee(P):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${P})`),te=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${c}) {
    ${F(`i2o_${e}(indices)`,"value")}
  }`,be=s<2?"":(()=>{let P=u.map(U=>`d${U}: u32`).join(", "),E=u.map(U=>`d${U}`).join(", ");return`
  fn set_${e}(${P}, value: ${c}) {
    set_${e}ByIndices(${z(E)}, value);
  }`})();return{impl:()=>{let P=[],E=!1;return y.offsetToIndices&&(P.push(S),E=!0),y.indicesToOffset&&(P.push(O),E=!0),y.broadcastedIndicesToOffset&&(Object.values(j).forEach(U=>P.push(U)),E=!0),y.set&&(P.push(be),E=!0),y.setByIndices&&(P.push(te),E=!0),y.get&&(P.push(H),E=!0),y.getByIndices&&(P.push(ne),E=!0),!i&&E&&P.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${$} = ${h.indices}(${R.computeStrides(r).join(",")});`),P.join(`
`)},type:h,offsetToIndices:k,indicesToOffset:I,broadcastedIndicesToOffset:V,indices:z,indicesGet:A,indicesSet:M,set:(...P)=>{if(P.length!==s+1)throw new Error(`indices length must be ${s}`);let E=P[s];if(typeof E!="string")throw new Error("value must be string");let U=P.slice(0,s).map(m).join(",");return s===0?F("0u",E):s===1?F(U[0],E):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${U}, ${E})`)},setByOffset:F,setByIndices:(P,E)=>s<2?F(P,E):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${P}, ${E});`),get:ae,getByOffset:ee,getByIndices:K,usage:n,name:e,strides:$,shape:x,rank:s}},D=(e,t,r,n=1)=>Jt(e,t,r,"input",n),Z=(e,t,r,n=1)=>Jt(e,t,r,"output",n),Wd=(e,t,r)=>Jt(e,t,r,"atomicOutput",1),jn=(e,t,r,n=1)=>Jt(e,t,r,"internal",n),Ys=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Gt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],n=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||n>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${n}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*n>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${n}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,i=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*n}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${n})
  fn main(${i}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",n=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${n}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:n}of this.uniforms)if(n&&n>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(n/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(n/4)}>`);else{let a=n==null||n===1?r:`vec${n}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Ld=(e,t)=>new Ys(e,t)}),Js,Ni,eo,to,ro,io,Ue,qd,Vd,wt=q(()=>{ie(),se(),Se(),ue(),Js=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ni=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),eo=(e,t)=>R.sortBasedOnPerm(e,Ni(e.length,t)),to=(e,t,r,n)=>{let a=`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let i=0;i<t;++i)a+=`a[${e[i]}]=i[${i}];`;return a+="return a;}"},ro=(e,t)=>{let r=[],n=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&n.push(t[a]);return{newShape:r,newPerm:n}},io=(e,t)=>{let r=0;for(let n=0;n<e.length;++n)if(t[e[n]]!==1){if(e[n]<r)return!1;r=e[n]}return!0},Ue=(e,t)=>{let r=e.dataType,n=e.dims.length,a=Ni(n,t),i=eo(e.dims,a),s=e.dims,u=i,l=n<2||io(a,e.dims),d;if(l)return d=y=>{let _=D("input",r,s,4),x=Z("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables(_,x)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:d};let{newShape:c,newPerm:f}=ro(e.dims,a),h=R.areEqual(f,[2,3,1]),m=R.areEqual(f,[3,1,2]);if(c.length===2||h||m){s=h?[c[0],c[1]*c[2]]:m?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let y=16;return d=_=>{let x=D("a",r,s.length),$=Z("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${y+1}>, ${y}>;
  ${_.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:_},...J(s,u)]}},getShaderSource:d}}return d=y=>{let _=D("a",r,s.length),x=Z("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(_,x)}

  ${to(a,n,_,x)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=R.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...J(s,u)]}},getShaderSource:d}},qd=(e,t)=>{Js(e.inputs,t.perm),e.compute(Ue(e.inputs[0],t.perm))},Vd=e=>he({perm:e.perm})}),no,ao,so,oo,uo,lo,po,co,fo,ho,Ge,Gd,Fd,Hd,jd,Kd,Zd,Qd,Xd,Yd,Jd,ig=q(()=>{ie(),se(),ue(),Kn(),wt(),no={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},ao={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},so={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},oo={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},uo=(e,t)=>{let r=[];for(let n=t-e;n<t;++n)r.push(n);return r},lo=(e,t)=>{let r=[],n=e.length;for(let i=0;i<n;i++)t.indexOf(i)===-1&&r.push(e[i]);let a=t.map(i=>e[i]);return[r,a]},po=(e,t)=>{let r=e.length+t.length,n=[],a=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?n.push(e[a++]):n.push(1);return n},co=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},fo=(e,t)=>{let r=[];if(!co(e,t)){for(let n=0;n<t;++n)e.indexOf(n)===-1&&r.push(n);e.forEach(n=>r.push(n))}return r},ho=(e,t,r,n,a,i,s)=>{let u=r[0].dims,l=R.size(i),d=R.size(s),c=D("_A",r[0].dataType,u),f=Z("output",a,i),h=64;l===1&&(h=256);let m=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,y=_=>`
        ${_.registerUniform("reduceSize","u32").declareVariables(c,f)}
        ${m}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${so[n]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${no[n]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${ao[n]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${n==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${oo[n]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Ge=(e,t,r,n)=>{let a=e.inputs.length===1?r:vn(e.inputs,r),i=a.axes;i.length===0&&!a.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((m,y)=>y));let s=R.normalizeAxes(i,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=fo(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Ue(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=uo(u.length,l.dims.length));let[c,f]=lo(l.dims,u),h=c;a.keepDims&&(h=po(c,s)),e.compute(ho(t,a.cacheKey,[l],n,e.inputs[0].dataType,h,f),{inputs:[l]})},Gd=(e,t)=>{Ge(e,"ReduceMeanShared",t,"mean")},Fd=(e,t)=>{Ge(e,"ReduceL1Shared",t,"l1")},Hd=(e,t)=>{Ge(e,"ReduceL2Shared",t,"l2")},jd=(e,t)=>{Ge(e,"ReduceLogSumExpShared",t,"logSumExp")},Kd=(e,t)=>{Ge(e,"ReduceMaxShared",t,"max")},Zd=(e,t)=>{Ge(e,"ReduceMinShared",t,"min")},Qd=(e,t)=>{Ge(e,"ReduceProdShared",t,"prod")},Xd=(e,t)=>{Ge(e,"ReduceSumShared",t,"sum")},Yd=(e,t)=>{Ge(e,"ReduceSumSquareShared",t,"sumSquare")},Jd=(e,t)=>{Ge(e,"ReduceLogSumShared",t,"logSum")}}),Fe,mo,Gr,vn,He,go,yo,_o,bo,wo,$o,vo,xo,ko,So,je,ep,tp,rp,ip,np,ap,sp,op,up,lp,Kn=q(()=>{ie(),se(),Se(),ue(),ig(),Fe=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},mo=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Gr=(e,t,r,n,a,i,s=!1,u=!1)=>{let l=[],d=r[0].dims,c=d.length,f=R.normalizeAxes(a,c),h=!u&&f.length===0;d.forEach((_,x)=>{h||f.indexOf(x)>=0?s&&l.push(1):l.push(_)});let m=l.length,y=R.size(l);return{name:e,shaderCache:t,getShaderSource:_=>{let x=[],$=D("_A",r[0].dataType,c),w=Z("output",i,m),S=n($,w,f),k=S[2];for(let T=0,O=0;T<c;T++)h||f.indexOf(T)>=0?(s&&O++,k=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${S[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${$.indicesSet("input_indices",T,`j${T}`)}
                  ${k}
                }`):(x.push(`${$.indicesSet("input_indices",T,w.indicesGet("output_indices",O))};`),O++);return`

        ${_.registerUniform("output_size","u32").declareVariables($,w)}

        ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${k}
          ${S[3]}
          ${S.length===4?w.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:i}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...J(d,l)]})}},vn=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),he({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},He=(e,t,r,n)=>{let a=e.inputs,i=a.length===1?r:vn(a,r);e.compute(Gr(t,{hint:i.cacheKey,inputDependencies:["rank"]},[a[0]],i.noopWithEmptyAxes&&i.axes.length===0?mo:n,i.axes,a[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},go=(e,t)=>{Fe(e.inputs),He(e,"ReduceLogSum",t,(r,n)=>[`var value = ${n.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},yo=(e,t)=>{Fe(e.inputs),He(e,"ReduceL1",t,(r,n)=>[`var value = ${n.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},_o=(e,t)=>{Fe(e.inputs),He(e,"ReduceL2",t,(r,n)=>[`var t = ${n.type.value}(0); var value = ${n.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},bo=(e,t)=>{Fe(e.inputs),He(e,"ReduceLogSumExp",t,(r,n)=>[`var value = ${n.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},wo=(e,t)=>{Fe(e.inputs),He(e,"ReduceMax",t,(r,n,a)=>{let i=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&i.push(r.indicesSet("input_indices",s,0));return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},$o=(e,t)=>{Fe(e.inputs),He(e,"ReduceMean",t,(r,n,a)=>{let i=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(i*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${n.type.value}(sum / ${i});`]})},vo=(e,t)=>{Fe(e.inputs),He(e,"ReduceMin",t,(r,n,a)=>{let i=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&i.push(`input_indices[${s}] = 0;`);return[`${i.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},xo=(e,t)=>{Fe(e.inputs),He(e,"ReduceProd",t,(r,n)=>[`var value = ${n.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},ko=(e,t)=>{Fe(e.inputs),He(e,"ReduceSum",t,(r,n)=>[`var value = ${n.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},So=(e,t)=>{Fe(e.inputs),He(e,"ReduceSumSquare",t,(r,n)=>[`var t = ${n.type.value}(0); var value = ${n.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},je=(e,t,r)=>{if(t.length===0)return r;let n=1,a=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?n*=e[i]:a*=e[i];return a<32&&n>1024},ep=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?$o(e,t):Gd(e,t)},tp=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yo(e,t):Fd(e,t)},rp=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_o(e,t):Hd(e,t)},ip=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bo(e,t):jd(e,t)},np=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wo(e,t):Kd(e,t)},ap=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vo(e,t):Zd(e,t)},sp=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?xo(e,t):Qd(e,t)},op=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ko(e,t):Xd(e,t)},up=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?So(e,t):Yd(e,t)},lp=(e,t)=>{je(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?go(e,t):Jd(e,t)}}),Pi,dp,pp,xn,ng=q(()=>{ie(),Se(),Kn(),Pi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},dp=(e,t)=>{Pi(e.inputs);let r=(n,a,i)=>{let s=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Gr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},pp=(e,t)=>{Pi(e.inputs);let r=(n,a,i)=>{let s=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Gr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},xn=e=>he(e)}),To,zr,Io,Co,Eo,cr,zo,cp,Zn=q(()=>{ie(),se(),Hn(),ue(),To=(e,t)=>{let r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(n.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(n.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==n.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=a.dims[0]/3,h=f,m=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],m=t.qkvHiddenSizes[2]}let y=d;if(f!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==f+h+m)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let _=0;if(s){if(h!==m)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(_=s.dims[3])}let x=y+_,$=-1,w=0;if(i)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:_,kvSequenceLength:y,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:c,hiddenSize:f,vHiddenSize:m,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(m/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},zr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Io=(e,t,r,n,a,i,s,u)=>{let l=ke(s?1:i),d=64,c=i/l;c<d&&(d=32);let f=Math.ceil(i/l/d),h=[{type:12,data:t},{type:12,data:r},{type:12,data:n},{type:12,data:a},{type:12,data:c},{type:12,data:f}],m=Ie(e.dataType,l),y=Oe(1,l),_=["type"];s&&_.push("type"),u&&_.push("type");let x=$=>{let w=Z("x",e.dataType,e.dims,l),S=[w],k=s?D("seq_lens",s.dataType,s.dims):void 0;k&&S.push(k);let T=u?D("total_sequence_length_input",u.dataType,u.dims):void 0;T&&S.push(T);let O=Oe(e.dataType),I=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${$.registerUniforms(I).declareVariables(...S)}
  ${$.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${zr(k,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${O}(1.0) / ${O}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${O}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${m};${l}`,inputDependencies:_},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:h})}},Co=(e,t,r,n,a,i,s,u,l)=>{let d=s+i.kvSequenceLength,c=[i.batchSize,i.numHeads,i.sequenceLength,d],f=e>1&&n,h=i.kvNumHeads?i.kvNumHeads:i.numHeads,m=f?[i.batchSize,h,d,i.headSize]:void 0,y=i.nReps?i.nReps:1,_=i.scale===0?1/Math.sqrt(i.headSize):i.scale,x=ke(i.headSize),$=i.headSize/x,w=12,S={x:Math.ceil(d/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},k=[{type:12,data:i.sequenceLength},{type:12,data:$},{type:12,data:d},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:_},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:y}],T=f&&n&&R.size(n.dims)>0,O=["type","type"];T&&O.push("type"),a&&O.push("type"),u&&O.push("type"),l&&O.push("type");let I=[{dims:c,dataType:t.dataType,gpuDataType:0}];f&&I.push({dims:m,dataType:t.dataType,gpuDataType:0});let z=A=>{let M=D("q",t.dataType,t.dims,x),j=D("key",r.dataType,r.dims,x),V=[M,j];if(T){let te=D("past_key",n.dataType,n.dims,x);V.push(te)}a&&V.push(D("attention_bias",a.dataType,a.dims));let F=u?D("seq_lens",u.dataType,u.dims):void 0;F&&V.push(F);let ee=l?D("total_sequence_length_input",l.dataType,l.dims):void 0;ee&&V.push(ee);let ne=Z("output",t.dataType,c),H=[ne];f&&H.push(Z("present_key",t.dataType,m,x));let ae=Oe(1,x),K=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${M.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${M.type.storage}, ${w*w}>;
  ${A.registerUniforms(K).declareVariables(...V,...H)}
  ${A.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${zr(F,ee,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${ae}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${ae}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${ne.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${a!==void 0};${n!==void 0};${e}`,inputDependencies:O},getRunData:()=>({outputs:I,dispatchGroup:S,programUniforms:k}),getShaderSource:z}},Eo=(e,t,r,n,a,i,s=void 0,u=void 0)=>{let l=i+a.kvSequenceLength,d=a.nReps?a.nReps:1,c=a.vHiddenSize*d,f=e>1&&n,h=a.kvNumHeads?a.kvNumHeads:a.numHeads,m=f?[a.batchSize,h,l,a.headSize]:void 0,y=[a.batchSize,a.sequenceLength,c],_=12,x={x:Math.ceil(a.vHeadSize/_),y:Math.ceil(a.sequenceLength/_),z:a.batchSize*a.numHeads},$=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:c},{type:12,data:i},{type:12,data:a.kvSequenceLength},{type:12,data:d}],w=f&&n&&R.size(n.dims)>0,S=["type","type"];w&&S.push("type"),s&&S.push("type"),u&&S.push("type");let k=[{dims:y,dataType:t.dataType,gpuDataType:0}];f&&k.push({dims:m,dataType:t.dataType,gpuDataType:0});let T=O=>{let I=D("probs",t.dataType,t.dims),z=D("v",r.dataType,r.dims),A=[I,z];w&&A.push(D("past_value",n.dataType,n.dims));let M=s?D("seq_lens",s.dataType,s.dims):void 0;s&&A.push(M);let j=u?D("total_sequence_length_input",u.dataType,u.dims):void 0;u&&A.push(j);let V=[Z("output",t.dataType,y)];f&&V.push(Z("present_value",t.dataType,m));let F=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${I.type.value}, ${_*_}>;
  var<workgroup> tileV: array<${I.type.value}, ${_*_}>;
  ${O.registerUniforms(F).declareVariables(...A,...V)}
  ${O.mainStart([_,_,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${zr(M,j,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${I.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${n!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:k,dispatchGroup:x,programUniforms:$}),getShaderSource:T}},cr=(e,t,r,n,a,i,s,u,l,d,c=void 0,f=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),m=h>1?d.pastSequenceLength:0,y=m+d.kvSequenceLength,_=l&&R.size(l.dims)>0?l:void 0,x=[t,r];h>1&&s&&R.size(s.dims)>0&&x.push(s),_&&x.push(_),c&&x.push(c),f&&x.push(f);let $=e.compute(Co(h,t,r,s,_,d,m,c,f),{inputs:x,outputs:h>1?[-1,1]:[-1]})[0];e.compute(Io($,d.batchSize,d.numHeads,m,d.sequenceLength,y,c,f),{inputs:c&&f?[$,c,f]:[$],outputs:[]});let w=[$,n];h>1&&u&&R.size(u.dims)>0&&w.push(u),c&&w.push(c),f&&w.push(f),e.compute(Eo(h,$,n,u,d,m,c,f),{inputs:w,outputs:h>1?[0,2]:[0]})},zo=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],n=t.sequenceLength,a=t.inputHiddenSize,i=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:n},{type:12,data:a},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=f=>{let h=Z("output_q",l[0].dataType,r),m=Z("output_k",l[0].dataType,r),y=Z("output_v",l[0].dataType,r),_=D("input",l[0].dataType,l[0].dims),x=D("weight",l[1].dataType,l[1].dims),$=D("bias",l[2].dataType,l[2].dims),w=_.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${f.registerUniforms(S).declareVariables(_,x,$,h,m,y)}
  ${f.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},cp=(e,t)=>{let r=To(e.inputs,t),[n,a,i]=zo(e,r);return cr(e,n,a,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Oo,Ao,Ro,fp,ag=q(()=>{Ye(),ie(),se(),Se(),ue(),Oo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(n,a,i)=>{let s=a.length;if(s!==n.length)throw new Error(`${i}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==n[l])throw new Error(`${i}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let n=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,n,"Invalid input scale"),r(e[2].dims,n,"Invalid input B"),r(e[3].dims,n,"Invalid input mean"),r(e[4].dims,n,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ao=(e,t)=>{let{epsilon:r,spatial:n,format:a}=t,i=e[0].dims,s=n?ke(i[i.length-1]):1,u=a==="NHWC"&&i.length>1?s:1,l=R.size(i)/s,d=n,c=d?i.length:i,f=D("x",e[0].dataType,e[0].dims,s),h=D("scale",e[1].dataType,e[1].dims,u),m=D("bias",e[2].dataType,e[2].dims,u),y=D("inputMean",e[3].dataType,e[3].dims,u),_=D("inputVar",e[4].dataType,e[4].dims,u),x=Z("y",e[0].dataType,c,s),$=()=>{let S="";if(n)S=`let cOffset = ${i.length===1?"0u":a==="NHWC"?`outputIndices[${i.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")S=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let k=1;k<h.rank;k++)S+=`cIndices[${k}] = outputIndices[${k}];`;S+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return S},w=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(f,h,m,y,_,x)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${$()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${m.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${n}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...J(i)]:[{type:12,data:l}]})}},Ro=e=>he(e),fp=(e,t)=>{let{inputs:r,outputCount:n}=e,a=Ro({...t,outputCount:n});if($e.webgpu.validateInputContent&&Oo(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ao(r,a))}}),Bo,Mo,hp,sg=q(()=>{se(),ue(),Bo=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Mo=e=>{let t=e[0].dims,r=e[0].dims[2],n=R.size(t)/4,a=e[0].dataType,i=D("input",a,t,4),s=D("bias",a,[r],4),u=D("residual",a,t,4),l=Z("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(i,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},hp=e=>{Bo(e.inputs),e.compute(Mo(e.inputs))}}),Do,fe,mp,gp,yp,_p,bp,wp,$p,vp,xp,No,kp,Sp,Tp,Ip,ur,Cp,Pr,Ep,zp,Op,Ap,Rp,Bp,Mp,Dp,Np,Pp,Up,Wp,Lp,qp,Vp,Gp,Ui,Fp,kn,Sn,Hp,jp,Kp,Po,Uo,Zp,Qn=q(()=>{ie(),se(),Se(),ue(),Do=(e,t,r,n,a,i,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let d=D("inputData",r,[u],4),c=Z("outputData",n,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(d,c)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},fe=(e,t,r,n,a,i=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:d=>Do(d,R.size(e.dims),e.dataType,i,r,n,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(R.size(d[0].dims)/64/4)},programUniforms:l})}},mp=e=>{e.compute(fe(e.inputs[0],"Abs","abs"))},gp=e=>{e.compute(fe(e.inputs[0],"Acos","acos"))},yp=e=>{e.compute(fe(e.inputs[0],"Acosh","acosh"))},_p=e=>{e.compute(fe(e.inputs[0],"Asin","asin"))},bp=e=>{e.compute(fe(e.inputs[0],"Asinh","asinh"))},wp=e=>{e.compute(fe(e.inputs[0],"Atan","atan"))},$p=e=>{e.compute(fe(e.inputs[0],"Atanh","atanh"))},vp=e=>he(e),xp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(fe(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},No=e=>{let t,r,n=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=n?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=n?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return he({min:t,max:r})},kp=(e,t)=>{let r=t||No(e.inputs),n=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${n}>(uniforms.min), vec4<${n}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:n},{name:"max",type:n}]),{inputs:[0]})},Sp=e=>{e.compute(fe(e.inputs[0],"Ceil","ceil"))},Tp=e=>{e.compute(fe(e.inputs[0],"Cos","cos"))},Ip=e=>{e.compute(fe(e.inputs[0],"Cosh","cosh"))},ur=e=>he(e),Cp=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Elu",n=>`elu_vf32(${n})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Pr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Ep=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Pr(t)))},zp=e=>{e.compute(fe(e.inputs[0],"Exp","exp"))},Op=e=>{e.compute(fe(e.inputs[0],"Floor","floor"))},Ap=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Pr(t)))},Rp=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"LeakyRelu",n=>`select(leaky_relu_alpha_ * ${n}, ${n}, ${n} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Bp=e=>{e.compute(fe(e.inputs[0],"Not",t=>`!${t}`))},Mp=e=>{e.compute(fe(e.inputs[0],"Neg",t=>`-${t}`))},Dp=e=>{e.compute(fe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Np=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Pp=e=>{e.compute(fe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Up=e=>he(e),Wp=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"HardSigmoid",n=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${n} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Lp=e=>{e.compute(fe(e.inputs[0],"Sin","sin"))},qp=e=>{e.compute(fe(e.inputs[0],"Sinh","sinh"))},Vp=e=>{e.compute(fe(e.inputs[0],"Sqrt","sqrt"))},Gp=e=>{e.compute(fe(e.inputs[0],"Tan","tan"))},Ui=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Fp=e=>{e.compute(fe(e.inputs[0],"Tanh",Ui))},kn=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ui("v")};
}
`,Sn=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Hp=e=>{let t=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"FastGelu",Sn,kn(t),void 0,e.inputs[0].dataType))},jp=(e,t)=>{let r=Oe(e.inputs[0].dataType);return e.compute(fe(e.inputs[0],"ThresholdedRelu",n=>`select(vec4<${r}>(0.0), ${n}, ${n} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Kp=e=>{e.compute(fe(e.inputs[0],"Log","log"))},Po=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Uo=e=>`quick_gelu_impl(${e})`,Zp=(e,t)=>{let r=Oe(e.inputs[0].dataType);e.compute(fe(e.inputs[0],"QuickGelu",Uo,Po(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Wo,Lo,Qp,og=q(()=>{se(),ue(),Qn(),Wo=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Lo=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=D("input",e[0].dataType,e[0].dims,4),n=D("bias",e[0].dataType,[e[0].dims[2]],4),a=Z("output",e[0].dataType,t,4),i=R.size(t)/4,s=Ie(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,n,a)}

  ${Pr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Qp=e=>{Wo(e.inputs),e.compute(Lo(e.inputs))}}),qo,Vo,Ke,Xp,Yp,Jp,ec,tc,rc,ic,nc,ac,sc,ug=q(()=>{ie(),se(),ue(),qo=(e,t,r,n,a,i,s,u,l,d,c,f)=>{let h,m;typeof u=="string"?h=m=(w,S)=>`${u}((${w}),(${S}))`:typeof u=="function"?h=m=u:(h=u.scalar,m=u.vector);let y=Z("outputData",c,n.length,4),_=D("aData",l,t.length,4),x=D("bData",d,r.length,4),$;if(a)if(i){let w=R.size(t)===1,S=R.size(r)===1,k=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;w||S?$=y.setByOffset("global_idx",m(w?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"),S?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",m(s||k?_.getByOffset("offsetA / 4u"):`${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=y.setByOffset("global_idx",m(_.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(S,k,T="")=>{let O=`aData[indexA${k}][componentA${k}]`,I=`bData[indexB${k}][componentB${k}]`;return`
            let outputIndices${k} = ${y.offsetToIndices(`global_idx * 4u + ${k}u`)};
            let offsetA${k} = ${_.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let offsetB${k} = ${x.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let indexA${k} = offsetA${k} / 4u;
            let indexB${k} = offsetB${k} / 4u;
            let componentA${k} = offsetA${k} % 4u;
            let componentB${k} = offsetB${k} % 4u;
            ${S}[${k}] = ${T}(${h(O,I)});
          `};c===9?$=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(_,x,y)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},Vo=(e,t,r,n,a,i,s=r.dataType)=>{let u=r.dims.map(_=>Number(_)??1),l=n.dims.map(_=>Number(_)??1),d=!R.areEqual(u,l),c=u,f=R.size(u),h=!1,m=!1,y=[d];if(d){let _=Vt.calcShape(u,l,!1);if(!_)throw new Error("Can't perform binary op on the given tensors");c=_.slice(),f=R.size(c);let x=R.size(u)===1,$=R.size(l)===1,w=u.length>0&&u[u.length-1]%4===0,S=l.length>0&&l[l.length-1]%4===0;y.push(x),y.push($),y.push(w),y.push(S);let k=1;for(let T=1;T<c.length;T++){let O=u[u.length-T],I=l[l.length-T];if(O===I)k*=O;else break}k%4===0?(m=!0,h=!0):(x||$||w||S)&&(h=!0)}else h=!0;return y.push(h),{name:e,shaderCache:{hint:t+y.map(_=>_.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:_=>qo(_,u,l,c,h,d,m,a,r.dataType,n.dataType,s,i),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(c)/4)},...J(u,l,c)]})}},Ke=(e,t,r,n,a,i)=>{e.compute(Vo(t,a??"",e.inputs[0],e.inputs[1],r,n,i))},Xp=e=>{Ke(e,"Add",(t,r)=>`${t}+${r}`)},Yp=e=>{Ke(e,"Div",(t,r)=>`${t}/${r}`)},Jp=e=>{Ke(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},ec=e=>{Ke(e,"Mul",(t,r)=>`${t}*${r}`)},tc=e=>{let t=D("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Ke(e,"Pow",{scalar:(r,n)=>`pow_custom(${r},${n})`,vector:(r,n)=>`pow_vector_custom(${r},${n})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},rc=e=>{Ke(e,"Sub",(t,r)=>`${t}-${r}`)},ic=e=>{Ke(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},nc=e=>{Ke(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},ac=e=>{Ke(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},sc=e=>{Ke(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Go,Fo,Ho,jo,oc,uc,lg=q(()=>{ie(),se(),Se(),ue(),Go=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,n=e[r],a=n.dataType,i=n.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==i)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==n.dims[d])throw new Error("non concat dimensions must match")})}})},Fo=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Ho=(e,t)=>{let r=e.length,n=[];for(let a=0;a<r;++a){let i=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?n.push(i):a===0?n.push(`if (inputIndex == ${a}u) { ${i} }`):a===r-1?n.push(`else { ${i} }`):n.push(`else if (inputIndex == ${a}) { ${i} }`)}return n.join(`
`)},jo=(e,t,r,n)=>{let a=R.size(r),i=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],c=[{type:12,data:a}];for(let _=0;_<e.length;++_)u+=e[_].dims[t],i[_]=u,d.push(e[_].dims.length),s[_]=D(`input${_}`,n,d[_]),l.push("rank"),c.push({type:12,data:i[_]});for(let _=0;_<e.length;++_)c.push(...J(e[_].dims));c.push(...J(r));let f=Z("output",n,r.length),h=f.indicesGet("indices",t),m=Array.from(Array(i.length).keys()).map(_=>`uniforms.sizeInConcatAxis${_}`).join(","),y=_=>`

  ${(()=>{_.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)_.registerUniform(`sizeInConcatAxis${x}`,"u32");return _.declareVariables(...s,f)})()}

  ${Fo(i.length,m)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${m});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Ho(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:n}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:y}},oc=(e,t)=>{let r=e.inputs,n=r[0].dims,a=R.normalizeAxis(t.axis,n.length);Go(r,a);let i=n.slice();i[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>R.size(u.dims)>0);e.compute(jo(s,a,i,r[0].dataType),{inputs:s})},uc=e=>he({axis:e.axis})}),Rt,Bt,Mt,Xn,Nt=q(()=>{ie(),se(),Rt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Bt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Mt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Xn=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,n]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:n}}else if(t==="Clip"){let[r,n]=(e==null?void 0:e.activation_params)||[Bd,Md];return{activation:t,clipMax:n,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ee,lc,Yn=q(()=>{Ee=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},lc=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),dc,dg=q(()=>{dc=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),dr,Jn,ea=q(()=>{ie(),se(),ue(),Nt(),dr=(e,t,r,n,a)=>{let i=n-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${X(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,X(a,u+i,n))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Jn=(e,t,r,n,a=!1,i)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],c=s[s.length-1],f=ke(d),h=ke(c),m=ke(l),y=R.size(r)/f/m,_=e.length>2,x=n?n.slice(0,-2):r.slice(0,-2),$=[R.size(x),l,d],w=[{type:12,data:y},{type:12,data:l},{type:12,data:d},{type:12,data:c}];Bt(t,w),w.push(...J(x,s,u)),_&&w.push(...J(e[2].dims)),w.push(...J($));let S=k=>{let T=jn("batch_dims",e[0].dataType,x.length),O=D("a",e[0].dataType,s.length,h),I=D("b",e[1].dataType,u.length,f),z=Z("output",e[0].dataType,$.length,f),A=Ie(z.type.tensor),M=Rt(t,z.type.value,A),j=[O,I],V="";if(_){let ne=a?f:1;j.push(D("bias",e[2].dataType,e[2].dims.length,ne)),V=`${a?`value += bias[col / ${ne}];`:`value += ${z.type.value}(bias[row + i]);`}`}let F=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Mt(t,F);let ee=()=>{let ne=`var a_data: ${O.type.value};`;for(let H=0;H<h;H++)ne+=`
              let b_data${H} = b[(b_offset + (k + ${H}) * uniforms.N + col) / ${f}];`;for(let H=0;H<m;H++){ne+=`a_data = a[(a_offset + (row + ${H}) * uniforms.K + k) / ${h}];`;for(let ae=0;ae<h;ae++)ne+=`
            values[${H}] = fma(${I.type.value}(a_data${h===1?"":`[${ae}]`}), b_data${ae}, values[${H}]);
`}return ne};return`
  ${k.registerUniforms(F).registerInternalVariables(T).declareVariables(...j,z)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${m};
    let row = (index1 % stride1) * ${m};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${O.type.indices};
    ${dr("a_indices",O,O.rank-2,T.rank,"batch_indices")}
    ${O.indicesSet("a_indices",O.rank-2,0)}
    ${O.indicesSet("a_indices",O.rank-1,0)}
    let a_offset = ${O.indicesToOffset("a_indices")};

    var b_indices: ${I.type.indices};
    ${dr("b_indices",I,I.rank-2,T.rank,"batch_indices")}
    ${I.indicesSet("b_indices",I.rank-2,0)}
    ${I.indicesSet("b_indices",I.rank-1,0)}
    let b_offset = ${I.indicesToOffset("b_indices")};
    var values: array<${z.type.value}, ${m}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${ee()}
    }
    for (var i = 0u; i < ${m}u; i++) {
      var value = values[i];
      ${V}
      ${M}
      let cur_indices = ${z.type.indices}(batch, row + i, col);
      let offset = ${z.indicesToOffset("cur_indices")};
      ${z.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${h};${m};${a}`,inputDependencies:_?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:w}),getShaderSource:S}}}),Ko,Zo,Tn,Wi,Qo,In,Xo,Fr,ta=q(()=>{ie(),se(),ue(),Nt(),ea(),Yn(),Ko=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Zo=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Tn=(e,t,r="f32",n,a=!1,i=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=a?l:i,f=a?i:l,h=c/t[0],m=i/t[1];if(!((a&&h===4&&e[1]===4||!a&&(h===3||h===4))&&c%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${c/h}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${i}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${m};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Ko(a,n)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${m}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${n?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Zo(a,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Wi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Qo=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",In=(e,t,r="f32",n,a=!1,i=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],f=a?d:i,h=a?i:d;if(!(h%t[1]===0&&f%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let m=h/t[1],y=f/t[0],_=i/t[1],x=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${Wi(a,n)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${n?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${m};
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${m}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Wi(a,n)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${n?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Qo(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${i}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Xo=(e,t,r,n,a=!1)=>{let[i,s,u,l]=n,d=Ie(n[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Ee(e,d)} {
      var value = ${Ee(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${dr("aIndices",s,s.rank-2,i.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Ee(e,d)} {
      var value = ${Ee(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${dr("bIndices",u,u.rank-2,i.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ee(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Ee(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Fr=(e,t,r,n,a=!1,i)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),c=n?n.slice(0,-2):r.slice(0,-2),f=R.size(c),h=s[s.length-2],m=s[s.length-1],y=u[u.length-1],_=m%4===0&&y%4===0,x=h<=8?[4,1,1]:[4,4,1],$=[8,8,1],w=[Math.ceil(y/$[0]/x[0]),Math.ceil(h/$[1]/x[1]),Math.ceil(f/$[2]/x[2])],S=_?4:1,k=[...l,h,m/S],T=k.length,O=[...d,m,y/S],I=O.length,z=[f,h,y/S],A=[{type:6,data:h},{type:6,data:y},{type:6,data:m}];Bt(t,A),A.push(...J(c,k,O));let M=["rank","rank"],j=e.length>2;j&&(A.push(...J(e[2].dims)),M.push("rank")),A.push(...J(z));let V=F=>{let ee=c.length,ne=jn("batchDims",e[0].dataType,ee,1),H=Ie(e[0].dataType),ae=D("a",e[0].dataType,T,S),K=D("b",e[1].dataType,I,S),te=Z("result",e[0].dataType,z.length,S),be=[ae,K];if(j){let me=a?S:1;be.push(D("bias",e[2].dataType,e[2].dims.length,me))}let P=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Mt(t,P);let E=Ie(te.type.tensor),U=Rt(t,te.type.value,E),Q=Xo(S,j,U,[ne,ae,K,te],a);return`
  ${F.registerUniforms(P).registerInternalVariables(ne).declareVariables(...be,te)}
  ${Q}
  ${_?Tn(x,$,H,ne):In(x,$,H,ne)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${_};${a}`,inputDependencies:M},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:A}),getShaderSource:V}}}),Yo,pc,pg=q(()=>{ie(),lt(),ue(),Nt(),Yn(),dg(),ta(),Yo=(e,t,r,n,a=!1,i,s=4,u=4,l=4,d="f32")=>{let c=A=>{switch(A){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${A} is not supported.`)}},f=A=>{switch(A){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${A} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,m=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",_=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Ee(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${_}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,S=e?t&&n?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Ee(s,d)}(0.0);`:n&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Ee(s,d)}(0.0);`,k=e?n&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${Ee(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${Ee(u,d)}(0.0);`,T=Ee(l,d),O=Ee(e?s:u,d),I=Ee(e?u:s,d),z=Rt(i,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${O} {
      ${e?S:k}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${I} {
      ${e?k:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${m}
      ${lc(a)}
      ${z}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},pc=(e,t,r,n,a,i,s,u,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],f=r[0],h=d?r[2]:r[3],m=d?r[1]:r[2],y=d?r[3]:r[1],_=d&&(c%4===0||c%3===0)&&y%4===0,x=d?y:h*m,$=d?h*m:y,w=[8,8,1],S=n<=8?[4,1,1]:[4,4,1],k=[Math.ceil(x/w[0]/S[0]),Math.ceil($/w[1]/S[1]),Math.ceil(f/w[2]/S[2])];de("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${k}`);let T=_?d&&c%4!==0?3:4:1,O=w[1]*S[1],I=w[0]*S[0],z=Math.max(w[0]*T,w[1]),A=n%O===0,M=a%I===0,j=i%z===0,V=_?[T,4,4]:[1,1,1],F=[{type:6,data:n},{type:6,data:a},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Bt(t,F),F.push(...J(e[0].dims,e[1].dims));let ee=["rank","rank"];s&&(F.push(...J(e[2].dims)),ee.push("rank")),F.push(...J(r));let ne=H=>{let ae=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Mt(t,ae);let K=_?4:1,te=Ie(e[0].dataType),be=`
      fn setOutputAtIndex(flatIndex : i32, value : ${_?`vec4<${te}>`:te}) {
        result[flatIndex] = ${_?`vec4<${te}>`:te}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_?`vec4<${te}>`:te}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_?"/ 4":""}, value);
      }`,P=D("x",e[0].dataType,e[0].dims.length,T===3?1:T),E=D("w",e[1].dataType,e[1].dims.length,K),U=[P,E],Q=Z("result",e[0].dataType,r.length,K);if(s){let me=D("bias",e[2].dataType,e[2].dims.length,K);U.push(me),be+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_?`vec4<${te}>`:te} {
          return bias[coords.${d?"w":"y"}${_?"/ 4":""}];
        }`}return`
        ${dc("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${H.registerUniforms(ae).declareVariables(...U,Q)}
        ${be}
        ${Yo(d,A,M,j,s,t,V[0],V[1],V[2],te)}
        ${_?Tn(S,w,te,void 0,!d,z):In(S,w,te,void 0,!d,z,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${_};${A};${M};${j};${O};${I};${z}`,inputDependencies:ee},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:k[0],y:k[1],z:k[2]},programUniforms:F}),getShaderSource:ne}}}),Jo,Li,er,eu,qi,tu,cc,fc,cg=q(()=>{ie(),lt(),se(),ue(),Nt(),Yn(),Jo=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Li=e=>typeof e=="number"?[e,e,e]:e,er=(e,t)=>t<=1?e:e+(e-1)*(t-1),eu=(e,t,r,n=1)=>{let a=er(t,n);return Math.floor((e[0]*(r-1)-r+a)/2)},qi=(e,t,r,n,a)=>{a==null&&(a=eu(e,t[0],n[0]));let i=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(i[s]=Math.trunc((e[s]-t[s]+2*a)/n[s]+1));return i},tu=(e,t,r,n,a,i,s,u,l,d)=>{let c,f,h,m;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=qi([t,r,n,1],[u,l,d],1,[a,i,s],e);f=y[0],h=y[1],m=y[2]}else if(Array.isArray(e)){if(!e.every((_,x,$)=>_===$[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=qi([t,r,n,1],[u,l,d],1,[a,i,s],e[0]);f=y[0],h=y[1],m=y[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/a),h=Math.ceil(r/i),m=Math.ceil(n/s);let y=(f-1)*a+u-t,_=(h-1)*i+l-r,x=(m-1)*s+d-n,$=Math.floor(y/2),w=y-$,S=Math.floor(_/2),k=_-S,T=Math.floor(x/2),O=x-T;c={top:S,bottom:k,left:T,right:O,front:$,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:f,outHeight:h,outWidth:m}},cc=(e,t,r,n,a,i=!1,s="channelsLast")=>{let u,l,d,c,f;if(s==="channelsLast")[u,l,d,c,f]=e;else if(s==="channelsFirst")[u,f,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,m,y,_]=t,[x,$,w]=Li(r),[S,k,T]=Li(n),O=er(m,S),I=er(y,k),z=er(_,T),{padInfo:A,outDepth:M,outHeight:j,outWidth:V}=tu(a,l,d,c,x,$,w,O,I,z),F=i?h*f:h,ee=[0,0,0,0,0];return s==="channelsFirst"?ee=[u,F,M,j,V]:s==="channelsLast"&&(ee=[u,M,j,V,F]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:f,outDepth:M,outHeight:j,outWidth:V,outChannels:F,padInfo:A,strideDepth:x,strideHeight:$,strideWidth:w,filterDepth:m,filterHeight:y,filterWidth:_,effectiveFilterDepth:O,effectiveFilterHeight:I,effectiveFilterWidth:z,dilationDepth:S,dilationHeight:k,dilationWidth:T,inShape:e,outShape:ee,filterShape:t}},fc=(e,t,r,n,a,i)=>{let s=i==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((x,$)=>$)},d=[Math.ceil(Jo(l.x.map(x=>r[x]))/u[0]),1,1];de("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let c=1,f=R.size(r),h=[{type:12,data:f},{type:12,data:n},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];Bt(t,h),h.push(...J(e[0].dims,e[1].dims));let m=["rank","rank"],y=e.length===3;y&&(h.push(...J(e[2].dims)),m.push("rank")),h.push(...J(r));let _=x=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:n.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Mt(t,$);let w=1,S=Ie(e[0].dataType),k=D("x",e[0].dataType,e[0].dims.length,c),T=D("W",e[1].dataType,e[1].dims.length,w),O=[k,T],I=Z("result",e[0].dataType,r.length,w),z="";if(y){let j=D("bias",e[2].dataType,e[2].dims.length,w);O.push(j),z+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${S} {
          return bias[${s?X("coords",4,5):X("coords",1,5)}];
        }`}let A=Ee(c,S),M=Rt(t,A,S);return`
            ${z}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${k.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
          ${x.registerUniforms($).declareVariables(...O,I)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${I.offsetToIndices("global_idx")};
              let batch = ${X("coords",0,k.rank)};
              let d2 = ${s?X("coords",k.rank-1,k.rank):X("coords",1,k.rank)};
              let xFRCCorner = vec3<u32>(${s?X("coords",1,k.rank):X("coords",2,k.rank)},
              ${s?X("coords",2,k.rank):X("coords",3,k.rank)},
              ${s?X("coords",3,k.rank):X("coords",4,k.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?X("uniforms.x_shape",1,k.rank):X("uniforms.x_shape",2,k.rank)};
              let xShapeZ = ${s?X("uniforms.x_shape",2,k.rank):X("uniforms.x_shape",3,k.rank)};
              let xShapeW = ${s?X("uniforms.x_shape",3,k.rank):X("uniforms.x_shape",4,k.rank)};
              let xShapeU = ${s?X("uniforms.x_shape",4,k.rank):X("uniforms.x_shape",1,k.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${y?"value = value + getBiasByOutputCoords(coords)":""};
              ${M}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${y}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:h}),getShaderSource:_}}}),hc,mc,fg=q(()=>{ie(),se(),ue(),Nt(),hc=(e,t,r,n)=>{let a=e.length>2,i=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,f=l&&c>=4?ke(d):1,h=R.size(r)/f,m=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];Bt(t,m),m.push(...J(s,[u[0],u[1],u[2],u[3]/f]));let y=a?["rank","rank","rank"]:["rank","rank"];m.push(...J([r[0],r[1],r[2],r[3]/f]));let _=x=>{let $=Z("output",e[0].dataType,r.length,f),w=Ie($.type.tensor),S=Rt(t,$.type.value,w),k=D("x",e[0].dataType,s.length),T=D("w",e[1].dataType,u.length,f),O=[k,T];a&&O.push(D("b",e[2].dataType,e[2].dims,f));let I=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Mt(t,I);let z=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${k.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${T.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${k.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(I).declareVariables(...O,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${z}
    ${i}
    ${S}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:m}),getShaderSource:_}},mc=(e,t,r,n)=>{let a=e.length>2,i=ke(r[3]),s=ke(r[2]),u=R.size(r)/i/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/i],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/i],c=[r[0],r[1],r[2],r[3]/i],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Bt(t,f),f.push(...J(l,d,c));let h=(s-1)*t.strides[1]+d[1],m=y=>{let _=Z("output",e[0].dataType,c.length,i),x=Ie(_.type.tensor),$=Rt(t,_.type.value,x),w=D("x",e[0].dataType,l.length,i),S=D("w",e[1].dataType,d.length,i),k=[w,S];a&&k.push(D("b",e[2].dataType,e[2].dims,i));let T=a?"value += b[output_channel];":"",O=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Mt(t,O),`
  ${y.registerUniforms(O).declareVariables(...k,_)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${h}>;
    var values: array<${_.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${$}
      ${_.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${i};${s};${h};${d[0]};${d[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:m}}}),ru,Or,iu,Ar,Cn,Vi,nu,au,En,hg=q(()=>{se(),pg(),cg(),ta(),fg(),Nt(),ea(),wt(),ru=(e,t,r,n,a,i)=>{let s=e[0],u=e.slice(i?1:2,i?3:4),l=u.length,d=t[0],c=t.slice(2).map((h,m)=>h+(h-1)*(r[m]-1)),f=u.map((h,m)=>h+n[m]+n[m+l]).map((h,m)=>Math.floor((h-c[m]+a[m])/a[m]));return f.splice(0,0,s),f.splice(i?3:1,0,d),f},Or=[2,3,1,0],iu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[1]*t.group;if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ar=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let n=e.pads.slice();Vr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,n,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:n}),a},Cn=e=>{let t=Xn(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,i=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:n,format:r,dilations:a,group:i,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Vi=(e,t,r,n)=>{let a=r.format==="NHWC",i=ru(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let O=[t[0]];if(a){let I=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=I),O.push(I)}else O.push(t[1]);t.length===3&&O.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(mc(O,r,i,n),{inputs:O}):e.compute(hc(O,r,i,n),{inputs:O});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],d=t[0].dims[a?3:1],c=t[1].dims[2],f=t[1].dims[3],h=i[a?1:2],m=i[a?2:3],y=i[a?3:1],_=a&&c===u&&f===l&&r.pads[0]===0&&r.pads[1]===0;if(_||c===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let O=i[0],I,z,A,M=[];if(a){let F=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=F),_){let ee=u*l*d;I=t[0].reshape([1,O,ee]),z=F.reshape([1,ee,y]),A=[1,O,y]}else I=t[0].reshape([O,u*l,d]),z=F.reshape([1,d,y]),A=[O,h*m,y];M.push(I),M.push(z)}else I=t[0].reshape([O,d,u*l]),z=t[1].reshape([1,y,d]),A=[O,y,h*m],M.push(z),M.push(I);s&&M.push(t[2]);let j=A[2],V=M[0].dims[M[0].dims.length-1];j<8&&V<8?e.compute(Jn(M,r,i,A,a,n),{inputs:M}):e.compute(Fr(M,r,i,A,a,n),{inputs:M});return}let x=!0,$=e.kernelCustomData.wT??e.compute(Ue(t[1],Or),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let w=[t[0],$];s&&w.push(t[2]);let S=a?h*m:y,k=a?y:h*m,T=c*f*d;e.compute(pc(w,r,i,S,k,T,s,x,n),{inputs:w})},nu=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Ar({...t,pads:a,strides:i,dilations:s,kernelShape:u},n);Vi(e,n,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},au=(e,t,r)=>{let n=r.format==="NHWC"?"channelsLast":"channelsFirst",a=Ar(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=cc(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,n);e.compute(fc(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],n))},En=(e,t)=>{if(iu(e.inputs,t),e.inputs[0].dims.length===3)nu(e,t);else if(e.inputs[0].dims.length===5)au(e,e.inputs,t);else{let r=Ar(t,e.inputs);Vi(e,e.inputs,r)}}}),gc,mg=q(()=>{ie(),lt(),se(),ue(),gc=(e,t,r)=>{let n=e.length>2,a=t.outputShape,i=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],c=i?ke(l):1,f=i&&d===1&&l>=4,h=f?Math.floor(l/4)*4:Math.floor(l/c)*c,m=l-h,y=i?ke(d):1,_=i?d===1?c:y:1,x=R.size(a)/y,$=[Math.ceil(x/64),1,1];de("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let w=["rank","rank"],S=[t.strides[0],t.strides[1]],k=[t.kernelShape[i?1:2],t.kernelShape[i?2:3]],T=[t.dilations[0],t.dilations[1]],O=[k[0]+(t.dilations[0]<=1?0:(t.kernelShape[i?1:2]-1)*(t.dilations[0]-1)),k[1]+(t.dilations[1]<=1?0:(t.kernelShape[i?2:3]-1)*(t.dilations[1]-1))],I=[O[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),O[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],z=[{type:12,data:x},{type:12,data:S},{type:12,data:k},{type:12,data:T},{type:12,data:O},{type:6,data:I},{type:12,data:h},{type:12,data:l},{type:12,data:d},...J(e[0].dims,e[1].dims)];n&&(z.push(...J(e[2].dims)),w.push("rank")),z.push(...J(a));let A=M=>{let j=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:S.length},{name:"filter_dims",type:"u32",length:k.length},{name:"dilations",type:"u32",length:k.length},{name:"effective_filter_dims",type:"u32",length:O.length},{name:"pads",type:"i32",length:I.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],V=Ie(e[0].dataType),F=i?1:2,ee=i?2:3,ne=i?3:1,H=D("W",e[1].dataType,e[1].dims.length,_),ae=D("Dy",e[0].dataType,e[0].dims.length,c),K=[ae,H];n&&K.push(D("bias",e[2].dataType,[a[ne]].length,y));let te=Z("result",e[0].dataType,a.length,y),be=()=>{let U="";if(f)c===4?U+=`
        let xValue = ${ae.getByOffset("x_offset")};
        let wValue = ${H.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?U+=`
          dotProd = dotProd + dot(vec4<${V}>(${ae.getByOffset("x_offset")}, ${ae.getByOffset("x_offset + 1u")}), vec4<${V}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(U+=`
          dotProd = dotProd + dot(vec4<${V}>(${ae.getByOffset("x_offset")}, ${ae.getByOffset("x_offset + 1u")}, ${ae.getByOffset("x_offset + 2u")}, ${ae.getByOffset("x_offset + 3u")}), vec4<${V}>(${H.getByOffset("w_offset")}, ${H.getByOffset("w_offset + 1u")}, ${H.getByOffset("w_offset + 2u")}, ${H.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(U+=`
                  let xValue = ${i?ae.getByOffset(`${ae.indicesToOffset(`${ae.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):ae.get("batch","inputChannel","idyR","idyC")};
        `,c===1)U+=`
          let w_offset = ${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${H.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let Q=0;Q<c;Q++)U+=`
            let wValue${Q} = ${H.getByOffset(`${H.indicesToOffset(`${H.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${Q}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${Q}] * wValue${Q};`;return U},P=()=>{if(m===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let U="";if(c===1){U+="dotProd = dotProd";for(let Q=0;Q<m;Q++)U+=`
            + ${ae.getByOffset(`x_offset + ${Q}`)} * ${H.getByOffset(`w_offset + ${Q}`)}`;U+=";"}else if(c===2){if(m!==2)throw new Error(`Invalid inputChannelsRemainder ${m}.`);U+=`
          let xValue = ${ae.getByOffset("x_offset")};
          let wValue = ${H.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return U},E=`
            let outputIndices = ${te.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${te.indicesGet("outputIndices",0)};
            let d1 = ${te.indicesGet("outputIndices",ne)};
            let r = ${te.indicesGet("outputIndices",F)};
            let c = ${te.indicesGet("outputIndices",ee)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${te.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${V}(dyRCorner) + ${V}(wR)) / ${V}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${V}(uniforms.Dy_shape[${F}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${V}(dyCCorner) + ${V}(wC)) / ${V}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${V}(uniforms.Dy_shape[${ee}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${ae.indicesToOffset(`${ae.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${H.indicesToOffset(`${H.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:c}) {
                  ${be()}
                  inputChannel = inputChannel + ${f?4:c};
                }
                ${P()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${n?` + bias[d1 / ${y}]`:""};
            ${te.setByOffset("global_idx","value")};
          `;return`
    ${M.registerUniforms(j).declareVariables(...K,te)}
      ${M.mainStart()}
      ${M.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${E}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${_}${y}${f}${m}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:z}),getShaderSource:A}}}),su,ou,uu,Gi,yc,lu,Fi,du,_c,gg=q(()=>{mg(),Nt(),wt(),su=(e,t,r,n,a,i)=>(e-1)*t+r+(n-1)*a+1-i,ou=(e,t,r,n,a)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[n]=i,r[a]=e-i):t==="SAME_LOWER"&&(r[n]=e-i,r[a]=i)},uu=(e,t,r,n,a,i,s,u,l,d)=>{let c=e.length-2,f=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let h=e[0],m=t[u?3:1]*a;for(let y=0,_=e.length-c-(u?1:0);y<c;++y,++_){let x=e[_],$=f?x*s[y]:d[y],w=su(x,s[y],i[y],t[_],r[y],$);ou(w,n,i,y,y+c),f&&d.push(s[y]*(x-1)+l[y]+(t[_]-1)*r[y]+1-i[y]-i[y+c])}d.splice(0,0,h),d.splice(u?3:1,0,m)},Gi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,h)=>f*h,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let n=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(n?3:1,0,t[1].dims[1]);let a=e.pads.slice(),i=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}let d=e.strides.slice();if(d.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}uu(u,r,l,e.autoPad,e.group,a,d,n,s,i);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:a,outputPadding:s,outputShape:i,dilations:l,strides:d}),c},yc=e=>{let t=Xn(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,i=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,f=e.outputShape;return{autoPad:n,format:r,dilations:a,group:i,kernelShape:s,outputPadding:c,outputShape:f,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},lu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[0];if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Fi=(e,t,r,n)=>{let a=e.kernelCustomData.wT??e.compute(Ue(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let i=[t[0],a];t.length===3&&i.push(t[2]),e.compute(gc(i,r,n),{inputs:i})},du=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),i=[1].concat(i),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let d=Gi({...t,pads:u,strides:s,dilations:i,kernelShape:a,outputPadding:l},n);Fi(e,n,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},_c=(e,t)=>{if(lu(e.inputs,t),e.inputs[0].dims.length===3)du(e,t);else{let r=Gi(t,e.inputs);Fi(e,e.inputs,r)}}}),pu,bc,wc,yg=q(()=>{ie(),se(),Se(),ue(),pu=(e,t,r,n)=>{let a=R.size(t),i=t.length,s=D("input",e,i),u=Z("output",e,i),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=R.normalizeAxis(l,i),c=f=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,m=X("uniforms.input_shape","uniforms.axis",i),y=n.reverse?h+(n.exclusive?" + 1":""):"0",_=n.reverse?m:h+(n.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:n.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:d},...J(t,t)]}),getShaderSource:c}},bc=(e,t)=>{let r=e.inputs[0].dims,n=e.inputs[0].dataType,a=e.inputs[1];e.compute(pu(n,r,a,t),{inputs:[0]})},wc=e=>{let t=e.exclusive===1,r=e.reverse===1;return he({exclusive:t,reverse:r})}}),cu,fu,hu,$c,vc,_g=q(()=>{ie(),se(),Se(),ue(),cu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},fu=(e,t,r,n)=>{let a=[];a.push(`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)a.push(r.indicesSet("a",e[i],`i[${i}]`));return a.push("return a;}"),a.join(`
`)},hu=(e,t)=>{let r,n,a,i,s,u,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,n,a,i]=e.dims,s=c?[r,n,a,d,d,i/d**2]:[r,n,a,i/d**2,d,d],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,n,a,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,i/d**2,n,a]:[r,i/d**2,d,d,n,a],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),h=f.dims.length,m=e.dataType,y=D("a",m,h),_=Z("output",m,h),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(y,_)}

  ${fu(u,h,y,_)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let w=l?[r,n*d,a*d,i/d**2]:[r,i/d**2,n*d,a*d],S=R.size(w),k=f.dims,T=R.sortBasedOnPerm(k,u);return{outputs:[{dims:w,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...J(k,T)]}},getShaderSource:x}},$c=(e,t)=>{cu(e.inputs),e.compute(hu(e.inputs[0],t))},vc=e=>he({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Rr,tr,Hi,mu,gu,yu,_u,ji,bu,xc,kc,bg=q(()=>{ie(),se(),Se(),ue(),Rr="[a-zA-Z]|\\.\\.\\.",tr="("+Rr+")+",Hi="^"+tr+"$",mu="("+tr+",)*"+tr,gu="^"+mu+"$",yu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},_u=class{constructor(e,t){var a;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,n]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(gu)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let u=e[s].dims.slice();if(!i.match(RegExp(Hi)))throw new Error("Invalid LHS term");let l=this.processTerm(i,!0,u,s);this.lhs.push(l)}),n==="")n+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!n.match(RegExp(tr)))throw new Error("Invalid RHS");(a=n.match(RegExp(Rr,"g")))==null||a.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(n,!1,this.outputDims)}addSymbol(e,t,r){let n=this.symbolToInfo.get(e);if(n!==void 0){if(n.dimValue!==t&&n.count!==1)throw new Error("Dimension mismatch");n.count++,n.inputIndices.push(r)}else n={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,n)}processTerm(e,t,r,n=-1){let a=r.length,i=!1,s=[],u=0;if(!e.match(RegExp(Hi))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Rr,"g")),d=new yu(n);return l==null||l.forEach((c,f)=>{if(c==="..."){if(i)throw new Error("Only one ellipsis is allowed per input term");i=!0;let h=a-l.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let m=0;m<s.length;m++){let y=String.fromCharCode(48+m);d.addSymbol(y,f+m),this.addSymbol(y,r[u++],n)}}else d.addSymbol(c,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],n)}),d}},ji=e=>e+"_max",bu=(e,t,r,n)=>{let a=e.map(d=>d.length).map((d,c)=>D(`input${c}`,t,d)),i=R.size(n),s=Z("output",t,n.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],f="var prod = 1.0;",h="var sum = 0.0;",m="sum += prod;",y=[],_=[],x=[],$=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((k,T)=>{var O;if(r.rhs.symbolToIndices.has(T)){let I=(O=r.rhs.symbolToIndices.get(T))==null?void 0:O[0];I!==void 0&&r.lhs.forEach((z,A)=>{if(k.inputIndices.includes(A)){let M=z.symbolToIndices.get(T);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(j=>{c.push(`${a[A].indicesSet(`input${A}Indices`,j,s.indicesGet("outputIndices",I))}`)})}})}else r.lhs.forEach((I,z)=>{if(k.inputIndices.includes(z)){let A=I.symbolToIndices.get(T);if(A===void 0)throw new Error("Invalid symbol error");A.forEach(M=>{y.push(`${a[z].indicesSet(`input${z}Indices`,M,`${T}`)}`)}),$.push(`prod *= ${a[z].getByIndices(`input${z}Indices`)};`)}}),_.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${ji(T)}; ${T}++) {`),x.push("}")});let S=w?[...c,`let sum = ${a.map((k,T)=>k.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...c,h,..._,...y,f,...$,m,...x];return`
            ${d.registerUniforms(u.map(k=>({name:`${ji(k)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((k,T)=>`var input${T}Indices: ${a[T].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(f=>r.symbolToInfo.has(f)).map(f=>{var h;return{type:12,data:((h=r.symbolToInfo.get(f))==null?void 0:h.dimValue)||0}});d.push({type:12,data:i});let c=e.map((f,h)=>[...J(f)]).reduce((f,h)=>f.concat(h),d);return c.push(...J(n)),{outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c}},getShaderSource:l}},xc=(e,t)=>{let r=new _u(e.inputs,t.equation),n=r.outputDims,a=e.inputs.map((i,s)=>i.dims);e.compute(bu(a,e.inputs[0].dataType,r,n))},kc=e=>{let t=e.equation.replace(/\s+/g,"");return he({equation:t})}}),wu,Ki,$u,vu,Sc,wg=q(()=>{ie(),se(),ue(),wu=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;n<r.length&&a<t.length;++n,++a)if(r[n]!==t[a]&&r[n]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Ki=(e,t)=>{let r=e.length-t.length,n=[];for(let a=0;a<r;++a)n.push(e[a]);for(let a=0;a<t.length;++a)n.push(t[a]===1?e[a+r]:t[a]);return n},$u=(e,t)=>e.length>t.length?Ki(e,t):Ki(t,e),vu=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=$u(t,r),a=e[0].dataType,i=a===9||R.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=i||n.length>0&&n[n.length-1]%4===0?4:1,l=Math.ceil(R.size(n)/u),d=f=>{let h=D("input",a,t.length,s),m=Z("output",a,n.length,u),y;if(a===9){let _=(x,$,w="")=>`
          let outputIndices${$} = ${m.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${h.broadcastedIndicesToOffset(`outputIndices${$}`,m)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${w}(${h.getByOffset(`index${$}`)}[component${$}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${_("data",0,"u32")}
        ${_("data",1,"u32")}
        ${_("data",2,"u32")}
        ${_("data",3,"u32")}
        ${m.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${m.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",m)};
        let data = ${m.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${m.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(h,m)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},c=[{type:12,data:l},...J(t,n)];return{name:"Expand",shaderCache:{hint:`${n.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},Sc=e=>{wu(e.inputs),e.compute(vu(e.inputs),{inputs:[0]})}}),xu,Tc,$g=q(()=>{ie(),se(),ue(),Qn(),xu=e=>{let t=e[0].dataType,r=R.size(e[0].dims),n=R.size(e[1].dims),a=n%4===0,i=s=>{let u=D("x",t,[1],4),l=D("bias",t,[1],4),d=Z("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=m=>`
      let bias${m}_offset: u32 = (global_idx * 4 + ${m}) % uniforms.bias_size;
      let bias${m} = ${l.getByOffset(`bias${m}_offset / 4`)}[bias${m}_offset % 4];`,h=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,l,d)}

    ${kn(Oe(t))}

    ${s.mainStart(Gt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Sn("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:n}],dispatchGroup:{x:Math.ceil(r/Gt/4)}})}},Tc=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?Hp(e):e.compute(xu(e.inputs))}}),ku,Su,Ic,Cc,vg=q(()=>{ie(),se(),Se(),ue(),ku=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Su=(e,t)=>{let r=e[0].dims,n=e[1].dims,a=r.length,i=R.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(i,1,...n);let u=r[i],l=e[0].dataType===9?4:1,d=Math.ceil(R.size(s)/l),c=[{type:12,data:d},{type:6,data:u},{type:12,data:i},...J(e[0].dims,e[1].dims,s)],f=h=>{let m=D("data",e[0].dataType,e[0].dims.length,l),y=D("inputIndices",e[1].dataType,e[1].dims.length),_=Z("output",e[0].dataType,s.length,l),x=w=>{let S=n.length,k=`var indicesIndices${w}  = ${y.type.indices}(0);`;for(let T=0;T<S;T++)k+=`${S>1?`indicesIndices${w}[${T}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${T}]`:`outputIndices${w}`};`;k+=`
          var idx${w} = ${y.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${m.type.indices};
        `;for(let T=0,O=0;T<a;T++)T===i?(k+=`${a>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = u32(idx${w});`,O+=S):(k+=`${a>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${O}]`:`outputIndices${w}`};`,O++);return k},$;if(e[0].dataType===9){let w=(S,k,T="")=>`
          let outputIndices${k} = ${_.offsetToIndices(`outputOffset + ${k}u`)};
          ${x(k)};
          let offset${k} = ${m.indicesToOffset(`dataIndices${k}`)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${S}[${k}] = ${T}(${m.getByOffset(`index${k}`)}[component${k}]);
        `;$=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${_.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${m.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,y,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:f}},Ic=e=>he({axis:e.axis}),Cc=(e,t)=>{let r=e.inputs;ku(r),e.compute(Su(e.inputs,t))}}),Tu,Ec,zc,xg=q(()=>{ie(),se(),ue(),Tu=(e,t,r,n,a,i,s,u,l)=>{let d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],c=[i];d.push(...J(t.dims,c));let f=h=>{let m=D("indices_data",t.dataType,t.dims.length),y=Z("input_slice_offsets_data",12,1,1),_=[m,y],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(x).declareVariables(..._)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:d}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},Ec=(e,t)=>{let r=e.inputs,n=r[0].dims,a=r[0].dataType,i=r[1].dims,s=i[i.length-1],u=R.sizeToDimension(i,i.length-1),l=R.sizeFromDimension(n,t.batchDims+s),d=R.sizeToDimension(n,t.batchDims),c=R.sizeFromDimension(n,t.batchDims),f=u/d,h=new Array(s),m=l;for(let k=0;k<s;++k)h[s-1-k]=m,m*=n[t.batchDims+s-1-k];let y=Tu(e,r[1],h,t.batchDims,n,u,f,c,s),_=t.batchDims+s;if(_>n.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=i.slice(0,-1).concat(n.slice(_)),$=R.size(x),w=[{type:12,data:$},{type:12,data:l},...J(r[0].dims,y.dims,x)],S=k=>{let T=D("data",r[0].dataType,r[0].dims.length),O=D("slice_offsets",12,y.dims.length),I=Z("output",r[0].dataType,x.length);return`
          ${k.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,O,I)}
            ${k.mainStart()}
            ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:a}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:w}),getShaderSource:S},{inputs:[r[0],y]})},zc=e=>({batchDims:e.batch_dims,cacheKey:""})}),Iu,Cu,Oc,Ac,kg=q(()=>{ie(),se(),Se(),ue(),Iu=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),n=t.blockSize,a=e[0],i=e[2],s=e.length===4?e[3]:void 0;if(i.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/n)===i.dims[l]:u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==i.dims.length||!s.dims.map((u,l)=>u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Cu=(e,t)=>{let r=e[0].dims,n=e[1].dims,a=r.length,i=R.normalizeAxis(t.gatherAxis,a),s=R.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(i,1,...n);let l=R.size(u),d=e[2].dataType,c=e[0].dataType===22,f=[{type:12,data:l},{type:12,data:s},{type:12,data:i},{type:12,data:t.blockSize},...J(...e.map((m,y)=>m.dims),u)],h=m=>{let y=D("data",e[0].dataType,e[0].dims.length),_=D("inputIndices",e[1].dataType,e[1].dims.length),x=D("scales",e[2].dataType,e[2].dims.length),$=e.length>3?D("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=Z("output",d,u.length),S=[y,_,x];$&&S.push($);let k=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${m.registerUniforms(k).declareVariables(...S,w)}
        ${m.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${_.type.indices}(0);
        ${n.length>1?`
          for (var i: u32 = 0; i < ${n.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${_.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${_.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${n.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Oe(d)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((m,y)=>y!==1).map(m=>m.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(m,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:h}},Oc=(e,t)=>{let r=e.inputs;Iu(r,t),e.compute(Cu(e.inputs,t))},Ac=e=>he({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Eu,zu,Rc,Bc,Sg=q(()=>{ie(),se(),Se(),ue(),Eu=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},zu=(e,t)=>{let r=e[0].dims,n=e[0].dataType,a=r.length,i=e[1].dims,s=e[1].dataType,u=R.normalizeAxis(t.axis,a),l=r[u],d=i.slice(0),c=R.size(d),f=D("input",n,a),h=D("indicesInput",s,i.length),m=Z("output",n,d.length),y=[{type:12,data:c},{type:6,data:l},{type:12,data:u}];return y.push(...J(r,i,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:y}),getShaderSource:_=>`
      ${_.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,h,m)}
      ${_.mainStart()}
      ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${m.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${m.setByOffset("global_idx","value")};
  }`}},Rc=e=>he({axis:e.axis}),Bc=(e,t)=>{let r=e.inputs;Eu(r),e.compute(zu(e.inputs,t))}}),Ou,Au,Mc,Dc,Tg=q(()=>{ie(),se(),ue(),Ou=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Au=(e,t)=>{let r=e[0].dims.slice(),n=e[1].dims.slice(),[a,i,s]=Rd.getShapeOfGemmResult(r,t.transA,n,t.transB,e.length===3?e[2].dims:void 0),u=[a,i];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(i/l),c=Math.ceil(a/l),f=!0,h=R.size(u),m=[{type:12,data:f?d:h},{type:12,data:a},{type:12,data:i},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(m.push(...J(e[2].dims)),y.push("rank")),m.push(...J(u));let _=$=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",k=D("a",e[0].dataType,e[0].dims),T=D("b",e[1].dataType,e[1].dims),O=k.type.value,I=null,z=[k,T];e.length===3&&(I=D("c",e[2].dataType,e[2].dims.length),z.push(I));let A=Z("output",e[0].dataType,u.length);z.push(A);let M=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(M).declareVariables(...z)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${O}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${S}
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${O}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let w=D("a",e[0].dataType,e[0].dims),S=D("b",e[1].dataType,e[1].dims),k=null,T=[w,S];e.length===3&&(k=D("c",e[2].dataType,e[2].dims.length),T.push(k));let O=Z("output",e[0].dataType,u.length);T.push(O);let I=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],z="",A="";t.transA&&t.transB?(A=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(A=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,z="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(A=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(A=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,z="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let M=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(I).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${l}>, ${l}>;
  ${$.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${O.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${A}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${z}
      }
      workgroupBarrier();
    }

    ${M}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${k!=null?`let cOffset = ${k.broadcastedIndicesToOffset("vec2(m, n)",O)}; value += ${O.type.value}(uniforms.beta) * ${k.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:m}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:m}),getShaderSource:_}},Mc=e=>{let t=e.transA,r=e.transB,n=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:n,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Dc=(e,t)=>{Ou(e.inputs),e.compute(Au(e.inputs,t))}}),rt,ot,Tt,It,Ru,Bu,Mu,Du,Nu,Pu,Uu,Wu,Nc,Pc,Ig=q(()=>{ie(),se(),Se(),ue(),[rt,ot,Tt,It]=[0,1,2,3],Ru=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Bu=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Mu=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Du=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Nu=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Pu=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${rt}] = batch;
     indices[${ot}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Tt}] = u32(r);
            indices[${It}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Tt}] = u32(clamp(r, 0, H - 1));
          indices[${It}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Tt}] = gs_reflect(r, border[1], border[3]);
          indices[${It}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Uu=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${rt}], indices[${ot}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${rt}], indices[${ot}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${rt}], indices[${ot}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${rt}], indices[${ot}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${rt}], indices[${ot}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${rt}], indices[${ot}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Wu=(e,t)=>{let r=D("x",e[0].dataType,e[0].dims.length),n=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=D("grid",e[1].dataType,n.length,2),i=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(i=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[rt,ot,Tt,It]=[0,3,1,2]);let s=Z("output",e[0].dataType,i.length),u=r.type.value,l=R.size(i),d=[{type:12,data:l},...J(e[0].dims,n,i)],c=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${Bu}
  ${Mu(u)}
  ${Du(t)}
  ${Nu(t)}
  ${Pu(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Tt}]);
      let W_in = i32(uniforms.x_shape[${It}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${rt}], indices[${Tt}], indices[${It}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Uu(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let h=R.size(i);return{outputs:[{dims:i,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:d}},getShaderSource:c}},Nc=(e,t)=>{Ru(e.inputs),e.compute(Wu(e.inputs,t))},Pc=e=>he({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Re,Lu,Uc,Zi,qu,lr,Wc,Lc=q(()=>{ie(),se(),Se(),Hn(),Zn(),ue(),wt(),Re=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Lu=(e,t)=>{let r=e[0],n=Re(e,1),a=Re(e,2),i=Re(e,3),s=Re(e,4),u=Re(e,5),l=Re(e,6),d=Re(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],f=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],m=f,y=0,_=0,x=Math.floor(h/t.numHeads);if(l&&d&&R.size(l.dims)&&R.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=l.dims[2],_=l.dims[2]}else if(l&&R.size(l.dims)||d&&R.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(n&&R.size(n.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(n.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,m=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,m=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,m=n.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(i&&R.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(n&&n.dims.length===5&&n.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=y+m,S=0;if(s&&R.size(s.dims)>0){S=8;let I=s.dims;throw I.length===1?I[0]===c?S=1:I[0]===3*c+2&&(S=3):I.length===2&&I[0]===c&&I[1]===w&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let k=!1,T=h;if(a&&R.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(m!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=a.dims[2]}else{if(m!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=a.dims[1]*a.dims[3],k=!0}}let O=!1;if(s&&R.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&R.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:f,pastSequenceLength:y,kvSequenceLength:m,totalSequenceLength:w,maxSequenceLength:_,inputHiddenSize:0,hiddenSize:h,vHiddenSize:T,headSize:x,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:O,passPastInKv:k,qkvFormat:$}},Uc=e=>he({...e}),Zi=he({perm:[0,2,1,3]}),qu=(e,t,r,n,a,i,s)=>{let u=[n,a,i],l=R.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:i}],c=f=>{let h=Z("qkv_with_bias",t.dataType,u),m=D("qkv",t.dataType,u),y=D("bias",r.dataType,u),_=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(_).declareVariables(m,y,h)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},lr=(e,t,r,n,a,i,s,u)=>{let l=i;if(s&&R.size(s.dims)>0){if(n===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=qu(e,i,s,t,n,r*a,u),l=l.reshape([t,n,r,a]),r===1||n===1?l:e.compute(Ue(l,Zi.perm),{inputs:[l],outputs:[-1]})[0]}else return i.dims.length===3&&(l=i.reshape([t,n,r,a])),r===1||n===1?l:e.compute(Ue(l,Zi.perm),{inputs:[l],outputs:[-1]})[0]},Wc=(e,t)=>{let r=Lu(e.inputs,t),n=e.inputs[0],a=Re(e.inputs,1),i=Re(e.inputs,2),s=Re(e.inputs,3),u=Re(e.inputs,4),l=Re(e.inputs,5),d=Re(e.inputs,6),c=Re(e.inputs,7);if(n.dims.length===5)throw new Error("Packed QKV is not implemented");if((a==null?void 0:a.dims.length)===5)throw new Error("Packed KV is not implemented");let f=a&&i&&a.dims.length===4&&i.dims.length===4,h=lr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,n,s,0);if(f)return cr(e,h,a,i,u,void 0,d,c,l,r);if(!a||!i)throw new Error("key and value must be provided");let m=lr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),y=lr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,s,2*r.hiddenSize);cr(e,h,m,y,u,void 0,d,c,l,r)}}),Vu,Gu,Fu,Hu,zn,qc,Vc,Gc=q(()=>{ie(),se(),Se(),ue(),Vu=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Gu=(e,t)=>{let r=[],n=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),n=r.length),he({numOutputs:n,axis:t.axis,splitSizes:r})},Fu=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${X("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Hu=e=>{let t=e.length,r=[];for(let n=0;n<t;++n){let a=e[n].setByIndices("indices","input[global_idx]");t===1?r.push(a):n===0?r.push(`if (output_number == ${n}u) { ${a} }`):n===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${n}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},zn=(e,t)=>{let r=e[0].dims,n=R.size(r),a=e[0].dataType,i=R.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=D("input",a,r.length),l=new Array(t.numOutputs),d=[],c=[],f=0,h=[{type:12,data:n}];for(let y=0;y<t.numOutputs;y++){f+=t.splitSizes[y],l[y]=f;let _=r.slice();_[i]=t.splitSizes[y],c.push(_),s[y]=Z(`output${y}`,a,_.length),d.push({dims:c[y],dataType:e[0].dataType})}h.push({type:12,data:l},...J(r,...c));let m=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${Fu(l.length)}
  ${Hu(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${X("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:m,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h})}},qc=(e,t)=>{Vu(e.inputs);let r=e.inputs.length===1?t:Gu(e.inputs,t);e.compute(zn(e.inputs,r),{inputs:[0]})},Vc=e=>{let t=e.axis,r=e.splitSizes,n=e.numOutputs<0?r.length:e.numOutputs;if(n!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return he({axis:t,numOutputs:n,splitSizes:r})}}),ju,Hr,Fc,Hc=q(()=>{ie(),se(),Se(),ue(),ju=(e,t)=>{let[r,n,a,i]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!R.areEqual(n.dims,[])&&!R.areEqual(n.dims,[1])&&n.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!R.areEqual(a.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=a.dims[0],f=R.sizeFromDimension(r.dims,1)/d,h=u===0?a.dims[1]*2:f/s;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(n.dims.length===2){if(l!==n.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${n.dims[0]}`);if(d!==n.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${n.dims[1]}`)}if(h/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Hr=(e,t)=>{let{interleaved:r,numHeads:n,rotaryEmbeddingDim:a,scale:i}=t,s=e[0].dims[0],u=R.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,c=e[2].dims[1],f=a===0?c*2:d/n,h=new Array(s,l,d/f,f-c),m=R.computeStrides(h),y=[{type:1,data:i},{type:12,data:h},{type:12,data:m},...e[0].dims.length===3?new Array({type:12,data:[u,d,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,l*f,1]}):[],...J(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],_=x=>{let $=D("input",e[0].dataType,e[0].dims.length),w=D("position_ids",e[1].dataType,e[1].dims.length),S=D("cos_cache",e[2].dataType,e[2].dims.length),k=D("sin_cache",e[3].dataType,e[3].dims.length),T=Z("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:m.length},{name:"input_output_strides",type:"u32",length:m.length}]),`
        ${x.declareVariables($,w,S,k,T)}

        ${x.mainStart(Gt)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",Z("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${$.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:he({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(h)/Gt)},programUniforms:y})}},Fc=(e,t)=>{ju(e.inputs,t),e.compute(Hr(e.inputs,t))}}),Ku,Zu,Qi,Qu,jc,Cg=q(()=>{Se(),ie(),Zn(),Lc(),Gc(),wt(),Hc(),ue(),Ku=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],n=e[1],a=e[2],i=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=d,h=0,m=!n||n.dims.length===0,y=Math.floor(m?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);m&&(c=y*t.numHeads);let _=i&&i.dims.length!==0,x=s&&s.dims.length!==0;if(_&&i.dims.length===4&&i.dims[0]===l&&i.dims[1]!==t.kvNumHeads&&i.dims[2]===t.kvNumHeads&&i.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if(_&&x){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=i.dims[2]}else if(_||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(n&&n.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(r.dims[2]%n.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');f=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=n.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let w=0,S=!1,k=t.kvNumHeads?y*t.kvNumHeads:c;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(f!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=a.dims[2]}else{if(f!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');k=a.dims[1]*a.dims[3],S=!0}}let T=e.length>4?e[5]:void 0;if(T&&T.dims.length!==1&&T.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:h,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:k,headSize:y,vHeadSize:Math.floor(k/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:$}},Zu=he({perm:[0,2,1,3]}),Qi=(e,t,r)=>{let n=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(n=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),n=e.compute(Ue(n,Zu.perm),{inputs:[n],outputs:[-1]})[0]),n},Qu=(e,t,r,n)=>{let a=7,i=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=c=>{let f=D("seq_lens",r.dataType,r.dims),h=D("total_seq_lens",n.dataType,n.dims),m=Z("pos_ids",a,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(y).declareVariables(f,h,m)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${m.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${m.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${m.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},jc=(e,t)=>{var k;let r=Ku(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((k=e.inputs[1])==null?void 0:k.dims.length)===5)throw new Error("Packed KV is not implemented");let n=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,i=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=he({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[h,m,y]=!a&&!i?e.compute(zn([n],f),{inputs:[n],outputs:[-1,-1,-1]}):[n,a,i],_,x;if(t.doRotary){let T=e.compute(Qu(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],O=e.inputs[7],I=e.inputs[8],z=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),A=[h,T,O,I],M=[-1];_=e.compute(Hr(A,z),{inputs:A,outputs:M})[0],A.splice(0,1,m);let j=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(Hr(A,j),{inputs:A,outputs:M})[0]}let $=lr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?_:h,void 0,0),w=Qi(e,t.doRotary?x:m,r),S=Qi(e,y,r);cr(e,$,w,S,void 0,void 0,s,u,void 0,r,l,d)}}),Xi,Xu,Yu,Kc,Eg=q(()=>{ie(),se(),wt(),ue(),Xi=(e,t,r,n,a,i,s,u)=>{let l=ke(i),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,f=a*s,h=64;f===1&&(h=256);let m=[a,s,i/l],y=[a,s,2],_=["rank","type","type"],x=[];x.push(...J(m,y));let $=w=>{let S=D("x",t.dataType,3,l),k=D("scale",r.dataType,r.dims),T=D("bias",n.dataType,n.dims),O=Z("output",1,3,2),I=[S,k,T,O];return`
  var<workgroup> workgroup_shared : array<${c}, ${h}>;
  const workgroup_size = ${h}u;
  ${w.declareVariables(...I)}
  ${w.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${bt("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${bt("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:f},programUniforms:x}),getShaderSource:$},{inputs:[t,r,n],outputs:[-1]})[0]},Xu=(e,t,r)=>{let n=t[0].dims,a=n,i=2,s=n[0],u=n[1],l=R.sizeFromDimension(n,i),d=ke(l),c=R.size(a)/d,f=Xi(e,t[0],t[1],t[2],s,l,u,r.epsilon),h=[s,u,l/d],m=[s,u],y=["type","none"],_=x=>{let $=D("x",t[0].dataType,h.length,d),w=D("scale_shift",1,m.length,2),S=Z("output",t[0].dataType,h.length,d),k=[$,w,S];return`
  ${x.registerUniform("output_size","u32").declareVariables(...k)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...J(h,m,h)]}),getShaderSource:_},{inputs:[t[0],f]})},Yu=(e,t,r)=>{let n=t[0].dims,a=n,i=n[0],s=n[n.length-1],u=R.sizeFromDimension(n,1)/s,l=ke(s),d=R.size(a)/l,c=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],f=["type","type"],h=!1,m=[0,n.length-1];for(let $=0;$<n.length-2;$++)h=h||n[$+1]!==1,m.push($+1);h=h&&n[n.length-1]!==1;let y=h?e.compute(Ue(e.inputs[0],m),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:n.length},($,w)=>n[m[w]])),_=Xi(e,y,t[1],t[2],i,u,s,r.epsilon),x=$=>{let w=Ie(t[0].dataType),S=l===1?"vec2f":`mat${l}x2f`,k=I=>{let z=I===0?"x":"y",A=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${w}(${A}(scale.${z}))`;case 2:return`vec2<${w}>(${A}(scale[0].${z}, scale[1].${z}))`;case 4:return`vec4<${w}>(${A}(scale[0].${z}, scale[1].${z}, scale[2].${z}, scale[3].${z}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=D("input",t[0].dataType,t[0].dims,l),O=Z("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${O.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${k(0)}, ${k(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:x},{inputs:[t[0],_]})},Kc=(e,t)=>{t.format==="NHWC"?Yu(e,e.inputs,t):Xu(e,e.inputs,t)}}),Ju,el,Zc,zg=q(()=>{ie(),se(),ue(),Ju=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},el=(e,t,r)=>{let n=t.simplified,a=e[0].dims,i=e[1],s=!n&&e[2],u=a,l=R.normalizeAxis(t.axis,a.length),d=R.sizeToDimension(a,l),c=R.sizeFromDimension(a,l),f=R.size(i.dims),h=s?R.size(s.dims):0;if(f!==c||s&&h!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${h}`);let m=[];for(let T=0;T<a.length;++T)T<l?m.push(a[T]):m.push(1);let y=ke(c),_=["type","type"],x=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/y)},{type:1,data:t.epsilon}];s&&_.push("type");let $=r>1,w=r>2,S=T=>{let O=Ie(e[0].dataType),I=[D("x",e[0].dataType,e[0].dims,y),D("scale",i.dataType,i.dims,y)];s&&I.push(D("bias",s.dataType,s.dims,y)),I.push(Z("output",e[0].dataType,u,y)),$&&I.push(Z("mean_data_output",1,m)),w&&I.push(Z("inv_std_output",1,m));let z=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(z).declareVariables(...I)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${$n("f32",y)};
    var mean_square_vector = ${$n("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${qt(O,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${bt("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${bt("mean_square_vector",y)} / uniforms.norm_size ${n?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${qt(O,y,"x[j + offset]")};
      let f32scale = ${qt(O,y,"scale[j]")};
      output[j + offset] = ${I[0].type.value}((f32input ${n?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${qt(O,y,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},k=[{dims:u,dataType:e[0].dataType}];return $&&k.push({dims:m,dataType:1}),w&&k.push({dims:m,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${n}`,inputDependencies:_},getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:x}),getShaderSource:S}},Zc=(e,t)=>{Ju(e.inputs),e.compute(el(e.inputs,t,e.outputCount))}}),tl,Qc,Og=q(()=>{se(),ea(),ta(),tl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Qc=e=>{tl(e.inputs);let t=Vt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],n=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&n<8)e.compute(Jn(e.inputs,{activation:""},t));else{let a=t[t.length-2],i=R.size(e.inputs[0].dims.slice(0,-2)),s=R.size(e.inputs[1].dims.slice(0,-2));if(i!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,i,n]),l=e.inputs[1].reshape([1,n,r]),d=[1,i,r],c=[u,l];e.compute(Fr(c,{activation:""},t,d),{inputs:c})}else e.compute(Fr(e.inputs,{activation:""},t))}}}),rl,il,nl,Xc,Yc,Ag=q(()=>{ie(),se(),Se(),ue(),rl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],n=r.dims.length;if(r.dims[n-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,s=e[1];if(!R.areEqual(s.dims,[t.n,a,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(R.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.bits>4?t.n*a:t.n*Math.floor((a+1)/2);if(R.size(l)!==d)throw new Error("zeroPoints input size error.")}},il=(e,t)=>{let r=e[0].dims,n=r.length,a=r[n-2],i=t.k,s=t.n,u=r.slice(0,n-2),l=R.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=ke(t.k),h=ke(d),m=ke(s),y=u.concat([a,s]),_=a>1&&s/m%2===0?2:1,x=R.size(y)/m/_,$=64,w=[],S=[l,a,i/f],k=R.convertShape(e[1].dims).slice();k.splice(-1,1,d/h),w.push(...J(S)),w.push(...J(k)),w.push(...J(e[2].dims)),e.length===4&&w.push(...J(R.convertShape(e[3].dims)));let T=[l,a,s/m];w.push(...J(T));let O=I=>{let z=S.length,A=D("a",e[0].dataType,z,f),M=D("b",12,k.length,h),j=D("scales",e[2].dataType,e[2].dims.length),V=[A,M,j],F=e.length===4?D("zero_points",12,e[3].dims.length):void 0;F&&V.push(F);let ee=T.length,ne=Z("output",e[0].dataType,ee,m),H=Ie(e[0].dataType),ae=(()=>{switch(f){case 1:return`array<${H}, 8>`;case 2:return`mat4x2<${H}>`;case 4:return`mat2x4<${H}>`;default:throw new Error(`${f}-component is not supported.`)}})(),K=()=>{let P=`
          // reuse a data
            var input_offset = ${A.indicesToOffset(`${A.type.indices}(batch, row, word_offset)`)};
            var a_data: ${ae};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${A.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let E=0;E<m*_;E++)P+=`
            b_value = ${h===1?`b${E}_data`:`b${E}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${ae}(${Array.from({length:4},(U,Q)=>`${H}(b_value_lower[${Q}]), ${H}(b_value_upper[${Q}])`).join(", ")});
            b_dequantized_values = ${f===1?`${ae}(${Array.from({length:8},(U,Q)=>`(b_quantized_values[${Q}] - ${F?`zero_point${E}`:"zero_point"}) * scale${E}`).join(", ")});`:`(b_quantized_values - ${ae}(${Array(8).fill(`${F?`zero_point${E}`:"zero_point"}`).join(",")})) * scale${E};`};
            workgroup_shared[local_id.x * ${_} + ${Math.floor(E/m)}]${m>1?`[${E%m}]`:""} += ${Array.from({length:8/f},(U,Q)=>`${f===1?`a_data[${Q}] * b_dequantized_values[${Q}]`:`dot(a_data[${Q}], b_dequantized_values[${Q}])`}`).join(" + ")};
          `;return P},te=()=>{let P=`
            var col_index = col * ${m};
            ${F?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${H}(8);`}
            `;for(let E=0;E<m*_;E++)P+=`
            let scale${E} = ${j.getByOffset("col_index * nBlocksPerCol + block")};
            ${F?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${E} = ${H}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return P},be=()=>{let P=`col_index = col * ${m};`;for(let E=0;E<m*_;E++)P+=`
            let b${E}_data = ${M.getByIndices(`${M.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return P+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ae};
            var b_dequantized_values: ${ae};`,P};return`
        var<workgroup> workgroup_shared: array<${ne.type.value}, ${_*$}>;
        ${I.declareVariables(...V,ne)}
        ${I.mainStart([$,1,1])}
          let output_indices = ${ne.offsetToIndices(`(global_idx / ${$}) * ${_}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${te()}
            for (var word: u32 = 0; word < ${d}; word += ${h}) {
              ${be()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${K()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${_}) {
            var output_value: ${ne.type.value} = ${ne.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${_};
            }
            ${ne.setByIndices(`${ne.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${h};${m};${_};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:c}],dispatchGroup:{x},programUniforms:w}),getShaderSource:O}},nl=(e,t)=>{let r=e[0].dims,n=r.length,a=r[n-2],i=t.k,s=t.n,u=r.slice(0,n-2),l=R.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=ke(t.k),h=ke(d),m=u.concat([a,s]),y=128,_=s%8===0?8:s%4===0?4:1,x=y/_,$=x*h*8,w=$/f,S=$/t.blockSize,k=R.size(m)/_,T=[],O=[l,a,i/f],I=R.convertShape(e[1].dims).slice();I.splice(-1,1,d/h),T.push(...J(O)),T.push(...J(I)),T.push(...J(e[2].dims)),e.length===4&&T.push(...J(R.convertShape(e[3].dims)));let z=[l,a,s];T.push(...J(z));let A=M=>{let j=O.length,V=D("a",e[0].dataType,j,f),F=D("b",12,I.length,h),ee=D("scales",e[2].dataType,e[2].dims.length),ne=[V,F,ee],H=e.length===4?D("zero_points",12,e[3].dims.length):void 0;H&&ne.push(H);let ae=z.length,K=Z("output",e[0].dataType,ae),te=Ie(e[0].dataType),be=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${te}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${te}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${V.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${K.type.value}, ${x}>, ${_}>;
        ${M.declareVariables(...ne,K)}
        ${M.mainStart([x,_,1])}
          let output_indices = ${K.offsetToIndices(`workgroup_index * ${_}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${V.getByIndices(`${V.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${V.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${H?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${H.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${te}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${te}(8);`}
            let scale = ${ee.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${F.getByIndices(`${F.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${be()}
              let b_value = ${h===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${te}>(${Array.from({length:4},(P,E)=>`${te}(b_value_lower[${E}]), ${te}(b_value_upper[${E}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${te}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(P,E)=>`${`dot(a_data${E}, b_dequantized_values[${E}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${_}) {
            var output_value: ${K.type.value} = ${K.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${K.setByIndices(`${K.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${h};${x};${_}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:c}],dispatchGroup:{x:k},programUniforms:T}),getShaderSource:A}},Xc=(e,t)=>{rl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(nl(e.inputs,t)):e.compute(il(e.inputs,t))},Yc=e=>he(e)}),al,sl,ol,ul,ll,dl,pl,cl,Jc,Rg=q(()=>{ie(),se(),ue(),al=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},sl=(e,t,r)=>{let n="";for(let a=t-1;a>=0;--a)n+=`
            k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${X("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${X("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${n}
            value = x[offset];
          }
      `},ol=(e,t,r)=>{let n="";for(let a=t-1;a>=0;--a)n+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${X("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${X("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},ul=(e,t,r)=>{let n="";for(let a=t-1;a>=0;--a)n+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k = i32(${X("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},ll=(e,t,r)=>{let n="";for(let a=t-1;a>=0;--a)n+=`
                k = i32(${e.indicesGet("indices",a)}) - ${X("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${X("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${X("uniforms.x_shape",a,t)})) {
                  k -= i32(${X("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${X("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},dl=(e,t,r)=>{switch(r.mode){case 0:return sl(e,t,r.pads.length);case 1:return ol(e,t,r.pads.length);case 2:return ul(e,t,r.pads.length);case 3:return ll(e,t,r.pads.length);default:throw new Error("Invalid mode")}},pl=(e,t)=>{let r=R.padShape(e[0].dims.slice(),t.pads),n=e[0].dims,a=R.size(r),i=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&i.push({type:s?e[2].dataType:1,data:t.value}),i.push(...J(e[0].dims,r));let u=["rank"],l=d=>{let c=Z("output",e[0].dataType,r.length),f=D("x",e[0].dataType,n.length),h=f.type.value,m=dl(c,n.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?h:"f32"}),`
            ${d.registerUniforms(y).declareVariables(f,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${m}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(r)/64)},programUniforms:i}),getShaderSource:l}},cl=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),n=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,i=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)i[Number(u[l])]=Number(r[l]),i[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>i[Number(l)]=Number(u));let s=[];return i.forEach(u=>s.push(u)),{mode:t.mode,value:n,pads:s}}else return t},Jc=(e,t)=>{al(e.inputs);let r=cl(e.inputs,t);e.compute(pl(e.inputs,r),{inputs:[0]})}}),rr,Yi,Ji,en,tn,fl,hl,rn,nn,ef,tf,an,rf,nf,sn,af,sf,of,uf,Bg=q(()=>{Ye(),ie(),se(),ue(),rr=e=>{if($e.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Yi=(e,t,r)=>{let n=t.format==="NHWC",a=e.dims.slice();n&&a.splice(1,0,a.pop());let i=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=i?t.dilations.slice():[],d=t.pads.slice();Vr.adjustPoolAttributes(r,a,s,u,l,d);let c=Vr.computePoolOutputShape(r,a,u,l,s,d,t.autoPad),f=Object.assign({},t);i?Object.assign(f,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let h=c.slice();return h.push(h.splice(1,1)[0]),[f,n?h:c]},Ji=(e,t)=>{let r=t.format==="NHWC",n=R.size(e),a=R.size(t.kernelShape),i=[{type:12,data:n},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],f=!!(d+c);i.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let m=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],_=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!(_+x),i.push({type:12,data:m},{type:12,data:y},{type:12,data:_},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,s,!0,f,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=R.computeStrides(t.kernelShape);i.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[i,s,!!l,!1,!1]}},en=(e,t,r,n,a,i,s,u,l,d,c,f)=>{let h=a.format==="NHWC",m=t.type.value,y=Z("output",t.type.tensor,n);if(a.kernelShape.length<=2){let _="",x="",$="",w=r-(h?2:1);if(c?_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`:_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`,a.kernelShape.length===2){let S=r-(h?3:2);f?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${m}(${u});
              var pad = 0;
              ${x}
              ${_}
              ${$}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let _=a.kernelShape.length,x=a.pads.length,$="";return d?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${m}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_-1}u; j++) {
                  offsets[j] = offset / ${X("uniforms.kernelStrides","j",_)};
                  offset -= offsets[j] * ${X("uniforms.kernelStrides","j",_)};
                }
                offsets[${_-1}] = offset;

                isPad = false;
                for (var j = ${r-_}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${X("uniforms.strides",`j - ${r-_}u`,_)}
                    + offsets[j - ${r-_}u] - ${X("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${s}

              output[global_idx] = value;
            }`}},tn=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,fl=e=>`${tn(e)};${e.countIncludePad}`,hl=e=>`${tn(e)};${e.storageOrder};${e.dilations}`,rn=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),nn=(e,t,r,n)=>{let[a,i]=Yi(t,n,r),s=D("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";a.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,f,h,m,y]=Ji(i,a);c.push(...J(t.dims,i));let _=["rank"];return{name:e,shaderCache:{hint:`${n.cacheKey};${h};${m};${y}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(i)/64)},programUniforms:c}),getShaderSource:x=>en(x,s,t.dims.length,i.length,a,l,d,0,f,h,m,y)}},ef=e=>{let t=e.count_include_pad!==0,r=rn(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let n={countIncludePad:t,...r,cacheKey:""};return{...n,cacheKey:fl(n)}},tf=(e,t)=>{rr(e.inputs),e.compute(nn("AveragePool",e.inputs[0],!1,t))},an={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},rf=e=>{let t=e.format;return{format:t,...an,cacheKey:t}},nf=(e,t)=>{rr(e.inputs),e.compute(nn("GlobalAveragePool",e.inputs[0],!0,t))},sn=(e,t,r,n)=>{let[a,i]=Yi(t,n,r),s=`
      value = max(x_val, value);
    `,u="",l=D("x",t.dataType,t.dims.length),d=["rank"],[c,f,h,m,y]=Ji(i,a);return c.push(...J(t.dims,i)),{name:e,shaderCache:{hint:`${n.cacheKey};${h};${m};${y}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(i)/64)},programUniforms:c}),getShaderSource:_=>en(_,l,t.dims.length,i.length,a,s,u,t.dataType===10?-65504:-1e5,f,h,m,y)}},af=(e,t)=>{rr(e.inputs),e.compute(sn("MaxPool",e.inputs[0],!1,t))},sf=e=>{let t=e.storage_order,r=e.dilations,n=rn(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...n,cacheKey:""};return{...a,cacheKey:hl(a)}},of=e=>{let t=e.format;return{format:t,...an,cacheKey:t}},uf=(e,t)=>{rr(e.inputs),e.compute(sn("GlobalMaxPool",e.inputs[0],!0,t))}}),ml,gl,lf,df,Mg=q(()=>{ie(),se(),Se(),ue(),ml=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,n)=>r===e[2].dims[n]).reduce((r,n)=>r&&n,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,i)=>i===t.axis||a===e[0].dims[i]).reduce((a,i)=>a&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],n=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/n)||t.blockSize>Math.ceil(r/(n-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},gl=(e,t)=>{let r=R.normalizeAxis(t.axis,e[0].dims.length),n=e[0].dataType,a=n===3,i=e[0].dims,s=e[1].dataType,u=R.size(i),l=n===3||n===2,d=l?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,f=e.length>2?e[2]:void 0,h=f?l?[Math.ceil(R.size(f.dims)/4)]:f.dims:void 0,m=c.length===0||c.length===1&&c[0]===1,y=m===!1&&c.length===1,_=ke(u),x=m&&(!l||_===4),$=x?_:1,w=x&&!l?_:1,S=D("input",l?12:n,d.length,w),k=D("scale",s,c.length),T=f?D("zero_point",l?12:n,h.length):void 0,O=Z("output",s,i.length,$),I=[S,k];T&&I.push(T);let z=[d,c];f&&z.push(h);let A=[{type:12,data:u/$},{type:12,data:r},{type:12,data:t.blockSize},...J(...z,i)],M=j=>{let V=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${j.registerUniforms(V).declareVariables(...I,O)}
      ${j.mainStart()}
          ${j.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${O.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${m?`let scale_value= ${k.getByOffset("0")}`:y?`
            let scale_index = ${O.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${k.getByOffset("scale_index")};`:`
            var scale_indices: ${k.type.indices} = output_indices;
            let index = ${k.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${k.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${k.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?m?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:y?l?`
                let zero_point_index = ${O.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${O.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${k.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${O.setByOffset("global_idx",`${O.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:M,getRunData:()=>({outputs:[{dims:i,dataType:s}],dispatchGroup:{x:Math.ceil(u/$/64),y:1,z:1},programUniforms:A})}},lf=(e,t)=>{ml(e.inputs,t),e.compute(gl(e.inputs,t))},df=e=>he({axis:e.axis,blockSize:e.blockSize})}),yl,_l,pf,Dg=q(()=>{Ye(),ie(),ue(),yl=(e,t,r)=>{let n=e===t,a=e<t&&r<0,i=e>t&&r>0;if(n||a||i)throw new Error("Range these inputs' contents are invalid.")},_l=(e,t,r,n)=>{let a=Math.abs(Math.ceil((t-e)/r)),i=[a],s=a,u=[{type:12,data:s},{type:n,data:e},{type:n,data:r},...J(i)],l=d=>{let c=Z("output",n,i.length),f=c.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${d.registerUniforms(h).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${n}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},pf=e=>{let t=0,r=0,n=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],n=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],n=e.inputs[2].getFloat32Array()[0]),$e.webgpu.validateInputContent&&yl(t,r,n),e.compute(_l(t,r,n,e.inputs[0].dataType),{inputs:[]})}}),bl,on,un,wl,cf,ff,Ng=q(()=>{ie(),se(),Se(),ue(),bl=(e,t,r,n)=>{if(e!=="none"&&n!=="i32"&&n!=="u32"&&n!=="f32")throw new Error(`Input ${n} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,i=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return n==="i32"||n==="u32"?`atomicAdd(&${t}, bitcast<${n}>(${r}));`:`
              ${a}bitcast<${n}>(oldValue) + (${r})${i}`;case"max":return n==="i32"||n==="u32"?`atomicMax(&${t}, bitcast<${n}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${i}`;case"min":return n==="i32"||n==="u32"?`atomicMin(&${t}, bitcast<${n}>(${r}));`:`${a}min(bitcast<${n}>(oldValue), (${r}))${i}`;case"mul":return`${a}(bitcast<${n}>(oldValue) * (${r}))${i}`;default:throw new Error(`Reduction ${e} is not supported.`)}},on=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,un=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${bl(e.reduction,"output[data_offset + i]","value",t)}
      }`,wl=(e,t)=>{let r=e[0].dims,n=e[1].dims,a=r,i=1,s=Math.ceil(R.size(n)/i),u=n[n.length-1],l=R.sizeFromDimension(r,u),d=R.sizeFromDimension(n,0)/u,c=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...J(e[1].dims,e[2].dims,a)],f=h=>{let m=D("indices",e[1].dataType,e[1].dims.length),y=D("updates",e[2].dataType,e[2].dims.length,i),_=t.reduction!=="none"&&t.reduction!==""?Wd("output",e[0].dataType,a.length):Z("output",e[0].dataType,a.length,i);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(m,y,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${d}; i = i + 1) {
      for (var j = i + 1; j < ${d}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${d}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${on(r.length,!1)}
      }
      ${un(t,_.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${on(r.length,!0)}
  }
  ${un(t,_.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f}},cf=e=>he({reduction:e.reduction}),ff=(e,t)=>{e.compute(wl(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),$l,vl,xl,ln,kl,Sl,Tl,Il,Cl,El,zl,Ol,dn,Al,Rl,Bl,Ml,Dl,hf,mf,Pg=q(()=>{ie(),se(),Se(),ue(),$l=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},vl=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let n=new Array(r).fill(1);return t.forEach((a,i)=>n[a]=e[i]),n},xl=(e,t,r,n,a,i)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>i.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>n.push(c)),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");$l(n,t),t.axes.length>0&&vl(n,t.axes,d).forEach((c,f)=>n[f]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>a.push(Number(c))),a.length!==0&&a.length!==d&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof n<"u"&&typeof a<"u"&&n.length>0&&a.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},ln=(e,t,r,n)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${n}(big / (${r}));
  let fract = ${n}(big % (${r})) / ${n}(${r});
  return whole + fract;
`,kl=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ln("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ln("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Sl=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Tl=(e,t,r)=>{let n=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?n:e.slice();return t.length>0?(t.forEach((i,s)=>{n[i]=a[s],n[s+r]=a[t.length+s]}),n):a},Il=(e,t,r,n)=>{let a=[];if(r.length>0)if(n.length>0){if(e.forEach(i=>a.push(i)),Math.max(...n)>e.length)throw new Error("axes is out of bound");n.forEach((i,s)=>a[i]=r[s])}else r.forEach(i=>a.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((i,s)=>Math.round(i*t[s]))}return a},Cl=(e,t,r)=>{let n=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=n),r.axes.forEach(i=>a[i]=Math.round(e[i]*t[i]))):(t.fill(n,0,t.length),a.forEach((i,s)=>a[s]=Math.round(i*t[s]))),a},El=(e,t,r,n,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${X("uniforms.scales","i",n)};
        var roi_low = ${X("uniforms.roi","i",a)};
        var roi_hi = ${X("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${X("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,zl=(e,t,r,n,a,i,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${X("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${X("uniforms.roi","i",i)};
          var roi_hi = ${X("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${X("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${X("uniforms.output_shape","i",n.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Ol=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${X("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,dn=(e,t,r,n)=>e.rank>n?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Al=(e,t,r,n,a)=>{let[i,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${dn(e,l,i,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${n?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${i}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Rl=(e,t,r,n,a,i,s,u,l,d)=>{let c=r.length===2,[f,h]=c?[0,1]:[2,3],m=e.type.value,y=_=>{let x=_===f?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",_)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[_]},
        ${n[_]}, ${r[_]}, ${i[_]}, ${i[_]} + ${r.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[_]} - 1))) {
          return ${l};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${m} = originalIdx + ${m}(i);
          if (${x} < 0 || ${x} >= ${r[_]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${x} = max(0, min(${x}, ${r[_]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",_,`u32(${x})`)};
          data[i + 1] = ${_===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${y(f)};
    ${y(h)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Bl=(e,t,r,n,a)=>{let[i,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${dn(e,d,i,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${n?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${i}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Ml=(e,t,r,n,a,i)=>{let s=e.dims,u=Tl(i,t.axes,s.length),l=Il(s,n,a,t.axes),d=n.slice();n.length===0&&(d=s.map((w,S)=>w===0?1:l[S]/w),t.keepAspectRatioPolicy!=="stretch"&&(l=Cl(s,d,t)));let c=Z("output",e.dataType,l.length),f=D("input",e.dataType,s.length),h=R.size(l),m=s.length===l.length&&s.every((w,S)=>w===l[S]),y=t.coordinateTransformMode==="tf_crop_and_resize",_=t.extrapolationValue,x=f.type.value,$=w=>`
      ${m?"":`
      ${kl(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Ol(f,s)};
              ${Sl(t.nearestMode,r,x)};
              ${zl(f,c,s,l,d.length,u.length,y)};
              `;case"linear":return`
              ${El(c,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Al(f,c,s,y,_)}`;if(s.length===3||s.length===5)return`${Bl(f,c,s,y,_)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Rl(f,c,s,l,d,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(f,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${m?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${m}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:d},{type:1,data:u},...J(s,l)]})}},Dl=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},hf=(e,t)=>{let r=[],n=[],a=[],i=Dl(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");xl(e.inputs,t,i,r,n,a),e.compute(Ml(e.inputs[0],t,i,r,n,a),{inputs:[0]})},mf=e=>{let t=e.antialias,r=e.axes,n=e.coordinateTransformMode,a=e.cubicCoeffA,i=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return he({antialias:t,axes:r,coordinateTransformMode:n,cubicCoeffA:a,excludeOutside:i,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),Nl,Pl,gf,Ug=q(()=>{ie(),se(),ue(),Nl=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],n=e[2];if(t.dataType!==r.dataType||t.dataType!==n.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(n.dims.length!==1)throw new Error("Gamma must be 1D");if(n.dims[n.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Pl=(e,t,r,n)=>{let a=t.simplified,i=e[0].dims,s=R.size(i),u=i,l=s,d=i.slice(-1)[0],c=n?i.slice(0,-1).concat(1):[],f=!a&&e.length>3,h=e.length>4,m=n&&r>1,y=n&&r>2,_=r>3,x=64,$=ke(d),w=[{type:12,data:l},{type:12,data:$},{type:12,data:d},{type:1,data:t.epsilon}],S=T=>{let O=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],I=[D("x",e[0].dataType,e[0].dims,$),D("skip",e[1].dataType,e[1].dims,$),D("gamma",e[2].dataType,e[2].dims,$)];f&&I.push(D("beta",e[3].dataType,e[3].dims,$)),h&&I.push(D("bias",e[4].dataType,e[4].dims,$)),I.push(Z("output",e[0].dataType,u,$)),m&&I.push(Z("mean_output",1,c)),y&&I.push(Z("inv_std_output",1,c)),_&&I.push(Z("input_skip_bias_sum",e[0].dataType,u,$));let z=Ie(e[0].dataType),A=Ie(1,$);return`

      ${T.registerUniforms(O).declareVariables(...I)}
      var<workgroup> sum_shared : array<${A}, ${x}>;
      var<workgroup> sum_squared_shared : array<${A}, ${x}>;

      ${T.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":z+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${_?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${qt(z,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${bt("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${bt("square_sum",$)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${m?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${z}(mean)`}) *
            ${z}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},k=[{dims:u,dataType:e[0].dataType}];return r>1&&k.push({dims:c,dataType:1}),r>2&&k.push({dims:c,dataType:1}),r>3&&k.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${m};${y};${_}`,inputDependencies:e.map((T,O)=>"type")},getShaderSource:S,getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:w})}},gf=(e,t)=>{Nl(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Pl(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Ul,ir,Wl,pn,Ll,ql,yf,_f,Wg=q(()=>{ie(),se(),Se(),ue(),Ul=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw new Error(`Input ${n} must be an array of int32 or int64`)})},ir=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(n=>r.push(Number(n)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(n=>r.push(Number(n)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Wl=(e,t)=>{if(e.length>1){let r=ir(e,1),n=ir(e,2),a=ir(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),he({starts:r,ends:n,axes:a})}else return t},pn=(e,t,r,n,a)=>{let i=e;return e<0&&(i+=r[n[t]]),a[t]<0?Math.max(0,Math.min(i,r[n[t]]-1)):Math.max(0,Math.min(i,r[n[t]]))},Ll=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${X("uniforms.input_shape","i",r.length)};
            let steps_i = ${X("uniforms.steps","i",r.length)};
            let signs_i = ${X("uniforms.signs","i",r.length)};
            let starts_i = ${X("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,ql=(e,t)=>{let r=e[0].dims,n=R.size(r),a=t.axes.length>0?R.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=ir(e,4);i.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(a.length).fill(1));let s=t.starts.map(($,w)=>pn($,w,r,a,i)),u=t.ends.map(($,w)=>pn($,w,r,a,i));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let $=0;$<r.length;++$)a.includes($)||(s.splice($,0,0),u.splice($,0,r[$]),i.splice($,0,1));let l=i.map($=>Math.sign($));i.forEach(($,w,S)=>{if($<0){let k=(u[w]-s[w])/$,T=s[w],O=T+k*i[w];s[w]=O,u[w]=T,S[w]=-$}});let d=r.slice(0);a.forEach(($,w)=>{d[$]=Math.ceil((u[$]-s[$])/i[$])});let c={dims:d,dataType:e[0].dataType},f=Z("output",e[0].dataType,d.length),h=D("input",e[0].dataType,e[0].dims.length),m=R.size(d),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:i.length}],_=[{type:12,data:m},{type:12,data:s},{type:6,data:l},{type:12,data:i},...J(e[0].dims,d)],x=$=>`
      ${$.registerUniforms(y).declareVariables(h,f)}
        ${Ll(h,f,r)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:_})}},yf=(e,t)=>{Ul(e.inputs,t);let r=Wl(e.inputs,t);e.compute(ql(e.inputs,r),{inputs:[0]})},_f=e=>{let t=e.starts,r=e.ends,n=e.axes;return he({starts:t,ends:r,axes:n})}}),Vl,Gl,bf,wf,Lg=q(()=>{ie(),se(),Se(),wt(),ue(),Vl=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Gl=(e,t)=>{let r=e.inputs[0],n=r.dims,a=R.size(n),i=n.length,s=R.normalizeAxis(t.axis,i),u=s<n.length-1,l,d=[];u?(d=Array.from({length:i},(I,z)=>z),d[s]=i-1,d[i-1]=s,l=e.compute(Ue(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,f=c[i-1],h=a/f,m=ke(f),y=f/m,_=64;h===1&&(_=256);let x=(I,z)=>z===4?`max(max(${I}.x, ${I}.y), max(${I}.z, ${I}.w))`:z===2?`max(${I}.x, ${I}.y)`:z===3?`max(max(${I}.x, ${I}.y), ${I}.z)`:I,$=D("x",l.dataType,l.dims,m),w=Z("result",l.dataType,l.dims,m),S=$.type.value,k=Ie(l.dataType)==="f32"?`var threadMax = ${S}(-3.402823e+38f);`:`var threadMax = ${S}(-65504.0h);`,T=I=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${I.registerUniform("packedCols","i32").declareVariables($,w)}
      ${I.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${k}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${x("threadShared[0]",m)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${bt("threadShared[0]",m)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,O=e.compute({name:"Softmax",shaderCache:{hint:`${m};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:y}]}),getShaderSource:T},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Ue(O,d),{inputs:[O]})},bf=(e,t)=>{Vl(e.inputs),Gl(e,t)},wf=e=>he({axis:e.axis})}),cn,Fl,Hl,jl,$f,qg=q(()=>{ie(),se(),ue(),cn=e=>Array.from(e.getBigInt64Array(),Number),Fl=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(cn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Hl=(e,t)=>{let r=[];for(let n=0;n<e.length;++n)r.push(e[n]*t[n]);return r},jl=(e,t)=>{let r=e[0].dims,n=t??cn(e[1]),a=Hl(r,n),i=R.size(a),s=e[0].dataType,u=D("input",s,r.length),l=Z("output",s,a.length),d=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${n}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...J(e[0].dims,a)]}),getShaderSource:d}},$f=e=>{Fl(e.inputs),e.compute(jl(e.inputs),{inputs:[0]})}}),Kl,Zl,vf,Vg=q(()=>{ie(),se(),ue(),Kl=(e,t,r,n,a)=>{let i=Z("output_data",a,r.length,4),s=D("a_data",t[1].dataType,t[1].dims.length,4),u=D("b_data",t[2].dataType,t[2].dims.length,4),l=D("c_data",t[0].dataType,t[0].dims.length,4),d,c=(f,h,m)=>`select(${h}, ${f}, ${m})`;if(!n)d=i.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let f=(h,m,y="")=>{let _=`a_data[index_a${m}][component_a${m}]`,x=`b_data[index_b${m}][component_b${m}]`,$=`bool(c_data[index_c${m}] & (0xffu << (component_c${m} * 8)))`;return`
            let output_indices${m} = ${i.offsetToIndices(`global_idx * 4u + ${m}u`)};
            let offset_a${m} = ${s.broadcastedIndicesToOffset(`output_indices${m}`,i)};
            let offset_b${m} = ${u.broadcastedIndicesToOffset(`output_indices${m}`,i)};
            let offset_c${m} = ${l.broadcastedIndicesToOffset(`output_indices${m}`,i)};
            let index_a${m} = offset_a${m} / 4u;
            let index_b${m} = offset_b${m} / 4u;
            let index_c${m} = offset_c${m} / 4u;
            let component_a${m} = offset_a${m} % 4u;
            let component_b${m} = offset_b${m} % 4u;
            let component_c${m} = offset_c${m} % 4u;
            ${h}[${m}] = ${y}(${c(_,x,$)});
          `};a===9?d=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,i)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Zl=e=>{let t=e[1].dims,r=e[2].dims,n=e[0].dims,a=e[1].dataType,i=!(R.areEqual(t,r)&&R.areEqual(r,n)),s=t,u=R.size(t);if(i){let d=Vt.calcShape(Vt.calcShape(t,r,!1),n,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=R.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>Kl(d,e,s,i,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...J(n,t,r,s)]})}},vf=e=>{e.compute(Zl(e.inputs))}}),xf,Gg=q(()=>{ng(),Zn(),ag(),sg(),og(),ug(),lg(),hg(),gg(),yg(),_g(),bg(),wg(),$g(),vg(),xg(),kg(),Sg(),Tg(),Ig(),Cg(),Eg(),zg(),Og(),Ag(),Lc(),Rg(),Bg(),Mg(),Dg(),Ng(),Kn(),Pg(),Hc(),Ug(),Wg(),Lg(),Gc(),qg(),wt(),Qn(),Vg(),xf=new Map([["Abs",[mp]],["Acos",[gp]],["Acosh",[yp]],["Add",[Xp]],["ArgMax",[pp,xn]],["ArgMin",[dp,xn]],["Asin",[_p]],["Asinh",[bp]],["Atan",[wp]],["Atanh",[$p]],["Attention",[cp]],["AveragePool",[tf,ef]],["BatchNormalization",[fp]],["BiasAdd",[hp]],["BiasSplitGelu",[Qp]],["Cast",[xp,vp]],["Ceil",[Sp]],["Clip",[kp]],["Concat",[oc,uc]],["Conv",[En,Cn]],["ConvTranspose",[_c,yc]],["Cos",[Tp]],["Cosh",[Ip]],["CumSum",[bc,wc]],["DepthToSpace",[$c,vc]],["DequantizeLinear",[lf,df]],["Div",[Yp]],["Einsum",[xc,kc]],["Elu",[Cp,ur]],["Equal",[Jp]],["Erf",[Ep]],["Exp",[zp]],["Expand",[Sc]],["FastGelu",[Tc]],["Floor",[Op]],["FusedConv",[En,Cn]],["Gather",[Cc,Ic]],["GatherElements",[Bc,Rc]],["GatherBlockQuantized",[Oc,Ac]],["GatherND",[Ec,zc]],["Gelu",[Ap]],["Gemm",[Dc,Mc]],["GlobalAveragePool",[nf,rf]],["GlobalMaxPool",[uf,of]],["Greater",[ic]],["GreaterOrEqual",[ac]],["GridSample",[Nc,Pc]],["GroupQueryAttention",[jc]],["HardSigmoid",[Wp,Up]],["InstanceNormalization",[Kc]],["LayerNormalization",[Zc]],["LeakyRelu",[Rp,ur]],["Less",[nc]],["LessOrEqual",[sc]],["Log",[Kp]],["MatMul",[Qc]],["MatMulNBits",[Xc,Yc]],["MaxPool",[af,sf]],["Mul",[ec]],["MultiHeadAttention",[Wc,Uc]],["Neg",[Mp]],["Not",[Bp]],["Pad",[Jc]],["Pow",[tc]],["QuickGelu",[Zp,ur]],["Range",[pf]],["Reciprocal",[Dp]],["ReduceMin",[ap]],["ReduceMean",[ep]],["ReduceMax",[np]],["ReduceSum",[op]],["ReduceProd",[sp]],["ReduceL1",[tp]],["ReduceL2",[rp]],["ReduceLogSum",[lp]],["ReduceLogSumExp",[ip]],["ReduceSumSquare",[up]],["Relu",[Np]],["Resize",[hf,mf]],["RotaryEmbedding",[Fc]],["ScatterND",[ff,cf]],["Sigmoid",[Pp]],["Sin",[Lp]],["Sinh",[qp]],["Slice",[yf,_f]],["SkipLayerNormalization",[gf]],["Split",[qc,Vc]],["Sqrt",[Vp]],["Softmax",[bf,wf]],["Sub",[rc]],["Tan",[Gp]],["Tanh",[Fp]],["ThresholdedRelu",[jp,ur]],["Tile",[$f]],["Transpose",[qd,Vd]],["Where",[vf]]])}),kf,Fg=q(()=>{Ye(),lt(),ue(),kf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,n,a){it(e.programInfo.name);let i=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});a&&u.push({binding:u.length,resource:a});let l=i.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:n};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...n),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Xe(e.programInfo.name)}dispose(){}build(e,t){it(e.name);let r=this.backend.device,n=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&n.push(`enable ${d.extension};`)});let a=Ld(t,this.backend.device.limits),i=e.getShaderSource(a),s=`${n.join(`
`)}
${a.additionalImplementations}
${i}`,u=r.createShaderModule({code:s,label:e.name});de("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Xe(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,n=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&n<=a)return[t,r,n];let i=t*r*n,s=Math.ceil(Math.sqrt(i));if(s>a){if(s=Math.ceil(Math.cbrt(i)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Sf={};Ft(Sf,{WebGpuBackend:()=>Tf});var Ql,Xl,Yl,Tf,Hg=q(()=>{Ye(),ie(),lt(),Dd(),rg(),Gg(),Fg(),Ql=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let n=0;n<e.length;++n){let a=e[n].dataType;switch(t[n]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let i=e[n].dims.length;r.push(`${a};${i}`);break}case"dims":{let i=e[n].dims.join(",");r.push(`${a};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[n]}`)}}return r.join("|")},Xl=(e,t,r)=>{var a,i;let n=e.name;return(a=e.shaderCache)!=null&&a.hint&&(n+="["+e.shaderCache.hint+"]"),n+=":"+r+`:${Ql(t,((i=e.shaderCache)==null?void 0:i.inputDependencies)??new Array(t.length).fill("dims"))}`,n},Yl=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Tf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],n={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=i=>t.features.has(i)&&r.push(i)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(n),this.adapterInfo=new Yl(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Ud(this),this.programManager=new kf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Gn(e.logLevel,!!e.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;it(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var n;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let i=r[a],s=i.kernelId,u=this.kernels.get(s),l=u.kernelType,d=u.kernelName,c=i.programName,f=i.inputTensorViews,h=i.outputTensorViews,m=t[a*2],y=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=m);let _=Number(m-this.queryTimeBase),x=Number(y-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((n=this.env.webgpu.profiling)!=null&&n.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map($=>({dims:$.dims,dataType:ut($.dataType)})),outputsMetadata:h.map($=>({dims:$.dims,dataType:ut($.dataType)})),kernelId:s,kernelType:l,kernelName:d,programName:c,startTime:_,endTime:x});else{let $="";f.forEach((S,k)=>{$+=`input[${k}]: [${S.dims}] | ${ut(S.dataType)}, `});let w="";h.forEach((S,k)=>{w+=`output[${k}]: [${S.dims}] | ${ut(S.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${d}|${c}" ${$}${w}execution time: ${x-_} ns`)}Ur("GPU",`${c}::${m}::${y}`)}e.unmap(),this.pendingQueries.delete(e)}),Xe()}run(e,t,r,n,a,i){it(e.name);let s=[];for(let w=0;w<t.length;++w){let S=t[w].data;if(S===0)continue;let k=this.gpuDataManager.get(S);if(!k)throw new Error(`no GPU data for input: ${S}`);s.push(k)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?u.map((w,S)=>S):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let f=[],h=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=i)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let S=c[w]===-1,k=c[w]===-2,T=S||k?a(u[w].dataType,u[w].dims):n(c[w],u[w].dataType,u[w].dims);if(f.push(T),T.data===0)continue;let O=this.gpuDataManager.get(T.data);if(!O)throw new Error(`no GPU data for output: ${T.data}`);if(S&&this.temporaryData.push(O),k){let I=this.kernelPersistentData.get(this.currentKernelId);I||(I=[],this.kernelPersistentData.set(this.currentKernelId,I)),I.push(O)}h.push(O)}if(s.length!==t.length||h.length!==f.length){if(h.length===0)return Xe(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let m;if(d){let w=0,S=[];d.forEach(I=>{let z=typeof I.data=="number"?[I.data]:I.data;if(z.length===0)return;let A=I.type===10?2:4,M,j;I.type===10?(j=z.length>4?16:z.length>2?8:z.length*A,M=z.length>4?16:A*z.length):(j=z.length<=2?z.length*A:16,M=16),w=Math.ceil(w/j)*j,S.push(w);let V=I.type===10?8:4;w+=z.length>4?Math.ceil(z.length/V)*M:z.length*A});let k=16;w=Math.ceil(w/k)*k;let T=new ArrayBuffer(w);d.forEach((I,z)=>{let A=S[z],M=typeof I.data=="number"?[I.data]:I.data;if(I.type===6)new Int32Array(T,A,M.length).set(M);else if(I.type===12)new Uint32Array(T,A,M.length).set(M);else if(I.type===10)new Uint16Array(T,A,M.length).set(M);else if(I.type===1)new Float32Array(T,A,M.length).set(M);else throw new Error(`Unsupported uniform type: ${ut(I.type)}`)});let O=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(O.buffer,0,T,0,w),this.gpuDataManager.release(O.id),m={offset:0,size:w,buffer:O.buffer}}let y=this.programManager.normalizeDispatchGroupSize(l),_=y[1]===1&&y[2]===1,x=Xl(e,t,_),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,y),this.programManager.setArtifact(x,$),de("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),d&&$.uniformVariablesInfo){if(d.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${d.length} in program "${$.programInfo.name}".`);for(let w=0;w<d.length;w++){let S=d[w],k=S.type,T=typeof S.data=="number"?1:S.data.length,[O,I]=$.uniformVariablesInfo[w];if(k!==O||T!==I)throw new Error(`Uniform variable ${w} mismatch: expect type ${O} with size ${I}, got type ${k} with size ${T} in program "${$.programInfo.name}".`)}}if(de("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run($,s,h,y,m),Xe(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,n){let a=xf.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let i={kernelType:e,kernelName:n,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,i)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let n=this.kernels.get(e);if(!n)throw new Error(`kernel not created: ${e}`);let a=n.kernelType,i=n.kernelName,s=n.kernelEntry,u=n.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${i}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),de("info",()=>`[WebGPU] Start to run kernel "[${a}] ${i}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${i}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${a}] ${i}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,n){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let i=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,n,i);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let n=await wn(this,e,t);return Fn(n.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){de("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){de("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){de("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let n=0;n<r;n++){let a=this.getComputePassEncoder(),i=e[n];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(i.computePipeline),a.setBindGroup(0,i.bindGroup),a.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[n]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),If={};Ft(If,{init:()=>Cf});var Br,Jl,Cf,jg=q(()=>{ie(),lt(),se(),tg(),Br=class Ef{constructor(t,r,n,a){this.module=t,this.dataType=r,this.data=n,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(R.size(t)!==R.size(this.dims))throw new Error("Invalid new shape");return new Ef(this.module,this.dataType,this.data,t)}},Jl=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let n=e.PTR_SIZE,a=r/e.PTR_SIZE,i=n===4?"i32":"i64";this.opKernelContext=Number(e.getValue(n*a++,i));let s=Number(e.getValue(n*a++,i));this.outputCount=Number(e.getValue(n*a++,i)),this.customDataOffset=Number(e.getValue(n*a++,"*")),this.customDataSize=Number(e.getValue(n*a++,i));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(n*a++,i)),c=Number(e.getValue(n*a++,"*")),f=Number(e.getValue(n*a++,i)),h=[];for(let m=0;m<f;m++)h.push(Number(e.getValue(n*a++,i)));u.push(new Br(e,d,c,h))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,n=(t==null?void 0:t.outputs)??[],a=(u,l,d)=>new Br(this.module,l,this.output(u,d),d),i=(u,l)=>{let d=At(u,l);if(!d)throw new Error(`Unsupported data type: ${u}`);let c=d>0?this.backend.gpuDataManager.create(d).id:0;return new Br(this.module,u,c,l)};return this.backend.run(e,r,n,a,i,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let n=this.module.PTR_SIZE,a=n===4?"i32":"i64",i=this.module.stackAlloc((1+t.length)*n);this.module.setValue(i,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(i+n*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(n){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${n}`)}finally{this.module.stackRestore(r)}}},Cf=async(e,t,r,n)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=(Hg(),pr(Sf)).WebGpuBackend,s=new i;await s.initialize(r,n),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,c=!1)=>{if(c)de("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{de("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),f)}},async(u,l,d)=>{de("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,c)=>{de("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let f=new Jl(t,s,Number(l));return s.computeKernel(Number(u),f,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let i=new Pd(r);a("webnn",[i,()=>i.reserveTensorId(),s=>i.releaseTensorId(s),async(s,u,l,d,c)=>i.ensureTensor(s,u,l,d,c),(s,u)=>{i.uploadTensor(s,u)},async(s,u)=>i.downloadTensor(s,u)])}}}),ed,ra,ia,yt,td,fn,jr,na,aa,hn,sa,oa,ua,zf=q(()=>{Ym(),Jm(),ie(),Dt(),Wn(),Ad(),ed=(e,t)=>{we()._OrtInit(e,t)!==0&&ye("Can't initialize onnxruntime.")},ra=async e=>{ed(e.wasm.numThreads,qr(e.logLevel))},ia=async(e,t)=>{var r,n;(n=(r=we()).asyncInit)==null||n.call(r);{let a=(jg(),pr(If)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let u=e.webgpu.forceFallbackAdapter;if(u!==void 0&&typeof u!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${u}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:u}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await a("webgpu",we(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await a("webnn",we(),e)}}},yt=new Map,td=e=>{let t=we(),r=t.stackSave();try{let n=t.PTR_SIZE,a=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,a,a+n)!==0&&ye("Can't get session input/output count.");let i=n===4?"i32":"i64";return[Number(t.getValue(a,i)),Number(t.getValue(a+n,i))]}finally{t.stackRestore(r)}},fn=(e,t)=>{let r=we(),n=r.stackSave(),a=0;try{let i=r.PTR_SIZE,s=r.stackAlloc(2*i);r._OrtGetInputOutputMetadata(e,t,s,s+i)!==0&&ye("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+i,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let d=r.HEAPU32[a/4+1],c=[];for(let f=0;f<d;f++){let h=Number(r.getValue(a+8+f*i,"*"));c.push(h!==0?r.UTF8ToString(h):Number(r.getValue(a+8+(f+d)*i,"*")))}return[u,l,c]}finally{r.stackRestore(n),a!==0&&r._OrtFree(a)}},jr=e=>{let t=we(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},na=async(e,t)=>{var f,h,m,y;let r,n,a=we();Array.isArray(e)?[r,n]=e:e.buffer===a.HEAPU8.buffer?[r,n]=[e.byteOffset,e.byteLength]:[r,n]=jr(e);let i=0,s=0,u=0,l=[],d=[],c=[];try{if([s,l]=await Od(t),(t==null?void 0:t.externalData)&&a.mountExternalData){let z=[];for(let A of t.externalData){let M=typeof A=="string"?A:A.path;z.push(Vn(typeof A=="string"?A:A.data).then(j=>{a.mountExternalData(M,j)}))}await Promise.all(z)}for(let z of(t==null?void 0:t.executionProviders)??[])if((typeof z=="string"?z:z.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof z!="string"){let A=z,M=A==null?void 0:A.context,j=A==null?void 0:A.gpuDevice,V=A==null?void 0:A.deviceType,F=A==null?void 0:A.powerPreference;M?a.currentContext=M:j?a.currentContext=await a.webnnCreateMLContext(j):a.currentContext=await a.webnnCreateMLContext({deviceType:V,powerPreference:F})}else a.currentContext=await a.webnnCreateMLContext();break}i=await a._OrtCreateSession(r,n,s),(f=a.webgpuOnCreateSession)==null||f.call(a,i),i===0&&ye("Can't create a session."),(h=a.jsepOnCreateSession)==null||h.call(a),a.currentContext&&(a.webnnRegisterMLContext(i,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[_,x]=td(i),$=!!(t!=null&&t.enableGraphCapture),w=[],S=[],k=[],T=[],O=[];for(let z=0;z<_;z++){let[A,M,j]=fn(i,z);A===0&&ye("Can't get an input name."),d.push(A);let V=a.UTF8ToString(A);w.push(V),k.push(M===0?{name:V,isTensor:!1}:{name:V,isTensor:!0,type:ut(M),shape:j})}for(let z=0;z<x;z++){let[A,M,j]=fn(i,z+_);A===0&&ye("Can't get an output name."),c.push(A);let V=a.UTF8ToString(A);S.push(V),T.push(M===0?{name:V,isTensor:!1}:{name:V,isTensor:!0,type:ut(M),shape:j});{if($&&(t==null?void 0:t.preferredOutputLocation)===void 0){O.push("gpu-buffer");continue}let F=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((m=t==null?void 0:t.preferredOutputLocation)==null?void 0:m[V])??"cpu",ee=a.webnnIsGraphOutput;if(F==="cpu"&&ee&&ee(i,V)){O.push("ml-tensor-cpu-output");continue}if(F!=="cpu"&&F!=="cpu-pinned"&&F!=="gpu-buffer"&&F!=="ml-tensor")throw new Error(`Not supported preferred output location: ${F}.`);if($&&F!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${F}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);O.push(F)}}let I=null;return O.some(z=>z==="gpu-buffer"||z==="ml-tensor"||z==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(i),u===0&&ye("Can't create IO binding."),I={handle:u,outputPreferredLocations:O,outputPreferredLocationsEncoded:O.map(z=>z==="ml-tensor-cpu-output"?"ml-tensor":z).map(z=>_n(z))}),yt.set(i,[i,d,c,I,$,!1]),[i,w,S,k,T]}catch(_){throw d.forEach(x=>a._OrtFree(x)),c.forEach(x=>a._OrtFree(x)),u!==0&&a._OrtReleaseBinding(u)!==0&&ye("Can't release IO binding."),i!==0&&a._OrtReleaseSession(i)!==0&&ye("Can't release session."),_}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&ye("Can't release session options."),l.forEach(_=>a._free(_)),(y=a.unmountExternalData)==null||y.call(a)}},aa=e=>{var l,d,c;let t=we(),r=yt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[n,a,i,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&ye("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&ye("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(c=t.webgpuOnReleaseSession)==null||c.call(t,e),a.forEach(f=>t._OrtFree(f)),i.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(n)!==0&&ye("Can't release session."),yt.delete(e)},hn=async(e,t,r,n,a,i,s=!1)=>{if(!e){t.push(0);return}let u=we(),l=u.PTR_SIZE,d=e[0],c=e[1],f=e[3],h=f,m,y;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let $=e[2].gpuBuffer;y=At(Ot(d),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');m=w(n,i,$,y)}}else if(f==="ml-tensor"){let $=e[2].mlTensor;y=At(Ot(d),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');m=w(n,$,Ot(d),c)}else{let $=e[2];if(Array.isArray($)){y=l*$.length,m=u._malloc(y),r.push(m);for(let w=0;w<$.length;w++){if(typeof $[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(m+w*l,Qe($[w],r),"*")}}else{let w=u.webnnIsGraphInput,S=u.webnnIsGraphOutput;if(d!=="string"&&w&&S){let k=u.UTF8ToString(a);if(w(n,k)||S(n,k)){let T=Ot(d);y=At(T,c),h="ml-tensor";let O=u.webnnCreateTemporaryTensor,I=u.webnnUploadTensor;if(!O||!I)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await O(n,T,c);I(z,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),m=z}else y=$.byteLength,m=u._malloc(y),r.push(m),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,y),m)}else y=$.byteLength,m=u._malloc(y),r.push(m),u.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,y),m)}}let _=u.stackSave(),x=u.stackAlloc(4*c.length);try{c.forEach((w,S)=>u.setValue(x+S*l,w,l===4?"i32":"i64"));let $=u._OrtCreateTensor(Ot(d),m,y,x,c.length,_n(h));$===0&&ye(`Can't create tensor for input/output. session=${n}, index=${i}.`),t.push($)}finally{u.stackRestore(_)}},sa=async(e,t,r,n,a,i)=>{var j,V,F,ee;let s=we(),u=s.PTR_SIZE,l=yt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],f=l[2],h=l[3],m=l[4],y=l[5],_=t.length,x=n.length,$=0,w=[],S=[],k=[],T=[],O=s.stackSave(),I=s.stackAlloc(_*u),z=s.stackAlloc(_*u),A=s.stackAlloc(x*u),M=s.stackAlloc(x*u);try{[$,w]=zd(i);for(let K=0;K<_;K++)await hn(r[K],S,T,e,c[t[K]],t[K],m);for(let K=0;K<x;K++)await hn(a[K],k,T,e,f[n[K]],_+n[K],m);for(let K=0;K<_;K++)s.setValue(I+K*u,S[K],"*"),s.setValue(z+K*u,c[t[K]],"*");for(let K=0;K<x;K++)s.setValue(A+K*u,k[K],"*"),s.setValue(M+K*u,f[n[K]],"*");if(h&&!y){let{handle:K,outputPreferredLocations:te,outputPreferredLocationsEncoded:be}=h;if(c.length!==_)throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${c.length}).`);for(let P=0;P<_;P++){let E=t[P];await s._OrtBindInput(K,c[E],S[P])!==0&&ye(`Can't bind input[${P}] for session=${e}.`)}for(let P=0;P<x;P++){let E=n[P];(j=a[P])!=null&&j[3]?s._OrtBindOutput(K,f[E],k[P],0)!==0&&ye(`Can't bind pre-allocated output[${P}] for session=${e}.`):s._OrtBindOutput(K,f[E],0,be[E])!==0&&ye(`Can't bind output[${P}] to ${te[P]} for session=${e}.`)}yt.set(e,[d,c,f,h,m,!0])}(V=s.jsepOnRunStart)==null||V.call(s,d),(F=s.webnnOnRunStart)==null||F.call(s,d);let ne;h?ne=await s._OrtRunWithBinding(d,h.handle,x,A,$):ne=await s._OrtRun(d,z,I,_,M,x,A,$),ne!==0&&ye("failed to call OrtRun().");let H=[],ae=[];for(let K=0;K<x;K++){let te=Number(s.getValue(A+K*u,"*"));if(te===k[K]){H.push(a[K]);continue}let be=s.stackSave(),P=s.stackAlloc(4*u),E=!1,U,Q=0;try{s._OrtGetTensorData(te,P,P+u,P+2*u,P+3*u)!==0&&ye(`Can't access output tensor data on index ${K}.`);let me=u===4?"i32":"i64",N=Number(s.getValue(P,me));Q=s.getValue(P+u,"*");let pe=s.getValue(P+u*2,"*"),We=Number(s.getValue(P+u*3,me)),Ce=[];for(let ge=0;ge<We;ge++)Ce.push(Number(s.getValue(pe+ge*u,me)));s._OrtFree(pe)!==0&&ye("Can't free memory for tensor dims.");let Ve=Ce.reduce((ge,xe)=>ge*xe,1);U=ut(N);let nt=h==null?void 0:h.outputPreferredLocations[n[K]];if(U==="string"){if(nt==="gpu-buffer"||nt==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ge=[];for(let xe=0;xe<Ve;xe++){let Me=s.getValue(Q+xe*u,"*"),$t=s.getValue(Q+(xe+1)*u,"*"),vt=xe===Ve-1?void 0:$t-Me;ge.push(s.UTF8ToString(Me,vt))}H.push([U,Ce,ge,"cpu"])}else if(nt==="gpu-buffer"&&Ve>0){let ge=s.jsepGetBuffer;if(!ge)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let xe=ge(Q),Me=At(N,Ve);if(Me===void 0||!Ln(U))throw new Error(`Unsupported data type: ${U}`);E=!0,H.push([U,Ce,{gpuBuffer:xe,download:s.jsepCreateDownloader(xe,Me,U),dispose:()=>{s._OrtReleaseTensor(te)!==0&&ye("Can't release tensor.")}},"gpu-buffer"])}else if(nt==="ml-tensor"&&Ve>0){let ge=s.webnnEnsureTensor,xe=s.webnnIsGraphInputOutputTypeSupported;if(!ge||!xe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(At(N,Ve)===void 0||!qn(U))throw new Error(`Unsupported data type: ${U}`);if(!xe(e,U,!1))throw new Error(`preferredLocation "ml-tensor" for ${U} output is not supported by current WebNN Context.`);let Me=await ge(e,Q,N,Ce,!1);E=!0,H.push([U,Ce,{mlTensor:Me,download:s.webnnCreateMLTensorDownloader(Q,U),dispose:()=>{s.webnnReleaseTensorId(Q),s._OrtReleaseTensor(te)}},"ml-tensor"])}else if(nt==="ml-tensor-cpu-output"&&Ve>0){let ge=s.webnnCreateMLTensorDownloader(Q,U)(),xe=H.length;E=!0,ae.push((async()=>{let Me=[xe,await ge];return s.webnnReleaseTensorId(Q),s._OrtReleaseTensor(te),Me})()),H.push([U,Ce,[],"cpu"])}else{let ge=Kr(U),xe=new ge(Ve);new Uint8Array(xe.buffer,xe.byteOffset,xe.byteLength).set(s.HEAPU8.subarray(Q,Q+xe.byteLength)),H.push([U,Ce,xe,"cpu"])}}finally{s.stackRestore(be),U==="string"&&Q&&s._free(Q),E||s._OrtReleaseTensor(te)}}h&&!m&&(s._OrtClearBoundOutputs(h.handle)!==0&&ye("Can't clear bound outputs."),yt.set(e,[d,c,f,h,m,!1]));for(let[K,te]of await Promise.all(ae))H[K][2]=te;return H}finally{(ee=s.webnnOnRunEnd)==null||ee.call(s,d),s.stackRestore(O),S.forEach(ne=>s._OrtReleaseTensor(ne)),k.forEach(ne=>s._OrtReleaseTensor(ne)),T.forEach(ne=>s._free(ne)),$!==0&&s._OrtReleaseRunOptions($),w.forEach(ne=>s._free(ne))}},oa=e=>{let t=we(),r=yt.get(e);if(!r)throw new Error("invalid session id");let n=r[0],a=t._OrtEndProfiling(n);a===0&&ye("Can't get an profile file name."),t._OrtFree(a)},ua=e=>{let t=[];for(let r of e){let n=r[2];!Array.isArray(n)&&"buffer"in n&&t.push(n.buffer)}return t}}),_t,Be,Wt,nr,ar,Mr,mn,Dr,Ct,Et,rd,Of,Af,Rf,Bf,Mf,Df,Nf,Pf=q(()=>{Ye(),zf(),Dt(),Pn(),_t=()=>!!$e.wasm.proxy&&typeof document<"u",Wt=!1,nr=!1,ar=!1,Dr=new Map,Ct=(e,t)=>{let r=Dr.get(e);r?r.push(t):Dr.set(e,[t])},Et=()=>{if(Wt||!nr||ar||!Be)throw new Error("worker not ready")},rd=e=>{switch(e.data.type){case"init-wasm":Wt=!1,e.data.err?(ar=!0,mn[1](e.data.err)):(nr=!0,mn[0]()),Mr&&(URL.revokeObjectURL(Mr),Mr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Dr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},Of=async()=>{if(!nr){if(Wt)throw new Error("multiple calls to 'initWasm()' detected.");if(ar)throw new Error("previous call to 'initWasm()' failed.");if(Wt=!0,_t())return new Promise((e,t)=>{Be==null||Be.terminate(),Cd().then(([r,n])=>{try{Be=n,Be.onerror=i=>t(i),Be.onmessage=rd,mn=[e,t];let a={type:"init-wasm",in:$e};!a.in.wasm.wasmPaths&&(r||yn)&&(a.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep-CLPRrI3A.wasm",import.meta.url).href}),Be.postMessage(a),Mr=r}catch(a){t(a)}},t)});try{await Un($e.wasm),await ra($e),nr=!0}catch(e){throw ar=!0,e}finally{Wt=!1}}},Af=async e=>{if(_t())return Et(),new Promise((t,r)=>{Ct("init-ep",[t,r]);let n={type:"init-ep",in:{epName:e,env:$e}};Be.postMessage(n)});await ia($e,e)},Rf=async e=>_t()?(Et(),new Promise((t,r)=>{Ct("copy-from",[t,r]);let n={type:"copy-from",in:{buffer:e}};Be.postMessage(n,[e.buffer])})):jr(e),Bf=async(e,t)=>{if(_t()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Et(),new Promise((r,n)=>{Ct("create",[r,n]);let a={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Be.postMessage(a,i)})}else return na(e,t)},Mf=async e=>{if(_t())return Et(),new Promise((t,r)=>{Ct("release",[t,r]);let n={type:"release",in:e};Be.postMessage(n)});aa(e)},Df=async(e,t,r,n,a,i)=>{if(_t()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Et(),new Promise((s,u)=>{Ct("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:n,options:i}};Be.postMessage(d,ua(l))})}else return sa(e,t,r,n,a,i)},Nf=async e=>{if(_t())return Et(),new Promise((t,r)=>{Ct("end-profiling",[t,r]);let n={type:"end-profiling",in:e};Be.postMessage(n)});oa(e)}}),gn,id,Uf,Kg=q(()=>{Ye(),Pf(),ie(),Nn(),Ad(),gn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},id=e=>{switch(e[3]){case"cpu":return new Pe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ln(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:n,dispose:a}=e[2];return Pe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:n,dispose:a})}case"ml-tensor":{let t=e[0];if(!qn(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:n,dispose:a}=e[2];return Pe.fromMLTensor(r,{dataType:t,dims:e[1],download:n,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},Uf=class{async fetchModelAndCopyToWasmMemory(e){return Rf(await Vn(e))}async loadModel(e,t){it();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Bf(r,t),Xe()}async dispose(){return Mf(this.sessionId)}async run(e,t,r){it();let n=[],a=[];Object.entries(e).forEach(f=>{let h=f[0],m=f[1],y=this.inputNames.indexOf(h);if(y===-1)throw new Error(`invalid input '${h}'`);n.push(m),a.push(y)});let i=[],s=[];Object.entries(t).forEach(f=>{let h=f[0],m=f[1],y=this.outputNames.indexOf(h);if(y===-1)throw new Error(`invalid output '${h}'`);i.push(m),s.push(y)});let u=n.map((f,h)=>gn(f,()=>`input "${this.inputNames[a[h]]}"`)),l=i.map((f,h)=>f?gn(f,()=>`output "${this.outputNames[s[h]]}"`):null),d=await Df(this.sessionId,a,u,s,l,r),c={};for(let f=0;f<d.length;f++)c[this.outputNames[s[f]]]=i[f]??id(d[f]);return Xe(),c}startProfiling(){}endProfiling(){Nf(this.sessionId)}}}),Wf={};Ft(Wf,{OnnxruntimeWebAssemblyBackend:()=>An,initializeFlags:()=>On,wasmBackend:()=>Lf});var On,An,Lf,Zg=q(()=>{Ye(),Pf(),Kg(),On=()=>{(typeof $e.wasm.initTimeout!="number"||$e.wasm.initTimeout<0)&&($e.wasm.initTimeout=0);let e=$e.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),$e.wasm.simd=!1),typeof $e.wasm.proxy!="boolean"&&($e.wasm.proxy=!1),typeof $e.wasm.trace!="boolean"&&($e.wasm.trace=!1),typeof $e.wasm.numThreads!="number"||!Number.isInteger($e.wasm.numThreads)||$e.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)$e.wasm.numThreads=1;else{let t=typeof navigator>"u"?Bm("node:os").cpus().length:navigator.hardwareConcurrency;$e.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},An=class{async init(e){On(),await Of(),await Af(e)}async createInferenceSessionHandler(e,t){let r=new Uf;return await r.loadModel(e,t),r}},Lf=new An});Ye();Ye();Ye();var Qg="1.22.0";{let e=(Zg(),pr(Wf)).wasmBackend;Lt("webgpu",e,5),Lt("webnn",e,5),Lt("cpu",e,10),Lt("wasm",e,10)}Object.defineProperty($e.versions,"web",{value:Qg,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xg=()=>{let e=null,t=null,r=null,n="none",a="./best.onnx";const i={totalInferences:0,totalTime:0,averageTime:0},s=async()=>{const m=navigator.gpu;if(!m||typeof m.requestAdapter!="function")return!1;try{return!!await m.requestAdapter()}catch{return!1}},u=async()=>{try{return e=await Wr.create(a,{executionProviders:["wasm"],graphOptimizationLevel:"all"}),n="wasm",!0}catch(m){return console.error("Failed to switch to WASM fallback:",m),!1}},l=async m=>{a=m||a;const y=await s();try{const _=y?{executionProviders:["webgpu","wasm"],graphOptimizationLevel:"all",enableCpuMemArena:!1,enableMemPattern:!1,executionMode:"sequential"}:{executionProviders:["wasm"],graphOptimizationLevel:"all"};e=await Wr.create(a,_),n=y?"webgpu":"wasm",t=document.createElement("canvas"),r=t.getContext("2d");const x=new Pe("float32",new Float32Array(1*3*640*640),[1,3,640,640]);try{await e.run({images:x})}catch{if(!await u())return!1;const w=new Pe("float32",new Float32Array(1*3*640*640),[1,3,640,640]);await e.run({images:w})}return!0}catch(_){console.error("Inference initialization failed, attempting WASM fallback",_);try{return await u()}catch(x){return console.error("Fallback failed",x),!1}}},d=m=>{if(!t||!r)return null;const y=640,_=m.videoWidth,x=m.videoHeight;if(_===0||x===0)return null;const $=Math.min(y/_,y/x),w=Math.round(_*$),S=Math.round(x*$);t.width=y,t.height=y,r.fillStyle="black",r.fillRect(0,0,y,y);const k=Math.floor((y-w)/2),T=Math.floor((y-S)/2);r.drawImage(m,0,0,_,x,k,T,w,S);const I=r.getImageData(0,0,y,y).data,z=new Float32Array(3*y*y);let A=0,M=y*y,j=2*y*y;for(let V=0;V<I.length;V+=4){const F=I[V]/255,ee=I[V+1]/255,ne=I[V+2]/255,H=V>>2;z[A+H]=F,z[M+H]=ee,z[j+H]=ne}return z},c=m=>{const y=Object.values(m),_=m.boxes||m.output0||y[0],x=m.scores||m.output1||y[1],$=m.classes||m.output2||y[2],w=[];if(!_||!x||!$)return w;const S=.3,k=_.data||_,T=x.data||x,O=$.data||$;for(let I=0;I<T.length;I++){const z=T[I];if(z<S)continue;const A=k[I*4+0],M=k[I*4+1],j=k[I*4+2],V=k[I*4+3],F=Math.max(0,j-A),ee=Math.max(0,V-M);w.push({bbox:{x:A,y:M,width:F,height:ee},confidence:z,classId:O[I],x1:A,y1:M,x2:j,y2:V})}return w};return{initialize:l,run:async m=>{if(!e||!m||m.videoWidth===0)return null;const y=d(m);if(!y)return null;const _=new Pe("float32",y,[1,3,640,640]),x=performance.now(),$=await e.run({images:_}),w=performance.now()-x;return i.totalInferences+=1,i.totalTime+=w,i.averageTime=i.totalTime/i.totalInferences,{detections:c($),inferenceTime:w,performanceStats:{...i},provider:n}},dispose:()=>{e=null,t=null,r=null},getProvider:()=>n}},Yg=(e,t,r)=>{const[n,a]=oe.useState(!1),i=oe.useRef(r);return oe.useEffect(()=>{i.current=r},[r]),oe.useEffect(()=>{if(!t){a(!1),i.current({isEnabled:!1,detections:[]});return}let s=!1;const u=Xg();return(async()=>{if(!await u.initialize()||s)return;a(!0);let d=0;const c=async f=>{if(s)return;const h=e.current;if(!h){requestAnimationFrame(c);return}if(f-d<120){requestAnimationFrame(c);return}d=f;try{const m=await u.run(h);m&&!s&&i.current({isEnabled:!0,detections:m.detections})}catch(m){console.error("inference error",m)}requestAnimationFrame(c)};requestAnimationFrame(c)})(),()=>{s=!0,a(!1),u.dispose()}},[t,e]),{isRunning:n}},Jg=({card:e,onChange:t,onRemove:r})=>{var be,P;const n=oe.useRef(null),a=oe.useRef(null),i=oe.useRef(null),s=oe.useRef(null),u=oe.useRef(null),{control:l,pads:d,ordered:c}=wm(),[f,h]=oe.useState({gnssSpeed:0,headingError:0,lateralError:0}),[m,y]=oe.useState({isEnabled:!1,detections:[]}),[_,x]=oe.useState(!1),[$,w]=oe.useState(null),[S,k]=oe.useState("idle"),[T,O]=oe.useState("Idle"),I=oe.useRef(f),z=oe.useRef(l),A=oe.useRef(m),M=(E,U)=>t(Q=>({...Q,[E]:U})),{connection:j,dataChannel:V}=hm({signalingUrl:e.signalingUrl,offerPeerId:e.offerPeerId,targetPeerId:e.targetPeerId,useIceServers:e.useStunTurn,videoCodec:e.videoCodec,onRemoteStream:E=>{var U,Q;n.current&&(n.current.srcObject=E,(Q=(U=n.current).play)==null||Q.call(U).catch(()=>{}))},onSignalingState:E=>M("signalingStatus",E),onIceState:E=>M("stunStatus",E),onDataChannel:E=>w(E)});oe.useEffect(()=>{I.current=f},[f]),oe.useEffect(()=>{z.current=l},[l]),oe.useEffect(()=>{A.current=m},[m]);const F=oe.useCallback(E=>{y(E)},[]);Yg(n,_,F),oe.useEffect(()=>{s.current||(s.current=$m(33)),s.current.setControlSource(()=>z.current)},[l]);const ee=oe.useCallback(()=>{var E;(E=u.current)==null||E.close(),u.current=null,w(null),k("idle")},[]),ne=async()=>{if(ee(),typeof window.Peer>"u"){console.error("SkyWay old SDK (Peer) is not loaded"),k("error");return}if(!e.skywayApiKey){console.warn("SkyWay API Key required"),k("error");return}k("opening");try{const E=await ks({apiKey:e.skywayApiKey,localPeerId:e.skywayLocalId||void 0,onOpen:U=>M("skywayMyId",U),onStream:U=>{n.current&&(n.current.srcObject=U)}});u.current=E,w(E.dataChannel),k("connected")}catch(E){console.error("Old SkyWay peer create failed",E),k("error")}},H=async()=>{if(ee(),typeof window.Peer>"u"){console.error("SkyWay old SDK (Peer) is not loaded"),k("error");return}if(!e.skywayApiKey||!e.skywayRemoteId){console.warn("SkyWay API key or remote id missing"),k("error");return}k("opening");try{const E=await ks({apiKey:e.skywayApiKey,localPeerId:e.skywayLocalId||void 0,remotePeerId:e.skywayRemoteId,onOpen:U=>M("skywayMyId",U),onStream:U=>{n.current&&(n.current.srcObject=U)}});u.current=E,w(E.dataChannel),k("connected")}catch(E){console.error("Old SkyWay connect failed",E),k("error")}};oe.useEffect(()=>(e.engine!=="oldskyway"&&ee(),()=>ee()),[e.engine,ee]),oe.useEffect(()=>{const E=s.current;if(!E)return;const U=$||V,Q=me=>{me&&me.readyState==="open"?(E.setSender(N=>me.send(JSON.stringify(N))),E.start()):(E.setSender(null),E.stop())};if(e.engine==="pure"||e.engine==="oldskyway"){if(Q(U),U&&typeof U.addEventListener=="function"){const me=()=>Q(U),N=()=>Q(null);return U.addEventListener("open",me),U.addEventListener("close",N),()=>{U.removeEventListener("open",me),U.removeEventListener("close",N)}}return}E.stop(),E.setSender(null)},[e.engine,$,V]),oe.useEffect(()=>{const E=$||V;if(!E)return;const U=me=>{var pe;let N=me.data;try{N=typeof me.data=="string"?JSON.parse(me.data):me.data}catch{}if((N==null?void 0:N.type)==="outputAutorunInfo"){const We=N.payload||N,Ce={gnssSpeed:Number(We.gnssSpeed)||0,headingError:Number(We.headingError)||0,lateralError:Number(We.lateralError)||0};h(Ce),I.current=Ce,O("Receiving")}else if((N==null?void 0:N.type)==="inferenceResults"||(N==null?void 0:N.type)==="offerInferenceResults"){const We=((pe=N.payload)==null?void 0:pe.detections)||N.detections||[];y({isEnabled:!0,detections:We})}};if(typeof E.addEventListener=="function")return E.addEventListener("message",U),()=>E.removeEventListener("message",U);const Q=E.onmessage;return E.onmessage=me=>{U(me),typeof Q=="function"&&Q(me)},()=>{E.onmessage=Q}},[$,V]),oe.useEffect(()=>{if(!a.current||!n.current)return;const E=km({canvas:a.current,video:n.current,getRobotInfo:()=>I.current,getControlInfo:()=>z.current,getDetectionInfo:()=>A.current});i.current=E,E.start();const U=()=>{document.fullscreenElement||E.hide()};return document.addEventListener("fullscreenchange",U),()=>{document.removeEventListener("fullscreenchange",U),E.stop()}},[e.id]);const ae=()=>{j.start().catch(E=>{console.error(E),M("signalingStatus","Error")})},K=()=>{const E=$||V;if(!E||E.readyState!=="open"){console.warn("DataChannel not open");return}const U={type:"videoQualityChange",width:Number(e.videoWidth),height:Number(e.videoHeight),framerate:Number(e.videoFramerate),bitrate:Number(e.videoBitrate)};try{E.send(JSON.stringify(U))}catch(Q){console.error("Failed to send video quality change",Q)}},te=()=>{var U;const E=a.current;E&&E.requestFullscreen&&((U=i.current)==null||U.show(),E.requestFullscreen())};return W.jsxs("div",{style:{border:"1px solid #ccc",padding:12,marginTop:12,borderRadius:8},children:[W.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[W.jsx("strong",{children:"Monitor"}),r&&W.jsx("button",{onClick:r,style:{marginLeft:"auto"},children:"Remove"})]}),W.jsxs(St,{title:"WebRTC Engine",children:[W.jsxs("label",{children:[W.jsx("input",{type:"radio",name:`engine-${e.id}`,value:"pure",checked:e.engine==="pure",onChange:()=>M("engine","pure")}),"Pure WebRTC"]}),W.jsxs("label",{style:{marginLeft:12},children:[W.jsx("input",{type:"radio",name:`engine-${e.id}`,value:"oldskyway",checked:e.engine==="oldskyway",onChange:()=>M("engine","oldskyway")}),"Old SkyWay"]}),W.jsxs("label",{style:{marginLeft:12},children:[W.jsx("input",{type:"radio",name:`engine-${e.id}`,value:"newskyway",checked:e.engine==="newskyway",onChange:()=>M("engine","newskyway")}),"New SkyWay (stub)"]})]}),W.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,marginTop:8},children:[W.jsx("video",{ref:n,autoPlay:!0,playsInline:!0,muted:!0,style:{width:220,height:140,background:"#000",borderRadius:6}}),W.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[W.jsx("button",{onClick:te,children:"Canvas Full Screen"}),W.jsxs("label",{style:{fontSize:12},children:[W.jsx("input",{type:"checkbox",checked:_,onChange:E=>x(E.target.checked)})," ","Enable ONNX detection overlay"]}),W.jsx("small",{children:"Canvasは通常hidden。Full Screenボタンで表示。"})]})]}),W.jsx("canvas",{ref:a,width:640,height:360,hidden:!0}),W.jsxs("div",{style:{marginTop:4,fontSize:12,color:"#333"},children:["Detections: ",m.detections.length," / Inference: ",_?"Running":"Stopped"]}),e.engine==="pure"&&W.jsxs(W.Fragment,{children:[W.jsxs(St,{title:"Pure WebRTC Connection",children:[W.jsxs("div",{style:{marginTop:6},children:["Offer Peer ID:",W.jsx("input",{type:"text",value:e.offerPeerId,onChange:E=>M("offerPeerId",E.target.value),style:{width:180,marginLeft:6}})]}),W.jsxs("div",{style:{marginTop:6},children:["Target Vehicle Peer ID:",W.jsx("input",{type:"text",value:e.targetPeerId,onChange:E=>M("targetPeerId",E.target.value),style:{width:180,marginLeft:6}})]}),W.jsxs("div",{style:{marginTop:6},children:["Signaling WS URL:",W.jsx("input",{type:"text",value:e.signalingUrl,onChange:E=>M("signalingUrl",E.target.value),style:{width:220,marginLeft:6}}),W.jsx("button",{style:{marginLeft:6},onClick:ae,children:"Connect"})]})]}),W.jsx("h3",{children:"Network Status"}),W.jsx("table",{children:W.jsxs("tbody",{children:[W.jsx("tr",{children:W.jsxs("th",{children:["Signaling: ",W.jsx("span",{children:e.signalingStatus})]})}),W.jsx("tr",{children:W.jsxs("th",{children:["STUN: ",W.jsx("span",{children:e.stunStatus})]})}),W.jsx("tr",{children:W.jsxs("th",{children:["TURN: ",W.jsx("span",{children:e.turnStatus})]})})]})}),W.jsxs("div",{style:{margin:"4px 0 10px 0"},children:[W.jsx("input",{type:"checkbox",id:`use-stun-${e.id}`,checked:e.useStunTurn,onChange:E=>M("useStunTurn",E.target.checked)}),W.jsx("label",{htmlFor:`use-stun-${e.id}`,children:"Use STUN/TURN"})]}),W.jsxs(St,{title:"GCC/Feedback Options",children:[W.jsxs("div",{children:[W.jsx("input",{type:"checkbox",checked:e.disableTcc,onChange:E=>M("disableTcc",E.target.checked)}),W.jsx("label",{children:"Disable TCC"})]}),W.jsxs("div",{children:[W.jsx("input",{type:"checkbox",checked:e.disableTwccExtmap,onChange:E=>M("disableTwccExtmap",E.target.checked)}),W.jsx("label",{children:"Disable TWCC extmap"})]}),W.jsxs("div",{children:[W.jsx("input",{type:"checkbox",checked:e.disableRemb,onChange:E=>M("disableRemb",E.target.checked)}),W.jsx("label",{children:"Disable REMB"})]}),W.jsxs("div",{children:[W.jsx("input",{type:"checkbox",checked:e.disableNackPliFir,onChange:E=>M("disableNackPliFir",E.target.checked)}),W.jsx("label",{children:"Disable NACK/PLI/FIR"})]}),W.jsxs("div",{children:[W.jsx("input",{type:"checkbox",checked:e.disableRtcpRsize,onChange:E=>M("disableRtcpRsize",E.target.checked)}),W.jsx("label",{children:"Disable RTCP Reduced-Size"})]})]}),W.jsxs(St,{title:"Video Quality",children:[W.jsxs("div",{style:{marginTop:4},children:["Codec:",W.jsxs("select",{value:e.videoCodec,onChange:E=>M("videoCodec",E.target.value),style:{marginLeft:6},children:[W.jsx("option",{value:"AV1",children:"AV1"}),W.jsx("option",{value:"VP9",children:"VP9"}),W.jsx("option",{value:"H264",children:"H264"}),W.jsx("option",{value:"VP8",children:"VP8"})]})]}),W.jsxs("div",{style:{marginTop:4},children:["Height: ",W.jsx("input",{type:"number",value:e.videoHeight,onChange:E=>M("videoHeight",E.target.value),style:{width:100}})]}),W.jsxs("div",{style:{marginTop:4},children:["Width: ",W.jsx("input",{type:"number",value:e.videoWidth,onChange:E=>M("videoWidth",E.target.value),style:{width:100}})]}),W.jsxs("div",{style:{marginTop:4},children:["FrameRate: ",W.jsx("input",{type:"number",value:e.videoFramerate,onChange:E=>M("videoFramerate",E.target.value),style:{width:100}})," Hz"]}),W.jsxs("div",{style:{marginTop:4},children:["Bitrate: ",W.jsx("input",{type:"number",value:e.videoBitrate,onChange:E=>M("videoBitrate",E.target.value),style:{width:140}})," bps"]}),W.jsx("button",{style:{marginTop:6},onClick:K,children:"SetVideoQuality"})]})]}),(e.engine==="pure"||e.engine==="oldskyway")&&W.jsxs(St,{title:"Gamepad (monitor side)",children:[W.jsxs("div",{children:["Gamepads detected: ",d.length]}),d.slice(0,2).map(E=>W.jsxs("div",{style:{fontSize:12,color:"#444"},children:["#",E.index,": ",E.id]},E.index)),W.jsxs("div",{style:{marginTop:4,fontSize:12},children:["Ordered: ",((be=c[0])==null?void 0:be.id)||"-"," / ",((P=c[1])==null?void 0:P.id)||"-"]}),W.jsxs("div",{style:{marginTop:6,fontSize:12},children:[W.jsxs("div",{children:["Steer: ",l.inputSteer]}),W.jsxs("div",{children:["Gear: ",l.inputGear]}),W.jsxs("div",{children:["Speed: ",l.inputSpeed," km/h"]}),W.jsxs("div",{children:["Shuttle: ",l.inputShuttle]}),W.jsxs("div",{children:["PTO Height: ",l.inputPtoHeight,"%"]}),W.jsxs("div",{children:["Remote Mode: ",l.isRemoteCont?"ON":"OFF"]}),W.jsxs("div",{children:["Telemetry: ",T," / ",f.gnssSpeed??0," km/h"]})]})]}),e.engine==="oldskyway"&&W.jsxs(St,{title:"Old SkyWay",children:[W.jsxs("div",{style:{marginTop:6},children:["SkyWay API Key:",W.jsx("input",{type:"text",value:e.skywayApiKey,onChange:E=>M("skywayApiKey",E.target.value),style:{width:280,marginLeft:6}})]}),W.jsxs("div",{style:{marginTop:6},children:["Local Peer ID:",W.jsx("input",{type:"text",value:e.skywayLocalId,onChange:E=>M("skywayLocalId",E.target.value),style:{width:220,marginLeft:6}}),W.jsxs("span",{style:{marginLeft:8},children:["My ID: ",e.skywayMyId]})]}),W.jsxs("div",{style:{marginTop:6},children:["Remote ID:",W.jsx("input",{type:"text",value:e.skywayRemoteId,onChange:E=>M("skywayRemoteId",E.target.value),style:{width:280,marginLeft:6}})]}),W.jsxs("div",{style:{marginTop:8,display:"flex",gap:8,alignItems:"center"},children:[W.jsx("button",{onClick:ne,children:"Create Peer"}),W.jsx("button",{onClick:H,children:"Connect Remote"}),W.jsx("button",{onClick:ee,children:"Disconnect"}),W.jsxs("span",{style:{fontSize:12,color:"#444"},children:["Status: ",S]})]})]}),e.engine==="newskyway"&&W.jsx(St,{title:"New SkyWay",children:W.jsx("p",{children:"工事中…"})})]})},e0="ws://localhost:8080",t0="e316eaa7-4c1c-468c-b23a-9ce51b074ab7",nd=()=>({id:typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`card-${Date.now().toString(16)}`,engine:"pure",offerPeerId:"offer-1",targetPeerId:"robot-1",videoCodec:"AV1",remoteVideoEnabled:!0,signalingUrl:e0,signalingStatus:"Disconnected",stunStatus:"Waiting...",turnStatus:"Waiting...",useStunTurn:!0,disableTcc:!0,disableTwccExtmap:!0,disableRemb:!0,disableNackPliFir:!1,disableRtcpRsize:!1,videoHeight:"1280",videoWidth:"1920",videoFramerate:"30",videoBitrate:"1000000",skywayApiKey:t0,skywayLocalId:"",skywayMyId:"(waiting)",skywayRemoteId:""}),r0=()=>{const[e,t]=oe.useState(()=>[nd()]),r=()=>t(i=>{const s=i.length+1,u=nd();return u.offerPeerId=`offer-${s}`,u.targetPeerId=`robot-${s}`,[...i,u]}),n=i=>t(s=>s.filter(u=>u.id!==i)),a=(i,s)=>t(u=>u.map(l=>l.id===i?s(l):l));return W.jsxs("div",{style:{padding:16},children:[W.jsx("h1",{children:"WebRTC Remote Monitor"}),W.jsx("button",{onClick:r,children:"+ Add Monitor"}),e.map(i=>W.jsx(Jg,{card:i,onChange:s=>a(i.id,s),onRemove:e.length>1?()=>n(i.id):void 0},i.id))]})},qf=document.getElementById("root");if(!qf)throw new Error("Root element #root not found");pm(qf).render(W.jsx(cm.StrictMode,{children:W.jsx(r0,{})}));
