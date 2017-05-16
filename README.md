# ezar-poi
A simple Cordova AR point of interest (POI) project. Video preview and 
web overlay are provided by the ezAR&trade; VideoOverlay plugin. Points 
of Interests location, object shapes and rendering are provided by the 
[awe.js](https://github.com/awe-media/awe.js) library.

## Getting Started  
While ezAR works with Cordova-based SDKs such as Ionic, only Cordova CLI examples are provided below. 
This example was built and tested with Cordova 6.5 and only uses the VideoOverlay plugin.

0. Download and unzip the [ezAR Startup Kit](https://ezartech.com/download/) version 0.2.12 or greater, 
includes the required VideoOverlay plugin.  

1. Install the ezAR Video Overlay plugin using the [Cordova SDK CLI](https://cordova.apache.org/)  

    ```
    cordova plugin add <path>/com.ezartech.ezar.videooverlay
    ```  
    
2. Install the platforms you plan to test on. Note only iOS and Android platforms are supported by ezAR.  

    ```
    cordova platform add ios
    cordova platform add android
    ```
    
3. Build the project for all installed platforms  

    ```
    cordova build --device
    ```  
  
## License
See [modified MIT license](LICENSE).  

## Credits
The project code was adapted from the awe.js VR example.
[awe.js github](https://github.com/awe-media/awe.js)  

## ezAR Docs and Tech Support
See [ezartech.com](http://ezartech.com) for documentation and support.


Copyright (c) 2017, ezAR Technologies     
