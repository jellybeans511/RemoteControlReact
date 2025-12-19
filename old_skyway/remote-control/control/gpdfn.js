//////////ButtonName//////////
logiHanconButtonExists = (gpdObj,buttonName) => {
    if (buttonName == "Circle") {
         return gpdObj.buttons[2].pressed;
    }
    else if (buttonName == "Triangle") {
        return gpdObj.buttons[3].pressed;
    }
    else if (buttonName == "Square") {
        return gpdObj.buttons[0].pressed;
    }
    else if (buttonName == "Cross") {
        return gpdObj.buttons[1].pressed;
    }
    else if (buttonName == "LeftPaddle") {
        return gpdObj.buttons[4].pressed;
    }
    else if (buttonName == "RightPaddle") {
        return gpdObj.buttons[5].pressed;
    }
    else if (buttonName == "UpKey") {
        var pressedUpkey;
        if(gpdObj.axes[9] == -1) {
            pressedUpkey = true;
        }
        else {
            pressedUpkey = false;
        }
        return pressedUpkey;
    }
    else if (buttonName == "DownKey") {
        var pressedDownkey;
        if(Math.round(gpdObj.axes[9] * 10) / 10 == 0.1) {
            pressedDownkey = true;
        }
        else {
            pressedDownkey = false;
        }
        return pressedDownkey;
    }
    else if (buttonName == "Share") {
        return gpdObj.buttons[8].pressed;
    }
    else if (buttonName == "PlayStation") {
        return gpdObj.buttons[12].pressed;
    }
};