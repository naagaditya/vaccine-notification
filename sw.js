
var intervalId;
self.addEventListener('activate', event => {
  console.log('active');
});
self.addEventListener('message', function(event){
  if(intervalId) {
    clearInterval(intervalId);
    console.log('clear ', intervalId)
  }
  var data = JSON.parse(event.data);

  console.log("SW Received Message:");
  console.log(data);
  var age45 = data.ageLimits[0];
  var age18 = data.ageLimits[1];
  intervalId = setInterval(() => {
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${data.district}&date=${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`, {
      "body": null,
      "method": "GET",
    }).then(res => {
      res.json().then(({centers}) => {
        centers.forEach(center => {
          center.sessions.forEach(session => {
            if(age18 && session.min_age_limit === 18 && session.available_capacity > 0){
              console.log(center)
              self.registration.showNotification('Slot Available', {
                body: 'please register from cowin website'
              });
              return;
            }
            else if(age45 && session.min_age_limit === 45 && session.available_capacity > 0){
              console.log(center)
              self.registration.showNotification('Slot Available', {
                body: 'please register from cowin website'
              });
              return;
            }
          });
        });
      })
    });
  },3600000*parseInt(data.interval))

});
