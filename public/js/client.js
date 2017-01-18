"use strict";var App=App||{},google=google;App.init=function(){this.mapSetup(),this.apiUrl="http://localhost:3000/api",this.$body=$("body"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),$("body").on("click",".scrapbook-focus",this.plotEntry),$("body").on("click",".add-entry",this.addEntry),$("body").on("click",".add-scrapbook",this.addScrapbook),$("body").on("click","re-plot",this.plotScrapbooks),$(".scrapbooks").on("click",this.scrapbooksModal.bind(this)),this.markerArray=[],this.$body.on("submit","form",this.handleForm),this.getToken()?this.loggedInState():this.loggedOutState()},App.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide(),App.fetchUserFromToken(App.plotScrapbooks.bind(App))},App.fetchUserFromToken=function(t){var o=App.getToken(),e=o.split(".")[1],n=JSON.parse(atob(e)),a=n.id;this.ajaxRequest("/api/users/"+a,"get",null,function(o){App.user=o,t()})},App.loggedOutState=function(){$(".loggedIn").hide(),$(".loggedOut").show(),this.mapSetup()},App.mapSetup=function(){var t=document.getElementById("map"),o={zoom:3,center:new google.maps.LatLng(40.673825,16.898852),mapTypeId:google.maps.MapTypeId.ROADMAP,styles:[{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#444444"}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2f2f2"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{visibility:"on"},{color:"#6bb3a5"}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100},{lightness:45}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{visibility:"on"},{color:"#ffdc7d"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:"#43b3cb"},{visibility:"on"}]}]};this.map=new google.maps.Map(t,o)},App.register=function(t){t&&t.preventDefault(),$(".modal-content").html('\n    <form method="post" action="/register">\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">Register</h4>\n    </div>\n    <div class="modal-body">\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[email]" placeholder="Email">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[username]" placeholder="Username">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[firstName]" placeholder="First name">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[secondName]" placeholder="Second name">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[password]" placeholder="Password">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n    </div>\n    </div>\n    <div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n    <button type="submit" class="btn btn-primary">Register</button>\n    </div>\n    </form>\n  '),$(".modal").modal("show")},App.login=function(t){t&&t.preventDefault(),$(".modal-content").html('\n  <form method="post" action="/login">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title site-font">Login</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control site-font" type="text" name="email" placeholder="Email">\n  </div>\n  <div class="form-group">\n  <input class="form-control site-font" type="password" name="password" placeholder="Password">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n  <button type="submit" class="btn btn-primary">Login</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show")},App.logout=function(t){t.preventDefault(),this.removeToken(),this.loggedOutState()},App.plotScrapbooks=function(){var t=this;console.log("Getting scrapbooks yo"),$.each(this.user.scrapbooks,function(o,e){var n=new google.maps.LatLng(e.lat,e.lng),a=new google.maps.Marker({position:n,map:t.map});App.markerArray.push(a),App.AddModalForScrapbook(e,a)})},App.scrapbooksModal=function(t){t&&t.preventDefault();var o="";$.each(App.user.scrapbooks,function(t,e){o+='<p class="scrapbook-title"><a class="scrapbook-focus" data-id="'+e._id+'">'+e.title+'</a></p>\n    <p class="scrapbook-location">'+e.location+"</p>\n    "}),$(".modal-content").html('\n    <div class="modal-header">\n      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n      <h2 class="modal-title site-font">Your Scrapbooks</h2>\n    </div>\n    <div class="modal-body">\n      '+o+'\n    </div>\n    <div class="modal-footer">\n      <button type="button" class="btn btn-default add-scrapbook site-font" data-id="'+this.user._id+'">Add Scrapbook</button>\n    </div>\n  '),$(".modal").modal("show")},App.AddModalForScrapbook=function(t,o){google.maps.event.addListener(o,"click",function(){var o="";$.each(t.entries,function(t,e){o+='<p class="entry-title"><a class="entry-focus title" data-id="'+e._id+'">'+e.title+'</a></p>\n      <p class="scrapbook-location">'+e.location+"</p>\n      "}),$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">'+t.location+'</h4>\n    </div>\n    <div class="modal-body">\n    <p class="title">'+t.title+'</p>\n    <p class="description">'+t.description+'</p>\n    <div class="entries">\n    <p class="entries-tag">Entries:</p>\n      '+o+'\n    </div>\n    <button type="button" class="btn btn-default add-entry" data-id="'+t._id+'">Add Entry</button>\n    </div>\n    '),$(".modal").modal("show")})},App.plotEntry=function(){var t=this,o=App.user.scrapbooks.filter(function(o){return o._id===$(t).data("id")})[0];$(".modal").modal("hide");for(var e=0;e<App.markerArray.length;e++)App.markerArray[e].setMap(null);var n=new google.maps.Marker({position:{lat:o.lat,lng:o.lng},map:App.map});App.AddModalForScrapbook(o,n),App.map.setCenter({lat:o.lat,lng:o.lng}),App.map.setZoom(11),$.each(o.entries,function(t,o){var e=new google.maps.LatLng(o.lat,o.lng),n=new google.maps.Marker({position:e,map:App.map});App.addModalForEntrys(o,n)})},App.addModalForEntrys=function(t,o){google.maps.event.addListener(o,"click",function(){$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">'+t.location+'</h4>\n    </div>\n    <div class="modal-body">\n    <p class="title">'+t.title+'</p>\n    <p class="description">'+t.description+"</p>\n    </div>\n    "),$(".modal").modal("show")})},App.addScrapbook=function(t){t&&t.preventDefault(),$(".modal-content").html('\n  <form method="post" action="/users/'+App.user._id+'/scrapbooks">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title">Add New Scrapbook</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control" type="text" name="title" placeholder="Title">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="description" placeholder="Description">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="location" placeholder="Location">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lat" placeholder="Latitude">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lng" placeholder="Longitute">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="submit" class="btn btn-primary re-plot">Add Scrapbook</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show"),setTimeout(function(){App.fetchUserFromToken(App.plotScrapbooks.bind(App))},2e3)},App.addEntry=function(t){var o=this;t&&t.preventDefault();var e=App.user.scrapbooks.filter(function(t){return t._id=$(o).data("id")})[0];$(".modal-content").html('\n  <form method="post" action="/scrapbooks/'+e._id+'/entries">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title">Add New Entry</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control" type="text" name="title" placeholder="Title">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="description" placeholder="Description">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="location" placeholder="Location">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lat" placeholder="Latitude">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lng" placeholder="Longitute">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="submit" class="btn btn-primary">Add Entry</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show")},App.handleForm=function(t){t.preventDefault();var o=""+App.apiUrl+$(this).attr("action"),e=$(this).attr("method"),n=$(this).serialize();return App.ajaxRequest(o,e,n,function(t){t.token&&(App.setToken(t.token),App.loggedInState()),$(".modal").modal("hide")})},App.ajaxRequest=function(t,o,e,n){return $.ajax({url:t,method:o,data:e,beforeSend:this.setRequestHeader.bind(this)}).done(n).fail(function(t){console.log(t)})},App.setRequestHeader=function(t){return t.setRequestHeader("Authorization","Bearer "+this.getToken())},App.setToken=function(t){return window.localStorage.setItem("token",t)},App.getToken=function(){return window.localStorage.getItem("token")},App.removeToken=function(){return window.localStorage.clear()},$(App.init.bind(App));