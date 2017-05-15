/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        window.addEventListener('load', this.onLoad, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        if (window.ezar) {
            ezar.initializeVideoOverlay(
                function () {
                    ezar.getBackCamera().start();
                },
                function (err) {
                    alert('unable to init ezar: ' + err);
                });
        } else {
            alert('Unable to detect the ezAR plugin');
        }

    },

    onLoad: function () {
        // initialize awe
        window.awe.init({
            // automatically detect the device type
            device_type: awe.AUTO_DETECT_DEVICE_TYPE,
            // populate some default settings
            settings: {
                container_id: 'pois',
                fps: 30,
                default_camera_position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                default_lights: [{
                    id: 'hemisphere_light',
                    type: 'hemisphere',
                    color: 0xCCCCCC
                }, ],
            },
            ready: function () {
                var d = '?_=' + Date.now();

                // load js files based on capability detection then setup the scene if successful
                awe.util.require([{
                        capabilities: ['webgl'],
                        files: [
                            ['libs/awe.js/js/awe-standard-dependencies.js' + d, 'libs/awe.js/js/awe-standard.js' + d], // core dependencies for this app 
                            ['libs/awe.js/js/plugins/StereoEffect.js', 'libs/awe.js/js/plugins/VREffect.js'], // dependencies for render effects
                            'libs/awe.js/js/plugins/awe.rendering_effects.js' + d,
                            'libs/awe.js/js/plugins/awe-standard-object_clicked_or_focused.js' + d, // object click/tap handling plugin
                            'libs/awe.js/js/plugins/awe.gyro.js' + d, // basic gyro handling
                            'libs/awe.js/js/plugins/awe.mouse.js' + d, // basic mouse handling
                        ],
                        success: function () {
                            // setup and paint the scene
                            awe.setup_scene();

                            var click_plugin = awe.plugins.view('object_clicked');
                            if (click_plugin) {
                                click_plugin.register();
                                click_plugin.enable();
                            }

                            var gyro_plugin = awe.plugins.view('gyro');
                            if (gyro_plugin) {
                                gyro_plugin.enable();
                            }

                            var mouse_plugin = awe.plugins.view('mouse');
                            if (mouse_plugin) {
                                mouse_plugin.enable();
                            }

                            var render_effects_plugin = awe.plugins.view('render_effects');
                            if (render_effects_plugin) {
                                render_effects_plugin.enable();
                            }

                            // setup some code to handle when an object is clicked/tapped
                            window.addEventListener('object_clicked', function (e) {
                                var p = awe.projections.view(e.detail.projection_id);
                                awe.projections.update({ // rotate clicked object by 180 degrees around x and y axes over 10 seconds
                                    data: {
                                        animation: {
                                            duration: 10,
                                        },
                                        rotation: {
                                            y: p.rotation.y + 180,
                                            x: p.rotation.x + 180
                                        }
                                    },
                                    where: {
                                        id: e.detail.projection_id
                                    }
                                });
                            }, false);

                            // add some points of interest (poi) for each of the compass points
                            awe.pois.add({
                                id: 'north',
                                position: {
                                    x: 0,
                                    y: 0,
                                    z: 200
                                }
                            });
                            awe.pois.add({
                                id: 'north_east',
                                position: {
                                    x: 200,
                                    y: 0,
                                    z: 200
                                }
                            });
                            awe.pois.add({
                                id: 'east',
                                position: {
                                    x: 200,
                                    y: 0,
                                    z: 0
                                }
                            });
                            awe.pois.add({
                                id: 'south_east',
                                position: {
                                    x: 200,
                                    y: 0,
                                    z: -200
                                }
                            });
                            awe.pois.add({
                                id: 'south',
                                position: {
                                    x: 0,
                                    y: 0,
                                    z: -200
                                }
                            });
                            awe.pois.add({
                                id: 'south_west',
                                position: {
                                    x: -200,
                                    y: 0,
                                    z: -200
                                }
                            });
                            awe.pois.add({
                                id: 'west',
                                position: {
                                    x: -200,
                                    y: 0,
                                    z: 0
                                }
                            });
                            awe.pois.add({
                                id: 'north_west',
                                position: {
                                    x: -200,
                                    y: 0,
                                    z: 200
                                }
                            });

                            // add projections to each of the pois
                            awe.projections.add({
                                id: 'n',
                               geometry : {
                                    font_url : "Hack_Regular.js",
                                    parameters : {
                                        height : 5, // depth of the extruded text
                                        size : 10
                                    },
                                    shape : "text", 
                                    text : "hello ezAR",
                                    },
                                rotation: {
                                    x: 0,
                                    y: 180,
                                    z: 0
                                },
                                material: {
                                    type: 'basic',  //default
                                    color: 0xFF0000,
                                },
                            }, {
                                poi_id: 'north'
                            });

                            // awe.projections.add({
                            //     id: 'n',
                            //     geometry: {
                            //         shape: 'cube',
                            //         x: 50,
                            //         y: 50,
                            //         z: 50
                            //     },
                            //     rotation: {
                            //         x: 30,
                            //         y: 30,
                            //         z: 0
                            //     },
                            //     material: {
                            //         type: 'phong',
                            //         color: 0xFF0000,
                            //     },
                            // }, {
                            //     poi_id: 'north'
                            // });

                            awe.projections.add({
                                id: 'ne',
                                geometry: {
                                    shape: 'sphere',
                                    radius: 10
                                },
                                material: {
                                    type: 'phong',
                                    color: 0xCCCCCC,
                                },
                            }, {
                                poi_id: 'north_east'
                            });

                            awe.projections.add({
                                id: 'e',
                                geometry: {
                                    shape: 'cube',
                                    x: 50,
                                    y: 50,
                                    z: 50
                                },
                                rotation: {
                                    x: 30,
                                    y: 30,
                                    z: 0
                                },
                                material: {
                                    type: 'phong',
                                    color: 0x00FF00,
                                },
                            }, {
                                poi_id: 'east'
                            });

                            awe.projections.add({
                                id: 'se',
                                geometry: {
                                    shape: 'sphere',
                                    radius: 10
                                },
                                material: {
                                    type: 'phong',
                                    color: 0xCCCCCC,
                                },
                            }, {
                                poi_id: 'south_east'
                            });

                            awe.projections.add({
                                id: 's',
                                geometry: {
                                    shape: 'cube',
                                    x: 50,
                                    y: 50,
                                    z: 50
                                },
                                rotation: {
                                    x: 30,
                                    y: 30,
                                    z: 0
                                },
                                material: {
                                    type: 'phong',
                                    color: 0xFFFFFF,
                                },
                            }, {
                                poi_id: 'south'
                            });

                            awe.projections.add({
                                id: 'sw',
                                geometry: {
                                    shape: 'sphere',
                                    radius: 10
                                },
                                material: {
                                    type: 'phong',
                                    color: 0xCCCCCC,
                                },
                            }, {
                                poi_id: 'south_west'
                            });

                            awe.projections.add({
                                id: 'w',
                                geometry: {
                                    shape: 'cube',
                                    x: 50,
                                    y: 50,
                                    z: 50
                                },
                                rotation: {
                                    x: 30,
                                    y: 30,
                                    z: 0
                                },
                                material: {
                                    type: 'phong',
                                    color: 0x0000FF,
                                },
                            }, {
                                poi_id: 'west'
                            });

                            awe.projections.add({
                                id: 'nw',
                                geometry: {
                                    shape: 'sphere',
                                    radius: 10
                                },
                                material: {
                                    type: 'phong',
                                    color: 0xCCCCCC,
                                },
                            }, {
                                poi_id: 'north_west'
                            });

                        },
                    },
                    { // else create a fallback
                        capabilities: [],
                        files: [],
                        success: function () {
                            document.body.innerHTML = '<p>This demo currently requires a standards compliant mobile browser.';
                            return;
                        },
                    },
                ]);
            }
        });
    }
};

app.initialize();