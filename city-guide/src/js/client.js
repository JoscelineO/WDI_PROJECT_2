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
  $('body').on('click', 'add-scrapbook', this.addScrapbook);
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
  App.plotScrapbooks();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
};

App.mapSetup = function() {
  const canvas = document.getElementById('map');

  const mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
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
    <button type="submit" class="btn btn-primary">Save changes</button>
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
  <h4 class="modal-title">Login</h4>
  </div>
  <div class="modal-body">
  <div class="form-group">
  <input class="form-control" type="text" name="email" placeholder="Email">
  </div>
  <div class="form-group">
  <input class="form-control" type="password" name="password" placeholder="Password">
  </div>
  </div>
  <div class="modal-footer">
  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
  <button type="submit" class="btn btn-primary">Login</button>
  </div>
  </form>
  `);
  $('.modal').modal('show');
  $('.scrapbooks').on('click', this.scrapbooksModal.bind(this));
};

App.logout = function(e) {
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

// You might move this into loggedInState?!
App.plotScrapbooks = function() {
  $.each(this.user.scrapbooks, (index, scrapbook) => {
    const latlng = new google.maps.LatLng(scrapbook.lat, scrapbook.lng);
    const marker = new google.maps.Marker({
      position: latlng,
      map: this.map
    });
    App.markerArray.push(marker);
    // Havent done the modal yet... Done now I think???
  });
};

App.scrapbooksModal = function(e) {
  if (e) e.preventDefault();
  const url = `${this.apiUrl}/user/${this.user._id}`;

  return this.ajaxRequest(url, 'get', null, data => { // what is null about?
    var stringToAdd = '';
    $.each(data.scrapbooks, (index, scrapbook) => {
      stringToAdd += `<h2><a class="scrapbook-focus" data-id="${scrapbook._id}">${scrapbook.title}</a></h2>
      <button type="button" class="btn btn-default add-entry" data-id="${scrapbook._id}">Add Entry</button>`;
      if(scrapbook.entries.length){
        stringToAdd += `
        <h4>Entries:</h4>`;
        $.each(scrapbook.entries, (index, entry) => {
          stringToAdd += `
          <p>${entry.title}</p>`;
        });
      }
    });
    $('.modal-content').html(`
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Your Scrapbooks</h4>
      </div>
      <div class="modal-body">
      ${stringToAdd}
      </div>
      <div class="modal-footer">

      <button type="button" class="btn btn-default add-scrapbook" data-id="${this.user._id}">Add Scrapbook</button>
      </div>
    `);
    $('.modal').modal('show');
  });
};

App.plotEntry = function() {
  console.log(this);
  const scrapbook = App.user.scrapbooks.filter(scrapbook => {
    return scrapbook._id = $(this).data('id');
  })[0];
  $('.modal').modal('hide');
  //removing scrapbook pins
  for (var i = 0; i < App.markerArray.length; i++) {
    App.markerArray[i].setMap(null);
  }
  App.map.setCenter({ lat: scrapbook.lat, lng: scrapbook.lng });
  App.map.setZoom(12);

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
    <h5>${ entry.title }</h5>
    <p>${ entry.description }</p>
    </div>
    `);
    $('.modal').modal('show');
  });
};

App.addScrapbook = function(e) {
  console.log(this.user);
  if (e) e.preventDefault();

  $('.modal-content').html(`
  <form method="post" action="/users/:id">
  <div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <h4 class="modal-title">New Entry</h4>
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
  <button type="submit" class="btn btn-primary">Add</button>
  </div>
  </form>
  `);
  $('.modal').modal('show');
};


App.addEntry = function(e) {
  if (e) e.preventDefault();
  const scrapbook = App.user.scrapbooks.filter(scrapbook => {
    return scrapbook._id = $(this).data('id');
  })[0];

// find the scrapbook by id in callback call scrapbook_id.entries

  $('.modal-content').html(`
  <form method="post" action="/users/:id/scrapbook/${scrapbook._id}">
  <div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <h4 class="modal-title">New Entry</h4>
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
  <button type="submit" class="btn btn-primary">Add</button>
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
    if (data.token) App.setToken(data.token);
    if (data.user) {
      App.user = data.user;
      App.loggedInState();
    }
    $('.modal').modal('hide');
  });
};

//what is going on here?
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
