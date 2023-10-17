/**
  * Enumeration of available pins
  */
enum SBC_MotoDriver3pin {
    //% block="Pin 8"
    P8,
    //% block="Pin 12"
    P12
}

/**
  * Enumeration of available directions
  */
enum SBC_MotoDriver3direction {
    //% block="Forward"
    Forward,
    //% block="Backward"
    Backward,
    //% block="All"
    All
}

/**
  * PCA9634 8-bit Fm+ I2C-bus LED driver
  */
//% color="#275C6B" weight=100 icon="\uf0e7" block="SBC_MotoDriver3"
namespace SBC_MotoDriver3 {
    // Register variables
    const LED_OFF_ALL = 0x00
    const LED_ON_ALL = 0x55
    const LED_PWM_ALL = 0xAA
    const LEDOUT0 = 0x0C
    const LEDOUT1 = 0x0D

    let numberSteps: number = 0
    let stepDelay: number = 0
    let stepsRemaining: number = 0
    let stepNumber: number = 0
    let lastStepTime: number = 0
    let direction: number

    // Some predefined variables that serve as default values
    let _address = 0x15

    /**
     * Changing the I2C address and enable pin based on user input
     */
    //% blockId="SBC_MotoDriver3_INIT" block="Initialize the SBC_MotoDriver3 with Address %address"
    //% address.defl=21
    //% color="#275C6B" weight=100 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function initSBC_MotoDriver3(address: number) {
        let _address = address
        basic.pause(10)
        write_reg(0x00, 0x01)
        basic.pause(0.5)
        write_reg(0x01, 0x14)
        basic.pause(10)
    }

    /**
     * Enable or disable the outputs
     */
    //% blockId="SBC_MotoDriver3_ENABLE" block="Set the enablepin to %SBC_MotoDriver3pin and enable/disable the outputs ? %state"
    //% state.defl=true
    //% SBC_MotoDriver3pin.defl=P8
    //% color="#275C6B" weight=95 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function enable(selection: SBC_MotoDriver3pin, state: boolean) {
        if (selection == SBC_MotoDriver3pin.P8) {
            if (state) {
                pins.digitalWritePin(DigitalPin.P8, 0)
            }
            else {
                pins.digitalWritePin(DigitalPin.P8, 1)
            }
        }
        else if (selection == SBC_MotoDriver3pin.P12) {
            if (state) {
                pins.digitalWritePin(DigitalPin.P12, 0)
            }
            else {
                pins.digitalWritePin(DigitalPin.P12, 1)
            }
        }
    }

    // Write the required 8-bit value into the register
    function write_reg(reg: number, val: number) {
        let temp: number[] = []
        temp.insertAt(1, val)
        let num = pins.createBuffer(2)
        num.setNumber(NumberFormat.Int8LE, 0, reg)
        num.setNumber(NumberFormat.Int8LE, 1, temp[1])
        pins.i2cWriteBuffer(_address, num, false)
    }

    // Read the 8-bit register value that will be returned
    function read_reg(reg: number) {
        pins.i2cWriteNumber(_address, reg & 0x1F, NumberFormat.Int8LE, false)
        let result = pins.i2cReadBuffer(_address, 1, false)
        let result1 = result.getNumber(NumberFormat.UInt8LE, 0)
        return result1 
    }

    /**
     * Reset the SBC_MotoDriver3
     */
    //% blockId="SBC_MotoDriver3_RESET" block="Reset the SBC_MotoDriver3"
    //% color="#275C6B" weight=90 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function soft_reset(): void {
        let num = pins.createBuffer(2)
        num.setNumber(NumberFormat.Int8LE, 0, 0xA5)
        num.setNumber(NumberFormat.Int8LE, 1, 0x5A)
        pins.i2cWriteBuffer(0x03, num, false)
    }

    /**
     * Sets a channel or all channels to a different state (pin 0-7)
     */
    function pinType(type0: number, pin: number, all:boolean = false) {
        let dataType, regValue: number
        let bc, bs, bc0, bc1: number

        if(type0 > 2) {
            type0 = 0
        }
        if(type0 == 0) {
            if(all) {
                write_reg(LEDOUT0, LED_OFF_ALL)
                write_reg(LEDOUT1, LED_OFF_ALL)
            }
            else if(pin < 4) {
                regValue = read_reg(LEDOUT0)
                bc0 = bitClear(regValue, (pin * 2))
                bc1 = bitClear(regValue, (pin * 2 + 1))
                write_reg(LEDOUT0, bc1)
            }
            else if(pin >= 4) {
                pin -= 4
                regValue = read_reg(LEDOUT1)
                bc0 = bitClear(regValue, (pin * 2))
                bc1 = bitClear(regValue, (pin * 2 + 1))
                write_reg(LEDOUT1, bc1)
            }
        }
        else if(type0 == 1) {
            if(all) {
                write_reg(LEDOUT0, LED_ON_ALL)
                write_reg(LEDOUT1, LED_ON_ALL)
            }
            else if(pin < 4) {
                regValue = read_reg(LEDOUT0)
                bc = bitClear(regValue, (pin * 2))
                bs = bitSet(regValue, (pin * 2 + 1))
                write_reg(LEDOUT0, bs)
            }
            else if(pin >= 4) {
                pin -= 4
                regValue = read_reg(LEDOUT1)
                bc = bitClear(regValue, (pin * 2))
                bs = bitSet(regValue, (pin * 2 + 1))
                write_reg(LEDOUT1, bc)
            }
        }
        else if (type0 == 2) {
            if(all) {
                write_reg(LEDOUT0, LED_PWM_ALL)
                write_reg(LEDOUT1, LED_PWM_ALL)
            }
            else if(pin < 4) {
                regValue = read_reg(LEDOUT0)
                bc = bitClear(regValue, (pin * 2))
                bs = bitSet(regValue, (pin * 2 + 1))
                write_reg(LEDOUT0, bs)
            }
            else if(pin >= 4) {
                pin -= 4
                regValue = read_reg(LEDOUT1)
                bc = bitClear(regValue, (pin * 2))
                bs = bitSet(regValue, (pin * 2 + 1))
                write_reg(LEDOUT1, bs)
            }
        }
    }

    /**
     * Writes a pwm value to a channel (accepts a channel value between 0 and 7)
     */
    function chanPwm(channel: number, val: number) {
        channel = channel+2
        write_reg(channel, val)
    }

    /**
     * Turn on a single channel (accepts values between 0 and 7)
     */
    //% blockId="SBC_MotoDriver3_ON" block="Turn on channel %pin"
    //% color="#275C6B" weight=85 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function on(pin: number) {
        pinType(1, pin)
        chanPwm(pin, 255)
    }

    /**
     * Turn off a single channel (accepts values between 0 and 7)
     */
    //% blockId="SBC_MotoDriver3_OFF" block="Turn off channel %pin"
    //% color="#275C6B" weight=80 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function off(pin: number) {
        pinType(0, pin)
        chanPwm(pin, 0)
    }

    /**
     * Turn on all the channels
     */
    //% blockId="SBC_MotoDriver3_ALLON" block="Turn on all %SBC_MotoDriver3direction channels"
    //% color="#275C6B" weight=75 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function allOn(selection: SBC_MotoDriver3direction) {
        if (selection == SBC_MotoDriver3direction.Forward) {
            let pin: number = 0
            for (let i = 0; i < 4; i++) {
                pwm(pin, 255)
                pin = pin+2
            }
        }
        else if (selection == SBC_MotoDriver3direction.Backward) {
            let pin: number = 1
            for (let i = 0; i < 4; i++) {
                pwm(pin, 255)
                pin = pin+2
            }
        }
        else if (selection == SBC_MotoDriver3direction.All) {
            pinType(1, 0, true)
            for (let i = 0; i < 8; i++) {
                chanPwm(i, 255)
            }
        }
    }

    /**
     * Turn off all the channels
     */
    //% blockId="SBC_MotoDriver3_ALLOFF" block="Turn off all channels"
    //% color="#275C6B" weight=70 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function allOff(): void {
        pinType(0, 0, true)
        for (let i = 0; i < 8; i++) {
            chanPwm(i, 0)
        }
    }

    /**
     * Fade a single channel to a specified value over a specified time
     */
    //% blockId="SBC_MotoDriver3_FADEIN" block="Fade in channel %pin over %timer milliseconds to %brightness"
    //% color="#275C6B" weight=65 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function fadeIn(pin: number, timer: number, brightness: number) {
        let interval: number
        pinType(2, pin)
        interval = timer / brightness
        for (let i = 0; i < brightness + 1; i++) {
            chanPwm(pin, i)
            basic.pause(interval)
        }
        if (brightness == 255) {
            pinType(1, pin)
        }
    }

    /**
     * Fade a single channel to a specified value over a specified time
     */
    //% blockId="SBC_MotoDriver3_FADEOUT" block="Fade out channel %pin over %timer milliseconds to %brightness"
    //% color="#275C6B" weight=60 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function fadeOut(pin: number, timer: number, brightness: number) {
        let interval: number
        let regValue = read_reg(pin + 2)
        pinType(2, pin)
        interval = timer / (regValue - brightness)
        for (let i = regValue; i > brightness - 1; i--) {
            chanPwm(pin, i)
            basic.pause(interval)
        }
        if (brightness == 0) {
            pinType(0, pin)
        }
    }

    /**
     * Write a specified value to a specified channel
     */
    //% blockId="SBC_MotoDriver3_PWM" block="Set channel %pin to pwm value %val"
    //% color="#275C6B" weight=55 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function pwm(pin: number, val: number) {
        pinType(2, pin)
        chanPwm(pin, val)
    }

    /**
     * Read the status of the specified channels
     * 0 = off
     * 1 = on
     * 2 = pwm
     */
    //% blockId="SBC_MotoDriver3_LEDSTATUS" block="Read the status of channel %pin"
    //% color="#275C6B" weight=50 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function ledStatus(pin: number) {
        let first, second
        let regValue = 0
        if(pin < 4) {
            regValue = read_reg(LEDOUT0)
            first = ((regValue >> (pin * 2)) & 0x01)
            second = ((regValue >> (pin * 2 + 1)) & 0x01)
        }
        else {
            pin -= 4
            regValue = read_reg(LEDOUT1)
            first = ((regValue >> (pin * 2)) & 0x01)
            second = ((regValue >> (pin * 2 + 1)) & 0x01)
        }
        if(!first && !second) {
            return 0
        }
        else if(first && !second) {
            return 1
        }
        else if (!first && second) {
            return 2
        }
        else {
            return 3
        }
    }

    /**
     * Read the current pwm value on the given pin
     */
    //% blockId="SBC_MotoDriver3_PWMSTATUS" block="Read the pwm status of channel %pin"
    //% color="#275C6B" weight=45 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function pwmStatus(pin: number) {
        return read_reg(pin + 2)
    }

    /**
     * Set the speed and the max amount of steps for the stepper motor
     */
    //% blockId="SBC_MotoDriver3_STEPPERSPEED" block="Set the speed of the Stepper to %speed rpm with %steps steps"
    //% speed.min=0 speed.max=30 speed.defl=15     <-- speed muss auf 30 Limitiert werden da die I2C Hardware auf dem micro:bit das sonst nicht schafft
    //% steps.defl=2048
    //% color="#275C6B" weight=40 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function StepperSpeed(speed: number, steps: number) {
        numberSteps = steps
        stepDelay = (60 * 1000 * 1000 / steps / speed)
    }

    /**
     * Based on the speed and the max amount of steps. Decide the direction in which the stepper motor is supposed to turn
     */
    //% blockId="SBC_MotoDriver3_STEPPER" block="Move the Stepper motor %stepAmount Steps on Pins %pin1, %pin2, %pin3, %pin4"
    //% stepAmount.min=0 stepAmount.max=2048 stepAmount.defl=2000
    //% pin1.min=0 pin1.max=7 pin1.defl=4
    //% pin2.min=0 pin2.max=7 pin2.defl=5
    //% pin3.min=0 pin3.max=7 pin3.defl=6
    //% pin4.min=0 pin4.max=7 pin4.defl=7
    //% color="#275C6B" weight=35 blockGap=8
    //% parts=led_SBC_MotoDriver3 trackArgs=0
    export function Stepper(stepAmount: number, pin1: number, pin2: number, pin3: number, pin4: number) {
        let now: number
        stepsRemaining = Math.abs(stepAmount)
        if (stepAmount > 0) { direction = 1 }
        if (stepAmount < 0) { direction = 0 }

        while (stepsRemaining > 0) {
            now = input.runningTimeMicros()
            if ((now - lastStepTime) >= stepDelay) {
                lastStepTime = now
                if (direction == 1) {
                    stepNumber += 1
                    if (stepNumber == numberSteps) {
                        stepNumber = 0
                    }
                }
                else {
                    if (stepNumber == 0) {
                        stepNumber = numberSteps
                    }
                    stepNumber -= 1
                }
                stepsRemaining -= 1
                stepMotor(stepNumber % 4, pin1, pin2, pin3, pin4)
            }
        }
    }

    /**
     * Based on the direction. Makes the Stepper motor move according to the direction
     */
    function stepMotor(thisStep: number, pin1: number, pin2: number, pin3: number, pin4: number) {
        if (direction == 1) {
            if (thisStep == 0) {
                pwm(pin1, 250)
                pwm(pin2, 0)
                pwm(pin3, 250)
                pwm(pin4, 0)
            }
            if (thisStep == 1) {
                pwm(pin1, 0)
                pwm(pin2, 250)
                pwm(pin3, 250)
                pwm(pin4, 0)
            }
            if (thisStep == 2) {
                pwm(pin1, 0)
                pwm(pin2, 250)
                pwm(pin3, 0)
                pwm(pin4, 250)
            }
            if (thisStep == 3) {
                pwm(pin1, 250)
                pwm(pin2, 0)
                pwm(pin3, 0)
                pwm(pin4, 250)
            }
        }
        else if (direction == 0) {
            if (thisStep == 0) {
                pwm(pin4, 250)
                pwm(pin3, 0)
                pwm(pin2, 250)
                pwm(pin1, 0)
            }
            if (thisStep == 1) {
                pwm(pin4, 0)
                pwm(pin3, 250)
                pwm(pin2, 250)
                pwm(pin1, 0)
            }
            if (thisStep == 2) {
                pwm(pin4, 0)
                pwm(pin3, 250)
                pwm(pin2, 0)
                pwm(pin1, 250)
            }
            if (thisStep == 3) {
                pwm(pin4, 250)
                pwm(pin3, 0)
                pwm(pin2, 0)
                pwm(pin1, 250)
            }
        }
    }

    /**
     * Returns an integer with the bit at 'offset' set to 1
     */
    function bitSet(int_type: number, offset: number){
        let mask: number
        mask = 1 << offset
        return (int_type | mask)
    }

    /**
     * Returns an integer with the bit at 'offset' cleared
     */
    function bitClear(int_type: number, offset: number) {
        let mask: number
        mask = ~(1 << offset)
        return (int_type & mask)
    }
}
