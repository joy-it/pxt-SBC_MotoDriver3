// Initialization of the board with I2C address 0x15 and oe_pin 8 and pull the oe_pin low to activate the board
SBC_MotoDriver3.initSBC_MotoDriver3(21)
SBC_MotoDriver3.enable(SBC_MotoDriver3pin.P8, SBC_MotoDriver3state.On)
// Switch off all outputs
SBC_MotoDriver3.allOff()
// Define the RPM and the maximum number of steps for the stepper motor
SBC_MotoDriver3.StepperSpeed(15, 2048)

// Main Loop
basic.forever(function () {
    serial.writeLine("Normal usage")
    // Switch on all even outputs
    SBC_MotoDriver3.allOn(SBC_MotoDriver3direction.Forward)
    basic.pause(1000)
    SBC_MotoDriver3.allOff()
    basic.pause(1000)
    // Switch on all odd outputs
    SBC_MotoDriver3.allOn(SBC_MotoDriver3direction.Backward)
    basic.pause(1000)
    SBC_MotoDriver3.allOff()
    basic.pause(1000)
    // Switch on a specific output
    SBC_MotoDriver3.on(0)
    basic.pause(2000)
    // Switch off a specific output
    SBC_MotoDriver3.off(0)
    basic.pause(500)
    // A specific output is faded in to a specific value over a specific time.
    SBC_MotoDriver3.fadeIn(0, 20000, 250)
    SBC_MotoDriver3.fadeOut(0, 20000, 0)
    basic.pause(1000)
    // Sets the Pwm value of a specific output
    SBC_MotoDriver3.pwm(0, 199)
    // Read the status of the specified output
    serial.writeLine("" + (SBC_MotoDriver3.ledStatus(0)))
    serial.writeLine("" + (SBC_MotoDriver3.pwmStatus(0)))
    basic.pause(2000)
    SBC_MotoDriver3.allOff()
    basic.pause(1000)
    /*serial.writeLine("Stepper")
    // Let the stepper motor move the desired number of steps on the desired pins at the previously set speed.
    SBC_MotoDriver3.Stepper(
    2000,
    4,
    5,
    6,
    7
    )
    basic.pause(1000)*/
})
