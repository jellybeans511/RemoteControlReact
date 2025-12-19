const API_KEY = "e316eaa7-4c1c-468c-b23a-9ce51b074ab7";
let localStream;

declare var Peer: any;
const peer = new Peer({
    key: API_KEY,
    debug: 3
});

let dstart = document.getElementById("debug-send");

// シグナリングサーバーと接続が成功したタイミングで発生する
peer.on('open', () => {
    (document.getElementById('my-id'))!.textContent = peer.id;
});

let dataConnection: any;
let calltrigger: any = document.getElementById('call-trigger');

calltrigger.addEventListener('click', () => {
    let IDele: HTMLInputElement = <HTMLInputElement>document.getElementById('their-id');
    let theirID = IDele.value;
    const mediaConnection = peer.call(theirID);
    setEventListener(mediaConnection);

    dataConnection = peer.connect(theirID);
    setEventListenerData(dataConnection);
});

interface Vehicleinfo1 {
    "EngineRpm": number;
    "DpfLv": number;
    "EngineTemp": number;
    "EngineLoad": number;
    "FuelAmo": number;
}

interface Vehicleinfo2 {
    "VehicleSpd":number;
    "Shuttle":number;
    "MainGear":number;
    "TMOilTemp":number;
    "Steer":number;
    "ADBreak":number;
    "DoubleSpd":boolean;
    "FourWD":boolean;
    "SubGear":number;
}

const setEventListenerData = (dataConnection: { once: (arg0: string, arg1: () => void) => void; on: (arg0: string, arg1: (Vehicleinfo:Vehicleinfo1|Vehicleinfo2) => void) => void; close: () => void; }) => {
    dataConnection.once('open', () => {
        console.log('Start send data to control from Yolo by 10Hz');
    });

    dataConnection.on('data', (Vehicleinfo:Vehicleinfo1|Vehicleinfo2) => {
        console.log(Vehicleinfo);

        if (typeof Vehicleinfo === "Vehicleinfo1") {
            document.getElementById("engine-rpm")!.textContent = Vehicleinfo.EngineRpm.toString();
            document.getElementById("dpf")!.textContent = Vehicleinfo.DpfLv.toString();
            document.getElementById("engine-temperature")!.textContent = Vehicleinfo.EngineTemp.toString();
            document.getElementById("engine-load")!.textContent = Vehicleinfo.EngineLoad.toString();
            document.getElementById("fuel-amount")!.textContent = Vehicleinfo.FuelAmo.toString();
        }

        else if (Vehicleinfo.Info == 2) {
            document.getElementById("speed")!.textContent = Vehicleinfo.VehicleSpd.toString();
            document.getElementById("shuttle")!.textContent = Vehicleinfo.Shuttle.toString();
            document.getElementById("main-gear")!.textContent = Vehicleinfo.MainGear.toString();
            document.getElementById("sub-gear")!.textContent = Vehicleinfo.SubGear.toString();
            document.getElementById("steer")!.textContent = Vehicleinfo.Steer.toString();
        }

        else if (Vehicleinfo.Info == 3) {
            console.log('Info3 arrived!!!!!!! It is uncorrect data!!!!!!!!!!!!!!!!!!!')
        }

    });

    dataConnection.on('close', () => {
        dataConnection.close();
    });
}

// 着信時にイベントリスナーをセットする関数: media
const setEventListener = (mediaConnection: { on: (arg0: string, arg1: (stream: any) => void) => void; }) => {
    mediaConnection.on('stream', stream => {
        const VIDEOelm = <HTMLInputElement>document.getElementById('their-video');
        VIDEOelm.srcObject = stream;
        VIDEOelm.play();
    });
}

// 着信時にイベントリスナーをセットする関数: data
//const setEventListenerData = dataConnection => {
// データチャネルが接続されたとき
let sendDataTimer: NodeJS.Timeout;

let Abutton: any = document.getElementById('a-button');
let Bbutton: any = document.getElementById('b-button');
let Xbutton: any = document.getElementById('x-button');
let Ybutton: any = document.getElementById('y-button');
let UPbutton: any = document.getElementById('up-button');
let DOWNbutton: any = document.getElementById('down-button');
let RIGHTbutton: any = document.getElementById('right-button');
let LEFTbutton: any = document.getElementById('left-button');
let EX1button: any = document.getElementById('ex1-button');
let EX2button: any = document.getElementById('ex2-button');

Abutton.addEventListener("click", () => {
    dataConnection.send(`A`);
    console.log('Click A button');
});

Bbutton.addEventListener("click", () => {
    dataConnection.send(`B`);
    console.log('Click B button');
});

Xbutton.addEventListener("click", () => {
    dataConnection.send(`X`);
    console.log('Click X button');
});

Ybutton.addEventListener("click", () => {
    dataConnection.send(`Y`);
    console.log('Click Y button');
});

UPbutton.addEventListener("click", () => {
    dataConnection.send(`UP`);
    console.log('Click UP button');
});

DOWNbutton.addEventListener("click", () => {
    dataConnection.send(`DOWN`);
    console.log('Click DOWN button');
});

RIGHTbutton.addEventListener("click", () => {
    dataConnection.send(`RIGHT`);
    console.log('Click RIGHT button');
});

LEFTbutton.addEventListener("click", () => {
    dataConnection.send(`LEFT`);
    console.log('Click LEFT button');
});

EX1button.addEventListener("click", () => {
    dataConnection.send(`EX1`);
    console.log('Click EX1 button');
});

EX2button.addEventListener("click", () => {
    dataConnection.send(`EX2`);
    console.log('Click EX2 button');
});

/*
function sendData(data) {
    dataConnection.send(data);
    console.log('to vehicle', data);
}*/

//着信処理: media
/*peer.on('call', async mc => {
    let mediaConnection = mc;
    mediaConnection.answer(localStream);
    setEventListenerMedia(mediaConnection);
});*/

//着信処理: data
peer.on('connection', (dc: any) => {
    dataConnection = dc;
    setEventListenerData(dataConnection);
});
