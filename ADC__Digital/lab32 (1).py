import os
import time
import busio
import digitalio
import board
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
import numpy as np

# Create the SPI bus and MCP3008 setup
spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
cs = digitalio.DigitalInOut(board.D22)
mcp = MCP.MCP3008(spi, cs)
chan0 = AnalogIn(mcp, MCP.P0)

sample_rate = 4000 
num_samples = 1000 

def detect_waveform(data, frequency):
    """ Detects the shape of the waveform based on sampled data """
    diffs = np.diff(data)  
    avg_diff = np.mean(np.abs(diffs))
    max_val = np.amax(data)
    topTen = .9 * max_val
    botTen = .1 * max_val
    top20 = .80 * max_val
    square = np.sum(np.logical_or(data < botTen, data > topTen))
    longest = 0
    current_len = 0
    inverse = (1 / frequency) * 300
    for value in data:
        if value >= top20:
            current_len += 1
        else:
            longest = max(longest, current_len)
            current_len = 0
    longest = max(longest,current_len)
    count = 0
    for value in data:
        if value == 0:
            count+= 1
    if count > .8 * num_samples:
        return "No Wave" 
        
    elif square > .85 * num_samples:
        print( f"Amplitude: {float(3.3*max_val/65535):.3f} Volts")
        return "Square Wave"
            
    elif longest >= inverse:
        print( f"Amplitude: {float(3.3*max_val/65535):.3f} Volts")
        return "Sine Wave"
    else:
        print( f"Amplitude: {float(3.3*max_val/65535):.3f} Volts")
        return "Triangle Wave"


def calculate_frequency(data, sample_rate):
    """ Calculate the frequency of the waveform """
    total_zeros = 0
    zero_count = 0
    zero_sequences = 0
    for i in data:
        if i == 0:
            zero_count += 1
        else:
            if zero_count > 0:
                zero_sequences += 1
                total_zeros += zero_count
                zero_count = 0
                
    if zero_count > 0:
        zero_sequences += 1
        total_zeros += zero_count
        
    if zero_sequences == 0:
        return -1
    return (zero_sequences / total_zeros) * 750
        

while True:
    samples = []

    while len(samples) < num_samples:
        samples.append(chan0.value)
    
    #print(samples)

    

    frequency = calculate_frequency(samples, sample_rate) 
    print(f"Frequency: {frequency:.2f} Hz")
    waveform = detect_waveform(samples,frequency)
    print(f"Detected waveform: {waveform}")
