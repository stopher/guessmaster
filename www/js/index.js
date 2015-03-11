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
      
        var numbers = [];
        $(".number div").each(function(idx, elt) {
            var num = getNumber(1,99);
            if(numbers.indexOf(num) > -1) {
                num = getNumber(1,99);
            }
            numbers.push(num);
            $(elt).html(num);            
        });

        $(".number").removeClass("active");
        $(".guessbtn").addClass("active");
        $(".guessbtn").transition({
            perspective: '200px',
            y: '0px'
        }, function() {
            View.openGui();
        });

      

    },
    nextGame: function() {

      app.resetApp();      
      $(".gameboard").transition({opacity:1, y:'0px'});

    },
    submitGame: function() {

        var selected = $(".number.active div");
        var notSelected = $(".number:not(.active) div");

        var doneCallback = function(response) {

            var win = false;
            if(parseInt(response.points) > 0) {
                $(".feedback div").html("Correct!")                
                win = true;
            } else {
                $(".feedback div").html("Sorry!")
            }

            $(".preloader").transition({opacity:0, y:'-500px', duration: 500},function() {
                $(".guessbtn").transition({opacity:0});
                $(".feedback div").transition({ opacity: 1, duration: 500 }).transition({ opacity: 0 }, app.nextGame);
                $(".points div").html(response.totalPoints);

                if(win) {
                    $(".points div").transition({scale:2}).transition({scale:1});
                    $(".combo div").html(""+response.winsInARow);
                    $(".combo div").transition({scale:response.winsInARow});
                } else {
                    $(".combo div").html(""+0).transition({scale:1})
                }
            });
            
        };

        var player = Datastore.getMyPlayer();

        // do ajax
        Datastore.saveGuess({ "uuid": player.uuid, "selectedVal": parseInt(selected.html()), "val2": parseInt(notSelected[0].innerHTML), "val3": parseInt(notSelected[1].innerHTML)}, doneCallback);

    },
    initializeApp: function() {
        
        $(".sprite-spinner").each(function(i){
            var s = new SpriteSpinner(this, {
                interval:50
            });
            s.start();
        });
        
        $(".number").on("click", function() {
            if(View.isLocked()) {
                return false;
            }            
            View.lockGui();
            $(this).transition({ scale: 1.5 }).transition({ scale: 1.0 }, function() {
                $(".number").removeClass("active");
                $(this).addClass("active");                
                $(".guessbtn").transition({opacity:1}, function() {
                    View.openGui();
                    View.openGuess();
                });
            });
        });

        $(".guessbtn").on("click", function() {

            if(View.isGuessLocked() || View.isLocked()) {
                return false;
            }

            View.lockGui();
            View.lockGuess();
            $(".guessbtn").transition({
                perspective: '200px',
                y: '180px',
                opacity: 0
            }, function() {
                $(this).addClass("active");
                $(".gameboard").transition({opacity:0, y:'-300px'});
                $(".preloader").transition({opacity:1, y:'500px'});

                app.submitGame();
            });

        });

        $(".highscore").on("click", function() {
            $(".highscorelist").show();
        });
        $(".close").on("click", function() {
            $(".highscorelist").hide();
        });

        var timeToDie = 200;
        setInterval(function() {

            var point = parseInt($(".points div").html());
            if (point >= 1) {        
                point = point -1;
                $(".points div").html(""+point);
            }

            if(timeToDie%2 == 0) {            
                $(".timeline").transition({ width: timeToDie/2+"%"});
            }
            timeToDie = timeToDie -1;
            if(timeToDie < 1) {
                // TODO GAME ENDS, HIGHSCORE AND PUNCH NAME
            }
        }, 500);

        Datastore.init();
        app.resetApp();

        document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
    }
};
