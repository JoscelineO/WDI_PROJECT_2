"use strict";var App=App||{},google=google;App.init=function(){this.mapSetup(),this.apiUrl="http://localhost:3000/api",this.$body=$("body"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),$("body").on("click",".scrapbook-focus",this.plotEntry),$("body").on("click",".add-entry",this.addEntry),$("body").on("click","add-scrapbook",this.addScrapbook),this.markerArray=[],this.$body.on("submit","form",this.handleForm),this.getToken()?this.loggedInState():this.loggedOutState()},App.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide(),App.plotScrapbooks()},App.loggedOutState=function(){$(".loggedIn").hide(),$(".loggedOut").show()},App.mapSetup=function(){var t=document.getElementById("map"),o={zoom:4,center:new google.maps.LatLng(51.506178,(-.088369)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(t,o)},App.register=function(t){t&&t.preventDefault(),$(".modal-content").html('\n    <form method="post" action="/register">\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">Register</h4>\n    </div>\n    <div class="modal-body">\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[email]" placeholder="Email">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[username]" placeholder="Username">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[firstName]" placeholder="First name">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="text" name="user[secondName]" placeholder="Second name">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[password]" placeholder="Password">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n    </div>\n    </div>\n    <div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n    <button type="submit" class="btn btn-primary">Save changes</button>\n    </div>\n    </form>\n  '),$(".modal").modal("show")},App.login=function(t){t&&t.preventDefault(),$(".modal-content").html('\n  <form method="post" action="/login">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title">Login</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control" type="text" name="email" placeholder="Email">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="password" name="password" placeholder="Password">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n  <button type="submit" class="btn btn-primary">Login</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show"),$(".scrapbooks").on("click",this.scrapbooksModal.bind(this))},App.logout=function(t){t.preventDefault(),this.removeToken(),this.loggedOutState()},App.plotScrapbooks=function(){var t=this;$.each(this.user.scrapbooks,function(o,n){var a=new google.maps.LatLng(n.lat,n.lng),e=new google.maps.Marker({position:a,map:t.map});App.markerArray.push(e)})},App.scrapbooksModal=function(t){var o=this;t&&t.preventDefault();var n=this.apiUrl+"/user/"+this.user._id;return this.ajaxRequest(n,"get",null,function(t){var n="";$.each(t.scrapbooks,function(t,o){n+='<h2><a class="scrapbook-focus" data-id="'+o._id+'">'+o.title+'</a></h2>\n      <button type="button" class="btn btn-default add-entry" data-id="'+o._id+'">Add Entry</button>',o.entries.length&&(n+="\n        <h4>Entries:</h4>",$.each(o.entries,function(t,o){n+="\n          <p>"+o.title+"</p>"}))}),$(".modal-content").html('\n      <div class="modal-header">\n      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n      <h4 class="modal-title">Your Scrapbooks</h4>\n      </div>\n      <div class="modal-body">\n      '+n+'\n      </div>\n      <div class="modal-footer">\n\n      <button type="button" class="btn btn-default add-scrapbook" data-id="'+o.user._id+'">Add Scrapbook</button>\n      </div>\n    '),$(".modal").modal("show")})},App.plotEntry=function(){var t=this;console.log(this);var o=App.user.scrapbooks.filter(function(o){return o._id=$(t).data("id")})[0];$(".modal").modal("hide");for(var n=0;n<App.markerArray.length;n++)App.markerArray[n].setMap(null);App.map.setCenter({lat:o.lat,lng:o.lng}),App.map.setZoom(12),$.each(o.entries,function(t,o){var n=new google.maps.LatLng(o.lat,o.lng),a=new google.maps.Marker({position:n,map:App.map});App.addModalForEntrys(o,a)})},App.addModalForEntrys=function(t,o){google.maps.event.addListener(o,"click",function(){$(".modal-content").html('\n    <div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n    <h4 class="modal-title">'+t.location+'</h4>\n    </div>\n    <div class="modal-body">\n    <h5>'+t.title+"</h5>\n    <p>"+t.description+"</p>\n    </div>\n    "),$(".modal").modal("show")})},App.addScrapbook=function(t){console.log(this.user),t&&t.preventDefault(),$(".modal-content").html('\n  <form method="post" action="/users/:id">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title">New Entry</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control" type="text" name="title" placeholder="Title">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="description" placeholder="Description">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="location" placeholder="Location">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lat" placeholder="Latitude">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lng" placeholder="Longitute">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="submit" class="btn btn-primary">Add</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show")},App.addEntry=function(t){var o=this;t&&t.preventDefault();var n=App.user.scrapbooks.filter(function(t){return t._id=$(o).data("id")})[0];$(".modal-content").html('\n  <form method="post" action="/users/:id/scrapbook/'+n._id+'">\n  <div class="modal-header">\n  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n  <h4 class="modal-title">New Entry</h4>\n  </div>\n  <div class="modal-body">\n  <div class="form-group">\n  <input class="form-control" type="text" name="title" placeholder="Title">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="description" placeholder="Description">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="location" placeholder="Location">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lat" placeholder="Latitude">\n  </div>\n  <div class="form-group">\n  <input class="form-control" type="text" name="lng" placeholder="Longitute">\n  </div>\n  </div>\n  <div class="modal-footer">\n  <button type="submit" class="btn btn-primary">Add</button>\n  </div>\n  </form>\n  '),$(".modal").modal("show")},App.handleForm=function(t){t.preventDefault();var o=""+App.apiUrl+$(this).attr("action"),n=$(this).attr("method"),a=$(this).serialize();return App.ajaxRequest(o,n,a,function(t){t.token&&App.setToken(t.token),t.user&&(App.user=t.user,App.loggedInState()),$(".modal").modal("hide")})},App.ajaxRequest=function(t,o,n,a){return $.ajax({url:t,method:o,data:n,beforeSend:this.setRequestHeader.bind(this)}).done(a).fail(function(t){console.log(t)})},App.setRequestHeader=function(t){return t.setRequestHeader("Authorization","Bearer "+this.getToken())},App.setToken=function(t){return window.localStorage.setItem("token",t)},App.getToken=function(){return window.localStorage.getItem("token")},App.removeToken=function(){return window.localStorage.clear()},$(App.init.bind(App));