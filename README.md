# MakeCode Package for the PCA9634 8-bit Fm+ I2C-bus LED driver 

This library provides a Microsoft Makecode package for the PCA9634 8-bit Fm+ I2C-bus LED driver.
See **https://joy-it.net/products/SBC-MotoDriver3** for more details.

## Behaviour considered to be a pass
As long as the microcontroller or single board computer still finds the I2C addresses of the PCA9634 (0x03, 0x15 and 0x70, 0x15 is the changeable I2C address), it is considered a pass. If the connected motors still rotate when prompted to rotate, it is also considered to be a pass.

## Behaviour considered to be a fail
As soon as the I2C addresses can no longer be found or the connected motors no longer rotate when prompted to do so.

# Basic functionality

## I2C Address
You can use the `Initialize SBC_MotoDriver3 with Address (...)` block to change the I2C address used for communication with the PCA.
```typescript
// Change the I2C address depending on how the resistors on the board are set.
// Default initialization with A1 = 1 | A2 = 0 | A3 = 1 | A4 = 0 | A5 = 1 | A6 = 0 | A7 = 0, resulting in I2C address 0x15
SBC_MotoDriver3.initSBC_MotoDriver3(0)
```

## Soft Reset
The `Reset the SBC_MotoDriver3` block allows you to do a Software Reset of the PCA.
```typescript
// Call this function to reset the PCA
SBC_MotoDriver3.soft_reset()
```

## Starting communication
The block `Set up and start the communication` can be used to start the communication between a microcontroller or single board computer and the SBC_MotoDriver3 with the previously defined address.
```typescript
// Start the communication with the PCA
SBC_MotoDriver3.begin()
```

## Enable
With the block `Set the enablepin to (...) and enable/disable the outputs ? (...)` you can choose between two pins and if you want to enable or disable **THE ENTIRE OUTPUT** of the SBC_MotoDriver3.
```typescript
// Change the pin to better fit your needs, choose between pin 8 and pin 12
// Choose between true and false to enable or disable the output of the PCA
// Standard will be pin 8 and false
SBC_MotoDriver3.enable(SBC_MotoDriver3pin.P8, false)
```

## On
The `Switch on channel (...)` block allows to switch on a single channel specified by the user with maximum value.
```typescript
// Choosing the Channel (0-7) which is to be turned on
// Standard will be 0
SBC_MotoDriver3.on(0)
```

## Off
The `Switch off channel (...)` block allows to switch off a single channel specified by the user.
```typescript
// Choosing the Channel (0-7) which is to be turned off
// Standard will be 0
SBC_MotoDriver3.off(0)
```

## All On
With the block `Switch on all (...) channels` you can choose between **all even**, **all odd** and **all** channels. The defined channels are then switched on with the maximum value.
```typescript
// Choosing which channels should be turned on based on the user input Forward (even numbered outputs) | Backwards (odd numbered outputs) | All (all outputs)
// Standard will be Forward (even numbered outputs)
SBC_MotoDriver3.allOn(SBC_MotoDriver3direction.Forward)
```

## All Off
With the block `Switch off all channels` you can switch off all outputs or set all outputs to 0.
```typescript
// All channels will be shut off/set to 0
SBC_MotoDriver3.allOff()
```

## Fade In
The block `Fade in channel (...) over (...) milliseconds to (...)` allows to fade in each of the 8 outputs to a certain value over a certain time.
```typescript
// Fade a single channel over a specified time to a specified value
// Standard will be Channel = 0 | time in ms = 0 | value to fade to = 0
SBC_MotoDriver3.fadeIn(0, 0, 0)
```

## Fade Out
The block `Fade channel (...) over (...) milliseconds to (...)` allows to fade out each of the 8 outputs to a certain value over a certain time.
```typescript
// Fade a single channel over a specified time to a specified value
// Standard will be Channel = 0 | time in ms = 0 | value to fade to = 0
SBC_MotoDriver3.fadeOut(0, 0, 0)
```

## PWM
The `Set channel (...) to pwm value (...)` block allows to set any user defined channel to any user defined pwm value.
```typescript
// Set a single channel to a changable pwm value
// Standard will be Channel = 0 | value = 0
SBC_MotoDriver3.pwm(0, 0)
```

## LED Status
The `Read the status of channel (...)` block returns the current status information of the channel specified by the user.
```typescript
// Read the status information of a single channel
// output is 0 = off
// output is 1 = on
// output is 2 = pwm
// output is 3 = ERROR
// Standard will be Channel = 0
SBC_MotoDriver3.ledStatus(0)
```

## PWM Status
The `Read the pwm status of channel (...)` block returns the current pwm information of the channel specified by the user.
```typescript
// Read the pwm information of a single channel
// Standard will be Channel = 0
SBC_MotoDriver3.pwmStatus(0)
```


# Stepper functionality

## Stepper Speed
With the block `Set the speed of the Stepper to (...) rpm with (...) steps` you can set the desired speed and the maximum number of steps based on the used stepper motor.
```typescript
// Setup for the stepper motor
// Standard will be Rpm = 15 | Maximum amount of steps = 2048
SBC_MotoDriver3.StepperSpeed(15, 2048)
```

## Stepper
With the block `Move the Stepper motor (...) steps on (...), (...), (...), (...)` you can let the stepper motor move a user specified number of steps on the pins specified by the user.
```typescript
// Let the stepper motor move the desired amount of steps on the desired pins with the previously set up speed
// Standard will be Steps = 0 | pin1 = 4 | pin2 = 5 | pin3 = 6 | pin4 = 7
SBC_MotoDriver3.Stepper(0, 4, 5, 6, 7)
```

## Supported targets

* for PXT/microbit

## License

MIT
