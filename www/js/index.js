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
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);        
        document.addEventListener('resume', this.onDeviceResume, false);
        document.addEventListener('pause', this.onDevicePause, false);

        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if(is_chrome) {
            setTimeout(function() {
                createEvent('deviceready');
            },500);            
        }        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    onDeviceResume: function() {
        app.receivedEvent('resume');
    },
    onDevicePause: function() {
        app.receivedEvent('pause');
    },    
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);

        if(id === 'deviceready') {
            app.initializeApp();
        }

    },
    resetApp: function() {
      
      $(".number div").each(function(idx, elt) {
        var num = getNumber(1,99);
        $(elt).html(num);
      });

    },
    submitGame: function() {

        var selected = $(".number[data-id=1].active div");
        var notSelected = $(".number:not(.active) div");

        $(".number[data-id=1] div").val();



        var doneCallback = function(response) {
            console.log(response);
            $(".feedback div").transition({ opacity: 1, duration: 500 }).transition({ opacity: 0 });
            $(".preloader").transition({opacity:0});
            $(".gameboard").transition({opacity:1, y:'0px'});
        };
        // do ajax
        Datastore.saveGuess({ "uuid": uuid, "selectedVal": parseInt(selected.html()), "val2": parseInt(notSelected[0].html()), "val3": parseInt(notSelected[1].html())}, doneCallback);

    },
    initializeApp: function() {
        
        $(".sprite-spinner").each(function(i){
            var s = new SpriteSpinner(this, {
                interval:50
            });
            s.start();
        });
        
        $(".number").on("click", function() {
            $(this).transition({ scale: 1.5 }).transition({ scale: 1.0 }, function() {
                $(".number").removeClass("active");
                $(this).addClass("active");                
                $(".guessbtn").transition({opacity:1});
            });
        });

        $(".guessbtn").on("click", function() {

            $(".guessbtn").transition({
                perspective: '200px',
                rotateY: '180deg'
            }, function() {
                $(this).addClass("active");
                $(".gameboard").transition({opacity:0, y:'-300px'});
                $(".preloader").transition({opacity:1});
                app.submitGame();
            });

        });

        Datastore.init();
        app.resetApp();

        document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    }
};
