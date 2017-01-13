//MAP STUFF

const googleMap = googleMap || {};
const google = google;

googleMap.mapSetup = function() {
  const canvas = document.getElementById('map');

  const mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
};

$(googleMap.mapSetup.bind(googleMap));

//LOGIN 'n' STUFF

const App = App || {};

App.init = function() {
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  this.$main.on('submit', 'form', this.handleForm);
};

App.register = function(e) {
  if (e) e.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
      <div class="form-group">
        <input class="form-control" type="text" name="user[username]" placeholder="Username">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input class="btn btn-primary" type="submit" value="Register">
    </form>
    `);
};

App.usersShow

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  this.usersShow();
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data => {
  // return App.ajaxRequest(url, method, data, data => {
  //   if (data.token) App.setToken(data.token);
    App.loggedInState();
  });
};

App.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data
    // beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

$(App.init.bind(App));
