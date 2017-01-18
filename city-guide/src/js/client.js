const App    = App || {};
const google = google;

App.init = function() {
  this.mapSetup();

  this.apiUrl = 'http://localhost:3000/api';
  this.$body  = $('body');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('body').on('click', '.scrapbook-focus', this.plotEntry);
  $('body').on('click', '.add-entry', this.addEntry);
  $('body').on('click', '.add-scrapbook', this.addScrapbook);
  $('body').on('click', 're-plot', this.plotScrapbooks);
  $('.scrapbooks').on('click', this.scrapbooksModal.bind(this));
  this.markerArray = [];
  this.$body.on('submit', 'form', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  App.fetchUserFromToken(App.plotScrapbooks.bind(App));
};

App.fetchUserFromToken = function(callback){
  const token   = App.getToken()
  const payload = token.split('.')[1];
  const decode  = JSON.parse(atob(payload));
  const user_id = decode.id;
  this.ajaxRequest(`/api/users/${user_id}`, 'get', null, data => {
    App.user = data;
    callback();
  });
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  this.mapSetup();
};

App.mapSetup = function() {
  const canvas = document.getElementById('map');

  const mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(40.673825, 16.898852),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#6bb3a5"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffdc7d"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#43b3cb"},{"visibility":"on"}]}]
  };

  this.map = new google.maps.Map(canvas, mapOptions);
};

App.register = function(e) {
  if (e) e.preventDefault();

  $('.modal-content').html(`
    <form method="post" action="/register">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">Register</h4>
    </div>
    <div class="modal-body">
    <div class="form-group">
    <input class="form-control" type="text" name="user[email]" placeholder="Email">
    </div>
    <div class="form-group">
    <input class="form-control" type="text" name="user[username]" placeholder="Username">
    </div>
    <div class="form-group">
    <input class="form-control" type="text" name="user[firstName]" placeholder="First name">
    </div>
    <div class="form-group">
    <input class="form-control" type="text" name="user[secondName]" placeholder="Second name">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[password]" placeholder="Password">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Register</button>
    </div>
    </form>
  `);
  $('.modal').modal('show');
};

App.login = function(e) {
  if (e) e.preventDefault();
  $('.modal-content').html(`
  <form method="post" action="/login">
  <div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <h4 class="modal-title site-font">Login</h4>
  </div>
  <div class="modal-body">
  <div class="form-group">
  <input class="form-control site-font" type="text" name="email" placeholder="Email">
  </div>
  <div class="form-group">
  <input class="form-control site-font" type="password" name="password" placeholder="Password">
  </div>
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
  <button type="submit" class="btn btn-primary">Login</button>
  </div>
  </form>
  `);
  $('.modal').modal('show');
};

