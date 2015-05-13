# Neuromancer: A Software Stack for Emotiv BCI Experiments



## Overview

The code given is designed to work with the Epoc Emotiv Research Edition--that is, the edition that exposes raw data.  It consists of the four main components:

**Experiment Controller**

The experiment controller, build in Java, is responsible for collecting and storing data from the Emotiv device as organized when participants are shown different stimuli.


**Web GUI**

The Neuromancer frontend is a display which runs in the browser.  It communicates with the Experiment Controller via a websocket.  The Experiment Controller decides which image to show the participant, and sends the location of this image to the GUI frontend.  The frontend loads the image and sends any keypresses or responses by the participant to the Controller.

**Data Analysis Server**

In order to perform realtime machine learning and data processing, the Experiment Controller publishes all data points from the Emotiv to a TCP port (in this case, port 6789).  A Python server listens at this port and builds appropriate models.  It may also classify points in real time and communciate them to the Experiment Controller over the TCP port.

**iPython Data Analysis Notebooks**

The provided iPython notebooks provide a series of methods and examples of parsing and analyzing Emotiv data.

## Experiment Controller

Within the src/ folder, the following files are given:

- EEGJournal.java
- EEGLog.java
- EEGLogFake.java
- EEGLoggingThread.java
- ExperimentController.java
- DfaInt.java
- eeglog.jar

Additionally, the root folder contains:

- participant_data directory
- build directory
- build.xml

The controller can be ran with the commands found in build.xml using [ant](http://ant.apache.org/), but the Emotiv Research SDK must first be installed.

The progression of the experiment run by the controller is described by the DfaInt interface, as found in DfaInt.java.  At the beginning of the experiment, Dfa.start is called, and each time a participant responds to a stimulus, the doNext method is called.  Additionally, the Dfa may choose to run the doNext method as triggered by a timer, in which case the Dfa may call doNext with fromTimer set to true.

To customize this software, the developer should edit the Dfa inner class of the ExperimentController file.  This must be done in the ExperimentController.java file, since (in most cases), the Dfa will want to access private state variables of the ExperimentController object.  

The current paradigm is implemented in the ExperimentController class given:

Participants are shown images as specified in directories in chunks called epochs.  An epoch in the given example lasts 50 seconds, wherein participants are shown images for 1000 milliseconds each.  Each image shown to a participant is named a trial.  

The API for interacting with the Emotiv is given in EEGLog.java.  EEGLogFake provides a dummy implementation of an Emotiv device.  EEGJournal.java is the structure for logging participant responses and trial information to disk, at participant_data/log.  The EEGLoggingThread.java file is a thread that runs in the background and polls the Emotiv, continually writing data to a file in participant_data/eeg.  

Experiments that differ from this paradigm will not greatly benefit from using the ExperimentController.java class; rather, one might choose to use the EEGJournal or EEGLoggingThread with a new main class.

To run:

1. Install Apache ant.
2. Install Emotiv Research SDK.
3. Move images into images/ directory. Update folder locations in ExperimentController.java.
4. Run:
        ant build  
        open ./frontend/index.htmls
        python dataserver.py
        ant exp -dArg0=<ParticipantNum> -dArg1=<outputDir> -dArg2=<realFeedback? (1,0)> -dArg3=<withEEG? (1,0)>
        -Darg4=<tcpPublish? (1,0)> -dArg5=<# trainEpochs> -dArg6=<# feedbackEpochs>

## Web GUI

The web interface is found in the frontend directory.  Data handlers for communicating with the Controller backend can be found in experimentServer.js.

## Data Analysis

An example data analysis server is given in dataserver.py.  Exporatory analyses for Emotiv data are given in the ipynb directory, which can be used to custom tailor a data analysis server for a given experiment.
