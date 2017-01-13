"use strict";var googleMap=googleMap||{},google=google;googleMap.mapSetup=function(){var e=document.getElementById("map"),o={zoom:4,center:new google.maps.LatLng(51.506178,(-.088369)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(e,o)},$(googleMap.mapSetup.bind(googleMap));var App=App||{};App.init=function(){this.apiUrl="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),this.$main.on("submit","form",this.handleForm)},App.register=function(e){e&&e.preventDefault(),this.$main.html('\n    <h2>Register</h2>\n    <form method="post" action="/register">\n      <div class="form-group">\n        <input class="form-control" type="text" name="user[username]" placeholder="Username">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="password" name="user[password]" placeholder="Password">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Register">\n    </form>\n    ')},App.usersShow,App.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide(),this.usersShow()},App.handleForm=function(e){e.preventDefault();var o=""+App.apiUrl+$(this).attr("action"),t=$(this).attr("method");$(this).serialize();return App.ajaxRequest(o,t,function(e){App.loggedInState()})},App.ajaxRequest=function(e,o,t,n){return $.ajax({url:e,method:o,data:t}).done(n).fail(function(e){console.log(e)})},$(App.init.bind(App));