App.logout = function(e) {
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

// You might move this into loggedInState?!
App.plotScrapbooks = function() {
  console.log("Getting scrapbooks yo")

  $.each(this.user.scrapbooks, (index, scrapbook) => {
    // const icon = {
    //   url: '/images/pin-orange.png',
    //   scaledSize: new google.maps.Size(22, 22),
    //   origin: new google.maps.Point(0,0),
    //   anchor: new google.maps.Point(0, 0)
    // };
    const latlng = new google.maps.LatLng(scrapbook.lat, scrapbook.lng);
    const marker = new google.maps.Marker({
      position: latlng,
      map: this.map
      // icon: icon
    });
    App.markerArray.push(marker);
    App.AddModalForScrapbook(scrapbook, marker);
  });
};

App.scrapbooksModal = function(e) {
  if (e) e.preventDefault();
  var stringToAdd = '';
  $.each(App.user.scrapbooks, (index, scrapbook) => {
    stringToAdd += `<p class="scrapbook-title"><a class="scrapbook-focus" data-id="${scrapbook._id}">${scrapbook.title}</a></p>
    <p class="scrapbook-location">${scrapbook.location}</p>
    `;
  });
  $('.modal-content').html(`
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h2 class="modal-title site-font">Your Scrapbooks</h2>
    </div>
    <div class="modal-body">
      ${stringToAdd}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default add-scrapbook site-font" data-id="${this.user._id}">Add Scrapbook</button>
    </div>
  `);
  $('.modal').modal('show');
};

App.AddModalForScrapbook = function(scrapbook, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    let stringToAdd = '';

    $.each(scrapbook.entries, (index, entry) => {
      stringToAdd += `<p class="entry-title"><a class="entry-focus" data-id="${entry._id}">${entry.title}</a></p>
      <p class="scrapbook-location">${entry.location}</p>
      `;
    });

    $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">${ scrapbook.location }</h4>
    </div>
    <div class="modal-body">
    <p class="title">${ scrapbook.title }</p>
    <p class="description">${ scrapbook.description }</p>
    <div class="entries">
      ${stringToAdd}
    </div>
    <button type="button" class="btn btn-default add-entry" data-id="${scrapbook._id}">Add Entry</button>
    </div>
    `);
    $('.modal').modal('show');
  });
};

App.plotEntry = function() {
  // Find that scrapbook
  const scrapbook = App.user.scrapbooks.filter(scrapbook => {
    return scrapbook._id === $(this).data('id');
  })[0];

  $('.modal').modal('hide');

  // Removing scrapbook pins
  for (var i = 0; i < App.markerArray.length; i++) {
    App.markerArray[i].setMap(null);
  }

  // Show scrapbook marker
  const scrapbookMarker = new google.maps.Marker({
    position: {lat: scrapbook.lat, lng: scrapbook.lng},
    map: App.map
    // icon: icon
  });

  App.AddModalForScrapbook(scrapbook, scrapbookMarker);

  App.map.setCenter({ lat: scrapbook.lat, lng: scrapbook.lng });
  App.map.setZoom(11);

  $.each(scrapbook.entries, (index, entry) => {
    const latlng = new google.maps.LatLng(entry.lat, entry.lng);
    const marker = new google.maps.Marker({
      position: latlng,
      map: App.map
    });
    App.addModalForEntrys(entry, marker);
  });
};

App.addModalForEntrys = function(entry, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">${ entry.location }</h4>
    </div>
    <div class="modal-body">
    <p class="title">${ entry.title }</p>
    <p class="description">${ entry.description }</p>
    </div>
    `);
    $('.modal').modal('show');
  });
};

App.addScrapbook = function(e) {
  if (e) e.preventDefault();
  $('.modal-content').html(`
  <form method="post" action="/users/${App.user._id}/scrapbooks">
  <div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <h4 class="modal-title">Add New Scrapbook</h4>
  </div>
  <div class="modal-body">
  <div class="form-group">
  <input class="form-control" type="text" name="title" placeholder="Title">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="description" placeholder="Description">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="location" placeholder="Location">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="lat" placeholder="Latitude">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="lng" placeholder="Longitute">
  </div>
  </div>
  <div class="modal-footer">
  <button type="submit" class="btn btn-primary re-plot">Add Scrapbook</button>
  </div>
  </form>
  `);
  $('.modal').modal('show');

  // ?
  setTimeout(function(){
    App.fetchUserFromToken(App.plotScrapbooks.bind(App));
  }, 2000);
};


App.addEntry = function(e) {
  if (e) e.preventDefault();
  const scrapbook = App.user.scrapbooks.filter(scrapbook => {
    return scrapbook._id = $(this).data('id');
  })[0];

// find the scrapbook by id in callback call scrapbook_id.entries

  $('.modal-content').html(`
  <form method="post" action="/scrapbooks/${scrapbook._id}/entries">
  <div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <h4 class="modal-title">Add New Entry</h4>
  </div>
  <div class="modal-body">
  <div class="form-group">
  <input class="form-control" type="text" name="title" placeholder="Title">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="description" placeholder="Description">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="location" placeholder="Location">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="lat" placeholder="Latitude">
  </div>
  <div class="form-group">
  <input class="form-control" type="text" name="lng" placeholder="Longitute">
  </div>
  </div>
  <div class="modal-footer">
  <button type="submit" class="btn btn-primary">Add Entry</button>
  </div>
  </form>
  `);
  $('.modal').modal('show');
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) {
      App.setToken(data.token);
      App.loggedInState();
    }
    $('.modal').modal('hide');
  });
};

App.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
};

App.setToken = function(token){
  return window.localStorage.setItem('token', token);
};

App.getToken = function(){
  return window.localStorage.getItem('token');
};

App.removeToken = function(){
  return window.localStorage.clear();
};


$(App.init.bind(App));
